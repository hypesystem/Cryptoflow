const pseudo_random_function_state = require("../pseudo_random_function_state");
const encode = require("../encode");

module.exports = (cryptoflow) => {
    return cryptoflow.defineBlock({
        id: "reverse_pseudo_random_function",
        name: "Reverse pseudo-random function (F_k^(-1))",
        inputs: ["k", "c"],

        //This is a construct that only exists theoretically. We implement it
        // by storing a map of all responses to make sure we always respond the 
        // same answer to the same query, within a rendering.

        //TODO: Should this work bytewise?
        innards: async function(k, c) {
            //Ensure a state for this key k
            let state = pseudo_random_function_state[k];
            if(!state) {
                state = pseudo_random_function_state[k] = { enc: {}, dec: {} };
            }

            //If c has been registered, return it
            let cHex = encode("buf", "hex", c);
            if(state.dec[cHex]) {
                return encode("hex", "buf", state.dec[cHex]);
            }

            //Otherwise we have an error! We cannot guess a reverse. This is where the theory fails us.
            console.error("No reversal found in pseudo-random function for value", c, "in state", state);
            return (new Array(c.length)).fill(0);
        }
    });
};
