use serde_json::{Value, json};
use anyhow::{Result, Ok};
use reqwest::{blocking::Client};

#[derive(Debug)]
pub struct ResolveData {
    pub token_id: String,
    pub token_address: String,
}

#[derive(Debug)]
pub struct RegistrationData {
    pub token_id: String,
    pub box_id: String,
    pub transaction_id: String,
    pub address: String,
    pub block_id: String,
    pub height: u32,
    pub timestamp: u64,
    pub price: String,
    pub royalty: String,
}

/// The default explorer API URL.
pub const GRAPH_QL_URL: &str = "https://gql-testnet.ergoplatform.com/";
/// The ErgoNames mint address.
pub const MINT_ADDRESS: &str = "3WxtPsqQVhdwQYA6BPGkfzo9y4vXoNNViZeguc3tJuxPo1XrheUp";

fn get_graphql_headers() -> Result<reqwest::header::HeaderMap> {
    let mut headers = reqwest::header::HeaderMap::new();
    headers.insert("Content-Type", "application/json".parse()?);
    headers.insert("Accept", "application/json".parse()?);
    Ok(headers)
}

fn make_graphql_request(query: &str, variables: &str, endpoint: Option<String>) -> Result<Value> {
    let url: String = match endpoint {
        Some(url) => url,
        None => GRAPH_QL_URL.to_string(),
    };
    let client: Client = reqwest::blocking::Client::new();
    let request_body: Value = json!({
        "query": query,
        "variables": variables
    });
    let response = client.post(url)
        .headers(get_graphql_headers()?)
        .body(request_body.to_string())
        .send()?
        .text()?;
    Ok(serde_json::from_str(&response)?)
}

fn get_token_data(name: &str, endpoint: Option<String>) -> Result<Value> {
    let query: String = format!("query BlockHeaders($tokenName: String!) {{ tokens(name: $tokenName) {{ tokenId }} }}");
    let variables: Value = json!({
        "tokenName": name
    });
    let response: Value = make_graphql_request(&query, &variables.to_string(), endpoint).unwrap();
    return Ok(response);
}

fn get_mint_address_of_token_by_id(token_id: &str, endpoint: Option<String>) -> Result<Value> {
    let query: String = format!("query BlockHeaders($tokenId: String!) {{ boxes(boxId: $tokenId) {{ address }} }}");
    let variables: Value = json!({
        "tokenId": token_id
    });
    let response: Value = make_graphql_request(&query, &variables.to_string(), endpoint).unwrap();
    return Ok(response);
}

fn get_current_token_address(token_id: &str, endpoint: Option<String>) -> Result<Value> {
    let query: String = format!("query BlockHeaders($tokenId: String!) {{ boxes(tokenId: $tokenId) {{ address }} }}");
    let variables: Value = json!({
        "tokenId": token_id
    });
    let response: Value = make_graphql_request(&query, &variables.to_string(), endpoint).unwrap();
    return Ok(response);
}

fn get_token_registration_box(token_id: &str, endpoint: Option<String>) -> Result<Value> {
    let query: String = format!("query BlockHeaders($tokenId: String!) {{ tokens(tokenId: $tokenId) {{ box {{ boxId creationHeight address transactionId }} }} }}");
    let variables: Value = json!({
        "tokenId": token_id
    });
    let response: Value = make_graphql_request(&query, &variables.to_string(), endpoint).unwrap();
    return Ok(response);
}

fn get_block_info_by_height(height: u32, endpoint: Option<String>) -> Result<Value> {
    let query: String = format!("query BlockHeaders($height: Int!) {{ blocks(height: $height) {{ timestamp headerId }} }}");
    let variables: Value = json!({
        "height": height
    });
    let response: Value = make_graphql_request(&query, &variables.to_string(), endpoint).unwrap();
    return Ok(response);
}

fn get_transaction_input_registers(transaction_id: &str, endpoint: Option<String>) -> Result<Value> {
    let query: String = format!("query BlockHeaders($transactionId: String!) {{ transactions(transactionId: $transactionId) {{ inputs {{ box {{ additionalRegisters }} }} }} }}");
    let variables: Value = json!({
        "transactionId": transaction_id
    });
    let response: Value = make_graphql_request(&query, &variables.to_string(), endpoint).unwrap();
    return Ok(response);
}

fn get_correct_token(name: &str, endpoint: Option<String>) -> Option<String> {
    let token_data: Result<Value> = get_token_data(name, endpoint.clone());
    if token_data.is_err() {
        return None;
    }
    let token_data: Value = token_data.unwrap();
    let tokens: Option<&Vec<Value>> = token_data["data"]["tokens"].as_array();
    if tokens.is_none() {
        return None;
    }
    let tokens: &Vec<Value> = tokens.unwrap();
    if tokens.len() == 0 {
        return None;
    }
    for t in tokens {
        let token_id: Option<&str> = t["tokenId"].as_str();
        if token_id.is_none() {
            continue;
        }
        let token_id: &str = token_id.unwrap();
        let mint_address: Result<Value> = get_mint_address_of_token_by_id(token_id, endpoint.clone());
        if mint_address.is_err() {
            continue;
        }
        let mint_address: Value = mint_address.unwrap();
        let mint_address: Option<&str> = mint_address["data"]["boxes"][0]["address"].as_str();
        if mint_address.is_none() {
            continue;
        }
        let mint_address: &str = mint_address.unwrap();
        if mint_address == MINT_ADDRESS {
            return Some(token_id.to_string());
        }
    }
    return None;
}

