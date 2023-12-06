import React, {useContext} from 'react';
import styles from './IconLanguages.module.scss'
import {languagesContext} from '../../context'

export default function IconLanguages() {

    const {language, setLanguage} = useContext(languagesContext)

    const changeLanguages = () => {
        language === 'ukr' ? setLanguage('eng') : setLanguage('ukr');
    }

    return (
        <span onClick={changeLanguages}
              className={styles['btn-languages'] + ' ' + (language === 'ukr' ? styles['btn-languages--ukr'] : styles['btn-languages--eng'])}>
        </span>
    )
}