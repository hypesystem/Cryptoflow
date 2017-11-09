module.exports = runBlock;

function runBlock(blockName) {
    let block = cryptoflow.blocks[blockName];
    let args = Array.prototype.slice.call(arguments, 1)
                    .map((arg) => {
                        if(!(arg instanceof Promise)) {
                            return Promise.resolve(arg);
                        }
                        return arg;
                    });
    console.log("running block", block, args);
    if(args.length) {
        return Promise.all(args).then((args) => block.func.apply(null, args));
    }
    return block.func();
}
