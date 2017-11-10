const parseInnardsToAbstractSyntax = require("./stringToAbstract");
const runBlock = require("../runBlock");

module.exports = parseInnardsToNodes;

function parseInnardsToNodes(block) {
    let innards = block.innards;

    let graph = {};
    let variables = {};

    block.inputs.forEach((input) => {
        let inputNode = { name: input.name, from: "__input", into: [] };
        graph[input.name] = inputNode;
        variables[input.name] = inputNode;
    });

    if(typeof innards == "function") {
        // Create a function block. Connect inputs to function, and function to output.
        let functionNode = makeFunctionNode(block.id, block.func);
        setUpFunctionInputs(variables, functionNode, block.inputs.map((input) => input.name));
        addNewFunctionOutputNode("output", functionNode);

        return graph;
    }

    let statements = parseInnardsToAbstractSyntax(innards);

    statements.forEach(({ type, variableName, blockId, args }) => {
        if(type == "return") {
            variableName = "output";
        }
        
        if(type == "assignment" || type == "return") {
            let functionNode = makeFunctionNodeFromId(blockId);
            setUpFunctionInputs(variables, functionNode, args);
            addNewFunctionOutputNode(variableName, functionNode);
        }
        else {
            console.warn("Encountered unknown statement type " + type + " when building as node.");
        }
    });

    return graph;
}

function makeFunctionNodeFromId(blockId) {
    return makeFunctionNode(blockId, cryptoflow.blocks[blockId].func);
}

function makeFunctionNode(name, func) {
    return { name: blockId, inputs: [], func: func, output: null };
    //TODO: bad! cryptoflow direct ref.
}

function setUpFunctionInputs(variables, functionNode, variableNames) {
    variableNames.forEach((variableName) => {
        let variable = variables[variableName];
        functionNode.inputs.push(variable);
        variable.into.push(functionNode);
    });
}

function addNewFunctionOutputNode(variableName, functionNode) {
    let newVariableNode = { name: variableName, from: functionNode, into: [] };
    variables[variableName] = newVariableNode;
    functionNode.output = newVariableNode;
}
