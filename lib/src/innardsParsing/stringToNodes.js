const parseInnardsToAbstractSyntax = require("./stringToAbstract");
const runBlock = require("../runBlock");

module.exports = parseInnardsToNodes;

function parseInnardsToNodes(block) {
    let outputNode = { name: "output", from: null, into: [] };
    let variables = { output: outputNode };

    block.inputs.forEach((input) => {
        let inputNode = { name: input.name, from: null, into: [] };
        variables[input.name] = inputNode;
    });

    if(typeof block.innards == "function") {
        // Create a function block. Connect inputs to function, and function to output.
        let functionNode = makeFunctionNode(block.id, block.func, outputNode);
        setUpFunctionInputs(variables, functionNode, block.inputs.map((input) => input.name));

        return outputNode;
    }

    let statements = parseInnardsToAbstractSyntax(block.innards);

    statements.forEach(({ type, variableName, blockId, args }) => {
        if(type == "return") {
            let functionNode = makeFunctionNodeFromId(blockId, outputNode);
            setUpFunctionInputs(variables, functionNode, args);
        }
        else if(type == "assignment") {
            let functionNode = makeFunctionNodeFromId(blockId);
            setUpFunctionInputs(variables, functionNode, args);
            addNewFunctionOutputNode(variables, variableName, functionNode);
        }
        else {
            console.warn("Encountered unknown statement type " + type + " when building as node.");
        }
    });

    return outputNode;
}

function makeFunctionNodeFromId(blockId, outputNode) {
    return makeFunctionNode(blockId, (cryptoflow || require("../index.js")).blocks[blockId].func, outputNode);
    //TODO: bad! cryptoflow direct ref.
}

function makeFunctionNode(name, func, outputNode) {
    if(outputNode) {
        let functionNode = { name, inputs: [], func, output: outputNode };
        outputNode.from = functionNode;
        return functionNode;
    }
    return { name, inputs: [], func, output: null };
}

function setUpFunctionInputs(variables, functionNode, variableNames) {
    variableNames.forEach((variableName) => {
        let variable = variables[variableName];
        functionNode.inputs.push(variable);
        variable.into.push(functionNode);
    });
}

function addNewFunctionOutputNode(variables, variableName, functionNode) {
    let newVariableNode = { name: variableName, from: functionNode, into: [] };
    variables[variableName] = newVariableNode;
    functionNode.output = newVariableNode;
}
