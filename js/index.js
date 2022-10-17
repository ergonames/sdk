import axios from 'axios';

const EXPLORER_API_URL = "https://api-testnet.ergoplatform.com";
const MINT_ADDRESS = "3WxtPsqQVhdwQYA6BPGkfzo9y4vXoNNViZeguc3tJuxPo1XrheUp";

const MINT_ADDRESS_ERGO_TREE = "";

export const resolve_ergoname = async (name, explorer_url = EXPLORER_API_URL) => {
    let token_data = await create_token_data(name, explorer_url);
    if (token_data == null) {
        return null;
    }
    let token_id = await get_asset_minted_at_address(token_data, explorer_url);
    let token_transactions = await get_token_transaction_data(token_id, explorer_url);
    let token_last_transaction = await get_last_transaction_for_token(token_transactions);
    let token_current_box_id = await get_box_id_from_token_data(token_last_transaction);
    let address = await get_box_address(token_current_box_id, explorer_url);
    return address;
}

export const check_already_registered = async (name, explorer_url = EXPLORER_API_URL) => {
    let address = await resolve_ergoname(name, explorer_url);
    if (address == null) {
        return false;
    }
    return true;
}

export const check_pending_registration = async (name, explorer_url = EXPLORER_API_URL) => {
    let mempool_transactions = get_mempool_transactions(explorer_url);
    if (mempool_transactions == null) {
        return null;
    }
    let total_amount = mempool_transactions.length;
    if (total_amount == 0) {
        return null;
    }
    for (let i=0; i<total_amount; i++) {
        let outputs = mempool_transactions[i].outputs;
        for (let j=0; j<outputs.length; j++) {
            let ergo_tree = outputs[j].ergoTree;
            if (ergo_tree == MINT_ADDRESS_ERGO_TREE) {
                for (let k=0; k<outputs[j].amount.length; k++) {
                    let r_name = outputs[j].assets[k].name;
                    if (r_name == name) {
                        return mempool_transactions[i].id;
                    }
                }
            }
        }
    }
    return null;
}

export const available_for_registration = async (name, explorer_url = EXPLORER_API_URL) => {
    let resolved_address = await resolve_ergoname(name, explorer_url);
    let pending = await check_pending_registration(name, explorer_url);
    if (resolved_address == null && pending == null) {
        return true;
    }
    return false;
}

