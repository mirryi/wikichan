import React from "react";

import styles from "./Search.module.scss";

export interface SearchProps {
    placeholderText: string;
    callback: (searchValue: string) => void;
}

export const Search = (props: SearchProps): JSX.Element => (
    <div className={styles.searchWrapper}>
        <input
            type="text"
            placeholder={props.placeholderText}
            onChange={(e) => props.callback(e.target.value)}
        />
    </div>
);
