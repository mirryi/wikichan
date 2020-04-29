import * as React from "react";
import { Component, ReactNode } from "react";
import { Subscription, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Item, ProviderMerge } from "../provider";
import { ItemComponent } from "./item";
import styles from "./root.module.scss";
import { SearchComponent } from "./search";

export interface RootProps {
  providers: ProviderMerge;
}

export interface RootState {
  items: Item[];
  itemSubscription?: Subscription;
  unsubscribe: Subject<void>;
}

export class RootComponent extends Component<RootProps, RootState> {
  constructor(props: RootProps) {
    super(props);

    this.state = {
      items: [],
      unsubscribe: new Subject<void>(),
    };
  }

  componentWillUnmount(): void {
    this.setState((state) => {
      state.unsubscribe.next();
      state.unsubscribe.complete();
      return {};
    });
  }

  searchProviders(queries: string[]): void {
    this.setState({ items: [] }, () => {
      this.state.unsubscribe.next();
      this.state.unsubscribe.complete();

      const unsubscribe = new Subject<void>();

      const obs = this.props.providers
        .search(queries)
        .pipe(takeUntil(this.state.unsubscribe));

      const subscription = obs.subscribe((item) => {
        console.log(unsubscribe);
        this.setState((state) => ({ items: [...state.items, item] }));
      });

      this.setState(() => {
        return {
          itemSubscription: subscription,
          unsubscribe: unsubscribe,
        };
      });
    });
  }

  render(): ReactNode {
    const itemRenders = this.state.items.map((item) => {
      return <ItemComponent key={item.title} data={item} />;
    });

    return (
      <div className={styles.wrapper}>
        <SearchComponent
          placeholderText="Search"
          callback={(query: string): void => {
            this.searchProviders([query]);
          }}
        />

        <div className={styles.results}>{itemRenders}</div>
      </div>
    );
  }
}
