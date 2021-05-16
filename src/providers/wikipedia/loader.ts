import * as s from "superstruct";

import {
    ProviderLoader,
    ProviderLoaderConfig,
    ProviderOptions,
    ValidationSchema,
} from "..";
import { Lang, WikipediaItem, WikipediaProvider, wikipedias } from ".";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface WikipediaProviderOptions extends ProviderOptions {}

export namespace WikipediaProviderOptions {
    export const Schema: ValidationSchema<WikipediaProviderOptions> = s.assign(
        ProviderOptions.Schema,
        s.defaulted(s.object({}), {}),
    );
}

export class WikipediaProviderLoader<C extends Lang>
    implements
        ProviderLoader<WikipediaProviderOptions, WikipediaItem, WikipediaProvider<C>> {
    constructor(private langcode: C) {}

    load(_opts: WikipediaProviderOptions): WikipediaProvider<C> {
        return new WikipediaProvider(this.langcode);
    }

    optionsSchema(): ValidationSchema<WikipediaProviderOptions> {
        return WikipediaProviderOptions.Schema;
    }

    itemSchema(): ValidationSchema<WikipediaItem> {
        return WikipediaItem.Schema;
    }
}

type WikipediaProviderLoaderConfig<C extends Lang> = ProviderLoaderConfig<
    WikipediaProviderOptions,
    WikipediaItem,
    WikipediaProvider<C>
>;
export type WikipediaProviderLoaderConfigs = {
    [C in Lang as `wiki.${C}`]: WikipediaProviderLoaderConfig<C>;
};

export const ALL = ((): WikipediaProviderLoaderConfigs => {
    const pairs = Object.entries(wikipedias).map(([code, wiki]) => {
        const key = `wiki.${code}`;
        const config: WikipediaProviderLoaderConfig<typeof wiki.code> = {
            getLoader: () => new WikipediaProviderLoader<typeof wiki.code>(wiki.code),
        };
        return [key, config] as const;
    });

    // Safety: Above mapping maps to correct pairs.
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return Object.fromEntries(pairs) as WikipediaProviderLoaderConfigs;
})();
