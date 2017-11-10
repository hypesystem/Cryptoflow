const encode = require("./encode");

module.exports = bytewise;

// args is expected to be an object with names of arguments pointing
// to their values. The values are expected to be arrays of 8-bit
// integers. The func is a function executed on the inputs, bytewise.
// That is, given {a: [1, 2, 3], b: [4, 5, 6]}, func will be evaluated
// for (1,4); (2,5); and (3,6), and the result of the entire function
// will be [func(1,4), func(2,5), func(3,6)].
async function bytewise(byteLength, args, func) {
    if(!func) {
        func = args;
        args = byteLength;
        byteLength = 8;
    }
    if(byteLength % 8 != 0) {
        console.warn(`Trying to run bytewise with a byte-length not divisible by 8 (byteLength=${byteLength}). Defaulting back to 8.`);
        byteLength = 8;
    }
    let inputValues = fitInputValuesToByteLength(byteLength, Object.values(args));
    let inputValuePairs = pairInputValues(inputValues);
    return await executeFuncOnInputs(func, inputValuePairs);
}

function fitInputValuesToByteLength(byteLength, inputValues) {
    if(byteLength == 8) {
        return inputValues;
    }

    let numbersToJoin = byteLength / 8;
    let fittedInputValues = [];
    let i = 0;
    while(i < inputValues.length) {
        let thisValue = 0;
        let startThisValue = i;
        let limitThisValue = startThisValue + numbersToJoin;
        while(i < limitThisValue) {
            thisValue += (inputValues[i] || 0) << ((i - startThisValue) * 8);
            i++;
        }
        fittedInputValues.push(thisValue);
    }
    return fittedInputValues;
}

async function executeFuncOnInputs(func, inputValuePairs) {
    if(inputValuePairs.length) {
        return await Promise.all(inputValuePairs.map((inputValuePair) => { return func.apply(null, inputValuePair); }));
    }
    return [];
}

// basically a zip with x input value arrays
function pairInputValues(inputValues) {
    let len = Math.max.apply(null, inputValues.map(inputValue => inputValue.length));
    let inputValuePairs = [];
    for(let i = 0; i < len; i++) {
        inputValuePairs.push(inputValues.map((inputValue) => inputValue[i] || 0));
    }
    return inputValuePairs;
}
