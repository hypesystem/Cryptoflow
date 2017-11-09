const encode = require("./encode");

module.exports = doBlockCalculation;

async function doBlockCalculation(block) {
    console.log("doing calculation", block.inputs);
    let inputValues = block.inputs.map((input) => encode("hex", "buf", input.value));
    console.log("input values", inputValues);
    let inputValuePairs = pairInputValues(inputValues);
    console.log("input value pairs", inputValuePairs);
    let outputValues;
    if(inputValuePairs.length) {
        outputValues = await Promise.all(inputValuePairs
                        .map((inputValuePair) => { return block.func.apply(null, inputValuePair); }));
    }
    else {
        outputValues = [await block.func()];
    }
    console.log("output values", outputValues);
    let result = encode("buf", "hex", outputValues);
    console.log("result", result);
    return result;
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
