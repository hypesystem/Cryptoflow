const encode = require("../encode");

module.exports = setUpInspectFieldModal;

function setUpInspectFieldModal(inspectFieldModal, showModal) {
    let inspectField = (data) => {
        let set = (key, val) => inspectFieldModal.querySelector(key).innerText = val;
        set(".value-name", data.name);
        set(".str-value", encode("buf", "string", data.value));
        set(".hex-value", encode("buf", "hex", data.value));
        set(".int-value", data.value.join(" "));
        set(".bit-value", encode("buf", "bits", data.value));
        showModal(inspectFieldModal);
    }

    return inspectField;
}
