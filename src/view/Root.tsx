import React, { Component, ReactNode } from "react";

import { Item } from "@providers";

import { ItemList } from "./ItemList";
import { Search } from "./Search";
import styles from "./Root.module.scss";

export interface RootProps {
    handleSearch: (query: string) => void;
}

export interface RootState {
    items: Item[];
}

export class Root extends Component<RootProps, RootState> {
    constructor(props: RootProps) {
        super(props);

        this.state = {
            items: [],
        };
    }

    render(): ReactNode {
        return (
            <div className={styles.wrapper}>
                <Search
                    placeholderText="Search"
                    callback={(query: string): void => this.props.handleSearch(query)}
                />

                <ItemList items={this.state.items} />
            </div>
        );
    }
}
