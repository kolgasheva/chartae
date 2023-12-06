import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import styles from './Cell.module.scss'
import Card from "../Card";
import {status} from "../../store/reducers/gameReducer";
import {changeGameStatus} from "../../store/reducers/gameReducer";
import {addCard, updateUsedCard} from '../../store/reducers/boardReducer'
import PlusIcon from "../PlusIcon"

export default function Cell (props) {

    const grid = useSelector(state => state.boardReducer.grid);
    const statusGame = useSelector(state => state.gameReducer.statusGame);
    const cards = useSelector(state => state.boardReducer.cards);
    const usedCards = useSelector(state => state.boardReducer.usedCards);

    const dispatch = useDispatch();

    function addCardToCell(row, col) {
        let card
        if(statusGame === status.start) {
            card = cards[usedCards.length]
            dispatch(updateUsedCard(card))
        } else {
            card = usedCards[usedCards.length - 1]
        }
        const newGrid = grid.map(rows => {
            return rows.map(cell => {
                if (cell.row === row && cell.col === col) {
                    return {
                        ...cell,
                        isEmpty: false,
                        sides: card.sides,
                        img: card.img,
                        isSpaced: false,
                        unlimitedRotate: true,
                        isMain: card.isMain,
                        waterGraph: card.waterGraph,
                        earthGraph: card.earthGraph,
                        imgIndex: card.imgIndex,
                    }
                } else return cell;
            })
        })
        const updatedNewGrid = getNeighbours(row, col, newGrid)
        dispatch(addCard(updatedNewGrid))
        dispatch(changeGameStatus(status.newCard))
    }

    const checkIndexNeighbour = (index) => {
        return index >= 0 && index < 3
    }

    const getNeighbours = (row, col, newGrid) => {
        const neighbours = []

        if (checkIndexNeighbour(col + 1)) {
            neighbours.push(grid[row][col + 1])
        }
        if (checkIndexNeighbour(col - 1)) {
            neighbours.push(grid[row][col - 1])
        }
        if (checkIndexNeighbour(row + 1)) {
            neighbours.push(grid[row + 1][col])
        }
        if (checkIndexNeighbour(row - 1)) {
            neighbours.push(grid[row - 1][col])
        }

        const updateNewGrid = []

        for (const row of newGrid) {
            const newRow = []

            for (const cell of row) {
                const newCell = { ...cell }

                for (const neighbour of neighbours) {
                    if (newCell.row === neighbour.row && newCell.col === neighbour.col) {
                        if(newCell.isSpaced === false && newCell.isEmpty === true) {
                            newCell.isSpaced = true
                        }
                    }
                }
                newRow.push(newCell)
            }
            updateNewGrid.push(newRow)
        }
        return updateNewGrid
    }

    return (
        <div
            onClick={statusGame === status.start || (statusGame === status.placeTile &&  grid[props.cell.row][props.cell.col].isSpaced) === true ? () => addCardToCell(props.cell.row, props.cell.col) : null}
            className={`${styles['cell']} ${statusGame === status.start || (statusGame === status.placeTile &&  grid[props.cell.row][props.cell.col].isSpaced === true ) ? styles['cell__neighbour'] : ''}`}
            data-row={props.cell.row}
            data-col={props.cell.col}
        >
            <div className={styles['cell-content']}>
            {statusGame === status.start ||( statusGame === status.placeTile &&  grid[props.cell.row][props.cell.col].isSpaced === true) ? <span><PlusIcon/></span> : null}
            {grid[props.cell.row][props.cell.col].isEmpty === false && <Card cell={props.cell}/>}
            </div>
        </div>
    )
}