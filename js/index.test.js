import { resolve_ergoname, check_already_registered, check_name_valid, get_block_id_registered, get_block_registered, get_timestamp_registered, get_date_registered, get_total_amount_owned, reverse_search} from './index.js';
import pkg from 'lodash';
const { isEqual } = pkg;

const name = "sdktests";
const null_name = "nullname";
const j5TL_address  = "3WwKzFjZGrtKAV7qSCoJsZK9iJhLLrUa3uwd4yw52bVtDVv6j5TL";
const BXZa_address   = "3WycHxEz8ExeEWpUBwvu1FKrpY8YQCiH1S9PfnAvBX1K73BXBXZa";
const GLSf_address = "3Wxf2LxF8HUSzfnT6bDGGUDNp1YMvWo5JWxjeSpszuV6w6UJGLSf";

let passed_amount = 0;
let failed_amount = 0;
let total_amount = 0;

const test_resolve_ergoname = async () => {
    let start_timestamp = Date.now();
    const resolved_name = await resolve_ergoname(name);
    let end_timestamp = Date.now();
    let time_taken = end_timestamp - start_timestamp;
    if (resolved_name === BXZa_address) {
        passed_amount += 1;
        total_amount += 1;
        return "Test resolve_ergoname passed in " + time_taken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test resolve_ergoname failed in " + time_taken + " milliseconds";
};

const test_null_resolve_ergoname = async () => {
    let start_timestamp = Date.now();
    const resolved_name = await resolve_ergoname(null_name);
    let end_timestamp = Date.now();
    let time_taken = end_timestamp - start_timestamp;
    if (resolved_name === null) {
        passed_amount += 1;
        total_amount += 1;
        return "Test null_resolve_ergoname passed in " + time_taken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test null_resolve_ergoname failed in " + time_taken + " milliseconds";
};

const test_check_already_registered = async () => {
    let start_timestamp = Date.now();
    const already_registered = await check_already_registered(name);
    let end_timestamp = Date.now();
    let time_taken = end_timestamp - start_timestamp;
    if (already_registered === true) {
        passed_amount += 1;
        total_amount += 1;
        return "Test check_already_registered passed in " + time_taken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test check_already_registered failed in " + time_taken + " milliseconds";
};

const test_null_check_already_registered = async () => {
    let start_timestamp = Date.now();
    const already_registered = await check_already_registered(null_name);
    let end_timestamp = Date.now();
    let time_taken = end_timestamp - start_timestamp;
    if (already_registered === false) {
        passed_amount += 1;
        total_amount += 1;
        return "Test null_check_already_registered passed in " + time_taken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test null_check_already_registered failed in " + time_taken + " milliseconds";
};

const test_check_name_valid = async () => {
    let start_timestamp = Date.now();
    const valid_name = await check_name_valid(name);
    let end_timestamp = Date.now();
    let time_taken = end_timestamp - start_timestamp;
    if (valid_name === true) {
        passed_amount += 1;
        total_amount += 1;
        return "Test check_name_valid passed in " + time_taken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test check_name_valid failed in " + time_taken + " milliseconds";
};

const test_null_check_name_valid = async () => {
    let start_timestamp = Date.now();
    const valid_name = await check_name_valid(null_name);
    let end_timestamp = Date.now();
    let time_taken = end_timestamp - start_timestamp;
    if (valid_name === true) {
        passed_amount += 1;
        total_amount += 1;
        return "Test null_check_name_valid passed in " + time_taken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test null_check_name_valid failed in " + time_taken + " milliseconds";
};


const test_get_block_id_registered = async () => {
    let start_timestamp = Date.now();
    const block_id = await get_block_id_registered(name);
    let end_timestamp = Date.now();
    let time_taken = end_timestamp - start_timestamp;
    if (block_id === "21e7cbe703f24a7827df37e05a11f3b55aaae91115f9c63a77f369fa319a14f6") {
        passed_amount += 1;
        total_amount += 1;
        return "Test get_block_id_registered passed in " + time_taken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test get_block_id_registered failed in " + time_taken + " milliseconds";
};

const test_null_get_block_id_registered = async () => {
    let start_timestamp = Date.now();
    const block_id = await get_block_id_registered(null_name);
    let end_timestamp = Date.now();
    let time_taken = end_timestamp - start_timestamp;
    if (block_id === null) {
        passed_amount += 1;
        total_amount += 1;
        return "Test null_get_block_id_registered passed in " + time_taken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test null_get_block_id_registered failed in " + time_taken + " milliseconds";
};

const test_get_block_registered = async () => {
    let start_timestamp = Date.now();
    const block = await get_block_registered(name);
    let end_timestamp = Date.now();
    let time_taken = end_timestamp - start_timestamp;
    if (block === 48209) {
        passed_amount += 1;
        total_amount += 1;
        return "Test get_block_registered passed in " + time_taken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test get_block_registered failed in " + time_taken + " milliseconds";
};

const test_null_get_block_registered = async () => {
    let start_timestamp = Date.now();
    const block = await get_block_registered(null_name);
    let end_timestamp = Date.now();
    let time_taken = end_timestamp - start_timestamp;
    if (block === null) {
        passed_amount += 1;
        total_amount += 1;
        return "Test null_get_block_registered passed in " + time_taken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test null_get_block_registered failed in " + time_taken + " milliseconds";
};

const test_get_timestamp_registered = async () => {
    let start_timestamp = Date.now();
    const timestamp = await get_timestamp_registered(name);
    let end_timestamp = Date.now();
    let time_taken = end_timestamp - start_timestamp;
    if (timestamp === 1665614877414) {
        passed_amount += 1;
        total_amount += 1;
        return "Test get_timestamp_registered passed in " + time_taken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test get_timestamp_registered failed in " + time_taken + " milliseconds";
};

const test_null_get_timestamp_registered = async () => {
    let start_timestamp = Date.now();
    const timestamp = await get_timestamp_registered(null_name);
    let end_timestamp = Date.now();
    let time_taken = end_timestamp - start_timestamp;
    if (timestamp === null) {
        passed_amount += 1;
        total_amount += 1;
        return "Test null_get_timestamp_registered passed in " + time_taken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test null_get_timestamp_registered failed in " + time_taken + " milliseconds";
};

const test_get_date_registered = async () => {
    let start_timestamp = Date.now();
    const date = await get_date_registered(name);
    let end_timestamp = Date.now();
    let time_taken = end_timestamp - start_timestamp;
    if (date === "10/12/2022") {
        passed_amount += 1;
        total_amount += 1;
        return "Test get_date_registered passed in " + time_taken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test get_date_registered failed in " + time_taken + " milliseconds";
};

const test_null_get_date_registered = async () => {
    let start_timestamp = Date.now();
    const date = await get_date_registered(null_name);
    let end_timestamp = Date.now();
    let time_taken = end_timestamp - start_timestamp;
    if (date === null) {
        passed_amount += 1;
        total_amount += 1;
        return "Test null_get_date_registered passed in " + time_taken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test null_get_date_registered failed in " + time_taken + " milliseconds";
};

const test_reverse_search = async () => {
    let start_timestamp = Date.now();
    const reverse_search_result = await reverse_search(BXZa_address);
    let end_timestamp = Date.now();
    let time_taken = end_timestamp - start_timestamp;
    let token_data = {'tokenId': '90e06b8014663a28523abe9ecf7eb65a74ee179abee1726a7cb47c860ac22b40', 'amount': 1, 'decimals': 0, 'name': 'sdktests', 'tokenType': 'EIP-004'}
    let owned_array = [token_data];
    if (isEqual(reverse_search_result, owned_array)) {
        passed_amount += 1;
        total_amount += 1;
        return "Test reverse_search passed in " + time_taken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test reverse_search failed in " + time_taken + " milliseconds";
};

const test_null_reverse_search = async () => {
    let start_timestamp = Date.now();
    const reverse_search_result = await reverse_search(GLSf_address);
    let end_timestamp = Date.now();
    let time_taken = end_timestamp - start_timestamp;
    if (reverse_search_result === null) {
        passed_amount += 1;
        total_amount += 1;
        return "Test null_reverse_search passed in " + time_taken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test null_reverse_search failed in " + time_taken + " milliseconds";
};

const test_get_total_amount_owned = async () => {
    let start_timestamp = Date.now();
    const total_amount_owned = await get_total_amount_owned(BXZa_address);
    let end_timestamp = Date.now();
    let time_taken = end_timestamp - start_timestamp;
    if (total_amount_owned === 1) {
        passed_amount += 1;
        total_amount += 1;
        return "Test get_total_amount_owned passed in " + time_taken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test get_total_amount_owned failed in " + time_taken + " milliseconds";
};

const test_null_get_total_amount_owned = async () => {
    let start_timestamp = Date.now();
    const total_amount_owned = await get_total_amount_owned(GLSf_address);
    let end_timestamp = Date.now();
    let time_taken = end_timestamp - start_timestamp;
    if (total_amount_owned === null) {
        passed_amount += 1;
        total_amount += 1;
        return "Test null_get_total_amount_owned passed in " + time_taken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test null_get_total_amount_owned failed in " + time_taken + " milliseconds";
};

console.log(await test_resolve_ergoname());
console.log(await test_null_resolve_ergoname());
console.log(await test_check_already_registered());
console.log(await test_null_check_already_registered());
console.log(await test_check_name_valid());
console.log(await test_null_check_name_valid());
console.log(await test_get_block_id_registered());
console.log(await test_null_get_block_id_registered());
console.log(await test_get_block_registered());
console.log(await test_null_get_block_registered());
console.log(await test_get_timestamp_registered());
console.log(await test_null_get_timestamp_registered());
console.log(await test_get_date_registered());
console.log(await test_null_get_date_registered());

if (passed_amount === 14) {
    console.log("All registration tests passed\n");
} else {
    console.log("Some registration tests failed\n");
};

console.log(await test_reverse_search());
console.log(await test_null_reverse_search());
console.log(await test_get_total_amount_owned());
console.log(await test_null_get_total_amount_owned());

if (passed_amount === total_amount) {
    console.log("All tests passed");
} else {
    console.log("Some tests failed");
}