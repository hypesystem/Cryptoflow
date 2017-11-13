module.exports = runBlock;

function runBlock(blockId/*, args... */) {
    let block = cryptoflow.blocks[blockId]; // TODO: Direct access to cryptoflow.blocks -- bad!
    let args = Array.prototype.slice.call(arguments, 1)
                .map(coerceToPromise);
    return Promise.all(args)
            .then((args) => block.func.apply(null, args));
}

function coerceToPromise(arg) {
    return (arg instanceof Promise) ? arg : Promise.resolve(arg);
}
