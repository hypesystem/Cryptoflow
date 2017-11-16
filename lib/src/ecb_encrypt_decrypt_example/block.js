module.exports = (cryptoflow) => {
    return cryptoflow.defineBlock({
        id: "ecb_encrypt_decrypt_example",
        name: "Electronic Code Book block cipher encyption/decryption example",
        inputs: ["enc_key", "message", "dec_key"],

        //View innards pls
        innards: `
            cipher <- ecb_encrypt(enc_key, message)
            <- ecb_decrypt(dec_key, cipher)
        `
    });
};
