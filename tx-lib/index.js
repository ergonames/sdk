import { ErgoAddress, OutputBuilder, SColl, TransactionBuilder } from "@fleet-sdk/core";

const DEFAULT_EXPLORER_URL = "https://api-testnet.ergoplatform.com";
const ERGONAMES_CONTRACT_ADDRESS = "XV64MAhmxVwnr8hFLcoTpJas5XQZ4EmPx7s3rdD9EFVxRk8uHZf8AGbN5aKL1Rn563BTbprBw3ex7fusqtAMTcpy6tU1FySTXNqWo1xrHcQ5DkKytmguJB6BGLi4NLUjaFX3mQSbqWJz6VmLa7nUe4YsGji7YQuK6bTxaLoUogG3FSt6gjJLm3NY9ZeoAvw1wqaB2qMpNNfvspaeenydQ6Xxo9qt1N4HfnDkXosyCeA4maaam5bHBjcg8uKey8pLYLG65cdfizvqhVVbEAYYcm85VCimwvY6WxapSkVA6G13GAB284LcFCHoXTnWMRLoFNw2RGNtMtpFbpHYDFqT7iyYaJmDm9a9WVGQjbK7o2q3moLECneZYB1BnMSBynhJzJ";
const ROYALTY_PERCENTAGE = 20;

export async function sendTransaction(price, name, receiverAddress, explorerUrl = DEFAULT_EXPLORER_URL) {
    let currentHeight = await getCurrentHeight(explorerUrl);
    let amountToSend = price + (1000000 * 2);
    let inputs = await ergo.get_utxos(amountToSend);

    let receiverErgoAddress = ErgoAddress.fromBase58(String(receiverAddress));
    let receiverErgoTree = receiverErgoAddress.ergoTree;

    const unsignedTransaction = new TransactionBuilder(currentHeight)
        .from(inputs)
        .to(new OutputBuilder(amountToSend, ERGONAMES_CONTRACT_ADDRESS)
            .setAdditionalRegisters({
                R4: ROYALTY_PERCENTAGE,
                R5: SColl(Buffer.from(name, "utf-8")).toString("hex"),
                R6: price,
                R7: receiverErgoTree,
            })
        )
        .sendChangeTo(receiverAddress)
        .payMinFee()
        .build("EIP-12");
    
    let signedTransaction = await ergo.sign_tx(unsignedTransaction);
    let txInfo = await ergo.submit_tx(signedTransaction);    
    return txInfo;
}

async function getCurrentHeight(explorerUrl = DEFAULT_EXPLORER_URL) {
    let url = `${explorerUrl}/api/v1/blocks?limit=1`;
    let response = await fetch(url);
    let json = await response.json();
    return json.total;
}