const encode = require("./encode");

module.exports = doBlockCalculation;

async function doBlockCalculation(block) {
    let inputValues = block.inputs.map((input) => encode("hex", "buf", input.value));
    let inputValuePairs = pairInputValues(inputValues);
    let outputValues = await executeBlockFunctionOnInputs(block, inputValuePairs);
    return encode("buf", "hex", outputValues);
}

async function executeBlockFunctionOnInputs(block, inputValuePairs) {
    if(inputValuePairs.length) {
        return await Promise.all(inputValuePairs.map((inputValuePair) => { return block.func.apply(null, inputValuePair); }));
    }
    return [await block.func()];
}

// basically a zip with x input value arrays
function pairInputValues(inputValues) {
    let len = Math.max.apply(null, inputValues.map(inputValue => inputValue.length));
    let inputValuePairs = [];
    for(let i = 0; i < len; i++) {
        inputValuePairs.push(inputValues.map((inputValue) => {
            return inputValue[i] || [];
        }));
    }
    return inputValuePairs;
}
