const encode = require("./encode");

module.exports = doBlockCalculation;

async function doBlockCalculation(block) {
    let inputValues = block.inputs.map((input) => encode("hex", "buf", input.value));
    let outputValues = await block.func.apply(null, inputValues);
    return encode("buf", "hex", outputValues);
}
