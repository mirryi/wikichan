import { ReactNode } from "react";
import { sanitize } from "dompurify";
import htmlReactParse from "html-react-parser";

import { Renderer } from "../..";
import { WikipediaItem } from "..";

export class WikipediaRenderer implements Renderer<WikipediaItem> {
    longDescription(item: WikipediaItem): ReactNode {
        const ld = item.longDescription;
        if (!ld) {
            return null;
        }

        const html = sanitize(ld);
        const components = htmlReactParse(html);
        return components;
    }
}
