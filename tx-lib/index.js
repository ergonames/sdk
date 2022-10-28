import { ErgoAddress, OutputBuilder, SColl, SByte, SConstant, SLong, TransactionBuilder } from "@fleet-sdk/core";

const DEFAULT_EXPLORER_URL = "https://api-testnet.ergoplatform.com";
const ERGONAMES_CONTRACT_ADDRESS = "gyGWQNQZJQ1qvJobi3aP6XGPd8vSAKAJwZowKLMhFQowQjCToww199LT2p7tpeZzJaWDfCeYUhWsw2qaEhCbpcxXpb898WPGz7LxKTWrscMrw8LLeJ6k7UTXDWznrnmkidBbXKVwGfCaHuUyyBBdTyf5rZREH1hw2bdky4hbGnDwjCVpsGnpNgY1ASwwsiDJGJ8GXyvfaZbuT5PaNKYqZxLBbUzRR2bLvm2aVEEBh5AWG77Mzy54nVxMAh1omNRgR8uf2MrMzficmqDPF9hrrk52fDyw6ixxMpwoMoaMovcqkhE3zreWdq3QetW758WPCTu6cEGLMhfMXXqB7jaCh3STPqtp8YayvXNcYBiStFTh2gfG9MSK6fdDdMPZ3QVN1gEhCkmuV2jF713JMRLaWiXTZTHTBr9XM6ympxNDGJpgVWb";

export async function sendTransaction(price, name, receiverAddress, explorerUrl = DEFAULT_EXPLORER_URL) {
    let currentHeight = await getCurrentHeight(explorerUrl);
    let amountToSend = price + (1000000 * 2);
    let inputs = await ergo.get_utxos(amountToSend);

    let receiverErgoAddress = ErgoAddress.fromBase58(String(receiverAddress));
    let receiverErgoTree = receiverErgoAddress.ergoTree;
    receiverErgoTree = "0e24" + receiverErgoTree;

    const unsignedTransaction = new TransactionBuilder(currentHeight)
        .from(inputs)
        .to(new OutputBuilder(amountToSend, ERGONAMES_CONTRACT_ADDRESS)
            .setAdditionalRegisters({
                R4: SConstant(SColl(SByte, Buffer.from(name, "utf-8"))).toString("hex"),
                R5: SConstant(SLong(price)).toString("hex"),
                R6: receiverErgoTree,
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