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
    const provider = data.provider;

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
          <div className={styles.top}>
            <a
              className={styles.title}
              target="_blank"
              rel="noopener noreferrer"
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
          let nv = v;
          if (typeof nv === "string") {
            if (k.length + nv.length >= limit) {
              nv = nv.substring(0, limit - 2) + "...";
            }
          } else {
            nv = nv as string[];
            let tl = k.length;
            for (let i = 0; i < nv.length; i++) {
              tl += nv[i].length;
              if (tl > limit) {
                nv = nv.slice(0, i + 1);
                nv[i] = nv[i].substring(0, nv[i].length - tl + limit - 2) + "...";
                break;
              }
            }

            nv = nv.reduce((prev, cur) => prev + ", " + cur);
          }

          let title = "";
          if (typeof v === "string") {
            title = v;
          } else {
            const lv = v as string[];
            title = "\n : " + lv.reduce((prev, cur) => prev + "\n : " + cur);
          }

          return (
            <span key={"tag:" + k} title={k + ": " + title} className={styles.tag}>
              <span className={styles.tagname}>{k}</span>: {nv}
            </span>
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
