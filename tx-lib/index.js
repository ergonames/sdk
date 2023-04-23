import { ErgoAddress, OutputBuilder, SColl, SByte, SConstant, SLong, SSigmaProp, TransactionBuilder } from "@fleet-sdk/core";

const DEFAULT_EXPLORER_URL = "https://api-testnet.ergoplatform.com";
const ERGONAMES_PROXY_ADDRESS = "34sQ9WYJ67tfGss9Za6jpiM6s1F9QAV2GR2Cvc3N5zJFVTuqTo68R9tBktFuwTZ7C67QX8xutEsV7Rsn8wUZno67EcRAf9hJ8wKZr6NDseFK6J3aCk76i3VWD3uqrnwqkQX1hEK8MVu1uXhoizUuKkuNQtKwYeMUK6yG3B3id4SoeQzgx24pqJEgw6cTjrNirjib7ossgbk3WDMCGpQt6htYDZWcmBPALxaxjrZWBRBsdNeVWFZckZ";

export async function sendTransaction(name, ergonamePrice, receiverAddress, explorerUrl = DEFAULT_EXPLORER_URL) {
    let currentHeight = await getCurrentHeight(explorerUrl);
    let amountToSend = ergonamePrice + (1000000 * 2);
    let inputs = await ergo.get_utxos(amountToSend);

    let receiverErgoAddress = ErgoAddress.fromBase58(String(receiverAddress));
    let receiverErgoTree = receiverErgoAddress.ergoTree;

    const unsignedTransaction = new TransactionBuilder(currentHeight)
        .from(inputs)
        .to(new OutputBuilder(amountToSend, ERGONAMES_PROXY_ADDRESS)
            .setAdditionalRegisters({
                R4: SConstant(SColl(SByte, Buffer.from(name, "utf-8"))).toString("hex"),
                R5: receiverErgoTree,
            })
        )
        .sendChangeTo(receiverAddress)
        .payMinFee()
        .build("EIP-12");
    
    let signedTransaction = await ergo.sign_tx(unsignedTransaction);
    let txInfo = await ergo.submit_tx(signedTransaction);    
    return { txId: txInfo };
}

async function getCurrentHeight(explorerUrl = DEFAULT_EXPLORER_URL) {
    let url = `${explorerUrl}/api/v1/blocks?limit=1`;
    let response = await fetch(url);
    let json = await response.json();
    return json.total;
}