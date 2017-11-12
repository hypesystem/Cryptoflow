const encode = require("../encode");
const setUpInspectBlockModal = require("./setUpInspectBlockModal");
const setUpInspectFieldModal = require("./setUpInspectFieldModal");
const setUpEditFieldModal = require("./setUpEditFieldModal");

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

    let showModal = (modal) => {
        modal.style = "display: block;";
        overlay.style = "display: block;";
    };

    let inspectField = setUpInspectFieldModal(document.querySelector(".inspect-field-modal"), showModal);
    let editField = setUpEditFieldModal(document.querySelector(".edit-field-modal"), showModal);
    let inspectBlock = setUpInspectBlockModal(document.querySelector(".inspect-block-modal"), showModal);

    //TODO: Encoding: add option to view as a large integer (bigint), one long base 10 value.
    //TODO: Option to re-run calculation of a block (useful with eg. PRG)

    return { inspectField, editField, inspectBlock };
}
