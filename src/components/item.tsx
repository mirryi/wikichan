import React, { Component, ReactNode } from "react";
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";

import { Item } from "@providers";

import styles from "./item.module.scss";

export interface ItemProps {
  data: Item;
}

class ItemComponent extends Component<ItemProps> {
  render(): ReactNode {
    const data = this.props.data;
    const provider = data.provider;

    if (provider.renderf) {
      return provider.renderf(data);
    }

    const longDescription = provider.renderLongDescription ? (
      provider.renderLongDescription(data)
    ) : (
      <div className={styles.longDescription}>
        <span>
          {data.longDescription ? data.longDescription : "No summary available."}
        </span>
      </div>
    );

    const tagsRender = this.renderTags();
    const urlsRender = this.renderURLs();

    return (
      <div>
        <div className={styles.header}>
          <div>
            <span className={[styles.providerName, styles.bold].join(" ")}>
              {provider.name()}
            </span>
          </div>
          <div className={styles.top}>
            <Tooltip
              html={
                <span className={styles.tooltip}>
                  Go to {`'${data.title}'`} @ {provider.name()}
                </span>
              }
              theme="light"
              position="right"
              arrow={true}
              animateFill={false}
              stickyDuration={false}
              duration={0}
            >
              <a
                className={styles.title}
                target="_blank"
                rel="noopener noreferrer"
                href={data.urls ? data.urls[0].toString() : ""}
              >
                {data.title}
              </a>
            </Tooltip>
            <div>{tagsRender}</div>
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
          <div>{longDescription}</div>

          {urlsRender}
        </div>
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

          let title;
          if (typeof v === "string") {
            title = [v];
          } else {
            title = v as string[];
          }
          const list = title.map((v) => <li key={v}>{v}</li>);

          return (
            <Tooltip
              key={"tag:" + k}
              html={
                <div className={styles.tooltip}>
                  <ul className={styles.tagList}>{list}</ul>
                </div>
              }
              theme="light"
              position="bottom"
              arrow={true}
              animateFill={false}
              stickyDuration={false}
              duration={0}
            >
              <span className={styles.tag}>
                <span className={styles.bold}>{label}</span>
              </span>
            </Tooltip>
          );
        });
  }

  renderURLs(): ReactNode {
    const data = this.props.data;
    return !data.urls ? null : (
      <div>
        <details className={styles.extra}>
          <summary className={styles.extraSummary}>external links</summary>
          <ul className={styles.list}>
            {data.urls
              ? [...data.urls.slice(1)].map((url) => (
                  <li
                    key={"url:" + url.toString()}
                    className={[styles.listItem, styles.link].join(" ")}
                  >
                    <a
                      target="_blank"
                      href={url.toString()}
                      rel="noopener noreferrer"
                      title={url.toString()}
                    >
                      {url.toString()}
                    </a>
                  </li>
                ))
              : null}
          </ul>
        </details>
      </div>
    );
  }
}

export default ItemComponent;
