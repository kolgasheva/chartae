import React from 'react';
import {useSelector} from "react-redux";
import styles from './Board.module.scss'
import Cell from '../Cell'

export default function Board () {

    const grid = useSelector(state => state.boardReducer.grid);

    return (
        <div className={styles['board']}>
            {
                grid.map((gridRow) => (
                    gridRow.map(cell => (
                        <Cell key={`${cell.row}-${cell.col}`} cell={cell}/>
                    ))
                ))
            }
        </div>
    )
}