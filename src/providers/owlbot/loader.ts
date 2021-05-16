import * as s from "superstruct";

import {
    ProviderLoader,
    ProviderLoaderConfig,
    ProviderOptions,
    ValidationSchema,
} from "..";
import { OwlBotItem, OwlBotProvider } from ".";

export interface OwlBotProviderOptions extends ProviderOptions {
    apiToken: string;
}

export namespace OwlBotProviderOptions {
    export const Schema: ValidationSchema<OwlBotProviderOptions> = s.assign(
        ProviderOptions.Schema,
        s.object({
            apiToken: s.defaulted(s.string(), ""),
        }),
    );
}

export class OwlBotProviderLoader
    implements ProviderLoader<OwlBotProviderOptions, OwlBotItem, OwlBotProvider> {
    load(opts: OwlBotProviderOptions): OwlBotProvider {
        return new OwlBotProvider(opts.apiToken);
    }

    optionsSchema(): ValidationSchema<OwlBotProviderOptions> {
        return OwlBotProviderOptions.Schema;
    }

    itemSchema(): ValidationSchema<OwlBotItem> {
        return OwlBotItem.Schema;
    }
}

type OwlBotProviderLoaderConfig = ProviderLoaderConfig<
    OwlBotProviderOptions,
    OwlBotItem,
    OwlBotProvider
>;
export const ALL: { owlbot: OwlBotProviderLoaderConfig } = {
    owlbot: {
        getLoader: () => new OwlBotProviderLoader(),
    },
};
