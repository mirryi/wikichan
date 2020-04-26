import * as React from "react";
import { Component, ReactNode } from "react";
import { Item } from "../provider";
import styles from "./item.scss";

export interface ItemProps {
  data: Item;
}

export class ItemComponent extends Component<ItemProps> {
  render(): ReactNode {
    const data = this.props.data;

    return (
      <div className={styles.item}>
        <div className={styles.header}>
          <div className={styles.top}>
            <a className={styles.title} target="_blank" href={data.urls[0].toString()}>
              {data.title}
            </a>
          </div>
        </div>
      </div>
    );
  }
}
