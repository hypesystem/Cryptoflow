const parseInnardsToAbstractSyntax = require("./stringToAbstract");

module.exports = parseInnardsToFunction;

function parseInnardsToFunction(block) {
    let innards = block.innards;

    if(typeof innards == "function") {
        return innards;
    }
    
    let statements = parseInnardsToAbstractSyntax(innards);
    let variables = block.inputs.map((input) => input.name);
    let statementsString = buildJsRepresentation(statements);
    return Function.apply(null, variables.concat(statementsString));
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
    return `cryptoflow.runBlock("${stmt.blockId}", ${stmt.args.join(", ")})`;
}
