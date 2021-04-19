import React, { Component, ReactNode } from "react";

import { Item } from "@providers";

import ItemListComponent from "./ItemList";
import SearchComponent from "./Search";
import styles from "./Root.module.scss";

export interface RootProps {
    handleSearch: (query: string) => void;
}

export interface RootState {
    items: Item[];
}

class RootComponent extends Component<RootProps, RootState> {
    constructor(props: RootProps) {
        super(props);

        this.state = {
            items: [],
        };
    }

    render(): ReactNode {
        return (
            <div className={styles.wrapper}>
                <SearchComponent
                    placeholderText="Search"
                    callback={(query: string): void => this.props.handleSearch(query)}
                />

                <ItemListComponent items={this.state.items} />
            </div>
        );
    }
}

export default RootComponent;
