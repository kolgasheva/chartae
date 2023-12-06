export const SIDE_TYPE = {
    None: 0,
    Earth: 1,
    Water: 2,
}

export const CELL_MODEL = {
    row: -1,
    col: -1,
    isEmpty: true,
    sides: Array(8).fill(SIDE_TYPE.None),
    imgIndex: [],
    img: '',
    waterGraph: [],
    earthGraph: [],
    isSpaced: false,
    unlimitedRotate: false,
    isMain: false,
    waterConnectedIndexes: [],
    earthConnectedIndexes: [],
    isConnected: false,
    connectedImgUrlIndex: [false, false, false],
}

export const isCellsEqual = (cell1, cell2) => {
    return cell1.row === cell2.row && cell1.col === cell2.col
}