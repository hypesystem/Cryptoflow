const parseInnardsToAbstractSyntax = require("./stringToAbstract");

module.exports = parseInnardsToFunction;

function parseInnardsToFunction(block) {
    let innards = block.innards;

    if(typeof innards == "function") {
        return innards;
    }

    let variables = block.inputs.map((input) => input.name);
    let initialVariables = variables.slice();
    let statements = parseInnardsToAbstractSyntax(initialVariables, innards);
    let statementsString = buildJsRepresentation(statements);
    let result = Function.apply(null, variables.concat(statementsString));
    result.derivedFromInnardsSpec = true;
    return result;
}

const jsBuilders = {
    assignment: (stmt) => `let ${stmt.variableName} = ${buildJsBlockApplication(stmt)};`,
    return: (stmt) => `return ${buildJsBlockApplication(stmt)};`
};

function buildJsRepresentation(statements) {
    return statements
            .map((stmt) => {
                let builder = jsBuilders[stmt.type];
                if(!builder) {
                    return "/* unparseable statement */";
                }
                return builder(stmt);
            })
            .join("\n");
}

function buildJsBlockApplication(stmt) {
    if(stmt.args.length) {
        return `cryptoflow.runBlock("${stmt.blockId}", ${stmt.args.join(", ")})`;
    }
    return `cryptoflow.runBlock("${stmt.blockId}");`;
}
