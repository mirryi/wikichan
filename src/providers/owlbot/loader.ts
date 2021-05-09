import { Loader } from "..";
import { OwlBotItem, OwlBotProvider } from ".";
import { LoaderConfig } from "@providers/loader";

export interface OwlBotOptions {
    apiToken: string;
}

export class OwlBotProviderLoader
    implements Loader<OwlBotOptions, OwlBotItem, OwlBotProvider> {
    load(opts: OwlBotOptions): OwlBotProvider {
        return new OwlBotProvider(opts.apiToken);
    }

    reload(opts: OwlBotOptions, _provider: OwlBotProvider): OwlBotProvider {
        return new OwlBotProvider(opts.apiToken);
    }

    defaultOptions(): OwlBotOptions {
        return { apiToken: "" };
    }

    // TODO: Implementation needed.
    cachedValidator(): (x: unknown) => x is OwlBotItem {
        return (x: unknown): x is OwlBotItem => {
            return x !== undefined && x !== null && typeof x === "object";
        };
    }
}

type OwlBotLoaderConfig = LoaderConfig<OwlBotOptions, OwlBotItem, OwlBotProvider>;
export const ALL: { owlbot: OwlBotLoaderConfig } = {
    owlbot: {
        getLoader: () => new OwlBotProviderLoader(),
    },
};
