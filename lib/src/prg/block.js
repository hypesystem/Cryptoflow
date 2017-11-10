module.exports = (cryptoflow) => {
    return cryptoflow.defineBlock({
        id: "prg",
        name: "pseudo-random generator",
        inputs: [],
        innards: async function() {
            let ui8arr = new Uint8Array(6);
            window.crypto.getRandomValues(ui8arr); //TODO: window reference! danger!
            return Array.from(ui8arr);
        }
    });
};
