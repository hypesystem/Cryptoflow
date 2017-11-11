const createSvgGroup = require("./createSvgGroup");

module.exports = renderBlock;

function renderBlock(svg, node, x, y) {
    let g = createSvgGroup();

    g.classList = "block";
    g.innerHTML = `
        <rect class="block-square" width="75" height="50" />
        <text class="block-label label" y="29">${node.name}</text>
    `;

    //TODO: break text if too wide

    svg.appendChild(g);

    // Set block size to contain text
    let text = g.querySelector("text")
    let textDims = text.getBBox();
    let rect = g.querySelector("rect");
    rect.setAttribute("width", Math.max(75, textDims.width + 15));

    // Center text in block
    let rectDims = rect.getBBox();
    text.setAttribute("transform", `translate(${(rectDims.width / 2) - (textDims.width / 2)}, 0)`);

    // Center block in lane
    // lane-without-gutter width is 230 px (250 - 2*10)
    let xOffset = (250 * x + 10) + (230 / 2) - (rectDims.width / 2);
    let yOffset = (75 * y + 50);
    g.setAttribute("transform", `translate(${xOffset},${yOffset})`);

    // Get bounding box to return
    let { width, height } = g.getBBox();
    let boundingBox = {
        width, height,
        x: xOffset,
        y: yOffset
    };

    // Setup value handling
    let val = null;
    let valueChangeListeners = [];
    let onValueChange = (handler) => valueChangeListeners.push(handler);
    let setValue = (newVal) => {
        val = newVal;
        valueChangeListeners.forEach((handler) => handler(val));
    };
    let getValue = () => val;

    return { element: g, setValue, getValue, onValueChange, x, y, boundingBox };
}
