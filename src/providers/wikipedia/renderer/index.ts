export * from "./renderer";

import { RendererLoader } from "../..";
import { WikipediaItem } from "..";
import { WikipediaRenderer, WikipediaRendererOptions } from "./renderer";
import { Describe } from "superstruct";

export class WikipediaRendererLoader
    implements
        RendererLoader<WikipediaRendererOptions, WikipediaItem, WikipediaRenderer> {
    load(opts: WikipediaRendererOptions): WikipediaRenderer {
        return new WikipediaRenderer(opts);
    }

    optionsSchema(): Describe<WikipediaRendererOptions> {
        return WikipediaRendererOptions.Schema;
    }
}
