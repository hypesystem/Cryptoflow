module.exports = (cryptoflow) => {
    return cryptoflow.defineBlock({
        id: "chained_xor",
        name: "chained xor operations (parity checker)",
        inputs: ["a", "b", "c", "d"],
        innards: `
            r1 <- xor(a, b)
            r2 <- xor(c, d)
            <- xor(r1, r2)
        `
    });
};
