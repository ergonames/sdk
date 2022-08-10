import { resolve_ergoname, check_already_registered, check_name_valid, get_block_id_registered, get_block_registered, get_timestamp_registered, get_date_registered, get_total_amount_owned, reverse_search} from './index.js';
import pkg from 'lodash';
const { isEqual } = pkg;

const name = "~balb";
const null_name = "~zack";
const address = "3WwKzFjZGrtKAV7qSCoJsZK9iJhLLrUa3uwd4yw52bVtDVv6j5TL";
const null_address = "3Wxf2LxF8HUSzfnT6bDGGUDNp1YMvWo5JWxjeSpszuV6w6UJGLSf";

let passed_amount = 0;
let failed_amount = 0;
let total_amount = 0;

const test_resolve_ergoname = async () => {
    const resolved_name = await resolve_ergoname(name);
    if (resolved_name === address) {
        passed_amount += 1;
        total_amount += 1;
        return "Test resolve_ergoname passed";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test resolve_ergoname failed";
};

const test_null_resolve_ergoname = async () => {
    const resolved_name = await resolve_ergoname(null_name);
    if (resolved_name === null) {
        passed_amount += 1;
        total_amount += 1;
        return "Test null_resolve_ergoname passed";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test null_resolve_ergoname failed";
};

const test_check_already_registered = async () => {
    const already_registered = await check_already_registered(name);
    if (already_registered === true) {
        passed_amount += 1;
        total_amount += 1;
        return "Test check_already_registered passed";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test check_already_registered failed";
};

const test_null_check_already_registered = async () => {
    const already_registered = await check_already_registered(null_name);
    if (already_registered === false) {
        passed_amount += 1;
        total_amount += 1;
        return "Test null_check_already_registered passed";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test null_check_already_registered failed";
};

const test_check_name_valid = async () => {
    const valid_name = await check_name_valid(name);
    if (valid_name === true) {
        passed_amount += 1;
        total_amount += 1;
        return "Test check_name_valid passed";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test check_name_valid failed";
};

const test_null_check_name_valid = async () => {
    const valid_name = await check_name_valid(null_name);
    if (valid_name === true) {
        passed_amount += 1;
        total_amount += 1;
        return "Test null_check_name_valid passed";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test null_check_name_valid failed";
};


const test_get_block_id_registered = async () => {
    const block_id = await get_block_id_registered(name);
    if (block_id === "a5e0ab7f95142ceee7f3b6b5a5318153b345292e9aaae7c56825da115e196d08") {
        passed_amount += 1;
        total_amount += 1;
        return "Test get_block_id_registered passed";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test get_block_id_registered failed";
};

const test_null_get_block_id_registered = async () => {
    const block_id = await get_block_id_registered(null_name);
    if (block_id === null) {
        passed_amount += 1;
        total_amount += 1;
        return "Test null_get_block_id_registered passed";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test null_get_block_id_registered failed";
};

const test_get_block_registered = async () => {
    const block = await get_block_registered(name);
    if (block === 60761) {
        passed_amount += 1;
        total_amount += 1;
        return "Test get_block_registered passed";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test get_block_registered failed";
};

const test_null_get_block_registered = async () => {
    const block = await get_block_registered(null_name);
    if (block === null) {
        passed_amount += 1;
        total_amount += 1;
        return "Test null_get_block_registered passed";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test null_get_block_registered failed";
};

const test_get_timestamp_registered = async () => {
    const timestamp = await get_timestamp_registered(name);
    if (timestamp === 1656968987794) {
        passed_amount += 1;
        total_amount += 1;
        return "Test get_timestamp_registered passed";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test get_timestamp_registered failed";
};

const test_null_get_timestamp_registered = async () => {
    const timestamp = await get_timestamp_registered(null_name);
    if (timestamp === null) {
        passed_amount += 1;
        total_amount += 1;
        return "Test null_get_timestamp_registered passed";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test null_get_timestamp_registered failed";
};

const test_get_date_registered = async () => {
    const date = await get_date_registered(name);
    if (date === "7/4/2022") {
        passed_amount += 1;
        total_amount += 1;
        return "Test get_date_registered passed";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test get_date_registered failed";
};

const test_null_get_date_registered = async () => {
    const date = await get_date_registered(null_name);
    if (date === null) {
        passed_amount += 1;
        total_amount += 1;
        return "Test null_get_date_registered passed";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test null_get_date_registered failed";
};

const test_reverse_search = async () => {
    const reverse_search_result = await reverse_search(address);
    let token_data = {'tokenId': '2b41b93d22a46de0b0ed9c8b814b766298adbf2ff304f83ee2426f47ac33d9b8', 'amount': 1, 'decimals': 0, 'name': '~balb', 'tokenType': 'EIP-004'}
    let owned_array = [token_data];
    if (isEqual(reverse_search_result, owned_array)) {
        passed_amount += 1;
        total_amount += 1;
        return "Test reverse_search passed";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test reverse_search failed";
};

const test_null_reverse_search = async () => {
    const reverse_search_result = await reverse_search(null_address);
    if (reverse_search_result === null) {
        passed_amount += 1;
        total_amount += 1;
        return "Test null_reverse_search passed";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test null_reverse_search failed";
};

const test_get_total_amount_owned = async () => {
    const total_amount_owned = await get_total_amount_owned(address);
    if (total_amount_owned === 1) {
        passed_amount += 1;
        total_amount += 1;
        return "Test get_total_amount_owned passed";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test get_total_amount_owned failed";
};

const test_null_get_total_amount_owned = async () => {
    const total_amount_owned = await get_total_amount_owned(null_address);
    if (total_amount_owned === null) {
        passed_amount += 1;
        total_amount += 1;
        return "Test null_get_total_amount_owned passed";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test null_get_total_amount_owned failed";
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