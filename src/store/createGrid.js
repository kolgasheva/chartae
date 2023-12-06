import {CELL_MODEL} from "./cell.type";

export default function createGrid () {
    const newGrid = []
    for (let row = 0; row < 3; row++) {
        const gridRow = [];
        for (let col = 0; col < 3; col++) {
            const cell = {...CELL_MODEL}

            cell.row = row
            cell.col = col

            gridRow.push(cell)
        }
        newGrid.push(gridRow)
    }
    return newGrid
}