module.exports = (cryptoflow) => {
    return cryptoflow.defineBlock({
        id: "ecb_decrypt",
        name: "Electronic Code Book block cipher decryption",
        inputs: ["k", "c"],

        //We assume a pseudo-random-function inverse that works bytewise on the message (eg. n=8).
        //This makes ECB super trivial. Explanatory text would be neat.
        innards: `
            <- reverse_pseudo_random_function(k, c)
        `
    });
};
