import React, {useState} from "react";
import {languagesContext} from "../../context";
import styles from "./GameBox.module.scss";
import languagesJSON from "../../languages.json";
import {useCallback, useContext} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    switchCurrentPlayer,
    resetCountRotation,
    changeGameStatus,
    countTurn,
    countEarthPoints,
    countSeaPoints,
    status
} from "../../store/reducers/gameReducer";
import {
    setPropertyUnlimitedRotation,
    updateUsedCard,
    changeCellConnectionInGrid
} from "../../store/reducers/boardReducer";
import {SIDE_TYPE} from "../../store/cell.type";
import Button from "../Button";


export default function GameBox({ resetGame }) {
    const statusGame = useSelector(state => state.gameReducer.statusGame);
    const currentPlayer = useSelector(state => state.gameReducer.currentPlayer)
    const countRotation = useSelector(state => state.gameReducer.countRotation)
    const turn = useSelector(state => state.gameReducer.turn)
    const pointsEarth = useSelector(state => state.gameReducer.pointsEarth)
    const pointsSea = useSelector(state => state.gameReducer.pointsSea)
    const grid = useSelector(state => state.boardReducer.grid);
    const cards = useSelector(state => state.boardReducer.cards);
    const usedCards = useSelector(state => state.boardReducer.usedCards);

    const [card, setCard] = useState()
    const dispatch = useDispatch();

    const {language} = useContext(languagesContext);
    let selectedLanguage = language === 'ukr' ? languagesJSON[0].ukr[0] : languagesJSON[1].eng[0];

    function addCard() {
        const newCard = cards[usedCards.length]
        dispatch(updateUsedCard(newCard))
        dispatch(changeGameStatus(status.placeTile))
        setCard(newCard)
        dispatch(resetCountRotation())
    }

    const isCellsEqual = (cell_1, cell_2) => {
        return cell_1.row === cell_2.row && cell_1.col === cell_2.col
    }

    const checkSideType = (neighborIndex) => {
        let currentSideIndexes = [-1, -1]

        // eslint-disable-next-line default-case
        switch (neighborIndex) {
            case 0:
                currentSideIndexes = [0, 1]
                break;
            case 1:
                currentSideIndexes = [2, 3]
                break;
            case 2:
                currentSideIndexes = [4, 5]
                break;
            case 3:
                currentSideIndexes = [6, 7]
                break;
        }
        return currentSideIndexes
    }

    const getCell = useCallback((row, col) => {
        for (let rowArray of grid) {
            const cell = rowArray.find(cell => {
                    return cell.row === row && cell.col === col
                }
            )
            if (cell !== undefined) return cell
        }
    }, [grid])

    const findStartCell = useCallback(() => {
        for (let row of grid) {
            const startCell = row.find(cell => {
                return cell.isMain;
            })
            if (startCell !== undefined) return startCell
        }
    }, [grid])

    const getCellNeighbors = useCallback((current, directions) => {
        const neighbors = [];
        for (let dir of directions) {
            const neighborCol = current.col + dir.col;
            const neighborRow = current.row + dir.row;
            if (neighborCol >= 0 && neighborRow >= 0 && neighborCol <= 2 && neighborRow <= 2) {
                neighbors.push(getCell(neighborRow, neighborCol));
            } else {
                neighbors.push(null)
            }
        }
        return neighbors;
    }, [getCell])

    const calcPoints = useCallback((checkedSideType) => {
        const frontier = []
        const reached = []
        const counted = []
        const connectedSides = []

        let points = 0

        const directions = [
            {col: 0, row: -1}, // Up
            {col: 1, row: 0},  // Right
            {col: 0, row: 1},  // Down
            {col: -1, row: 0}, // Left
        ];

        const startCell = findStartCell()
        frontier.push(startCell)
        reached.push(startCell)

        while (frontier.length > 0) {
            const current = frontier.shift()

            const neighbors = getCellNeighbors(current, directions)

            for (let neighborIndex = 0; neighborIndex < neighbors.length; neighborIndex++) {
                const neighbor = neighbors[neighborIndex]

                if (neighbor == null) continue

                const isReached = reached.findIndex(reachedCell => isCellsEqual(neighbor, reachedCell)) >= 0

                if (isReached) {
                    continue
                }

                let currentSideIndexes = checkSideType(neighborIndex)

                for (let sideIndex of currentSideIndexes) {
                    const neighborSideIndex = getOppositeIndex(sideIndex)
                    const currentSideType = current.sides[sideIndex]
                    const neighborSideType = neighbor.sides[neighborSideIndex]

                    const isPointsTypeCheckFine = checkedSideType === currentSideType
                    const isSidesTypesEqual = currentSideType === neighborSideType

                    const isCounted = counted.findIndex(_cell => _cell.row === neighbor.row && _cell.col === neighbor.col) >= 0

                    if (!isPointsTypeCheckFine || !isSidesTypesEqual) continue

                    const checkGraph = checkedSideType === SIDE_TYPE.Water ? current.waterGraph : current.earthGraph

                    let isConnectedToMainGraph = false

                    if (current.isMain) {
                        isConnectedToMainGraph = true
                    } else {
                        const indexInGraph = checkGraph.findIndex(connection => {
                            const pairIndex = connection.findIndex(_sideIndex => _sideIndex === sideIndex)

                            if (pairIndex < 0) return false
                            const nextPairIndex = pairIndex === 0 ? 1 : 0
                            const nextPairSideIndex = connection[nextPairIndex]

                            const isConnected = connectedSides.includes(current.row + '|' + current.col + '|' + nextPairSideIndex)

                            return isConnected
                        })

                        isConnectedToMainGraph = indexInGraph >= 0
                    }

                    if (!isConnectedToMainGraph) continue

                    const currentConnectionName = current.row + '|' + current.col + '|' + sideIndex
                    const neighborConnectionName = neighbor.row + '|' + neighbor.col + '|' + neighborSideIndex

                    if (!connectedSides.includes(currentConnectionName)) connectedSides.push(currentConnectionName)
                    if (!connectedSides.includes(neighborConnectionName)) connectedSides.push(neighborConnectionName)

                    //</editor-fold>
                    if (!isCounted) {
                        dispatch(changeCellConnectionInGrid({
                            checkCell: neighbor,
                            sideIndex: neighborSideIndex,
                            isMain: false
                        }))
                        counted.push(neighbor)
                        points += 1
                    }

                    frontier.push(neighbor)
                    reached.push(neighbor)
                }
            }
        }
        points += counted.length > 0 ? 1 : 0

        if (counted.length > 0) {
            dispatch(changeCellConnectionInGrid({checkCell: startCell, sideIndex: checkedSideType, isMain: true}))
        }

        if (checkedSideType === SIDE_TYPE.Earth) {
            dispatch(countEarthPoints(points))
        } else {
            dispatch(countSeaPoints(points))
        }
    }, [dispatch, findStartCell, getCellNeighbors])

    const nextTurn = useCallback(() => {
        if (statusGame !== 'new card') return

        if (usedCards.length === 9) {
            dispatch(setPropertyUnlimitedRotation())
            dispatch(changeGameStatus('game over'))
            dispatch(resetCountRotation())

            calcPoints(SIDE_TYPE.Water)

            calcPoints(SIDE_TYPE.Earth)

        } else {
            dispatch(setPropertyUnlimitedRotation())
            dispatch(changeGameStatus('players turn'))
            dispatch(switchCurrentPlayer())
            dispatch(resetCountRotation())
            dispatch(countTurn())
        }
    }, [calcPoints, dispatch, usedCards.length, statusGame])

    function getOppositeIndex(index) {
        const oppositeIndices = [5, 4, 7, 6, 1, 0, 3, 2];
        if (index >= 0 && index < oppositeIndices.length) {
            return oppositeIndices[index]
        } else {
            return -1
        }
    }

    return (
        <>
            {statusGame !== 'game over' &&
                <div className={styles['info-container']}>
                    <p className={`${styles['turn-info__text']} ${styles['turn-info__text-turn']}`}>
                        {selectedLanguage.turn} {turn}
                    </p>
                    <p className={styles['turn-info__text']}>
                        {selectedLanguage.moveOfPlayer} {currentPlayer} ({currentPlayer === 1 ?
                        <span
                            className={`${styles['turn-info__text']} ${styles['turn-info__text--brown']}`}>
                            {selectedLanguage.earth}
                        </span> :
                        <span
                            className={`${styles['turn-info__text']} ${styles['turn-info__text--blue']}`}>
                            {selectedLanguage.sea}
                        </span>})
                    </p>
                    <p className={styles['turn-info__text']}>
                        {selectedLanguage.rotationPerformed} {countRotation}
                    </p>
                    {
                        countRotation === 2 &&
                        <>
                            <p className={`${styles['turn-info__text']} ${styles['turn-info__text--red']}`}>
                                {selectedLanguage.rotationLimitReached}
                            </p>
                            <p className={styles['turn-info__text']}>
                                {selectedLanguage.placeNewTile}
                            </p>
                        </>
                    }
                    {
                        statusGame === 'start' &&
                        <p className={styles['turn-info__text']}>
                            {selectedLanguage.placeNewTile}
                        </p>
                    }
                    {
                        statusGame === 'players turn' && countRotation !== 2 &&
                        <p className={styles['turn-info__text']}>
                            {selectedLanguage.placeNewTile} {selectedLanguage.rotateTile}
                        </p>
                    }
                    {
                        statusGame === 'new card' &&
                        <p className={styles['turn-info__text']}>
                            {selectedLanguage.unlimitedRotateCard}
                        </p>
                    }
                    {
                        statusGame === status.placeTile &&
                        <p className={styles['turn-info__text']}>
                            * {selectedLanguage.forPlaceNewTile}
                        </p>
                    }
                    {statusGame === status.rotateTile &&
                        <p className={styles['turn-info__text']}>
                            ** {selectedLanguage.forRotate}
                        </p>
                    }
                    {statusGame === status.newCard &&
                        <Button
                            title={selectedLanguage.btnTitleForDone}
                            onClick={nextTurn}
                            className={'btn-done'}
                        ></Button>
                    }
                    {statusGame === status.playersTurn &&
                        <Button
                            title={selectedLanguage.btnTitlePlaceTile}
                            onClick={addCard}
                            className={'btn--action'}
                        ></Button>
                    }
                    {statusGame === status.placeTile &&
                        <div className={styles['img-tile']}>
                            {card.img.map((url, index) => (
                                <div key={index} className={`${styles[`img-tile__id`]}`}
                                     style={{
                                         backgroundImage: `url(${url})`
                                     }}>
                                </div>))
                            }
                        </div>}
                    {statusGame === status.playersTurn && countRotation !== 2 &&
                        <Button
                            title={selectedLanguage.btnTitleRotateTile}
                            onClick={() => {
                                dispatch(changeGameStatus(status.rotateTile))
                            }}
                            className={'btn--action'}
                        ></Button>
                    }
                </div>
            }
            {statusGame === 'game over' &&
                <div className={styles['info-container']}>
                    <p className={styles['turn-info__text']}>
                        {selectedLanguage.player} 1 (
                        <span
                            className={`${styles['turn-info__text']} ${styles['turn-info__text--brown']}`}>
                        {selectedLanguage.earth}
                        </span>)
                        {selectedLanguage.points} : {pointsEarth}
                    </p>
                    <p className={styles['turn-info__text']}>
                        {selectedLanguage.player} 2 (
                        <span
                            className={`${styles['turn-info__text']} ${styles['turn-info__text--blue']}`}>
                        {selectedLanguage.sea}
                        </span>)
                        {selectedLanguage.points} : {pointsSea}
                    </p>
                    <div className={styles['btn-container']}>
                        <Button title={selectedLanguage.btnTitlePlayAgain}
                                onClick={resetGame}
                                className={'btn--game-over'}>
                        </Button>
                    </div>
                </div>
            }
        </>
    )
}