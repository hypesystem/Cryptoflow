const bytewise = require("../bytewise");

module.exports = (cryptoflow) => {
    return cryptoflow.defineBlock({
        id: "xor",
        name: "xor",
        inputs: ["a", "b"],
        innards: async function(a, b) {
            return await bytewise({ a, b }, (a, b) => a^b);
        }
    });
};
