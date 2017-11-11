module.exports = makeGrid;

function makeGrid() {
    let grid = [];

    let findFirstFreeY = (x) => {
        while(x >= grid.length - 1) {
            grid.push([]);
        }
        let indexOfNull = grid[x].indexOf(null);
        if(indexOfNull == -1) {
            // no empty space, add to end
            return grid[x].length;
        }
        // empty space!
        return indexOfNull;
    };

    let set = (x, y, node) => {
        while(x >= grid.length - 1) {
            grid.push([]);
        }
        let col = grid[x];
        while(y >= col.length - 1) {
            col.push(null);
        }
        col[y] = node;
    };

    let getMaxXY = () => {
        let maxX = grid.length;

        let colLengths = grid.map((col) => col.length);
        let maxY = Math.max.apply(null, colLengths);
        
        return { maxX, maxY };
    };
    
    return { findFirstFreeY, set, getMaxXY };
}
