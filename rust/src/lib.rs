use serde_json::{Value, json};
use anyhow::{Result, Ok};
use reqwest::{blocking::Client};

#[derive(Debug)]
pub struct ResolveData {
    pub token_id: String,
    pub token_address: String,
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

pub fn reformat_ergoname_input(name: &str) -> String {
    if name.starts_with("~") {
        let name: String = name.replace("~", "");
        return name;
    }
    name.to_string()
}

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