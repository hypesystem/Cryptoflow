module.exports = (cryptoflow) => {
    return cryptoflow.defineBlock({
        id: "concat",
        name: "concatenate strings",
        inputs: ["a", "b"],

        //We assume a fixed block length (for illustrative purposes!) of 4 messages of some length n.
        //TODO: Some `split` block that splits messages in x equally big blcoks.
        innards: async function() {
            let result = [];
            Array.prototype.forEach.call(arguments, (arg) => {
                result = result.concat(arg);
            });
            return result;
        }
    });
};
