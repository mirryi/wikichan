import React from "react";
import { sanitize } from "dompurify";
import htmlReactParse from "html-react-parser";

import { Renderer } from "../..";
import { OwlBotItem } from "..";
import styles from "./Renderer.module.scss";

export class OwlBotRenderer implements Renderer<OwlBotItem> {
    longDescription(item: OwlBotItem): JSX.Element | undefined {
        const elements = item.definitions.map((def) => {
            const definition = this.renderRawHTML(def.definition);
            const emoji = def.emoji ? this.renderRawHTML(def.emoji) : null;
            const example = def.example ? this.renderRawHTML(def.example) : null;
            return (
                <div key={item.title + def.definition} className={styles.definition}>
                    <div>
                        <em>{def.type}</em>: {definition} {emoji}
                    </div>
                    <div className={styles.example}>{example}</div>
                </div>
            );
        });
        return <>{elements}</>;
    }

    private renderRawHTML(raw: string): JSX.Element | JSX.Element[] {
        const html = sanitize(raw);
        const components = htmlReactParse(html);
        return components;
    }
}
