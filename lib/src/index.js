const encode = require("./encode");
const defineBlock = require("./defineBlock");

let cryptoflow = {
    encode,
    defineBlock,
    blocks: {
        xor: require("./xor/block")({ defineBlock })
    }
};

//TODO: This didn't work with browserify. Needs inlining?
//["xor"].forEach((blockName) => cryptoflow.blocks[blockName] = require(`./${blockName}/block`)(cryptoflow));

module.exports = cryptoflow;
if(typeof window !== "undefined") {
    window.cryptoflow = cryptoflow;
}
