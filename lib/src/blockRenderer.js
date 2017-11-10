module.exports = (onBlockChange, onOutputChange, notifyChanged) => (renderspace, inspectField, editField, inspectBlock) => {
    renderspace.attr("transform", "translate(100,30)");

    let inputHeight = 100;
    let mainBlockX = 300;
    let mainBlockY = 200;

    onBlockChange(() => {
        // cleanup
        renderspace.selectAll("g").remove();

        // render block
        let { renderedBlock, blockDimensions } = renderBlock(block, mainBlockX, mainBlockY, renderspace);
        renderedBlock.on("click", () => inspectBlock(block));

        // render inputs
        renderInputs(block, mainBlockX, mainBlockY, inputHeight, renderspace, editField);

        // render output
        let output = renderOutput(block, mainBlockX, mainBlockY, blockDimensions, renderspace);
        onOutputChange(() => output.setValue(block.output.value));
        output.block.on("click", () => inspectField({
            name: "output",
            value: encode("hex", "buf", output.getValue())
        }));
    });

    notifyChanged();
};

function renderBlock(block, mainBlockX, mainBlockY, renderspace) {
    // - square
    let renderedBlock = renderspace.append("g")
            .attr("class", "block")
            .attr("transform", `translate(${mainBlockX}, ${mainBlockY})`);
    
    // add block rect
    let blockSquare = renderedBlock.append("rect")
        .attr("class", "block-square")

    // define text to get dimensions
    let blockText = renderedBlock.append("text")
        .attr("class", "block-label label")
        .text(block.name);

    let textDimensions = blockText.node().getBBox();

    // calculate square itself, and change iets dimensions
    let blockDimensions = {
        width: Math.max(100, textDimensions.width + 20),
        height: Math.max(50, textDimensions.height + 20)
    };

    blockSquare
        .attr("width", blockDimensions.width)
        .attr("height", blockDimensions.height);
    
    // - text in square, update dimensions
    blockText
        .attr("x", (blockDimensions.width / 2) - (textDimensions.width / 2))
        .attr("y", (blockDimensions.height / 2) + (textDimensions.height / 6));

    return { renderedBlock, blockDimensions };
}

function renderInputs(block, mainBlockX, mainBlockY, inputHeight, renderspace, editField) {
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
        .attr("d", (d, i) => `M${mainBlockX - 75} 20 C${mainBlockX - 50} 20, ${mainBlockX - 25} ${getInputDotOnBlockY(i)}, ${mainBlockX} ${getInputDotOnBlockY(i)}`);

    // - editable field
    let inputEditable = input.append("g")
        .attr("class", "input-editable")
        .attr("transform", `translate(${mainBlockX - 175 - 75}, 10)`);

    inputEditable.append("rect")
            .attr("class", "input-editable-rect")
            .attr("width", 175)
            .attr("height", 20);

    let inputEditableText = inputEditable.append("text")
            .attr("class", "input-editable-text")
            .text((d) => d.value);
    
    let firstInputEditableTextNode = inputEditableText.node();

    if(firstInputEditableTextNode) {
        let inputEditableTextDimensions = firstInputEditableTextNode.getBBox();

        inputEditableText
                .attr("x", 3)
                .attr("y", (inputEditableTextDimensions.height / 6) * 5);

        inputEditable.on("click", (d) => editField({
            name: d.name,
            value: encode("hex", "buf", d.value)
        }));

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
            .attr("cx", mainBlockX)
            .attr("cy", (d, i) => getInputDotOnBlockY(i));

        input.append("circle")
            .attr("class", "dot block-input-dot external-dot")
            .attr("r", 4)
            .attr("cx", mainBlockX - 75)
            .attr("cy", 20);
    }
}

function renderOutput(block, mainBlockX, mainBlockY, blockDimensions, renderspace) {
    let blockCenter = blockDimensions.height / 2;
    let xSpaceBetween = 75;

    // render output
    let output = renderspace.append("g")
        .attr("class", "output-container")
        .attr("transform", `translate(${mainBlockX + blockDimensions.width}, ${mainBlockY})`);

    output.append("path")
        .attr("class", "block-output-path path-between-circles")
        .attr("d", `M0 ${blockCenter} L${xSpaceBetween} ${blockCenter}`);
    
    output.append("circle")
        .attr("class", "dot block-output-dot dot-on-box")
        .attr("r", 4)
        .attr("cy", blockCenter);
    
    output.append("circle")
        .attr("class", "dot block-output-dot external-dot")
        .attr("r", 4)
        .attr("cx", xSpaceBetween)
        .attr("cy", blockCenter);

    let outputValueBlock = renderValueBlock(output, "output-block");
    
    outputValueBlock.block.attr("transform", `translate(${xSpaceBetween},15)`);
    outputValueBlock.setValue(block.output.value);

    let outputValueBlockDimensions = outputValueBlock.block.node().getBBox();

    // - label
    let label = output.append("text").text("output (in hex)");
    let labelDimensions = label.node().getBBox();
    label.attr("x", xSpaceBetween + outputValueBlockDimensions.width + 5)
         .attr("y", blockCenter + (labelDimensions.height / 5));

    return outputValueBlock;
}

function renderValueBlock(container, name) {
    let block = container.append("g").attr("class", name);

    let rect = block.append("rect")
        .attr("class", `${name}-rect`)
        .attr("width", 175)
        .attr("height", 20);

    let rectDimensions = rect.node().getBBox();

    let text = block.append("text")
        .attr("class", `${name}-text`)
        .text("loading...");

    let textDimensions = text.node().getBBox();

    text.attr("x", "7")
        .attr("y", (rectDimensions.height / 2) + (textDimensions.height / 4));
    
    let setValue = (val) => text.text(val);
    let getValue = () => text.text();

    return { block, setValue, getValue };
}
