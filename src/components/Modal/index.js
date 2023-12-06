import styles from "./Modal.module.scss";
import {useContext} from "react";
import {languagesContext} from "../../context";
import languagesJSON from "../../languages.json";
import Button from "../Button";

export default function Modal(props) {
    const {language} = useContext(languagesContext);
    let selectedLanguage = language === 'ukr' ? languagesJSON[0].ukr[0] : languagesJSON[1].eng[0];

    return (
        <div className={styles['modal-overlay']}
             onClick={props.toggleVisibilityModal}>
            <div className={styles['modal-wrapper']}
                 onClick={(e) => {
                     e.stopPropagation()
                 }}>
                <div className={styles['modal-container']}>
                    <h2 className={styles['modal-title']}>
                        {selectedLanguage.gameTitle}
                    </h2>
                    <p className={styles['modal-text']}>
                        {selectedLanguage.gameText}
                    </p>
                    <h2 className={styles['modal-title']}>
                        {selectedLanguage.introduction}</h2>
                    <p className={styles['modal-text']}>
                        {selectedLanguage.introductionText}
                    </p>
                    <h2 className={styles['modal-title']}>
                        {selectedLanguage.setup}
                    </h2>
                    <p className={`${styles['modal-text']} ${styles['modal-text--margin']}`}>
                        {selectedLanguage.setupText}
                    </p>
                    <p className={styles['modal-text']}>
                        {selectedLanguage.setupTextSecond}
                    </p>
                    <h2 className={styles['modal-title']}>
                        {selectedLanguage.theGame}
                    </h2>
                    <p className={`${styles['modal-text']} ${styles['modal-text--margin']}`}>
                        {selectedLanguage.theGameText}
                    </p>
                    <p className={`${styles['modal-text']} ${styles['modal-text--italic']}`}>
                        {selectedLanguage.rotation}
                    </p>
                    <p className={`${styles['modal-text']} ${styles['modal-text--margin']}`}>
                        {selectedLanguage.rotationText}
                    </p>
                    <p className={`${styles['modal-text']} ${styles['modal-text--margin']}`}>
                        {selectedLanguage.rotationTextNote}
                    </p>
                    <p className={`${styles['modal-text']} ${styles['modal-text--italic']}`}>
                        {selectedLanguage.placement}
                    </p>
                    <p className={`${styles['modal-text']} ${styles['modal-text--margin']}`}>
                        {selectedLanguage.placementText}
                    </p>
                    <p className={styles['modal-text']}>
                        {selectedLanguage.placementTextNote}
                    </p>
                    <h2 className={styles['modal-title']}>
                        {selectedLanguage.scoring}
                    </h2>
                    <p className={`${styles['modal-text']} ${styles['modal-text--margin']}`}>
                        {selectedLanguage.scoringText}
                    </p>
                    <p className={styles['modal-text']}>
                        {selectedLanguage.scoringTextSecond}
                    </p>
                    <div className={styles['modal-container__img']}>
                        <img className={styles['modal-img']}
                             alt="Example calc points"
                             src={`${process.env.PUBLIC_URL}/img/card/boardExample.jpg`}/>
                    </div>
                </div>
                <Button onClick={props.toggleVisibilityModal}
                        title={selectedLanguage.btnTitleClose}
                        className='btn--action'>
                </Button>
            </div>
        </div>

    )
}