/// Reformats the input to ErgoName standard format
pub fn reformat_ergoname_input(name: &str) -> String {
    if name.starts_with("~") {
        let name: String = name.replace("~", "");
        return name;
    }
    name.to_string()
}

/// Resolved token data for the given ErgoName with token ID and current token address
pub fn resolve_ergoname(name: &str, endpoint: Option<String>) -> Option<ResolveData> {
    let name: String = reformat_ergoname_input(name);
    let token_id: Option<String> = get_correct_token(&name, endpoint.clone());
    if token_id.is_none() {
        return None;
    }
    let token_id: String = token_id.unwrap();
    let current_address: Result<Value> = get_current_token_address(&token_id, endpoint);
    if current_address.is_err() {
        return None;
    }
    let current_address: Value = current_address.unwrap();
    let current_address: Option<&str> = current_address["data"]["boxes"][0]["address"].as_str();
    if current_address.is_none() {
        return None;
    }
    let current_address: &str = current_address.unwrap();
    let resolve_data: ResolveData = ResolveData {
        token_id,
        token_address: current_address.to_string(),
    };
    return Some(resolve_data);
}

pub fn check_ergoname_registration_information(name: &str, endpoint: Option<String>) -> Option<RegistrationData> {
    let name: String = reformat_ergoname_input(name);
    let token_id: Option<String> = get_correct_token(&name, endpoint.clone());
    if token_id.is_none() {
        return None;
    }
    let token_id: String = token_id.unwrap();
    let registration_box: Result<Value> = get_token_registration_box(&token_id, endpoint.clone());
    if registration_box.is_err() {
        return None;
    }
    let registration_box: Value = registration_box.unwrap();
    let creation_height: u32 = registration_box["data"]["tokens"][0]["box"]["creationHeight"].as_u64().unwrap() as u32;
    let box_id: &str = registration_box["data"]["tokens"][0]["box"]["boxId"].as_str().unwrap();
    let address: &str = registration_box["data"]["tokens"][0]["box"]["address"].as_str().unwrap();
    let token_registration_block: Result<Value> = get_block_info_by_height(creation_height, endpoint.clone());
    if token_registration_block.is_err() {
        return None;
    }
    let token_registration_block: Value = token_registration_block.unwrap();
    let timestamp: u64 = token_registration_block["data"]["blocks"][0]["timestamp"].to_string().replace("\"", "").parse().unwrap();
    let block_id: &str = token_registration_block["data"]["blocks"][0]["headerId"].as_str().unwrap();
    let transaction_id: &str = registration_box["data"]["tokens"][0]["box"]["transactionId"].as_str().unwrap();
    let input_registers: Result<Value> = get_transaction_input_registers(transaction_id, endpoint.clone());
    if input_registers.is_err() {
        return None;
    }
    let input_registers: Value = input_registers.unwrap();
    // TODO: Properly parse register information
    let royalty_raw: String = input_registers["data"]["transactions"][0]["inputs"][0]["box"]["additionalRegisters"]["R4"].to_string().replace("\"", "");
    let amount_spend_raw: String = input_registers["data"]["transactions"][0]["inputs"][1]["box"]["additionalRegisters"]["R5"].to_string().replace("\"", "");
    return Some(RegistrationData {
        token_id,
        box_id: box_id.to_string(),
        transaction_id: transaction_id.to_string(),
        address: address.to_string(),
        block_id: block_id.to_string(),
        height: creation_height,
        timestamp,
        price: amount_spend_raw,
        royalty: royalty_raw,
    });
}

/// Returns false if the given ErgoName is not registered and true if it is registered
pub fn check_already_registered(name: &str, endpoint: Option<String>) ->  bool {
    let name: String = reformat_ergoname_input(name);
    let resolved_data: Option<ResolveData> = resolve_ergoname(&name, endpoint);
    if resolved_data.is_none() {
        return false;
    }
    return true;
}

/// Checks if the input name is valid according to ErgoName standards
pub fn check_name_valid(name: &str) -> bool {
    let name: String = reformat_ergoname_input(name);
    for c in name.chars() {
        let char_code: u32 = c as u32;
        if char_code <= 44 {
            return false;
        }
        else if char_code == 47 {
            return false;
        }
        else if char_code >= 58 && char_code <= 94 {
            return false;
        }
        else if char_code == 96 {
            return false;
        }
        else if char_code >= 123 && char_code <= 125 {
            return false;
        }
        else if char_code >= 127 {
            return false;
        }
    }
    return true;
}