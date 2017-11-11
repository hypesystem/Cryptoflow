const createSvgGroup = require("./createSvgGroup");

module.exports = renderConnection;

function renderConnection(svg, fromNode, toNode) {
    let g = createSvgGroup();

    let gutterSwerve = 50;
    let distanceSwerve = (toNode.x - fromNode.x - 1) * 250;

    let fDim = fromNode.boundingBox;
    let tDim = toNode.boundingBox;
    
    let fromX = fDim.x + fDim.width;
    let fromY = fDim.y + (fDim.height / 2);
    let toX = tDim.x;
    let toY = tDim.y + (tDim.height / 2);
    g.innerHTML = `
        <path d="M${fromX} ${fromY}
                 C${fromX + gutterSwerve + distanceSwerve} ${fromY},
                  ${toX - gutterSwerve} ${toY},
                  ${toX} ${toY}
        " class="connector" />
    `;

    // TODO: Render dots on input and output(?) or arrow at one end?
    // TODO: when several inputs we could pass a ratio (1 of 5, 2 of 5, ..., 5 of 5)
    //       and it could then decide where on the toNode box it should place it,
    //       spreading them out and looking real good!

    svg.appendChild(g);
    return g;
}
