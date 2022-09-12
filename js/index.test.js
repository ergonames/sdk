import { resolve_ergoname, check_already_registered, check_name_valid, get_block_id_registered, get_block_registered, get_timestamp_registered, get_date_registered, get_total_amount_owned, reverse_search} from './index.js';
import pkg from 'lodash';
const { isEqual } = pkg;

const name = "~firstofmany";
const null_name = "~zack";
const address = "9fEqfyAUQE7aCuYazV28moMjMUtzA8wSqyY7iPZAwSViCjDSnEB";
const null_address = "9f5DBrs8oReD5pztPz1hqnmLoNqPuDqJC7rskt593sJxVQoing8";

let passed_amount = 0;
let failed_amount = 0;
let total_amount = 0;

const test_resolve_ergoname = async () => {
    let start_timestamp = Date.now();
    const resolved_name = await resolve_ergoname(name);
    let end_timestamp = Date.now();
    let time_taken = end_timestamp - start_timestamp;
    if (resolved_name === address) {
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
    if (block_id === "0873d8dc922e1e7b8c802bee599cdfa13e010fe7f96dfb473383548ac68b6189") {
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
    if (block === 836605) {
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
    if (timestamp === 1662942507465) {
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
    if (date === "9/11/2022") {
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
    const reverse_search_result = await reverse_search(address);
    let end_timestamp = Date.now();
    let time_taken = end_timestamp - start_timestamp;
    let token_data = {'tokenId': '9464438a5d880041a186a3191a281a45034d8fd6a03a331b2aeeb99b86fc4754', 'amount': 1, 'decimals': 0, 'name': '~firstofmany', 'tokenType': 'EIP-004'}
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
    const reverse_search_result = await reverse_search(null_address);
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
    const total_amount_owned = await get_total_amount_owned(address);
    let end_timestamp = Date.now();
    let time_taken = end_timestamp - start_timestamp;
    if (total_amount_owned === 3) {
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
    const total_amount_owned = await get_total_amount_owned(null_address);
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
console.log(await test_reverse_search());
console.log(await test_null_reverse_search());
console.log(await test_get_total_amount_owned());
console.log(await test_null_get_total_amount_owned());

if (passed_amount === total_amount) {
    console.log("All tests passed");
} else {
    console.log("Some tests failed");
}