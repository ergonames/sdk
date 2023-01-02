import { ErgoAddress, OutputBuilder, SColl, SByte, SConstant, TransactionBuilder } from "@fleet-sdk/core";

const DEFAULT_EXPLORER_URL = "https://api-testnet.ergoplatform.com";
const ERGONAMES_CONTRACT_ADDRESS = "2QSobRecPvrMVpdNVdqiEcDjCoZYyMCXRwh8cA8M5qx3rwiuQA5bifAzghk";

export async function sendTransaction(name, receiverAddress, explorerUrl = DEFAULT_EXPLORER_URL) {
    let currentHeight = await getCurrentHeight(explorerUrl);
    let amountToSend = 1000000 * 2;
    let inputs = await ergo.get_utxos(amountToSend);

    let receiverErgoAddress = ErgoAddress.fromBase58(String(receiverAddress));
    let receiverErgoTree = receiverErgoAddress.ergoTree;
    receiverErgoTree = "0e24" + receiverErgoTree;

    const unsignedTransaction = new TransactionBuilder(currentHeight)
        .from(inputs)
        .to(new OutputBuilder(amountToSend, ERGONAMES_CONTRACT_ADDRESS)
            .setAdditionalRegisters({
                R4: SConstant(SColl(SByte, Buffer.from(name, "utf-8"))).toString("hex"),
                R5: receiverErgoTree,
            })
        )
        .sendChangeTo(receiverAddress)
        .payMinFee()
        .build("EIP-12");
    
    let signedTransaction = await ergo.sign_tx(unsignedTransaction);
    let outputZeroBoxId = signedTransaction.outputs[0].boxId;
    let txInfo = await ergo.submit_tx(signedTransaction);    
    return { txId: txInfo, boxId: outputZeroBoxId };
}

async function getCurrentHeight(explorerUrl = DEFAULT_EXPLORER_URL) {
    let url = `${explorerUrl}/api/v1/blocks?limit=1`;
    let response = await fetch(url);
    let json = await response.json();
    return json.total;
}