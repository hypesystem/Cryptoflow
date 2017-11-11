const createSvgGroup = require("./createSvgGroup");
const encode = require("../encode");

module.exports = renderTextField;

function renderTextField(svg, classBase, x, y) {
    let g = createSvgGroup();
    g.classList.add(classBase);
    g.innerHTML = `
        <rect class="${classBase}-rect" width="175" height="20"/>
        <text class="${classBase}-text" x="4" y="15">loading...</text>
    `;

    svg.appendChild(g);

    // Center box in vertical lane (230 is vertical-lane-after-gutters-width)
    let rectDims = g.querySelector("rect").getBBox();
    let xOffset = 250 * x + 10 + (230 / 2) - (rectDims.width / 2);
    let yOffset = 75 * y + 27;
    g.setAttribute("transform", `translate(${xOffset},${yOffset})`);

    // Build bounding box
    let { width, height } = g.getBBox();
    let boundingBox = {
        width, height,
        x: xOffset,
        y: yOffset
    };

    // Set up value handling
    let textField = g.querySelector("text");
    let valueChangeListeners = [];
    let onValueChange = (handler) => valueChangeListeners.push(handler);
    let setValue = (val) => {
        textField.textContent = encode("buf", "hex", val);
        valueChangeListeners.forEach((handler) => handler(val));
    };
    let getValue = () => encode("hex", "buf", textField.textContent);

    return { element: g, setValue, getValue, onValueChange, x, y, boundingBox };
}
