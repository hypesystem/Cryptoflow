const encode = require("./encode");

module.exports = doBlockCalculation;

async function doBlockCalculation(block) {
    let inputValues = block.inputs.map((input) => input.value);
    console.log("doBlockCalc: input values", inputValues);
    let outputValues = await block.func.apply(null, inputValues);
    console.log("doBlockCalc: output values", outputValues);
    return outputValues;
}
