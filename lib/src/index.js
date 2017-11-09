const encode = require("./encode");
const defineBlock = require("./defineBlock");

const blocks = [
    require("./xor/block"),
    require("./several-xor/block")
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

//TODO: This didn't work with browserify. Needs inlining?
//["xor"].forEach((blockName) => cryptoflow.blocks[blockName] = require(`./${blockName}/block`)(cryptoflow));

module.exports = cryptoflow;
if(typeof window !== "undefined") {
    window.cryptoflow = cryptoflow;
}

function runBlock(blockName) {
    let block = cryptoflow.blocks[blockName];
    let args = Array.prototype.slice.call(arguments, 1)
                    .map((arg) => {
                        if(!(arg instanceof Promise)) {
                            return Promise.resolve(arg);
                        }
                        return arg;
                    });
    return Promise.all(args).then((args) => block.func.apply(null, args));
}
