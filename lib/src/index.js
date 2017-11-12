const encode = require("./encode");
const defineBlock = require("./defineBlock");
const runBlock = require("./runBlock");

const blocks = [
    require("./cbc_encrypt/block"),
    require("./concat/block"),
    require("./ecb_encrypt/block"),
    require("./ecb_decrypt/block"),
    require("./ecb_example/block"),
    require("./pseudo_random_function/block"),
    require("./reverse_pseudo_random_function/block"),
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
