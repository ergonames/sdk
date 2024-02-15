use anyhow::Result;

const API_BASE_URL: &str = "http://54.183.62.198:3001";

#[derive(Debug)]
pub struct Ergoname {
    pub ergoname: String,
    pub mint_transaction: String,
    pub mint_box: String,
    pub spent_transaction: String,
    pub token_id: String,
    pub block_registered: String,
    pub registration_number: u32,
}

pub fn resolve_ergoname(name: &str) -> Result<Ergoname> {
    let url: &str = &format!("{}/resolve/{}", API_BASE_URL, name);
    let resp = reqwest::blocking::get(url).unwrap();
    let body = resp.text().unwrap();
    let json: serde_json::Value = serde_json::from_str(&body).unwrap();
    let res = &json[0];
    let en = Ergoname {
        ergoname: res["ergoname_name"].to_string(),
        mint_transaction: res["mint_transaction_id"].to_string(),
        mint_box: res["mint_box_id"].to_string(),
        spent_transaction: res["spent_transaction_id"].to_string(),
        token_id: res["ergoname_token_id"].to_string(),
        block_registered: res["block_registered"].to_string(),
        registration_number: res["registration_number"]
            .to_string()
            .parse::<u32>()
            .unwrap(),
    };
    Ok(en)
}

pub fn ergoname_owner(name: &str) -> Result<String> {
    let url: &str = &format!("{}/owner/{}", API_BASE_URL, name);
    let resp = reqwest::blocking::get(url).unwrap();
    let body = resp.text().unwrap();
    let json: serde_json::Value = serde_json::from_str(&body).unwrap();
    Ok(json["owner"].to_string())
}
