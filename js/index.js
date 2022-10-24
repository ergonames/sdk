import axios from 'axios';

const GRAPH_QL_URL = "https://gql-testnet.ergoplatform.com/";
const MINT_ADDRESS = "3WxtPsqQVhdwQYA6BPGkfzo9y4vXoNNViZeguc3tJuxPo1XrheUp";

const getGraphQlHeaders = () => {
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
}

const retrieveTokenData = async (ergoname, endpoint = GRAPH_QL_URL) => {
    const headers = getGraphQlHeaders();
    const graphqlQuery = {
        "query": `query BlockHeaders($tokenName: String!) { tokens(name: $tokenName) { tokenId } }`,
        "variables": { tokenName: ergoname }
    };
    const response = await axios({
        url: endpoint,
        method: 'post',
        headers: headers,
        data: graphqlQuery
    });
    return response.data.data.tokens;
}

const getMintAddressOfTokenById = async (token_id, endpoint = GRAPH_QL_URL) => {
    const headers = getGraphQlHeaders();
    const graphqlQuery = {
        "query": `query BlockHeaders($tokenId: String!) { boxes(boxId: $tokenId) { address } }`,
        "variables": { tokenId: token_id }
    };
    const response = await axios({
        url: endpoint,
        method: 'post',
        headers: headers,
        data: graphqlQuery
    });
    return response.data.data.boxes[0].address;
}

const getCorrectToken = async (name, endpoint = GRAPH_QL_URL) => {
    let tokenData = await retrieveTokenData(name, endpoint);
    for (let i = 0; i<tokenData.length; i++) {
        let tokenId = tokenData[i].tokenId;
        let tokenMintAddress = await getMintAddressOfTokenById(tokenId, endpoint);
        if (tokenMintAddress == MINT_ADDRESS) {
            return tokenId;
        }
    };
    return null;
}

const getCurrentTokenAddress = async (tokenId, endpoint = GRAPH_QL_URL) => {
    const headers = getGraphQlHeaders();
    const graphqlQuery = {
        "query": `query BlockHeaders($tokenId: String!) { boxes(tokenId: $tokenId) { address } }`,
        "variables": { tokenId: tokenId }
    };
    const response = await axios({
        url: endpoint,
        method: 'post',
        headers: headers,
        data: graphqlQuery
    });
    return response.data.data.boxes[0].address;
}

const getTokenRegistrationBox = async (tokenId, endpoint = GRAPH_QL_URL) => {
    const headers = getGraphQlHeaders();
    const graphqlQuery = {
        "query": `query BlockHeaders($tokenId: String!) { tokens(tokenId: $tokenId) { box { boxId creationHeight address transactionId } } }`,
        "variables": { tokenId: tokenId }
    };
    const response = await axios({
        url: endpoint,
        method: 'post',
        headers: headers,
        data: graphqlQuery
    });
    return response.data.data.tokens;
}

const getBlockInfoByHeight = async (height, endpoint = GRAPH_QL_URL) => {
    const headers = getGraphQlHeaders();
    const graphqlQuery = {
        "query": `query BlockHeaders($height: Int!) { blocks(height: $height) { timestamp headerId } }`,
        "variables": { height: height }
    };
    const response = await axios({
        url: endpoint,
        method: 'post',
        headers: headers,
        data: graphqlQuery
    });
    return response.data.data.blocks[0];
}

const reformatErgonameInput = (name) => {
    if (name.startsWith("~")) {
        name = name.substring(1);
    }
    return name;
}

export const resolveErgoname = async (name, endpoint = GRAPH_QL_URL) => {
    name = reformatErgonameInput(name);
    let tokenId = await getCorrectToken(name, endpoint);
    if (tokenId == null) {
        return null;
    }
    let tokenAddress = await getCurrentTokenAddress(tokenId, endpoint);
    return { tokenId: tokenId, tokenAddress: tokenAddress };
}

export const resolveErgonameRegistrationInformation = async (name, endpoint = GRAPH_QL_URL) => {
    name = reformatErgonameInput(name);
    let tokenId = await getCorrectToken(name, endpoint);
    if (tokenId == null) {
        return null;
    }
    let tokenRegistrationBox = await getTokenRegistrationBox(tokenId, endpoint);
    let creationHeight = tokenRegistrationBox[0].box.creationHeight;
    let boxId = tokenRegistrationBox[0].box.boxId;
    let address = tokenRegistrationBox[0].box.address;
    let tokenRegistrationBlock = await getBlockInfoByHeight(creationHeight, endpoint);
    let timestamp = tokenRegistrationBlock.timestamp;
    let blockId = tokenRegistrationBlock.headerId;
    return { tokenId: tokenId, boxId: boxId, address: address, height: creationHeight, timestamp: timestamp, blockId: blockId };
}

export const checkAlreadyRegistered = async (name, endpoint = GRAPH_QL_URL) => {
    name = reformatErgonameInput(name);
    let tokenData = await resolveErgoname(name, endpoint);
    if (tokenData == null) {
        return false;
    }
    return true;
}

export const checkNameValid = async (name) => {
    name = reformatErgonameInput(name);
    for (let i=0; i<name.length; i++) {
        let charCode = name.charCodeAt(i);
        if (charCode <= 44) {
            return false;
        } else if (charCode == 47) {
            return false;
        } else if (charCode >= 58 && charCode <= 94) {
            return false;
        } else if (charCode == 96) {
            return false;
        } else if (charCode >= 123 && charCode <= 125) {
            return false;
        } else if (charCode >= 127) {
            return false;
        }
    }
    return true;
}