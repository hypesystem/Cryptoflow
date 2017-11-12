module.exports = (cryptoflow) => {
    return cryptoflow.defineBlock({
        id: "ecb_encrypt",
        name: "Electronic Code Book block cipher encryption",
        inputs: ["k", "m"],

        //We assume a pseudo-random-function that works bytewise on the message (eg. n=8).
        //This makes ECB super trivial. Explanatory text would be neat.
        innards: `
            <- pseudo_random_function(k, m)
        `
    });
};
