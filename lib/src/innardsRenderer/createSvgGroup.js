module.exports = createSvgGroup;

function createSvgGroup() {
    return document.createElementNS("http://www.w3.org/2000/svg", "g");
    //TODO: Direct access to `document`! bad!
}
