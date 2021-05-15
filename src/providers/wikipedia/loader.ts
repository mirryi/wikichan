import s from "superstruct";

import { Loader, LoaderConfig, ProviderOptions, ValidationSchema } from "..";
import { Lang, WikipediaItem, WikipediaProvider, wikipedias } from ".";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface WikipediaOptions extends ProviderOptions {}

export namespace WikipediaOptions {
    export const Schema: ValidationSchema<WikipediaOptions> = s.assign(
        ProviderOptions.Schema,
        s.defaulted(s.object({}), {}),
    );
}

export class WikipediaProviderLoader<C extends Lang>
    implements Loader<WikipediaOptions, WikipediaItem, WikipediaProvider<C>> {
    constructor(private langcode: C) {}

    load(_opts: WikipediaOptions): WikipediaProvider<C> {
        return new WikipediaProvider(this.langcode);
    }

    optionsSchema(): ValidationSchema<WikipediaOptions> {
        return WikipediaOptions.Schema;
    }

    itemSchema(): ValidationSchema<WikipediaItem> {
        return WikipediaItem.Schema;
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
