const encode = require("../encode");

module.exports = (container) => {
    container.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal edit-field-modal">
            <div class="modal-close"></div>
            <h1>Edit value: <span class="value-name"></span></h1>
            <table>
                <tr>
                    <td>String</td>
                    <td><input type="text" class="str-value"></td>
                </tr>
                <tr>
                    <td>Hex</td>
                    <td><input type="text" class="hex-value"></td>
                </tr>
                <tr>
                    <td>Int array (buffer)</td>
                    <td><input type="text" class="int-value"></td>
                </tr>
                <tr>
                    <td>Bits (binary string)</td>
                    <td><input type="text" class="bit-value"></td>
                </tr>
            </table>
        </div>
        <div class="modal inspect-field-modal">
            <div class="modal-close"></div>
            <h1>Inspect value: <span class="value-name"></span></h1>
            <table>
                <tr>
                    <td>String</td>
                    <td class="str-value"></td>
                </tr>
                <tr>
                    <td>Hex</td>
                    <td class="hex-value"></td>
                </tr>
                <tr>
                    <td>Int array (buffer)</td>
                    <td class="int-value"></td>
                </tr>
                <tr>
                    <td>Bits (binary string)</td>
                    <td class="bit-value"></td>
                </tr>
            </table>
        </div>
        <div class="modal inspect-block-modal">
            <div class="modal-close"></div>
            <h1>Inspect block: <span class="block-name"></span></h1>
            <a href="#see-block-implementation" class="block-impl-inspect">See block implementation</a>
            <label for="encoding">
                Encoding:
                <select name="block-data-encoding">
                    <option value="bufStr">Buffer (int array)</option>
                    <option value="bits">Bits</option>
                    <option value="string">String (utf-8)</option>
                    <option value="hex" selected>Hex</option>
                </select>
            </label>
            <div class="inputs"></div>
            <label for="output">
                Output
                <span class="output"></span>
            </label>
        </div>
    `;

    let overlay = container.querySelector(".modal-overlay");
    let modals = container.querySelectorAll(".modal");

    Array.prototype.forEach.call(modals, (modal) => {
        modal.querySelector(".modal-close").addEventListener("click", (e) => {
            modal.style = "";
            overlay.style = "";
        });
    });

    //TODO: generate all representations from int array
    let inspectFieldModal = document.querySelector(".inspect-field-modal");
    let inspectField = (data) => {
        let set = (key, val) => inspectFieldModal.querySelector(key).innerText = val;
        set(".value-name", data.name);
        set(".str-value", encode("buf", "string", data.value));
        set(".hex-value", encode("buf", "hex", data.value));
        set(".int-value", data.value.join(" "));
        set(".bit-value", encode("buf", "bits", data.value));
        inspectFieldModal.style = "display: block;";
        overlay.style = "display: block;";
    }

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

    let editFieldModal = document.querySelector(".edit-field-modal");
    let editField = (data) => {
        let set = (key, val) => editFieldModal.querySelector(key).value = val;
        editFieldModal.querySelector(".value-name").innerText = data.name;
        set(".str-value", encode("buf", "string", data.value));
        set(".hex-value", encode("buf", "hex", data.value));
        set(".int-value", encode("buf", "bufStr", data.value));
        set(".bit-value", encode("buf", "bits", data.value));

        setUpUpdateOnChange(data.name, data.setValue);
        editFieldModal.style = "display: block;";
        overlay.style = "display: block;";

        let modalClose = editFieldModal.querySelector(".modal-close");
        modalClose.addEventListener("click", closeListener);

        function closeListener(e) {
            clearUpdateOnChange();
            modalClose.removeEventListener("click", closeListener);
        }
    }

    let inspectBlockModal = document.querySelector(".inspect-block-modal");
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

        inspectBlockModal.style = "display: block;";
        overlay.style = "display: block;";
    };

    //TODO: Encoding: add option to view as a large integer (bigint), one long base 10 value.
    //TODO: Option to re-run calculation of a block (useful with eg. PRG)

    return { inspectField, editField, inspectBlock };
}
