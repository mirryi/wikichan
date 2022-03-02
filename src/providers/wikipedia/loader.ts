import * as s from "superstruct";

import { Entries } from "@util";

import { Lang, WikipediaItem, WikipediaProvider, wikipedias } from ".";
import {
    ProviderLoader,
    ProviderLoaderConfig,
    ProviderOptions,
    ValidationSchema,
} from "..";

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
        ProviderLoader<WikipediaProviderOptions, WikipediaItem, WikipediaProvider<C>>
{
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

export namespace WikipediaProviderLoader {
    export const ALL = Entries.map<typeof wikipedias, WikipediaProviderLoaderConfigs>(
        wikipedias,
        ([code, wiki]) => {
            const key = `wiki.${code}` as const;
            const config: WikipediaProviderLoaderConfig<typeof wiki.code> = {
                getLoader: () => new WikipediaProviderLoader<typeof wiki.code>(wiki.code),
            };

            // TODO: Better way to type this?
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-return
            return [key, config as any];
        },
    );
}
