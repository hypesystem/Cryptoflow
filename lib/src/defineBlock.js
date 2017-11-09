const _ = require("lodash");
const encode = require("./encode");
const parseInnardsToFunction = require("./innardsParsing/stringToFunction");

module.exports = (config) => {
    let inputs = config.inputs.map((inputName) => { return { name: inputName, value: generateRandomDefaultValue() }; });
    let changeListeners = [];

    let onBlockChange = (cb) => {
        changeListeners.push(cb);
    }

    let notifyChanged = () => {
        changeListeners.forEach((listener) => listener());
    }

    let setValue = (name, value) => {
        let input = inputs.find((input) => input.name == name);
        if(input) input.value = value;
        else console.warn(`Tried to set ${name} to ${value}, but ${name} does not exist on the block ${config.name} (${config.id})`);
        notifyChanged();
    }

    let output = { name: "output", value: "loading..." };
    
    let outputListeners = [];
    let onOutputChange = (cb) => {
        outputListeners.push(cb);
    };

    let notifyOutputChanged = () => outputListeners.forEach((listener) => listener());

    let setOutput = (value) => {
        output.value = value;
        notifyOutputChanged();
    };

    let block = _.defaults({ inputs, setValue, output, onOutputChange }, config);
    block.func = parseInnardsToFunction(block);

    block.render = (renderspace, inspectField, editField, inspectBlock) => {
        renderspace.attr("transform", "translate(100,30)");

        let inputHeight = 100;

        // render block
        // - bounding group
        let mainBlockX = 300;
        let mainBlockY = 200;

        onBlockChange(() => {

            // cleanup
            renderspace.selectAll("g").remove();

            // - square
            let renderedBlock = renderspace.append("g")
                    .attr("class", "block")
                    .attr("cursor", "pointer")
                    .attr("transform", `translate(${mainBlockX}, ${mainBlockY})`);

            let squareDimensions = { width: 100, height: 50 };

            let blockSquare = renderedBlock.append("rect")
                .attr("class", "block-square")
                .attr("width", squareDimensions.width)
                .attr("height", squareDimensions.height);

            renderedBlock.on("click", () => inspectBlock(block));
            
            // - text in square
            let blockText = renderedBlock.append("text")
                .attr("class", "block-label label")
                .text(block.name);

            let textDimensions = blockText.node().getBBox();

            blockText
                .attr("x", (squareDimensions.width / 2) - (textDimensions.width / 2))
                .attr("y", (squareDimensions.height / 2) + (textDimensions.height / 6));

            // render inputs
            let input = renderspace.selectAll("g.block-input")
                    .data(block.inputs)
                .enter().append("g")
                    .attr("class", "block-input")
                    .attr("transform", (d, i) => `translate(0, ${i*inputHeight})`);
            
            // - path
            let getRelativeBlockY = (i) => mainBlockY - (i * inputHeight);
            let getInputDotOnBlockY = (i) => getRelativeBlockY(i) + i * 15 + 10;

            input.append("path")
                .attr("class", "block-input-path path-between-circles")
                .attr("d", (d, i) => `M225 20 C250 20, 275 ${getInputDotOnBlockY(i)}, 300 ${getInputDotOnBlockY(i)}`);

            // - editable field
            let inputEditable = input.append("g")
                .attr("transform", "translate(50, 10)")
                .attr("cursor", "pointer");

            inputEditable.append("rect")
                    .attr("stroke", "black")
                    .attr("fill", "white")
                    .attr("width", 175)
                    .attr("height", 20);

            let inputEditableText = inputEditable.append("text")
                    .text((d) => d.value)
                    .attr("font-size", "0.8em");
            
            let firstInputEditableTextNode = inputEditableText.node();

            if(firstInputEditableTextNode) {
                let inputEditableTextDimensions = firstInputEditableTextNode.getBBox();

                inputEditableText
                        .attr("x", 3)
                        .attr("y", (inputEditableTextDimensions.height / 6) * 5);

                inputEditable.on("click", (d) => {
                    console.log("making bytes", d.value);
                    let bytes = hexToByteArray(d.value);
                    console.log("bytes->", bytes);
                    editField({ name: d.name, value: bytes });
                });

                // - label
                let inputLabel = input.append("text")
                    .attr("class", "block-input-label label")
                    .text((d) => `${d.name} (as hex)`);
                
                let inputLabelDimensions = inputLabel.node().getBBox();

                inputLabel
                    .attr("x", 50 - 5 - inputLabelDimensions.width)
                    .attr("y", inputLabelDimensions.height);

                // - dots
                input.append("circle")
                    .attr("class", "dot block-input-dot dot-on-box")
                    .attr("r", 4)
                    .attr("cx", 300)
                    .attr("cy", (d, i) => getInputDotOnBlockY(i));

                input.append("circle")
                    .attr("class", "dot block-input-dot external-dot")
                    .attr("r", 4)
                    .attr("cx", 225)
                    .attr("cy", 20);
            }

            // render outputs
            let output = renderspace.append("g")
                .attr("class", "block-output")
                .attr("transform", "translate(400, 200)");

            output.append("path")
                .attr("class", "block-output-path path-between-circles")
                .attr("d", "M0 25 L75 25");
            
            output.append("circle")
                .attr("class", "dot block-output-dot dot-on-box")
                .attr("r", 4)
                .attr("cy", 25);
            
            output.append("circle")
                .attr("class", "dot block-output-dot external-dot")
                .attr("r", 4)
                .attr("cx", 75)
                .attr("cy", 25);

            let outputEditable = output.append("g")
                .attr("transform", "translate(75,15)")
                .attr("cursor", "pointer");

            outputEditable.append("rect")
                .attr("class", "output-field")
                .attr("width", 175)
                .attr("height", 20)
                .attr("stroke", "black")
                .attr("fill", "transparent");

            let outputEditableText = outputEditable.append("text")
                .text("loading...")
                .attr("font-size", "0.8em");

            let outputEditableTextDimensions = outputEditableText.node().getBBox();

            outputEditableText
                .attr("x", "7")
                .attr("y", (outputEditableTextDimensions.height / 6) * 5);

            outputEditable.on("click", () => {
                let hex = outputEditableText.text();
                inspectField({
                    name: "output",
                    value: hexToByteArray(hex)
                });
            });

            // - label
            let outputLabel = output.append("text")
                .text("output (in hex)");

            let outputLabelDimensions = outputLabel.node().getBBox();

            outputLabel
                .attr("x", 75 + 175 + 5)
                .attr("y", 10 + (outputLabelDimensions.height / 6) * 5);

            onOutputChange(() => outputEditableText.text(block.output.value));

            doCalculation(block).then(result => setOutput(result));
        });

        notifyChanged();
    };

    return block;
};

