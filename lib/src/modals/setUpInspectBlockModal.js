const encode = require("../encode");

module.exports = setUpInspectBlockModal;

function setUpInspectBlockModal(inspectBlockModal, showModal) {
    let inspectBlockModalOutput = inspectBlockModal.querySelector(".output");
    let inspectBlockEncodingSelector = inspectBlockModal.querySelector("[name=block-data-encoding]");
    let inspectBlockEncoding = inspectBlockEncodingSelector.value;
    let inspectBlock = (block) => {
        let encodingSelector = inspectBlockEncodingSelector;
        
        inspectBlockModalOutput.innerText = encode("buf", inspectBlockEncoding, block.getOutputValue());
        let outputChangeListenerActive = true;
        block.onOutputChange(() => { //TODO: we need to clear old output-change listeners...
            if(!outputChangeListenerActive) return;
            inspectBlockModalOutput.innerText = encode("buf", inspectBlockEncoding, block.getOutputValue())
        });

        inspectBlockModal.querySelector(".inputs").innerHTML = block.inputs.map((input, i) => {
            if(!input.editable) {
                return `
                    <label for="input-${i}-field">
                        Input (${input.name})
                        <span class="input-${i}-field">${encode("buf", inspectBlockEncoding, input.getValue())}</span>
                    </label>
                `;
            }
            return `
                <label for="input-${i}">
                    Input (${input.name})
                    <input type="text" name="input-${i}" class="input-box input-${i}-field" value="${encode("buf", inspectBlockEncoding, input.getValue())}">
                </label>
            `;
        }).join("");

        console.log("setting name and listeners");
        inspectBlockModal.querySelector(".block-name").innerText = block.name;
        block.inputs.forEach((input, i) => {
            let inputElement = inspectBlockModal.querySelector(`[name=input-${i}]`);
            if(!inputElement) return; //<-- this is the case when input is not editable
            inputElement.addEventListener("change", (e) => {
                console.log("input element change", this);
                input.setValue(encode(inspectBlockEncoding, "buf", inputElement.value));
            });
        });
        
        console.log("setting encoding change listener");
        encodingSelector.addEventListener("change", (e) => {
            inspectBlockEncoding = encodingSelector.value;
            block.inputs.forEach((input, i) => {
                let inputField = inspectBlockModal.querySelector(`[name=input-${i}]`);
                if(inputField) {
                    inputField.value = encode("buf", inspectBlockEncoding, input.getValue());
                }
                else {
                    let inputElement = inspectBlockModal.querySelector(`.input-${i}-field`);
                    inputElement.innerText = encode("buf", inspectBlockEncoding, input.getValue());
                }

            });
            inspectBlockModalOutput.innerText = encode("buf", inspectBlockEncoding, block.getOutputValue());
        });

        let showImplInspectLink = inspectBlockModal.querySelector(".block-impl-inspect");
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

        let modalCloseBtn = inspectBlockModal.querySelector(".modal-close");
        modalCloseBtn.addEventListener("click", cleanUpEventListeners);
        function cleanUpEventListeners() {
            modalCloseBtn.removeEventListener("click", cleanUpEventListeners);
            showImplInspectLink.removeEventListener("click", showImpl);
            outputChangeListenerActive = false;
        }

        showModal(inspectBlockModal);
    };

    return inspectBlock;
}
