import React, {useContext, useEffect} from "react";
import styles from "./GamePage.module.scss";
import {NavLink} from "react-router-dom";
import Board from "../components/Board";
import GameBox from "../components/GameBox";
import Button from "../components/Button";
import {languagesContext} from "../context";
import languagesJSON from "../languages.json";
import {
    resetCountRotation, resetCurrentPlayer, resetStatusGame, resetTurn, resetPlayersPoints
} from "../store/reducers/gameReducer";
import {
    resetUsedCards, resetGrid, resetCards, updateGrid, createBoard
} from "../store/reducers/boardReducer";
import {useDispatch} from "react-redux";
import createGrid from "../store/createGrid";


export default function GamePages() {
    const dispatch = useDispatch();
    const {language} = useContext(languagesContext);

    let selectedLanguage = language === 'ukr' ? languagesJSON[0].ukr[0] : languagesJSON[1].eng[0];

    function resetGame() {
        dispatch(resetStatusGame())
        dispatch(resetCountRotation())
        dispatch(resetCurrentPlayer())
        dispatch(resetGrid())
        dispatch(resetUsedCards())
        dispatch(resetCards())
        dispatch(resetTurn())
        dispatch(resetPlayersPoints())
    }

    useEffect(() => {
        function getCard() {
            dispatch(createBoard())
        }

        const newGrid = createGrid();

        dispatch(updateGrid(newGrid))
        getCard()
    }, [dispatch])


    return (
        <div className={styles['game-wrapper']}>
            <div className={styles['game-container']}>
                <Board/>
                <GameBox resetGame={resetGame}/>
            </div>
            <NavLink className={styles['btn--position']} to='/chartae/'>
                <Button
                    className={'btn--position'}
                    title={selectedLanguage.homePage}
                    onClick={resetGame}
                />
            </NavLink>
        </div>
    )
}