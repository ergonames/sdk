import axios from 'axios';

const BASE_GRAPHQL_URL = "https://gql-testnet.ergoplatform.com/";
const ERGONAMES_MINT_ADDRESS = "3WxtPsqQVhdwQYA6BPGkfzo9y4vXoNNViZeguc3tJuxPo1XrheUp";

const getGraphQlHeaders = () => {
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
}

const makeGraphQlRequest = async (data, endpoint = BASE_GRAPHQL_URL) => {
    const headers = getGraphQlHeaders();
    const response = await axios({
        url: endpoint,
        method: 'post',
        headers: headers,
        data: data
    });
    return response;
}

const retrieveTokenData = async (ergoname, endpoint = BASE_GRAPHQL_URL) => {
    const data = {
        query: `query BlockHeaders($tokenName: String!) { tokens(name: $tokenName) { tokenId } }`,
        variables: { tokenName: ergoname }
    }
    const response = await makeGraphQlRequest(data, endpoint);
    return response.data.data.tokens;
}

const getMintAddressOfTokenById = async (token_id, endpoint = BASE_GRAPHQL_URL) => {
    const data = {
        query: `query BlockHeaders($tokenId: String!) { boxes(boxId: $tokenId) { address } }`,
        variables: { tokenId: token_id }
    }
    const response = await makeGraphQlRequest(data, endpoint);
    return response.data.data.boxes[0].address;
}

const getCorrectToken = async (name, endpoint = BASE_GRAPHQL_URL) => {
    let tokenData = await retrieveTokenData(name, endpoint);
    for (let i = 0; i<tokenData.length; i++) {
        let tokenId = tokenData[i].tokenId;
        let tokenMintAddress = await getMintAddressOfTokenById(tokenId, endpoint);
        if (tokenMintAddress == ERGONAMES_MINT_ADDRESS) {
            return tokenId;
        }
    };
    return null;
}

const getCurrentTokenAddress = async (tokenId, endpoint = BASE_GRAPHQL_URL) => {
    const data = {
        query: `query BlockHeaders($tokenId: String!) { boxes(tokenId: $tokenId) { address } }`,
        variables: { tokenId: tokenId }
    }
    const response = await makeGraphQlRequest(data, endpoint);
    return response.data.data.boxes[0].address;
}

const getTokenRegistrationBox = async (tokenId, endpoint = BASE_GRAPHQL_URL) => {
    const data = {
        query: `query BlockHeaders($tokenId: String!) { tokens(tokenId: $tokenId) { box { boxId creationHeight address transactionId } } }`,
        variables: { tokenId: tokenId }
    }
    const response = await makeGraphQlRequest(data, endpoint);
    return response.data.data.tokens;
}

const getBlockInfoByHeight = async (height, endpoint = BASE_GRAPHQL_URL) => {
    const data = {
        query: `query BlockHeaders($height: Int!) { blocks(height: $height) { timestamp headerId } }`,
        variables: { height: height }
    }
    const response = await makeGraphQlRequest(data, endpoint);
    return response.data.data.blocks[0];
}

const getTransactionInputRegisters = async (transactionId, endpoint = BASE_GRAPHQL_URL) => {
    const data = {
        query: `query BlockHeaders($transactionId: String!) { transactions(transactionId: $transactionId) { inputs { box { additionalRegisters } } } }`,
        variables: { transactionId: transactionId }
    }
    const response = await makeGraphQlRequest(data, endpoint);
    return response.data.data.transactions[0].inputs;
}

const checkForInvalidCharacters = (name) => {
    const regex = /^[a-z0-9._-]+$/;
    return regex.test(name);
}

export const reformatErgonameInput = (name) => {
    if (name.startsWith("~")) {
        name = name.substring(1);
    }
    name = name.toLowerCase();
    return name;
}

export const resolveErgoname = async (name, endpoint = BASE_GRAPHQL_URL) => {
    name = reformatErgonameInput(name);
    let tokenId = await getCorrectToken(name, endpoint);
    if (tokenId == null) {
        return { registered: false, tokenId: null, tokenAddress: null };
    }
    let tokenAddress = await getCurrentTokenAddress(tokenId, endpoint);
    return { registered: true, tokenId: tokenId, tokenAddress: tokenAddress };
}

export const resolveErgonameRegistrationInformation = async (name, endpoint = BASE_GRAPHQL_URL) => {
    name = reformatErgonameInput(name);
    let tokenId = await getCorrectToken(name, endpoint);
    if (tokenId == null) {
        return { registered: false, tokenId: null, boxId: null, transactionId: null, address: null, blockId: null, height: null, timestamp: null, registerPrice: null, royalty: null }
    }
    let tokenRegistrationBox = await getTokenRegistrationBox(tokenId, endpoint);
    let creationHeight = tokenRegistrationBox[0].box.creationHeight;
    let boxId = tokenRegistrationBox[0].box.boxId;
    let address = tokenRegistrationBox[0].box.address;
    let tokenRegistrationBlock = await getBlockInfoByHeight(creationHeight, endpoint);
    let timestamp = tokenRegistrationBlock.timestamp;
    let blockId = tokenRegistrationBlock.headerId;
    let transactionId = tokenRegistrationBox[0].box.transactionId;
    let inputRegisters = await getTransactionInputRegisters(transactionId, endpoint);
    let royalty = inputRegisters[0].box.additionalRegisters.R4;
    let amountSpend = inputRegisters[1].box.additionalRegisters.R5;
    // Todo: Decode R4 to get royalty + R6 to get amount spent
    return { registered: true, tokenId: tokenId, boxId: boxId, transactionId: transactionId, address: address, blockId: blockId, height: creationHeight, timestamp: timestamp, registerPrice: amountSpend, royalty: royalty };
}

export const checkAlreadyRegistered = async (name, endpoint = BASE_GRAPHQL_URL) => {
    name = reformatErgonameInput(name);
    let tokenData = await resolveErgoname(name, endpoint);
    if (tokenData == null) {
        return false;
    }
    return true;
}

export const checkNameValid = (name) => {
    name = reformatErgonameInput(name);
    if (name.length === 0 || name.length > 20) {
        return false;
    }
    if (!checkForInvalidCharacters(name)) {
        return false;
    }
    return true;
}