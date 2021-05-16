import * as s from "superstruct";

import {
    ProviderLoader,
    ProviderLoaderConfig,
    ProviderOptions,
    ValidationSchema,
} from "..";
import { OwlBotItem, OwlBotProvider } from ".";

export interface OwlBotOptions extends ProviderOptions {
    apiToken: string;
}

export namespace OwlBotOptions {
    export const Schema: ValidationSchema<OwlBotOptions> = s.assign(
        ProviderOptions.Schema,
        s.object({
            apiToken: s.defaulted(s.string(), ""),
        }),
    );
}

export class OwlBotProviderLoader
    implements ProviderLoader<OwlBotOptions, OwlBotItem, OwlBotProvider> {
    load(opts: OwlBotOptions): OwlBotProvider {
        return new OwlBotProvider(opts.apiToken);
    }

    optionsSchema(): ValidationSchema<OwlBotOptions> {
        return OwlBotOptions.Schema;
    }

    itemSchema(): ValidationSchema<OwlBotItem> {
        return OwlBotItem.Schema;
    }
}

type OwlBotLoaderConfig = ProviderLoaderConfig<OwlBotOptions, OwlBotItem, OwlBotProvider>;
export const ALL: { owlbot: OwlBotLoaderConfig } = {
    owlbot: {
        getLoader: () => new OwlBotProviderLoader(),
    },
};
