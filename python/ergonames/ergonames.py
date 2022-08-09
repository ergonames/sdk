import datetime
import requests

EXPLORER_API_URL = "https://api-testnet.ergoplatform.com/"
MINT_ADDRESS = "3WycHxEz8ExeEWpUBwvu1FKrpY8YQCiH1S9PfnAvBX1K73BXBXZa"
MINT_ADDRESS_ERGO_TREE = ""

def resolve_ergoname(name, explorer_url = EXPLORER_API_URL):
    token_data = create_token_data(name, explorer_url)
    if len(token_data) > 0:
        token_id = get_asset_minted_at_address(token_data, explorer_url)
        token_transactions = get_token_transaction_data(token_id, explorer_url)
        token_last_transaction = get_token_last_transaction(token_transactions)
        token_box_id = get_box_id_from_token_data(token_last_transaction)
        token_box_address = get_box_address(token_box_id, explorer_url)
        return token_box_address
    return None

def check_already_registered(name, explorer_url = EXPLORER_API_URL):
    address = resolve_ergoname(name)
    if address is None:
        return False
    return True

def check_pending_registration(name, explorer_url = EXPLORER_API_URL):
    mempool_transactions = get_mempool_transactins(explorer_url)
    if mempool_transactions == None or len(mempool_transactions) == 0:
        return None
    for tx in mempool_transactions:
        for opt in tx["outputs"]:
            ergo_tree = opt["ergoTree"]
            if ergo_tree == MINT_ADDRESS_ERGO_TREE:
                for asset in opt["assets"]:
                    r_name = asset["name"]
                    if r_name == name:
                        return tx["id"]
    return None
    

def available_for_registration(name, explorer_url = EXPLORER_API_URL):
    resolved_address = resolve_ergoname(name)
    pending = check_pending_registration(name)
    if resolved_address is None and pending is None:
        return True
    return False

def check_name_valid(name):
    for c in name:
        if c not in "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_.~":
            return False
    return True

def get_block_id_registered(name, explorer_url = EXPLORER_API_URL):
    token_data = create_token_data(name, explorer_url)
    if len(token_data) > 0:
        token_id = get_asset_minted_at_address(token_data, explorer_url)
        token_transactions = get_token_transaction_data(token_id, explorer_url)
        token_first_transaction = get_token_first_transaction(token_transactions)
        token_block_id  = get_block_id_from_transaction_data(token_first_transaction)
        return token_block_id
    return None

def get_block_registered(name, explorer_url = EXPLORER_API_URL):
    block_id = get_block_id_registered(name, explorer_url)
    if block_id is None:
        return None
    block = get_height_from_transaction(block_id, explorer_url)
    return block

def get_timestamp_registered(name, explorer_url = EXPLORER_API_URL):
    block_id = get_block_id_registered(name, explorer_url)
    if block_id is None:
        return None
    timestamp = get_timestamp_from_transaction(block_id, explorer_url)
    return timestamp

def get_date_registered(name, explorer_url = EXPLORER_API_URL):
    timestamp = get_timestamp_registered(name, explorer_url)
    if timestamp is None:
        return None
    return datetime.datetime.fromtimestamp(timestamp / 1000).strftime('%Y-%m-%d')

def reverse_search(address, explorer_url = EXPLORER_API_URL):
    token_data = get_address_confirmed_balance(address, explorer_url)["tokens"]
    if token_data is None:
        return None
    token_data = remove_invalid_tokens(token_data)
    token_data = check_correct_mint_address(address, token_data)
    return token_data
    
def get_total_amount_owned(address, explorer_url = EXPLORER_API_URL):
    owned = reverse_search(address)
    if owned is None:
        return 0
    return len(owned)

def create_token_data(name, explorer_url = EXPLORER_API_URL):
    total = get_token_data(name, 1, 0, explorer_url)["total"]
    needed_calls = int(total / 500) + 1
    data = []
    offset = 0
    if total > 0:
        for i in range(needed_calls):
            data += get_token_data(name, 500, offset, explorer_url)["items"]
            offset += 500
    return data

