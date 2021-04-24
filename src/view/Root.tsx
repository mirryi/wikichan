import React from "react";

import { Item } from "@providers";

import { ItemList } from "./ItemList";
import { Search } from "./Search";
import styles from "./Root.module.scss";

export interface RootProps {
    items: Item[];
    handleSearch: (query: string) => void;
}

export const Root = (props: RootProps): JSX.Element => {
    return (
        <div className={styles.wrapper}>
            <Search
                placeholderText="Search"
                callback={(query: string): void => props.handleSearch(query)}
            />

            <ItemList items={props.items} />
        </div>
    );
};
