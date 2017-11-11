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
                <span class="output">
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

    let updateOnChange = (inputName, inputField, from) => {
        return (e) => {
            let set = (key, val) => editFieldModal.querySelector(key).value = val;

            let value = inputField.value;
            if(from == "buf") value = encode("bufStr", "buf", value);

            if(from != "string") set(".str-value", encode(from, "string", value));
            if(from != "buf") set(".int-value", encode(from, "bufStr", value));
            if(from != "bits") set(".bit-value", encode(from, "bits", value));
            if(from != "hex") {
                let hexValue = encode(from, "hex", value);
                set(".hex-value", hexValue);
                block.setValue(inputName, hexValue);
            }
            else {
                block.setValue(inputName, value);
            }
        };
    };

    let updateFunctions = [];
    let setUpUpdateOnChange = (inputName) => {
        console.log("setting up listeners for", inputName);
        let setListener = (selector, from) => {
            let inputField = document.querySelector(`input${selector}`);
            let listener = updateOnChange(inputName, inputField, from);
            inputField.addEventListener("change", listener);
            updateFunctions.push({ inputField, listener });
        }
        setListener(".str-value", "string");
        setListener(".hex-value", "hex");
        setListener(".int-value", "buf");
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

        setUpUpdateOnChange(data.name);
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
    setTimeout(() => { //timeout until block is defined in the script block below. bad pattern.
        inspectBlockModalOutput.innerText = block.output.value;
        block.onOutputChange(() => inspectBlockModalOutput.innerText = encode("hex", inspectBlockEncoding, block.output.value));
    }, 1);
    let inspectBlock = (block) => {
        let encodingSelector = inspectBlockEncodingSelector;

        inspectBlockModal.querySelector(".inputs").innerHTML = block.inputs.map((input, i) => {
            return `
            <label for="input-${i}">
                Input (${input.name})
                <input type="text" name="input-${i}" class="input-box" value="${encode("hex", inspectBlockEncoding, input.value)}">
            </label>
            `;
        }).join("");

        inspectBlockModal.querySelector(".block-name").innerText = block.name;
        block.inputs.forEach((input, i) => {
            let inputElement = inspectBlockModal.querySelector(`[name=input-${i}]`);
            inputElement.addEventListener("change", (e) => {
                block.setValue(input.name, encode(inspectBlockEncoding, "hex", inputElement.value));
            });
        });

        encodingSelector.addEventListener("change", (e) => {
            inspectBlockEncoding = encodingSelector.value;
            block.inputs.forEach((input, i) => {
                let inputElement = inspectBlockModal.querySelector(`[name=input-${i}]`);
                inputElement.value = encode("hex", inspectBlockEncoding, input.value);
            });
            inspectBlockModalOutput.innerText = encode("hex", inspectBlockEncoding, block.output.value);
        });

        inspectBlockModal.style = "display: block;";
        overlay.style = "display: block;";
    };

    inspectBlockModal.querySelector(".block-impl-inspect").addEventListener("click", (e) => {
        e.preventDefault();
        if(typeof block.innards == "function") {
            alert("[Raw Javascript Function]\n" + block.innards.toString());
        }
        else {
            location.pathname = "/blocks/" + block.id + "/innards/";
        }
        return false;
    });

    //TODO: Encoding: add option to view as a large integer (bigint), one long base 10 value.
    //TODO: Option to re-run calculation of a block (useful with eg. PRG)

    return { inspectField, editField, inspectBlock };
}
