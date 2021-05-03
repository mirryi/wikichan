import { Loader } from "..";
import { OwlBotItem, OwlBotProvider } from ".";
import { LoaderConfig } from "@providers/loader";

export interface OwlBotOptions {
    apiToken: string;
}

export class OwlBotProviderLoader
    implements Loader<OwlBotOptions, OwlBotItem, OwlBotProvider> {
    async load(opts: OwlBotOptions): Promise<OwlBotProvider> {
        return new OwlBotProvider(opts.apiToken);
    }

    async reload(
        opts: OwlBotOptions,
        _provider: OwlBotProvider,
    ): Promise<OwlBotProvider> {
        return new OwlBotProvider(opts.apiToken);
    }
}

type OwlBotLoaderConfig = LoaderConfig<OwlBotOptions, OwlBotItem, OwlBotProvider>;
export const ALL: { owlbot: OwlBotLoaderConfig } = {
    owlbot: {
        getLoader: () => new OwlBotProviderLoader(),
        defaultOptions: () => ({
            apiToken: "",
        }),
    },
};
