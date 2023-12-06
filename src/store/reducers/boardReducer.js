import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import createGrid from "../createGrid";
import {isCellsEqual, SIDE_TYPE} from "../cell.type";

const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array
}
export const createBoard = createAsyncThunk(
    'gameReducer/createBoard',
    async (_, {rejectWithValue}) => {
        try {
            const response = await fetch('/card.json')
            const cards = await response.json();
            const shuffledCards = shuffleArray(cards);
            const mainItemIndex = shuffledCards.findIndex(card => card.isMain === true);
            const mainItem = shuffledCards.splice(mainItemIndex, 1)[0];
            shuffledCards.unshift(mainItem)
            return shuffledCards
        } catch (e) {
            return rejectWithValue(e.message)
        }
    }
)

const initialState = {
    grid: [],
    cards: [],
    status: '',
    usedCards: []
}

const boardReducer = createSlice({
    name: 'boardReducer',
    initialState,
    reducers: {
        updateGrid(state, action) {
            state.grid = action.payload
        },
        addCard(state, action) {
            state.grid = action.payload
        },
        updateUsedCard(state, action) {
            state.usedCards = [...state.usedCards, action.payload]
        },
        setPropertyUnlimitedRotation (state) {
            const newGrid = state.grid.map(rows => {
                return rows.map(cell => {
                    return {
                        ...cell,
                        unlimitedRotate: false
                    }
                })
            })
            state.grid = [...newGrid]
        },
        resetUsedCards(state) {
            state.usedCards = []
        },
        resetGrid(state) {
            const newGrid = createGrid();
            state.grid = [...newGrid]
        },
        resetCards(state) {
            const shuffledCards = shuffleArray(state.cards)
            const mainItemIndex = shuffledCards.findIndex(card => card.isMain === true);
            const mainItem = shuffledCards.splice(mainItemIndex, 1)[0];
            shuffledCards.unshift(mainItem)
            state.cards = [...shuffledCards]
        },
        changeCellConnectionInGrid(state, action) {
            const {checkCell, sideIndex, isMain} = action.payload
            const newGrid = state.grid.map(rows => {
                return rows.map(cell => {
                    if (!isCellsEqual(cell, checkCell)) return cell
                    let isConnectedImgUrlIndex = [...cell.connectedImgUrlIndex]
                    if(isMain){
                        if(sideIndex=== SIDE_TYPE.Earth) {
                            isConnectedImgUrlIndex[1] = true;
                        } else {
                            isConnectedImgUrlIndex[0] = true;
                        }
                        isConnectedImgUrlIndex[2] = true;
                    } else {
                        const correspondingValueIMG = cell.imgIndex[sideIndex]
                        isConnectedImgUrlIndex[correspondingValueIMG] = true;
                    }
                    return {
                        ...cell,
                        isConnected: true,
                        connectedImgUrlIndex: isConnectedImgUrlIndex
                    }
                })
            })
            state.grid = [...newGrid]
        }
    },
    extraReducers: {
        [createBoard.pending]: (state) => {
            state.status = 'loading';
        },
        [createBoard.fulfilled]: (state, action) => {
            state.status = 'loaded';
            state.cards = action.payload
        },
        [createBoard.rejected]: (state, action) => {
            state.status = 'rejected: error ' + action.payload;
            state.cards = [];
        }
    }
})
export const {updateGrid, addCard,updateUsedCard,resetUsedCards,resetGrid, resetCards,setPropertyUnlimitedRotation, changeCellConnectionInGrid} = boardReducer.actions
export default boardReducer.reducer
