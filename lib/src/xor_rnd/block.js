module.exports = (cryptoflow) => {
    return cryptoflow.defineBlock({
        id: "xor_rnd",
        name: "xor with pseudo-random",
        inputs: ["a"],
        innards: `
            r <- prg()
            <- xor(a, r)
        `
    });
};
