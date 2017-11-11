const renderTextField = require("./renderTextField");
const renderLabel = require("./renderLabel");

module.exports = renderInputField;

function renderInputField(svg, node, x, y) {
    let inputField = renderTextField(svg, "input-editable", x, y);
    let label = renderLabel(svg, node.name, inputField);
    return inputField;
}
