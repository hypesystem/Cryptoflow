module.exports = (cryptoflow) => {
    return cryptoflow.defineBlock({
        id: "cbc_encrypt",
        name: "Chaining-block cipher (|m|=4)",
        inputs: ["k", "iv", "m1", "m2", "m3", "m4"],

        //We assume a fixed block length (for illustrative purposes!) of 4 messages of some length n.
        //TODO: Some `split` block that splits messages in x equally big blcoks.
        innards: `
            m1x <- xor(iv, m1)
            c1 <- pseudo_random_function(k, m1x)
            m2x <- xor(c1, m2)
            c2 <- pseudo_random_function(k, m2x)
            m3x <- xor(c2, m3)
            c3 <- pseudo_random_function(k, m3x)
            m4x <- xor(c3, m4)
            c4 <- pseudo_random_function(k, m4x)
            <- concat(c1, c2, c3, c4)
        `
    });
};
