import { WikipediaItem } from "..";
import { RendererLoader, RendererLoaderConfig, ValidationSchema } from "../..";
import { WikipediaRenderer, WikipediaRendererOptions } from "./renderer";

export * from "./renderer";

export class WikipediaRendererLoader
    implements
        RendererLoader<WikipediaRendererOptions, WikipediaItem, WikipediaRenderer> {
    load(opts: WikipediaRendererOptions): WikipediaRenderer {
        return new WikipediaRenderer(opts);
    }

    optionsSchema(): ValidationSchema<WikipediaRendererOptions> {
        return WikipediaRendererOptions.Schema;
    }
}

type WikipediaRendererLoaderConfig = RendererLoaderConfig<
    WikipediaRendererOptions,
    WikipediaItem,
    WikipediaRenderer
>;

export namespace WikipediaRendererLoader {
    export const ALL: { wiki: WikipediaRendererLoaderConfig } = {
        wiki: { getLoader: () => new WikipediaRendererLoader() },
    };
}
