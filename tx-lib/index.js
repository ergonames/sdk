import * as wasm from "ergo-lib-wasm-browser";
import JSONBigInt from "json-bigint";

const DEFAULT_EXPLORER_URL = "https://api-testnet.ergoplatform.com";
const ERGONAMES_CONTRACT_ADDRESS = "E6GgjuJFZjL31Srt3CBsCfmF7mWMLHR4z4sDWsB6MsFxBcKAaD2cqSLEB25rfJZatMrZgpDLdVVVzLC55uVHqmBuWFCQKM8NB9cHp1uRkufkQ85nvVNtWpVi7wwW5WWSchjDAFvabEYgGmeAP5YQdYTdxmN5SVzoDQwzibjAD68GWsNKsmQQJm8ScS9hndLAAGkUWhTm4C6uxFURagxnMdHMJuDqHKnkLXAu1p6RJKLAg6VdktTJLPNFeMdy1q18J8A2LZtMuvKNkkne1ZpL5BmQhtjLPMw2XnhfPaCUKjEHiPZfo9q";
const ROYALTY_PERCENTAGE = 20;

async function get_current_height(explorer_url = DEFAULT_EXPLORER_URL) {
    let url = explorer_url + "/api/v1/blocks?limit=1";
    return await fetch(url)
        .then(res => res.json())
        .then(data => { return data["total"]; })
}

