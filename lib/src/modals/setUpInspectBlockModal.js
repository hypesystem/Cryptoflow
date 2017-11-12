const encode = require("../encode");

module.exports = setUpInspectBlockModal;

function setUpInspectBlockModal(modal, showModal) {
    let outputField = modal.querySelector(".output");
    let encodingSelector = modal.querySelector("[name=block-data-encoding]");
    let encoding = encodingSelector.value;
    let inputsContainer = modal.querySelector(".inputs");

    let inspectBlock = (block) => {
        let encodeCurrent = (val) => encode("buf", encoding, val);
        let loadOutputValue = () => outputField.innerText = encodeCurrent(block.getOutputValue());

        let outputChangeListenerActive = true;
        block.onOutputChange(() => { //TODO: we need to clear old output-change listeners...
            if(outputChangeListenerActive) loadOutputValue();
        });
        loadOutputValue();

        inputsContainer.innerHTML = block.inputs.map((input, i) => `
            <label for="input-${i}-field">
                Input (${input.name})
                ${renderInputField(input, i, encodeCurrent(input.getValue()))}
            </label>
        `).join("");

        modal.querySelector(".block-name").innerText = block.name;
        block.inputs.filter((input) => input.editable).forEach((input, i) => {
            let inputElement = modal.querySelector(`[name=input-${i}-field]`);
            inputElement.addEventListener("change", (e) => input.setValue(encode(encoding, "buf", inputElement.value)));
        });
        
        encodingSelector.addEventListener("change", (e) => {
            encoding = encodingSelector.value;
            block.inputs.forEach((input, i) => {
                if(input.editable) {
                    let inputField = modal.querySelector(`[name=input-${i}-field]`);
                    inputField.value = encodeCurrent(input.getValue());
                }
                else {
                    let inputElement = modal.querySelector(`.input-${i}-field`);
                    inputElement.innerText = encodeCurrent(input.getValue());
                }
            });
            loadOutputValue();
        });

        let showImplInspectLink = modal.querySelector(".block-impl-inspect");
        showImplInspectLink.addEventListener("click", showImpl);
        function showImpl(e) {
            e.preventDefault();
            if(!block.func.derivedFromInnardsSpec) {
                alert("[Raw Javascript Function]\n" + block.func.toString());
            }
            else {
                location.pathname = "/blocks/" + block.id + "/innards/";
            }
            return false;
        }

        let modalCloseBtn = modal.querySelector(".modal-close");
        modalCloseBtn.addEventListener("click", cleanUpEventListeners);
        function cleanUpEventListeners() {
            modalCloseBtn.removeEventListener("click", cleanUpEventListeners);
            showImplInspectLink.removeEventListener("click", showImpl);
            outputChangeListenerActive = false;
        }

        showModal(modal);
    };

    return inspectBlock;
}

function renderInputField(input, i, val) {
    if(!input.editable) {
        return `<span class="input-${i}-field">${val}</span>`;
    }
    return `<input type="text" name="input-${i}-field" value="${val}">`;
}
