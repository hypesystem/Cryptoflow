module.exports = runBlock;

function runBlock(blockName/*, args... */) {
    let block = cryptoflow.blocks[blockName]; // TODO: Direct access to cryptoflow.blocks -- bad!
    let args = Array.prototype.slice.call(arguments, 1)
                    .map((arg) => {
                        if(!(arg instanceof Promise)) {
                            return Promise.resolve(arg);
                        }
                        return arg;
                    });
    if(args.length) {
        return Promise.all(args).then((args) => block.func.apply(null, args));
    }
    return block.func();
}