export async function send_transaction(ergoname_price, ergoname_name, reciever_address, explorer_url = DEFAULT_EXPLORER_URL) {
    ergoConnector.nautilus.connect().then(() => {
        ergo.get_balance().then(async function() {
            async function getUtxos(amountToSend) {
                const fee = BigInt(wasm.TxBuilder.SUGGESTED_TX_FEE().as_i64().to_str());
                const fullAmount = BigInt(1000) * amountToSend + fee;
                console.log(fullAmount);
                const utxos = await ergo.get_utxos(fullAmount.toString());
                const filteredUtxos = [];
                for (const utxo of utxos) {
                    try {
                        await wasm.ErgoBox.from_json(JSONBigInt.stringify(utxo));
                        filteredUtxos.push(utxo);
                    } catch (e) {
                        console.log('[getUtxos] UTXO failed parsing: ', utxo, e);
                    }
                }
                return filteredUtxos;
            }

            const creationHeight = await get_current_height(explorer_url);
            console.log(creationHeight);

            const amountToSend = BigInt(ergoname_price);
            const amountToSendBoxValue = wasm.BoxValue.from_i64(wasm.I64.from_str(amountToSend.toString()));
            const utxos = await getUtxos(amountToSend);
            let utxosValue = utxos.reduce((acc, utxo) => acc += BigInt(utxo.value), BigInt(0));
            console.log('utxos', utxosValue, utxos);

            const changeValue = utxosValue - amountToSend - BigInt(wasm.TxBuilder.SUGGESTED_TX_FEE().as_i64().to_str());
            console.log(`${changeValue} | cv.ts() = ${changeValue.toString()}`);
            const changeAddr = await ergo.get_change_address();
            console.log(`changeAddr = ${JSON.stringify(changeAddr)}`);

            const selector = new wasm.SimpleBoxSelector();
            const boxSelection = selector.select(
                wasm.ErgoBoxes.from_boxes_json(utxos),
                wasm.BoxValue.from_i64(amountToSendBoxValue.as_i64().checked_add(wasm.TxBuilder.SUGGESTED_TX_FEE().as_i64())),
                new wasm.Tokens());
            console.log(`boxes selected: ${boxSelection.boxes().len()}`);

            const outputCandidates = wasm.ErgoBoxCandidates.empty();

            let outBoxBuilder = new wasm.ErgoBoxCandidateBuilder(
                amountToSendBoxValue,
                wasm.Contract.pay_to_address(wasm.Address.from_base58(ERGONAMES_CONTRACT_ADDRESS)),
                creationHeight);

            outBoxBuilder.set_register_value(4, wasm.Constant.from_i32(ROYALTY_PERCENTAGE));
            outBoxBuilder.set_register_value(5, wasm.Constant.from_byte_array(ergoname_name).encode_to_base16());
            outBoxBuilder.set_register_value(6, wasm.Constant.from_i32(ergoname_price));
            outBoxBuilder.set_register_value(7, wasm.Constant.from_byte_array(reciever_address).encode_to_base16());

            try {
                outputCandidates.add(outBoxBuilder.build());
            } catch (e) {
                console.log(`building error: ${e}`);
                throw e;
            }
            console.log(`utxosvalue: ${utxosValue.toString()}`);

            const txBuilder = wasm.TxBuilder.new(
                boxSelection,
                outputCandidates,
                creationHeight,
                wasm.TxBuilder.SUGGESTED_TX_FEE(),
                wasm.Address.from_base58(changeAddr),
                wasm.BoxValue.SAFE_USER_MIN());
            const dataInputs = new wasm.DataInputs();
            txBuilder.set_data_inputs(dataInputs);

            console.log(txBuilder.build().to_json());

            const tx = parseTransactionData(txBuilder.build().to_json());

            console.log(`tx: ${JSONBigInt.stringify(tx)}`);
            console.log(`original id: ${tx.id}`);

            const correctTx = parseTransactionData(wasm.UnsignedTransaction.from_json(JSONBigInt.stringify(tx)).to_json());
            console.log(`correct tx: ${JSONBigInt.stringify(correctTx)}`);
            console.log(`new id: ${correctTx.id}`);
            
            correctTx.inputs = correctTx.inputs.map(box => {
                console.log(`box: ${JSONBigInt.stringify(box)}`);
                const fullBoxInfo = utxos.find(utxo => utxo.boxId === box.boxId);
                return {
                    ...fullBoxInfo,
                    extension: {}
                };
            });
            console.log(`${JSONBigInt.stringify(correctTx)}`);                    

            async function signTx(txToBeSigned) {
                try {
                    return await ergo.sign_tx(txToBeSigned);
                } catch (err) {
                    const msg = `[signTx] Error: ${JSON.stringify(err)}`;
                    console.error(msg, err);
                    return null;
                }
            }

            async function submitTx(txToBeSubmitted) {
                try {
                    return await ergo.submit_tx(txToBeSubmitted);
                } catch (err) {
                    const msg = `[submitTx] Error: ${JSON.stringify(err)}`;
                    console.error(msg, err);
                    return null;
                }
            }

            async function processTx(txToBeProcessed) {
                const msg = s => {
                    console.log('[processTx]', s);
                };
                const signedTx = await signTx(txToBeProcessed);
                if (!signedTx) {
                    console.log(`No signed tx`);
                    return null;
                }
                msg("Transaction signed - awaiting submission");
                const txId = await submitTx(signedTx);
                if (!txId) {
                    console.log(`No submotted tx ID`);
                    return null;
                }
                msg("Transaction submitted - thank you for your donation!");
                return txId;
            }

            let txId = processTx(correctTx).then(txId => {
                return txId;
            });
            return txId;
        });
    });
}

function parseTransactionData(str) {
    let json = JSONBigInt.parse(str);
    return {
        id: json.id,
        inputs: json.inputs,
        dataInputs: json.dataInputs,
        outputs: json.outputs.map(output => parseUTXO(output)),
    }
}

function parseUTXO(json) {
    var newJson = { ...json };
    if (newJson.assets === null) {
        newJson.assets = [];
    }
    return {
        boxId: newJson.boxId,
        value: newJson.value.toString(),
        ergoTree: newJson.ergoTree,
        assets: newJson.assets.map(asset => ({
            tokenId: asset.tokenId,
            amount: asset.amount.toString(),
        })),
        additionalRegisters: newJson.additionalRegisters,
        creationHeight: newJson.creationHeight,
        transactionId: newJson.transactionId,
        index: newJson.index
    };
}