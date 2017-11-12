const pseudo_random_function_state = require("../pseudo_random_function_state");
const encode = require("../encode");

module.exports = (cryptoflow) => {
    return cryptoflow.defineBlock({
        id: "pseudo_random_function",
        name: "Pseudo-random function (F_k)",
        inputs: ["k", "m"],

        //This is a construct that only exists theoretically. We implement it
        // by storing a map of all responses to make sure we always respond the 
        // same answer to the same query, within a rendering.

        //TODO: Should this work bytewise?
        innards: async function(k, m) {
            //Ensure a state for this key k
            let state = pseudo_random_function_state[k];
            if(!state) {
                state = pseudo_random_function_state[k] = { enc: {}, dec: {} };
            }

            //If m has been queried before, return it.
            let mHex = encode("buf", "hex", m);
            if(state.enc[mHex]) {
                return encode("hex", "buf", state.enc[mHex]);
            }

            //Generate a random value, same length as m
            let rnd = new Uint8Array(m.length);
            window.crypto.getRandomValues(rnd); // TODO: direct access to window - bad!
            let result = Array.from(rnd);

            //Save the mapping of the return value for this m.
            let resultHex = encode("buf", "hex", result);
            state.enc[mHex] = resultHex;
            state.dec[resultHex] = mHex;

            //Return the result
            return result;
        }
    });
};
