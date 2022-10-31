import { resolveErgoname, checkAlreadyRegistered, checkNameValid, resolveErgonameRegistrationInformation } from './index.js';

const name = "~paymentaddressparam";
const nullName = "nullname";
const j5TL_address  = "3WwKzFjZGrtKAV7qSCoJsZK9iJhLLrUa3uwd4yw52bVtDVv6j5TL";

let passed_amount = 0;
let failed_amount = 0;
let total_amount = 0;

const testResolveErgoname = async () => {
    let startTimestamp = Date.now();
    const tokenData = await resolveErgoname(name);
    const resolvedAddress = tokenData;
    let endTimestamp = Date.now();
    let timeTaken = endTimestamp - startTimestamp;
    if (tokenData.registered === true && tokenData.tokenId === "f2fb40441f15cb8d0d57627188aff4e9edaa902c4cb65662c428588d8d2206c5" && tokenData.tokenAddress === j5TL_address) {
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
    if (tokenData.registered === false && tokenData.tokenId === null && tokenData.tokenAddress === null) {
        passed_amount += 1;
        total_amount += 1;
        return "Test null resolveErgoname passed in " + timeTaken + " milliseconds";
    };
    failed_amount += 1;
    total_amount += 1;
    return "Test null resolveErgoname failed in " + timeTaken + " milliseconds";
};

const testCheckErgonameRegistrationInformation = async () => {
    let startTimestamp = Date.now();
    const registrationData = await resolveErgonameRegistrationInformation(name);
    let endTimestamp = Date.now();
    let timeTaken = endTimestamp - startTimestamp;
    if (registrationData.registered == true
    && registrationData.tokenId == "f2fb40441f15cb8d0d57627188aff4e9edaa902c4cb65662c428588d8d2206c5"
    && registrationData.boxId == "63e300f59c070cdb3f3046c8010469745d4d5e3fcec229c84c306b7ffa3f39e2"
    && registrationData.transactionId == "0181f040d19f8a4000ea867ac359194bc144f7ad41e759d0c9b8afabab63c98e"
    && registrationData.address == j5TL_address
    && registrationData.blockId == "9c343f5f5d76242a5e4457d87cfa115f882aa54bc6af9ac3b0ec8ec78cb982cd"
    && registrationData.height == 71552
    && registrationData.timestamp == "1666732782576"
    && registrationData.registerPrice === "05809bee02"
    && registrationData.royalty === "0428") {
        passed_amount += 1;
        total_amount += 1;
        return "Test checkErgonameRegistrationInformation passed in " + timeTaken + " milliseconds";
    } else {
        failed_amount += 1;
        total_amount += 1;
        return "Test checkErgonameRegistrationInformation failed in " + timeTaken + " milliseconds";
    }
}

const testCheckErgonameRegistrationInformationNull = async () => {
    let startTimestamp = Date.now();
    const registrationData = await resolveErgonameRegistrationInformation(nullName);
    let endTimestamp = Date.now();
    let timeTaken = endTimestamp - startTimestamp;
    if (registrationData.registered == false
    && registrationData.tokenId == null
    && registrationData.boxId == null
    && registrationData.transactionId == null
    && registrationData.address == null
    && registrationData.blockId == null
    && registrationData.height == null
    && registrationData.timestamp == null
    && registrationData.registerPrice == null
    && registrationData.royalty == null) {
        passed_amount += 1;
        total_amount += 1;
        return "Test checkErgonameRegistrationInformationNull passed in " + timeTaken + " milliseconds";
    } else {
        failed_amount += 1;
        total_amount += 1;
        return "Test checkErgonameRegistrationInformationNull failed in " + timeTaken + " milliseconds";
    }
}


console.log(await testResolveErgoname());
console.log(await testNullResolveErgoname());
console.log(await testCheckErgonameRegistrationInformation());
console.log(await testCheckErgonameRegistrationInformationNull());


if (passed_amount === 4) {
    console.log("All tests passed\n");
} else {
    console.log("Some tests failed\n");
};