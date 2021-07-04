import { sanitize } from "dompurify";
import htmlReactParse from "html-react-parser";
import React from "react";
import * as s from "superstruct";

import { WikipediaItem } from "..";
import { Renderer, RendererOptions, ValidationSchema } from "../..";

export interface WikipediaRendererOptions {
    /**
     * Option dictating how the renderer handles disambiguations.
     *
     *   hide: Don't display disambiguation pages
     *   separate: Separate disambiguation pages into a separate section
     *   none: Display disambiguation pages normally
     *
     * *Unused for now*.
     */
    disambiguations: "hide" | "separate" | "none";
}

export namespace WikipediaRendererOptions {
    export const Schema: ValidationSchema<WikipediaRendererOptions> = s.assign(
        RendererOptions.Schema,
        s.object({
            disambiguations: s.defaulted(s.enums(["hide", "separate", "none"]), "none"),
        }),
    );
}

export class WikipediaRenderer implements Renderer<WikipediaItem> {
    constructor(private opts: WikipediaRendererOptions) {}

    longDescription(item: WikipediaItem): JSX.Element | undefined {
        const ld = item.longDescription;
        if (!ld) {
            return <></>;
        }

        const html = sanitize(ld);
        const components = htmlReactParse(html);
        return <>{components}</>;
    }
}
