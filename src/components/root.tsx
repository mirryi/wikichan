import * as React from "react";
import { Component, ReactNode } from "react";
import { Item, ProviderMerge } from "../provider";
import { ItemComponent } from "./item";
import * as styles from "./root.scss";
import { SearchComponent } from "./search";

export interface RootProps {
  providers: ProviderMerge;
}

export interface RootState {
  items: Item[];
}

export class RootComponent extends Component<RootProps, RootState> {
  constructor(props: RootProps) {
    super(props);

    this.state = {
      items: [],
    };
  }

  searchProviders(query: string): void {
    this.setState({ items: [] });
    const obs = this.props.providers.search(query);
    obs.subscribe((item) => {
      this.setState({ items: [...this.state.items, item] });
    });
  }

  render(): ReactNode {
    const itemRenders = this.state.items.map((item) => <ItemComponent data={item} />);

    return (
      <div>
        <SearchComponent
          placeholderText="Search"
          callback={this.searchProviders.bind(this)}
        />

        <div className={styles.results}>{itemRenders}</div>
      </div>
    );
  }
}
