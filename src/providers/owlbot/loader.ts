import { Loader } from "..";
import { OwlBotItem, OwlBotProvider } from ".";

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
