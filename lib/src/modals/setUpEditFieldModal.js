const encode = require("../encode");

module.exports = setUpEditFieldModal;

function setUpEditFieldModal(editFieldModal, showModal) {
    let updateOnChange = (inputField, from, setValue) => {
        return (e) => {
            let set = (key, val) => editFieldModal.querySelector(key).value = val;

            let value = inputField.value;

            if(from != "string") set(".str-value", encode(from, "string", value));
            if(from != "bits") set(".bit-value", encode(from, "bits", value));
            if(from != "hex") set(".hex-value", encode(from, "hex", value));
            if(from != "buf") set(".int-value", encode(from, "bufStr", value));
            setValue(encode(from, "buf", value));
        };
    };

    let updateFunctions = [];
    let setUpUpdateOnChange = (inputName, setValue) => {
        console.log("setting up listeners for", inputName);
        let setListener = (selector, from) => {
            let inputField = document.querySelector(`input${selector}`);
            let listener = updateOnChange(inputField, from, setValue);
            inputField.addEventListener("change", listener);
            updateFunctions.push({ inputField, listener });
        }
        setListener(".str-value", "string");
        setListener(".hex-value", "hex");
        setListener(".int-value", "bufStr");
        setListener(".bit-value", "bits");
        console.log("set up listeners for", inputName, updateFunctions);
    };
    let clearUpdateOnChange = () => {
        updateFunctions.forEach(({ inputField, listener }) => inputField.removeEventListener("change", listener));
        updateFunctions = [];
    };
    
    let editField = (data) => {
        let set = (key, val) => editFieldModal.querySelector(key).value = val;
        editFieldModal.querySelector(".value-name").innerText = data.name;
        set(".str-value", encode("buf", "string", data.value));
        set(".hex-value", encode("buf", "hex", data.value));
        set(".int-value", encode("buf", "bufStr", data.value));
        set(".bit-value", encode("buf", "bits", data.value));

        setUpUpdateOnChange(data.name, data.setValue);

        let modalClose = editFieldModal.querySelector(".modal-close");
        modalClose.addEventListener("click", closeListener);
        function closeListener(e) {
            clearUpdateOnChange();
            modalClose.removeEventListener("click", closeListener);
        }

        showModal(editFieldModal);
    };

    return editField;
}
