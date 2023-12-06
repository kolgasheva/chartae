import React from 'react';
import styles from "./Button.module.scss"

export default function Button(props) {
    return (
        <button className={`${styles.button} btn btn-secondary ${props.className && styles[props.className]}`}
                onClick={props.onClick ? props.onClick : null}>{props.title}
        </button>
    )
}