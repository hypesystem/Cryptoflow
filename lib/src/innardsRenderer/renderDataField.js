const renderTextField = require("./renderTextField");
const renderLabel = require("./renderLabel");

module.exports = renderDataField;

function renderDataField(svg, node, x, y) {
    let dataField = renderTextField(svg, "output-block", x, y);
    let label = renderLabel(svg, node.name, dataField);
    return dataField;
}
