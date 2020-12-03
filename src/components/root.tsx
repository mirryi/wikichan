import { default as React, Component, ReactNode } from "react";
import { Subscription, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { Item, ProviderMerge } from "@providers";

import { ItemComponent } from "./item";
import { SearchComponent } from "./search";
import styles from "./root.module.scss";

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
    queries = [...new Set(queries.map((q) => q.trim()))].filter((q) => q !== "");
    if (queries.length === 0) {
      return;
    }
    this.setState(
      (state) => {
        state.unsubscribe.next();
        state.unsubscribe.complete();

        return { items: [] };
      },
      () => {
        const unsubscribe = new Subject<void>();

        const obs = this.props.providers.search(queries).pipe(takeUntil(unsubscribe));

        const subscription = obs.subscribe((item) => {
          this.setState((state) => ({ items: [...state.items, item] }));
        });

        this.setState(() => {
          return {
            itemSubscription: subscription,
            unsubscribe: unsubscribe,
          };
        });
      },
    );
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

        <div>{itemRenders}</div>
      </div>
    );
  }
}
