module.exports = parseInnardsToFunction;

function parseInnardsToFunction(block) {
    let innards = block.innards;

    if(typeof innards == "function") {
        return innards;
    }

    //parse string to abstract statements
    let statements = innards
                        .split("\n")
                        .map((line) => line.trim())
                        .filter((line) => line.length > 0)
                        .map((stmt) => {
                            console.log("stmt str", stmt);
                            let assignmentMatch = /^([a-z0-9_]+)\s+\<\-\s+([a-z0-9_]+)\((?:([a-z0-9_]+),\s*)*([a-z0-9_]+)\s*\)$/.exec(stmt);
                            console.log("assignment?", assignmentMatch);
                            if(assignmentMatch) {
                                return {
                                    type: "assignment",
                                    variableName: assignmentMatch[1],
                                    blockId: assignmentMatch[2],
                                    args: assignmentMatch.slice(3)
                                };
                            }
                            
                            let returnMatch = /^\<\-\s+([a-z0-9_]+)\((?:([a-z0-9_]+),\s*)*([a-z0-9_]+)\s*\)$/.exec(stmt);
                            console.log("return?", returnMatch);
                            if(returnMatch) {
                                return {
                                    type: "return",
                                    blockId: returnMatch[1],
                                    args: returnMatch.slice(2)
                                };
                            }

                            return {};
                        });

    //parse abstract statements to js representation
    let variables = block.inputs.map((input) => input.name);
    let statementsString = statements
                            .map((stmt) => {
                                if(stmt.type == "assignment") {
                                    return `let ${stmt.variableName} = ${parseFunctionApplication(stmt)};`
                                }
                                if(stmt.type == "return") {
                                    return `return ${parseFunctionApplication(stmt)};`;
                                }
                                console.error("Unrecognized stmt", stmt);
                            })
                            .join("\n");

    console.log("function innards:\n", variables, "\n", statementsString);

    return Function.apply(null, variables.concat(statementsString));
}

function parseFunctionApplication(stmt) {
    return `cryptoflow.runBlock("${stmt.blockId}", ${stmt.args.join(", ")})`;
}
