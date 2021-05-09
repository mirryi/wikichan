import { Loader, LoaderConfig } from "..";
import { Lang, WikipediaItem, WikipediaProvider, wikipedias } from ".";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface WikipediaOptions {}

export class WikipediaProviderLoader<C extends Lang>
    implements Loader<WikipediaOptions, WikipediaItem, WikipediaProvider<C>> {
    constructor(private langcode: C) {}

    load(_opts: WikipediaOptions): WikipediaProvider<C> {
        return new WikipediaProvider(this.langcode);
    }

    reload(
        _opts: WikipediaOptions,
        provider: WikipediaProvider<C>,
    ): WikipediaProvider<C> {
        return provider;
    }

    defaultOptions(): WikipediaOptions {
        return {};
    }

    // TODO: Implementation needed.
    cachedValidator(): (x: unknown) => x is WikipediaItem {
        return (x: unknown): x is WikipediaItem => {
            return x !== undefined && x !== null && typeof x === "object";
        };
    }
}

type WikipediaLoaderConfig<C extends Lang> = LoaderConfig<
    WikipediaOptions,
    WikipediaItem,
    WikipediaProvider<C>
>;
export type WikipediaLoaderConfigs = {
    [C in Lang as `wiki.${C}`]: WikipediaLoaderConfig<C>;
};

export const ALL = ((): WikipediaLoaderConfigs => {
    const pairs = Object.entries(wikipedias).map(([code, wiki]) => {
        const key = `wiki.${code}`;
        const config: WikipediaLoaderConfig<typeof wiki.code> = {
            getLoader: () => new WikipediaProviderLoader<typeof wiki.code>(wiki.code),
        };
        return [key, config] as const;
    });

    // Safety: Above mapping maps to correct pairs.
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return Object.fromEntries(pairs) as WikipediaLoaderConfigs;
})();
