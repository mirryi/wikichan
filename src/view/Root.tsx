import React from "react";

import { Item } from "@providers";

import { ItemDetails } from "./ItemDetails";
import styles from "./Root.module.scss";
import { Search } from "./Search";

export interface RootProps {
    items: Item[];
    handleSearch: (query: string) => void;
}

export const Root = (props: RootProps): JSX.Element => (
    <div className={styles.wrapper}>
        <Search
            placeholderText="Search"
            callback={(query: string): void => props.handleSearch(query)}
        />

        <div>
            {props.items.map((item) => (
                <ItemDetails
                    key={`${item.meta.source.uid}::${item.meta.uid}`}
                    data={item}
                />
            ))}
        </div>
    </div>
);
