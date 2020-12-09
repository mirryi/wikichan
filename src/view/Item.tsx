import React, { Component, ReactNode } from "react";

import { Item } from "@providers";

import styles from "./Item.module.scss";

export interface ItemProps {
  data: Item;
}

export interface ItemState {
  expanded: boolean;
}

class ItemComponent extends Component<ItemProps, ItemState> {
  constructor(props: ItemProps) {
    super(props);
    this.state = { expanded: true };
  }

  private toggleExpanded(): void {
    this.setState((state) => {
      return {
        expanded: !state.expanded,
      };
    });
  }

  render(): ReactNode {
    const data = this.props.data;
    const provider = data.provider;

    if (provider.renderf) {
      return provider.renderf(data);
    }

    const tagsRender = this.renderTags();

    let body: ReactNode = undefined;
    if (this.state.expanded) {
      const longDescription = provider.renderLongDescription ? (
        provider.renderLongDescription(data)
      ) : (
        <div className={styles.longDescription}>
          <span>
            {data.longDescription ? data.longDescription : "No summary available."}
          </span>
        </div>
      );

      const urlsRender = this.renderURLs();

      body = (
        <div className={styles.content}>
          <div className={styles.description}>
            <span>{data.description}</span>
          </div>
          <div>{longDescription}</div>

          <div>{urlsRender}</div>
        </div>
      );
    }

    return (
      <div>
        <div className={styles.header}>
          <div>
            <span className={[styles.providerName, styles.bold].join(" ")}>
              {provider.name()}
            </span>
          </div>
          <div className={styles.top}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={data.urls ? data.urls[0].toString() : ""}
              className={styles.title}
            >
              {data.title}
            </a>
            <div>
              <button
                className={styles.minimizeButton}
                onClick={(): void => this.toggleExpanded()}
              >
                -
              </button>
              {tagsRender}
            </div>
          </div>
          <span>
            <span>result of: </span>
            <span className={styles.searchTerm}>{data.searchTerm}</span>
          </span>
        </div>
        {body}
      </div>
    );
  }

  renderTags(): ReactNode {
    const data = this.props.data;

    return !data.tags
      ? null
      : [...data.tags].slice(0, 2).map(([k, v]) => {
          const limit = 25;
          let label;
          if (typeof v === "string") {
            label = k + ": " + v;
            if (k.length + v.length >= limit) {
              label = k;
            }
          } else {
            label = k + ": " + (v as string[]).join("; ");
            if (label.length >= limit) {
              label = k;
            }
          }

          // let title;
          // if (typeof v === "string") {
          // title = [v];
          // } else {
          // title = v as string[];
          // }
          // const list = title.map((v) => <li key={v}>{v}</li>);

          return (
            <span key={label} className={styles.tag}>
              <span className={styles.bold}>{label}</span>
            </span>
          );
        });
  }

  renderURLs(): ReactNode {
    const urls = this.props.data.urls;
    if (!urls || urls.length == 0) {
      return null;
    }

    const links = urls.map((url) => (
      <li
        key={"url:" + url.toString()}
        className={[styles.listItem, styles.link].join(" ")}
      >
        <a target="_blank" href={url} rel="noopener noreferrer" title={url}>
          {url}
        </a>
      </li>
    ));
    return (
      <>
        <details className={styles.extra}>
          <summary className={styles.extraSummary}>external links</summary>
          <ul className={styles.list}>{links}</ul>
        </details>
      </>
    );
  }
}

export default ItemComponent;
