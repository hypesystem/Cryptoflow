const parseInnardsToNodes = require("../innardsParsing/stringToNodes");
const encode = require("../encode");

// TODO:
// - when something is introduced but not used until a lot later, it should
//   take up the row until where it is used, so other things are further down.
// - this also implies that new things placed at a low x should check that they
//   can run on in the y-lane until their target, or otherwise be placed at a 
//   higher y.

module.exports = (block) => (svg) => {
    let outputVariable = parseInnardsToNodes(block);

    let grid = makeGrid();
    exploreLeftUntilRenderRightFromVariable(svg, outputVariable, grid);

    let { maxX, maxY } = grid.getMaxXY();
    svg.setAttribute("width", maxX * 250);
    svg.setAttribute("height", maxY * 75);
};

function makeGrid() {
    let grid = [];

    let findFirstFreeY = (x) => {
        while(x >= grid.length - 1) {
            grid.push([]);
        }
        let indexOfNull = grid[x].indexOf(null);
        if(indexOfNull == -1) {
            // no empty space, add to end
            return grid[x].length;
        }
        // empty space!
        return indexOfNull;
    };

    let set = (x, y, node) => {
        while(x >= grid.length - 1) {
            grid.push([]);
        }
        let col = grid[x];
        while(y >= col.length - 1) {
            col.push(null);
        }
        col[y] = node;
    };

    let getMaxXY = () => {
        let maxX = grid.length;

        let colLengths = grid.map((col) => col.length);
        let maxY = Math.max.apply(null, colLengths);
        
        return { maxX, maxY };
    };
    
    return { findFirstFreeY, set, getMaxXY };
}

function exploreLeftUntilRenderRightFromVariable(svg, v, grid) {
    //ensure dependencies are rendered
    if(v.from && !v.from.rendering) {
        exploreLeftUntilRenderRightFromBlock(svg, v.from, grid);
    }

    if(!v.from) {
        //render as input field
        let x = 0;
        let y = grid.findFirstFreeY(x);
        v.rendering = renderInputField(svg, v, x, y);
        grid.set(x, y, v);

        //no dependency. set a random start value
        v.rendering.setValue(generateRandomValue(6));
    }
    else {
        //render as data field, making sure y is at least the y of `from`
        let x = v.from.rendering.x + 1;
        let y = Math.max(grid.findFirstFreeY(x), v.from.rendering.y);
        v.rendering = renderDataField(svg, v, x, y);
        grid.set(x, y, v);
        
        //render connection from `v.from`
        renderConnection(svg, v.from.rendering, v.rendering);

        //set listener on v.from state to change own state
        v.from.rendering.onValueChange((val) => v.rendering.setValue(val));

        let currentValue = v.from.rendering.getValue();
        if(currentValue) {
            v.rendering.setValue(currentValue);
        }
    }
}

function generateRandomValue(numBytes) {
    let result = [];
    for(let i = 0; i < numBytes; i++) {
        result.push(Math.round(Math.random() * 255));
    }
    return result;
}

function exploreLeftUntilRenderRightFromBlock(svg, b, grid) {
    //ensure dependencies are rendered
    b.inputs.forEach((inputVar) => {
        if(!inputVar.rendering) {
            exploreLeftUntilRenderRightFromVariable(svg, inputVar, grid);
        }
    });

    //find x and y, making sure y is at *least* the lowest y of any dependency 
    let x = Math.max.apply(null, b.inputs.map((v) => v.rendering.x).concat([-1])) + 1;
    let lowestDependencyY = Math.min.apply(null, b.inputs.map((v) => v.rendering.y).concat([0]));
    let y = Math.max(grid.findFirstFreeY(x), lowestDependencyY);

    //render self
    b.rendering = renderBlock(svg, b, x, y);

    //takes up two vertical spots
    grid.set(x, y, b);
    grid.set(x, y + 1, b);

    //render connections from `b.inputs`
    b.inputs.forEach((v) => {
        renderConnection(svg, v.rendering, b.rendering);
    });

    //set listeners on `b.inputs` states to change own state
    let runFunction = () => b.func.apply(null, b.inputs.map((v) => v.rendering.getValue()));
    b.inputs.forEach((v) => {
        v.rendering.onValueChange(() => runFunction().then((result) => b.rendering.setValue(result)));
    });
    
    if(b.inputs.every((v) => v.rendering.getValue())) {
        runFunction().then((result) => b.rendering.setValue(result));
    }
}

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

function renderInputField(svg, node, x, y) {
    let inputField = renderTextField(svg, "input-editable", x, y);
    let label = renderLabel(svg, node.name, inputField);
    return inputField;
}

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

function renderDataField(svg, node, x, y) {
    let dataField = renderTextField(svg, "output-block", x, y);
    let label = renderLabel(svg, node.name, dataField);
    return dataField;
}

function renderLabel(svg, text, target) {
    let g = createSvgGroup();

    g.setAttribute("transform", `translate(${target.boundingBox.x},${target.boundingBox.y - 4})`);
    g.innerHTML = `
        <text class="text-field-label label">${text}</text>
    `;
    
    svg.append(g);

    return g;
}

function createSvgGroup() {
    return document.createElementNS("http://www.w3.org/2000/svg", "g");
}

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
