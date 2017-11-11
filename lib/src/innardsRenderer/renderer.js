const parseInnardsToNodes = require("../innardsParsing/stringToNodes");
const makeGrid = require("./makeGrid");
const renderConnection = require("./renderConnection");
const renderInputField = require("./renderInputField");
const renderDataField = require("./renderDataField");
const renderBlock = require("./renderBlock");
const modals = require("../modals/index");

// TODO:
// - when something is introduced but not used until a lot further right, it should
//   take up the row until where it is used, so other things are further down.
// - this also implies that new things placed at a low x should check that they
//   can run on in the y-lane until their target, or otherwise be placed at a 
//   higher y.

module.exports = (block) => (svg, modalspace) => {
    let { inspectField, editField, inspectBlock } = modals(modalspace);

    let outputVariable = parseInnardsToNodes(block);

    let grid = makeGrid();
    exploreLeftUntilRenderRightFromVariable(svg, outputVariable, grid);

    let { maxX, maxY } = grid.getMaxXY();
    svg.setAttribute("width", maxX * 250);
    svg.setAttribute("height", maxY * 75);
};

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
