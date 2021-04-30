import { Loader, LoaderConfig } from "..";
import { Lang, WikipediaItem, WikipediaProvider, wikipedias } from ".";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface WikipediaOptions {}

export class WikipediaProviderLoader<C extends Lang>
    implements Loader<WikipediaOptions, WikipediaItem, WikipediaProvider<C>> {
    constructor(private langcode: C) {}

    async load(_opts: WikipediaOptions): Promise<WikipediaProvider<C>> {
        return new WikipediaProvider(this.langcode);
    }

    async reload(
        _opts: WikipediaOptions,
        provider: WikipediaProvider<C>,
    ): Promise<WikipediaProvider<C>> {
        return provider;
    }
}

type WikipediaLoaderConfig<C extends Lang> = LoaderConfig<
    WikipediaOptions,
    WikipediaItem,
    WikipediaProvider<C>
>;
export type WikipediaLoaderConfigs = {
    [C in Lang as `wiki::${C}`]: WikipediaLoaderConfig<C>;
};

export const ALL = ((): WikipediaLoaderConfigs => {
    const pairs = Object.values(wikipedias).map((wiki) => {
        const key = `wiki::${wiki.code}` as const;
        const config: WikipediaLoaderConfig<typeof wiki.code> = {
            getLoader: () => new WikipediaProviderLoader<typeof wiki.code>(wiki.code),
            defaultOptions: () => ({}),
        };
        return [key, config] as const;
    });

    // Safety: Above mapping maps to correct pairs.
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return Object.fromEntries(pairs) as WikipediaLoaderConfigs;
})();
