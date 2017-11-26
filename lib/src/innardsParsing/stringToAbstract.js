module.exports = parseInnardsToAbstractSyntax;

const matchers = [
    {
        regex: /^([a-z0-9_]+)\s+\<\-\s+([a-z0-9_]+)\((?:([a-z0-9_]+),\s*)*([a-z0-9_]+)?\s*\)$/,
        build: (match) => { return {
            type: "assignment",
            variableName: match[1],
            blockId: match[2],
            args: match.slice(3).filter(x => x)
        };}
    },
    {
        regex: /^\<\-\s+([a-z0-9_]+)\((?:([a-z0-9_]+),\s*)*([a-z0-9_]+)?\s*\)$/,
        build: (match) => { return {
            type: "return",
            blockId: match[1],
            args: match.slice(2).filter(x => x)
        };}
    }
];

function parseInnardsToAbstractSyntax(initialVariables, innards) {
    let result = parse(innards);
    validate(initialVariables, result);
    return result;
}

function parse(innards) {
    return innards
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0)
            .map((line) => {
                let matcher = matchers.find((matcher) => matcher.regex.test(line)); //TOOD: double evaluation of regex bad
                if(!matcher) {
                    console.error("Failed to parse statement", line, "into abstract syntax");
                    return {};
                }

                let match = matcher.regex.exec(line);
                return matcher.build(match);
            });
}

function validate(initialVariables, statements) {
    let knownVariables = initialVariables.slice();
    let unusedVariables = knownVariables.slice();
    let hasReturned = false;
    statements.forEach((stmt) => {
        if(hasReturned) {
            throw new Error(`Statement found after return, which is illegal.`);
        }
        stmt.args.forEach((arg, i) => {
            if(!knownVariables.includes(arg)) {
                throw new Error(`Argument ${arg} used without being initialized (line ${i}). Known variables at this point: ${knownVariables}`);
            }
            let varI = unusedVariables.indexOf(arg);
            if(varI !== -1) {
                unusedVariables.splice(varI, varI + 1);
            }
        });
        if(stmt.type == "assignment") {
            knownVariables.push(stmt.variableName);
            unusedVariables.push(stmt.variableName);
        }
        if(stmt.type == "return") {
            hasReturned = true;
        }
    });
    if(unusedVariables.length) {
        throw new Error(`Program finishes with unused variables: ${unusedVariables}.`);
    }
}
