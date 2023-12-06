import {createSlice} from "@reduxjs/toolkit";

const players = [1, 2]

export const status=  {
    start: 'start',
    playersTurn: 'players turn',
    newCard: 'new card',
    gameOver: 'game over',
    placeTile: 'place tile',
    rotateTile: 'rotate tile'
}


const initialState = {
    statusGame: 'start',
    currentPlayer: 1,
    countRotation: 0,
    turn: 1,
    pointsEarth: 0,
    pointsSea: 0
}

const gameReducer = createSlice({
    name: 'gameReducer',
    initialState,
    reducers: {
        changeGameStatus(state, action) {
            state.statusGame = action.payload
        },
        switchCurrentPlayer(state) {
            state.currentPlayer = (state.currentPlayer === players[0]) ? players[1] : players[0];
        },
        changeCountRotation(state){
            state.countRotation += 1
        },
        countTurn(state) {
            state.turn = state.turn + 1
        },
        countEarthPoints(state, action ) {
            state.pointsEarth = action.payload
        },
        countSeaPoints(state, action ) {
            state.pointsSea = action.payload
        },
        resetCountRotation(state) {
            state.countRotation = 0
        },
        resetCurrentPlayer(state){
            state.currentPlayer = 1
        },
        resetStatusGame(state){
            state.statusGame = status.start
        },
        resetTurn(state) {
            state.turn = 1
        },
        resetPlayersPoints (state) {
            state.pointsEarth = 0
            state.pointsSea = 0
        }
    }
})
export const {changeGameStatus, switchCurrentPlayer, changeCountRotation,resetCountRotation, resetCurrentPlayer,resetStatusGame, resetTurn, countTurn, countEarthPoints, countSeaPoints, resetPlayersPoints} = gameReducer.actions
export default gameReducer.reducer