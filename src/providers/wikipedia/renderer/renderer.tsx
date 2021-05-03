import React from "react";
import { sanitize } from "dompurify";
import htmlReactParse from "html-react-parser";

import { Renderer } from "../..";
import { WikipediaItem } from "..";

export class WikipediaRenderer implements Renderer<WikipediaItem> {
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
