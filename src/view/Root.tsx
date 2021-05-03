import React from "react";

import { Item } from "@providers";

import { Search } from "./Search";
import styles from "./Root.module.scss";
import { ItemDetails } from "./ItemDetails";

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
