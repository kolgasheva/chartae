import React, {useState} from 'react';
import styles from './Card.module.scss'
import {useDispatch, useSelector} from "react-redux";
import {updateGrid} from "../../store/reducers/boardReducer";
import {
    changeCountRotation,
    switchCurrentPlayer,
    countTurn,
    status,
    changeGameStatus
} from "../../store/reducers/gameReducer";
import CounterClockWiseRotation from "../СounterСlockwiseRotation";
import ClockWiseRotation from "../СlockwiseRotation";

export default function Card(props) {
    const grid = useSelector(state => state.boardReducer.grid)
    const statusGame = useSelector(state => state.gameReducer.statusGame)
    const countRotation = useSelector(state => state.gameReducer.countRotation)

    const [rotationDegree, setRotationDegree] = useState(0)
    const dispatch = useDispatch()

    function plusRotationDegree() {
        setRotationDegree((prevState) => prevState + 90)
    }

    function minusRotationDegree() {
        setRotationDegree((prevState) => prevState - 90)
    }

    function changeGridClockWise(row, col) {
        const sides = [...props.cell.sides]
        const imgIndex = [...props.cell.imgIndex]

        const lastTwoElementsSides = sides.splice(-2)
        sides.unshift(...lastTwoElementsSides)

        const lastTwoElementsImgIndex = imgIndex.splice(-2)
        imgIndex.unshift(...lastTwoElementsImgIndex)



        let waterGraph = changeGraphClockWise('waterGraph')
        let earthGraph = changeGraphClockWise('earthGraph')

        const newGrid = grid.map(rows => {
            return rows.map(cell => {
                if (cell.row === row && cell.col === col) {
                    return {
                        ...cell,
                        imgIndex: imgIndex,
                        sides: sides,
                        waterGraph: waterGraph,
                        earthGraph: earthGraph
                    }
                } else return cell;
            })
        })
        dispatch(updateGrid(newGrid))
    }

    function changeGridCounterClockWise(row, col) {
        const sides = [...props.cell.sides]
        const imgIndex = [...props.cell.imgIndex]

        const firstTwoElementsSides = sides.splice(0, 2)
        sides.push(...firstTwoElementsSides)

        const firstTwoElementsImgIndex = imgIndex.splice(0, 2)
        imgIndex.push(...firstTwoElementsImgIndex)

        let waterGraph = changeGraphCounterClockWise('waterGraph')
        let earthGraph = changeGraphCounterClockWise('earthGraph')

        const newGrid = grid.map(rows => {
            return rows.map(cell => {
                if (cell.row === row && cell.col === col) {
                    return {
                        ...cell,
                        imgIndex: imgIndex,
                        sides: sides,
                        waterGraph: waterGraph,
                        earthGraph: earthGraph
                    }
                } else return cell;
            })
        })
        dispatch(updateGrid(newGrid))
    }

    function deepCloneArray(array) {
        return JSON.parse(JSON.stringify(array));
    }

    function changeGraphClockWise(graph) {
        const modifiedGraph = []
        let changedGraph
        if (graph === 'waterGraph') {
            changedGraph = deepCloneArray(props.cell.waterGraph)
        } else {
            changedGraph = deepCloneArray(props.cell.earthGraph)
        }

        for (const edge of changedGraph) {
            const modifiedEdge = [];
            for (const num of edge) {
                if (num === 6) {
                    modifiedEdge.push(0);
                } else if (num === 7) {
                    modifiedEdge.push(1);
                } else {
                    modifiedEdge.push(num + 2);
                }
            }
            modifiedGraph.push(modifiedEdge);
        }
        return modifiedGraph
    }

    function changeGraphCounterClockWise(graph) {
        const modifiedGraph = []
        let changedGraph
        if (graph === 'waterGraph') {
            changedGraph = deepCloneArray(props.cell.waterGraph)
        } else {
            changedGraph = deepCloneArray(props.cell.earthGraph)
        }

        for (const edge of changedGraph) {
            const modifiedEdge = [];
            for (const num of edge) {
                if (num === 1) {
                    modifiedEdge.push(7);
                } else if (num === 0) {
                    modifiedEdge.push(6);
                } else {
                    modifiedEdge.push(num - 2);
                }
            }
            modifiedGraph.push(modifiedEdge);
        }
        return modifiedGraph
    }

    function rotateClockWise(row, col) {
        if (statusGame === 'new card') {
            plusRotationDegree()
            changeGridClockWise(row, col)
        } else if (statusGame === status.rotateTile && (countRotation === 1 || countRotation === 0)) {
            plusRotationDegree()
            changeGridClockWise(row, col)
            dispatch(changeCountRotation())
            dispatch(switchCurrentPlayer())
            dispatch(changeGameStatus(status.playersTurn))
            dispatch(countTurn())
        }
    }

    function rotateCounterClockWise(row, col) {
        if (statusGame === 'new card') {
            minusRotationDegree()
            changeGridCounterClockWise(row, col)
        } else if (statusGame === status.rotateTile && (countRotation === 1 || countRotation === 0)) {
            minusRotationDegree()
            changeGridCounterClockWise(row, col)
            dispatch(changeCountRotation())
            dispatch(switchCurrentPlayer())
            dispatch(changeGameStatus(status.playersTurn))
            dispatch(countTurn())
        }
    }

    return (
        <>
            {
                <div className={`${styles['card-img']}`}
                     style={{transform: `rotate(${rotationDegree}deg)`}}>
                    {props.cell.img.map((url, index) => (
                        <div key={index} className={`${styles[`card-img__id`]} ${statusGame===status.gameOver && !props.cell.connectedImgUrlIndex[index] && styles['card-img__id--brightness']}`}
                             style={{
                                 backgroundImage: `url(${url})`
                             }}>
                        </div>))
                    }
                </div>
            }
            {grid[props.cell.row][props.cell.col].unlimitedRotate === true ||
            (statusGame === status.rotateTile && countRotation !== 2) ?
                <>
                <span className={`${styles['btn-rotate']} ${styles['btn-rotate--left']}`}
                      onClick={() => rotateCounterClockWise(props.cell.row, props.cell.col)}>
                        <CounterClockWiseRotation/>
                    </span>
                    <span className={`${styles['btn-rotate']} ${styles['btn-rotate--right']}`}
                          onClick={() => rotateClockWise(props.cell.row, props.cell.col)}>
                        <ClockWiseRotation/>
                    </span>
                </> :
                null
            }
        </>
    )
}