export const check_name_valid = async (name) => {
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

export const get_block_id_registered = async (name, explorer_url = EXPLORER_API_URL) => {
    let token_data = await create_token_data(name, explorer_url);
    if (token_data == null) {
        return null;
    }
    let token_id = await get_asset_minted_at_address(token_data, explorer_url);
    let token_transactions = await get_token_transaction_data(token_id, explorer_url);
    let token_first_transaction = await get_first_transaction_for_token(token_transactions);
    let block_id = await get_block_id_from_transaction(token_first_transaction);
    return block_id;
}

export const get_block_registered = async (name, explorer_url = EXPLORER_API_URL) => {
    let block_id = await get_block_id_registered(name, explorer_url);
    if (block_id == null) {
        return null;
    }
    let block_data = await get_block_by_id(block_id, explorer_url);
    let height = await get_height_from_block(block_data);
    return height;
}

export const get_timestamp_registered = async (name, explorer_url = EXPLORER_API_URL) => {
    let block_id = await get_block_id_registered(name, explorer_url);
    if (block_id == null) {
        return null;
    }
    let block_data = await get_block_by_id(block_id, explorer_url);
    let timestamp = await get_timestamp_from_block(block_data);
    return timestamp;
}

export const get_date_registered = async (name, explorer_url = EXPLORER_API_URL) => {
    let timestamp = await get_timestamp_registered(name, explorer_url);
    if (timestamp == null) {
        return null;
    }
    let date = new Date(timestamp);
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    date = date.toLocaleString('en-US', options);
    return date;
}

export const reverse_search = async (address, explorer_url = EXPLORER_API_URL) => {
    let token_data = await get_address_tokens(address, explorer_url);
    if (token_data.length == 0) {
        return null;
    }
    let valid_tokens = await remove_invalid_tokens(token_data);
    let correct_tokens = await check_correct_address(valid_tokens, address);
    return correct_tokens;
}

export const get_total_amount_owned = async (address, explorer_url = EXPLORER_API_URL) => {
    let owned = await reverse_search(address, explorer_url);
    if (owned == null) {
        return null;
    }
    return owned.length;
}

async function create_token_data(name, explorer_url = EXPLORER_API_URL) {
    let total_raw = await get_token_data(name, 1, 0, explorer_url);
    let total = total_raw.total;
    let needed_calls = Math.floor(total / 500) + 1;
    let offset = 0;
    let token_data = [];
    if (total > 0) {
        for (let i = 0; i < needed_calls; i++) {
            let data = await get_token_data(name, 500, offset, explorer_url);
            token_data = token_data.concat(data.items);
            offset += 500;
        }
        return token_data;
    }
    return null;
}

async function get_mempool_transactions(explorer_url = EXPLORER_API_URL) {
    let url = '${explorer_url}/api/v1/mempool/transactions/byAddress{MINT_ADDRESS}';
    let response = await axios.get(url)
        .then(res => res.data);
    let json = await response.json();
    return json;
}

async function get_token_data(name, limit, offset, explorer_url = EXPLORER_API_URL) {
    let url = `${explorer_url}/api/v1/tokens/search?query=${name}&limit=${limit}&offset=${offset}`;
    let response = await axios.get(url)
        .then(res => res.data);
    return response;
}

async function get_asset_minted_at_address(token_data, explorer_url = EXPLORER_API_URL) {
    for (let i = 0; i < token_data.length; i++) {
        let token = token_data[i];
        let token_id = token.id;
        let address = await get_box_address(token_id, explorer_url);
        if (address == MINT_ADDRESS) {
            return token_id;
        };
    };
    return null;
}

async function get_box_address(box_id, explorer_url = EXPLORER_API_URL) {
    let box_data = await get_box_by_id(box_id, explorer_url);
    let address = box_data.address;
    return address;
}

async function get_box_by_id(box_id, explorer_url = EXPLORER_API_URL) {
    let url = `${explorer_url}/api/v1/boxes/${box_id}`;
    let response = await axios.get(url)
        .then(res => res.data);
    return response;
}

async function get_token_transaction_data(token_id, explorer_url = EXPLORER_API_URL) {
    let url = `${explorer_url}/api/v1/assets/search/byTokenId?query=${token_id}`;
    let response = await axios.get(url)
        .then(res => res.data);
    return response.items;
}

async function get_last_transaction_for_token(token_transactions) {
    let latest_transaction = null;
    let creation_height = 0;
    for (let i = 0; i < token_transactions.length; i++) {
        let box_id = token_transactions[i].boxId;
        let box_info = await get_box_by_id(box_id);
        if (box_info.creationHeight > creation_height) {
            creation_height = box_info.creationHeight;
            latest_transaction = token_transactions[i];
        };
    };
    return latest_transaction;
}

async function get_first_transaction_for_token(token_transactions) {
    let latest_transaction = null;
    let creation_height = null;
    for (let i = 0; i < token_transactions.length; i++) {
        let box_id = token_transactions[i].boxId;
        let box_info = await get_box_by_id(box_id);
        if ((box_info.creationHeight < creation_height) || (creation_height == null)) {
            creation_height = box_info.creationHeight;
            latest_transaction = token_transactions[i];
        };
    };
    return latest_transaction;
}

async function get_box_id_from_token_data(data) {
    return data.boxId;
}

async function get_block_id_from_transaction(data) {
    return data.headerId;
}

async function get_block_by_id(block_id, explorer_url = EXPLORER_API_URL) {
    let url = `${explorer_url}/api/v1/blocks/${block_id}`;
    let response = await axios.get(url)
        .then(res => res.data);
    return response;
}

async function get_height_from_block(block_data) {
    return block_data.block.header.height;
}

async function get_timestamp_from_block(block_data) {
    return block_data.block.header.timestamp;
}

async function get_address_tokens(address, explorer_url = EXPLORER_API_URL) {
    let balance = await get_address_confirmed_balance(address, explorer_url);
    let tokens = balance.tokens;
    return tokens;
}

async function get_address_confirmed_balance(address, explorer_url = EXPLORER_API_URL) {
    let url = `${explorer_url}/api/v1/addresses/${address}/balance/confirmed`;
    let response = await axios.get(url)
        .then(res => res.data);
    return response;
}

async function remove_invalid_tokens(token_data) {
    for (let i = 0; i < token_data.length; i++) {
        let token = token_data[i];
        let token_name = token.name;
        if (await check_name_valid(token_name) == false) {
            token_data.splice(i, 1);
            i--;
        }
        let token_amount = token.amount;
        if (token_amount != 1) {
            token_data.splice(i, 1);
            i--;
        }
        let token_type = token.tokenType;
        if (token_type != 'EIP-004') {
            token_data.splice(i, 1);
            i--;
        }
        let token_decimals = token.decimals;
        if (token_decimals != 0) {
            token_data.splice(i, 1);
            i--;
        } 
    }
    return token_data;
}

async function check_correct_address(token_data, address) {
    for (let i=0; i<token_data.length; i++) {
        let token = token_data[i];
        let token_name = token.name;
        if (await resolve_ergoname(token_name) != address) {
            token_data.splice(i, 1);
            i--;
        }
    }
    return token_data;
}