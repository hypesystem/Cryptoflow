module.exports = (cryptoflow) => {
    return cryptoflow.defineBlock({
        id: "ecb_example",
        name: "Electronic Code Book block cipher example",
        inputs: ["k1", "m1", "k2", "m2"],

        //View innards pls
        innards: `
            c1 <- ecb_encrypt(k1, m1)
            m1_recomputed <- ecb_decrypt(k1, c1)
            c2 <- ecb_encrypt(k2, m2)
            m2_recomputed <- ecb_decrypt(k2, c2)
            <- xor(m1_recomputed, m2_recomputed)
        `
    });
};