def get_mempool_transactins(explorer_url = EXPLORER_API_URL):
    url = explorer_url + "api/v1/mempool/transactions/byAddress" + MINT_ADDRESS
    response = requests.get(url).json()
    return response

def get_token_data(name, limit, offset, explorer_url = EXPLORER_API_URL):
    url = explorer_url + "api/v1/tokens/search?query=" + name + "&limit=" + str(limit) + "&offset=" + str(offset)
    response = requests.get(url).json()
    return response

def get_asset_minted_at_address(token_data, explorer_url = EXPLORER_API_URL):
    for i in token_data:
        address = get_box_address(i["boxId"], explorer_url)
        if address == MINT_ADDRESS:
            return i["id"]
    return None

def get_box_address(box_id, explorer_url = EXPLORER_API_URL):
    box = get_box_by_id(box_id, explorer_url)
    return box["address"]

def get_box_by_id(box_id, explorer_url = EXPLORER_API_URL):
    url = explorer_url + "api/v1/boxes/" + box_id
    box = requests.get(url).json()
    return box

def get_token_transaction_data(token_id, explorer_url = EXPLORER_API_URL):
    url = explorer_url + "api/v1/assets/search/byTokenId?query=" + token_id
    transactions = requests.get(url).json()
    return transactions

def get_token_last_transaction(token_transactions):
    token_transactions = token_transactions["items"]
    last_transaction = None
    creation_height = 0
    for i in token_transactions:
        box_id = i["boxId"]
        box_info = get_box_by_id(box_id)
        if box_info["creationHeight"] > creation_height:
            creation_height = box_info["creationHeight"]
            last_transaction = i
    return last_transaction

def get_token_first_transaction(token_transactions):
    token_transactions = token_transactions["items"]
    last_transaction = None
    creation_height = None
    for i in token_transactions:
        box_id = i["boxId"]
        box_info = get_box_by_id(box_id)
        if creation_height is None or box_info["creationHeight"] < creation_height:
            creation_height = box_info["creationHeight"]
            last_transaction = i
    return last_transaction

def get_token_data_by_token_id(token_id, explorer_url = EXPLORER_API_URL):
    url = explorer_url + "api/v1/tokens/" + token_id
    token_data = requests.get(url).json()
    return token_data

def get_box_id_from_token_data(token_data):
    return token_data["boxId"]

def get_block_id_from_transaction_data(transaction_data):
    return transaction_data["headerId"]

def get_block_by_id(block_id, explorer_url = EXPLORER_API_URL):
    url = explorer_url + "api/v1/blocks/" + block_id
    block = requests.get(url).json()
    return block

def get_height_from_transaction(transaction, explorer_url = EXPLORER_API_URL):
    block_data = get_block_by_id(transaction, explorer_url)
    return block_data["block"]["header"]["height"]
    
def get_timestamp_from_transaction(block_id, explorer_url = EXPLORER_API_URL):
    block = get_block_by_id(block_id, explorer_url)
    return block["block"]["header"]["timestamp"]

def get_address_tokens(address, explorer_url = EXPLORER_API_URL):
    balance = get_address_confirmed_balance(address, explorer_url)
    return balance["tokens"]

def get_address_confirmed_balance(address, explorer_url = EXPLORER_API_URL):
    url = explorer_url + "api/v1/addresses/" + address + "/balance/confirmed"
    balance = requests.get(url).json()
    return balance

def remove_invalid_tokens(token_data):
    for i in token_data:
        if check_name_valid(i["name"]) is False:
            token_data.remove(i)
    return token_data

def check_correct_mint_address(address, token_data):
    for i in token_data:
        token = get_token_data_by_token_id(i["tokenId"])
        box_id = token["boxId"]
        if get_box_address(box_id) != MINT_ADDRESS:
            token_data.remove(i)
    return token_data