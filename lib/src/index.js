const encode = require("./encode");
const defineBlock = require("./defineBlock");
const runBlock = require("./runBlock");

const blocks = [
    require("./xor/block"),
    require("./several-xor/block"),
    require("./prg/block"),
    require("./xor_rnd/block")
];

let cryptoflow = {
    encode,
    defineBlock,
    blocks: blocks.map((blockRef) => {
            let block = blockRef({ defineBlock });
            return { [block.id]: block };
        }).reduce((a,b) => {
            Object.keys(b).forEach((key) => a[key] = b[key]);
            return a;
        }),
    runBlock
};

module.exports = cryptoflow;
if(typeof window !== "undefined") {
    window.cryptoflow = cryptoflow;
}
