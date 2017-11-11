const createSvgGroup = require("./createSvgGroup");

module.exports = renderLabel;

function renderLabel(svg, text, target) {
    let g = createSvgGroup();

    g.setAttribute("transform", `translate(${target.boundingBox.x},${target.boundingBox.y - 4})`);
    g.innerHTML = `
        <text class="text-field-label label">${text}</text>
    `;
    
    svg.append(g);

    return g;
}
