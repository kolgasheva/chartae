import {useContext, useState} from "react";
import {NavLink} from 'react-router-dom';
import {languagesContext} from '../context'
import Button from "../components/Button";
import IconLanguages from "../components/IconLanguages";
import Modal from "../components/Modal"
import styles from "./HomePage.module.scss";
import languagesJSON from "../languages.json"

export default function HomePage () {
    const [visibilityModal, setVisibilityModal] = useState(false)

    const toggleVisibilityModal = () => {
        setVisibilityModal(prevState => !prevState)
    }


    const {language} = useContext(languagesContext);
    let selectedLanguage = language === 'ukr' ? languagesJSON[0].ukr[0] :  languagesJSON[1].eng[0];

    return (
        <div className={styles['home-container']}>
            <NavLink to="/chartae/game"><Button title={selectedLanguage.btnTitleForPlay}/></NavLink>
            <Button title={selectedLanguage.btnTitleForRules} onClick={toggleVisibilityModal}/>
            <IconLanguages />
            {visibilityModal && <Modal toggleVisibilityModal={toggleVisibilityModal}></Modal>}
        </div>
    )
}