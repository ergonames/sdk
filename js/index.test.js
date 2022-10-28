import { resolveErgoname, checkAlreadyRegistered, checkNameValid, resolveErgonameRegistrationInformation } from './index.js';

const name = "~seperatepaymenttest";
const nullName = "nullname";
const j5TL_address  = "3WwKzFjZGrtKAV7qSCoJsZK9iJhLLrUa3uwd4yw52bVtDVv6j5TL";
const BXZa_address   = "3WycHxEz8ExeEWpUBwvu1FKrpY8YQCiH1S9PfnAvBX1K73BXBXZa";
const GLSf_address = "3Wxf2LxF8HUSzfnT6bDGGUDNp1YMvWo5JWxjeSpszuV6w6UJGLSf";

let passed_amount = 0;
let failed_amount = 0;
let total_amount = 0;

const testResolveErgoname = async () => {
    let startTimestamp = Date.now();
    const tokenData = await resolveErgoname(name);
    const resolvedAddress = tokenData.tokenAddress;
    let endTimestamp = Date.now();
    let timeTaken = endTimestamp - startTimestamp;
    if (resolvedAddress === j5TL_address) {
        passed_amount += 1;
        total_amount += 1;
        return "Test resolveErgoname passed in " + timeTaken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test resolveErgoname failed in " + timeTaken + " milliseconds";
};

const testNullResolveErgoname = async () => {
    let startTimestamp = Date.now();
    const tokenData = await resolveErgoname(nullName);
    let endTimestamp = Date.now();
    let timeTaken = endTimestamp - startTimestamp;
    if (tokenData === null) {
        passed_amount += 1;
        total_amount += 1;
        return "Test null resolveErgoname passed in " + timeTaken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test null resolveErgoname failed in " + timeTaken + " milliseconds";
};

const testCheckAlreadyRegistered = async () => {
    let startTimestamp = Date.now();
    const already_registered = await checkAlreadyRegistered(name);
    let endTimestamp = Date.now();
    let timeTaken = endTimestamp - startTimestamp;
    if (already_registered === true) {
        passed_amount += 1;
        total_amount += 1;
        return "Test checkAlreadyRegistered passed in " + timeTaken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test checkAlreadyRegistered failed in " + timeTaken + " milliseconds";
};

const testNullCheckAlreadyRegisterd = async () => {
    let startTimestamp = Date.now();
    const already_registered = await checkAlreadyRegistered(nullName);
    let endTimestamp = Date.now();
    let timeTaken = endTimestamp - startTimestamp;
    if (already_registered === false) {
        passed_amount += 1;
        total_amount += 1;
        return "Test null checkAlreadyRegistered passed in " + timeTaken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test null checkAlreadyRegistered failed in " + timeTaken + " milliseconds";
};

const testCheckNameValid = async () => {
    let startTimestamp = Date.now();
    const valid_name = checkNameValid(name);
    let endTimestamp = Date.now();
    let timeTaken = endTimestamp - startTimestamp;
    if (valid_name === true) {
        passed_amount += 1;
        total_amount += 1;
        return "Test checkNameValid passed in " + timeTaken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test checkNameValid failed in " + timeTaken + " milliseconds";
};

const testNullCheckNameValid = async () => {
    let startTimestamp = Date.now();
    const valid_name = checkNameValid(nullName);
    let endTimestamp = Date.now();
    let timeTaken = endTimestamp - startTimestamp;
    if (valid_name === true) {
        passed_amount += 1;
        total_amount += 1;
        return "Test null checkNameValid passed in " + timeTaken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test null checkNameValid failed in " + timeTaken + " milliseconds";
};


const testGetBlockIdRegistered = async () => {
    let startTimestamp = Date.now();
    const tokenData = await resolveErgonameRegistrationInformation(name);
    const blockId = tokenData.blockId;
    let endTimestamp = Date.now();
    let timeTaken = endTimestamp - startTimestamp;
    if (blockId === "be493af88b54e94a308c9764a744654479c43e638cd358660883a3d68e9242fd") {
        passed_amount += 1;
        total_amount += 1;
        return "Test getBlockIdRegistered passed in " + timeTaken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test getBlockIdRegistered failed in " + timeTaken + " milliseconds";
};

const testNullGetBlockIdRegistered = async () => {
    let startTimestamp = Date.now();
    const tokenData = await resolveErgonameRegistrationInformation(nullName);
    let endTimestamp = Date.now();
    let timeTaken = endTimestamp - startTimestamp;
    if (tokenData === null) {
        passed_amount += 1;
        total_amount += 1;
        return "Test null getBlockIdRegistered passed in " + timeTaken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test null getBlockIdRegistered failed in " + timeTaken + " milliseconds";
};

const testGetBlockRegistered = async () => {
    let startTimestamp = Date.now();
    const tokenData = await resolveErgonameRegistrationInformation(name);
    const block = tokenData.height;
    let endTimestamp = Date.now();
    let timeTaken = endTimestamp - startTimestamp;
    if (block === 55834) {
        passed_amount += 1;
        total_amount += 1;
        return "Test getBlockRegistered passed in " + timeTaken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test getBlockRegistered failed in " + timeTaken + " milliseconds";
};

const testNullGetBlockRegistered = async () => {
    let startTimestamp = Date.now();
    const tokenData = await resolveErgonameRegistrationInformation(nullName);
    let endTimestamp = Date.now();
    let timeTaken = endTimestamp - startTimestamp;
    if (tokenData === null) {
        passed_amount += 1;
        total_amount += 1;
        return "Test null getBlockRegistered passed in " + timeTaken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test null getBlockRegistered failed in " + timeTaken + " milliseconds";
};

const testGetTimestampRegistered = async () => {
    let startTimestamp = Date.now();
    const tokenData = await resolveErgonameRegistrationInformation(name);
    const timestamp = tokenData.timestamp;
    let endTimestamp = Date.now();
    let timeTaken = endTimestamp - startTimestamp;
    if (timestamp == 1665960319367) {
        passed_amount += 1;
        total_amount += 1;
        return "Test getTimestampRegistered passed in " + timeTaken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test getTimestampRegistered failed in " + timeTaken + " milliseconds";
};

const testNullGetTimestampRegistered = async () => {
    let startTimestamp = Date.now();
    const tokenData = await resolveErgonameRegistrationInformation(nullName);
    let endTimestamp = Date.now();
    let timeTaken = endTimestamp - startTimestamp;
    if (tokenData === null) {
        passed_amount += 1;
        total_amount += 1;
        return "Test null getTimestampRegistered passed in " + timeTaken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test null getTimestampRegistered failed in " + timeTaken + " milliseconds";
};

const testTokenId = async () => {
    let startTimestamp = Date.now();
    const tokenData = await resolveErgonameRegistrationInformation(name);
    const tokenId = tokenData.tokenId;
    let endTimestamp = Date.now();
    let timeTaken = endTimestamp - startTimestamp;
    if (tokenId === "27b4d0bc579ed6c2ffe9785428ee3b987375078851ed1d126867e459078cb244") {
        passed_amount += 1;
        total_amount += 1;
        return "Test tokenId passed in " + timeTaken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test tokenId failed in " + timeTaken + " milliseconds";
};

const testNullTokenId = async () => {
    let startTimestamp = Date.now();
    const tokenData = await resolveErgonameRegistrationInformation(nullName);
    let endTimestamp = Date.now();
    let timeTaken = endTimestamp - startTimestamp;
    if (tokenData === null) {
        passed_amount += 1;
        total_amount += 1;
        return "Test null tokenId passed in " + timeTaken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test null tokenId failed in " + timeTaken + " milliseconds";
};

const testRegistrationBoxId = async () => {
    let startTimestamp = Date.now();
    const tokenData = await resolveErgonameRegistrationInformation(name);
    const registrationBoxId = tokenData.boxId;
    let endTimestamp = Date.now();
    let timeTaken = endTimestamp - startTimestamp;
    if (registrationBoxId === "9e3882f135917c0767321c85ea83ac80e72ce4534cef1eb4212394b3d0869901") {
        passed_amount += 1;
        total_amount += 1;
        return "Test registrationBoxId passed in " + timeTaken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test registrationBoxId failed in " + timeTaken + " milliseconds";
};

const testNullRegistrationBoxId = async () => {
    let startTimestamp = Date.now();
    const tokenData = await resolveErgonameRegistrationInformation(nullName);
    let endTimestamp = Date.now();
    let timeTaken = endTimestamp - startTimestamp;
    if (tokenData === null) {
        passed_amount += 1;
        total_amount += 1;
        return "Test null registrationBoxId passed in " + timeTaken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test null registrationBoxId failed in " + timeTaken + " milliseconds";
};

console.log(await testResolveErgoname());
console.log(await testNullResolveErgoname());
console.log(await testCheckAlreadyRegistered());
console.log(await testNullCheckAlreadyRegisterd());
console.log(await testCheckNameValid());
console.log(await testNullCheckNameValid());
console.log(await testGetBlockIdRegistered());
console.log(await testNullGetBlockIdRegistered());
console.log(await testGetBlockRegistered());
console.log(await testNullGetBlockRegistered());
console.log(await testGetTimestampRegistered());
console.log(await testNullGetTimestampRegistered());
console.log(await testTokenId());
console.log(await testNullTokenId());
console.log(await testRegistrationBoxId());
console.log(await testNullRegistrationBoxId());

if (passed_amount === 16) {
    console.log("All tests passed\n");
} else {
    console.log("Some tests failed\n");
};