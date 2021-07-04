import React, { useState } from "react";

import { Item } from "@providers";

import styles from "./ItemDetails.module.scss";

export interface ItemProps {
    data: Item;
}

export const ItemDetails = (props: ItemProps): JSX.Element => {
    const [expanded, setExpanded] = useState(true);

    const data = props.data;

    const body = (
        <div className={styles.content} style={{ display: expanded ? "block" : "none" }}>
            <div className={styles.description}>
                <span>{data.description}</span>
            </div>
            <div>
                <div className={styles.longDescription}>
                    <span>{data.longDescription ?? "No summary available."}</span>
                </div>
            </div>

            <div>{renderURLs(data)}</div>
        </div>
    );

    return (
        <div>
            <div className={styles.header}>
                <div>
                    <span className={[styles.providerName, styles.bold].join(" ")}>
                        {data.meta.source.name}
                    </span>
                </div>
                <div className={styles.top}>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={data.urls ? data.urls[0] : ""}
                        className={styles.title}
                    >
                        {data.title}
                    </a>
                    <div>
                        <button
                            className={styles.minimizeButton}
                            onClick={(): void => setExpanded(!expanded)}
                        >
                            -
                        </button>
                        {renderTags(data)}
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
};

function renderTags(data: Item): JSX.Element[] | undefined {
    if (!data.tags) {
        return undefined;
    }

    return Object.entries(data.tags)
        .slice(0, 2)
        .map(([k, v]) => {
            const limit = 25;
            let label;
            if (typeof v === "string") {
                label = k + ": " + v;
                if (k.length + v.length >= limit) {
                    label = k;
                }
            } else {
                label = k + ": " + v.join("; ");
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

function renderURLs(data: Item): JSX.Element | undefined {
    const urls = data.urls;
    if (!urls || urls.length == 0) {
        return undefined;
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
