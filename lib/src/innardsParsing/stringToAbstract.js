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

function parseInnardsToAbstractSyntax(innards) {
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
