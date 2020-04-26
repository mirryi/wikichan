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

    const tagsRender = data.tags
      ? [...data.tags].map(([k, v]) => (
          <span className={styles.tag}>
            {k}: {v}
          </span>
        ))
      : null;

    const urlsRender =
      data.urls !== undefined ? (
        <details className={styles.extra}>
          <summary className={styles.extraSummary}>external links</summary>
          <ul className={styles.list}>
            {data.urls
              ? [...data.urls.slice(1)].map((url) => (
                  <li className={[styles.listItem, styles.link].join(" ")}>
                    <a target="_blank" href={url.toString()} title={url.toString()}>
                      {url.toString()}
                    </a>
                  </li>
                ))
              : null}
          </ul>
        </details>
      ) : null;

    return (
      <div>
        <div className={styles.header}>
          <div className={styles.top}>
            <a
              className={styles.title}
              target="_blank"
              href={data.urls ? data.urls[0].toString() : ""}
            >
              {data.title}
            </a>
            <div className={styles.tags}>{tagsRender}</div>
          </div>
          <span>
            <span>result of: </span>
            <span className={styles.searchTerm}>{data.searchTerm}</span>
          </span>
        </div>

        <div className={styles.content}>
          <div className={styles.description}>
            <span>{data.description}</span>
          </div>
          <div className={styles.longDescription}>
            <span>
              {data.longDescription ? data.longDescription : "No summary available."}
            </span>
          </div>

          <div className={styles.extras}>{urlsRender}</div>
        </div>
      </div>
    );
  }
}
