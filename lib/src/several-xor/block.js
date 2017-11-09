module.exports = (cryptoflow) => {
    return cryptoflow.defineBlock({
        id: "several_xor",
        name: "several xor",
        inputs: ["a", "b", "c", "d"],
        innards: `
            r1 <- xor(a, b)
            r2 <- xor(c, d)
            <- xor(r1, r2)
        `
    });
};
