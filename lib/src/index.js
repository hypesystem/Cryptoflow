let cryptoflow = {
    defineBlock: require("./defineBlock"),
    blocks: {}
};

["xor"].forEach((blockName) => cryptoflow.blocks[blockName] = require(`./${blockName}/block`)(cryptoflow));

module.exports = cryptoflow;