function generateRandomDefaultValue() {
    let result = [];
    for(let i = 0; i < 6; i++) {
        result.push(Math.round(Math.random() * 255));
    }
    console.log("generating default value", result);
    return byteArrayToHex(result);
}

function stringToByteArray(str) {
    return encode("string", "buf", str);
}

function hexToByteArray(hex) {
    return encode("hex", "buf", hex);
}

// basically a zip with x input value arrays
function pairInputValues(inputValues) {
    let len = Math.max.apply(null, inputValues.map(inputValue => inputValue.length));
    let inputValuePairs = [];
    for(let i = 0; i < len; i++) {
        inputValuePairs.push(inputValues.map((inputValue) => {
            return inputValue[i] || [];
        }));
    }
    return inputValuePairs;
}

function byteArrayToHex(byteArray) {
    return encode("buf", "hex", byteArray);
}

function byteArrayToString(byteArray) {
    return encode("buf", "string", byteArray);
}

function byteArrayToBitString(byteArray) {
    return encode("buf", "bits", byteArray);
}

async function doCalculation(block) {
    console.log("doing calculation", block.inputs);
    let inputValues = block.inputs
        .map((input) => hexToByteArray(input.value));
    console.log("input values", inputValues);
    let inputValuePairs = pairInputValues(inputValues);
    console.log("input value pairs", inputValuePairs);
    let outputValues;
    if(inputValuePairs.length) {
        outputValues = await Promise.all(inputValuePairs
                        .map((inputValuePair) => { return block.func.apply(null, inputValuePair); }));
    }
    else {
        outputValues = [await block.func()];
    }
    console.log("output values", outputValues);
    let result = byteArrayToHex(outputValues);
    console.log("result", result);
    return result;
}
