module.exports = (cryptoflow) => {
    return cryptoflow.defineBlock({
        name: "xor",
        inputs: ["a", "b"],
        innards: async function(a, b) { return a^b; }
    });
};
