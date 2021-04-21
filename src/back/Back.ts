import { Provider } from "@providers";

import { BackStorage, InnerStorage } from "./BackStorage";
import { Exchange, InnerExchange } from "./Exchange";
import { OptionsManager } from "./OptionsManager";
import { QueryItemManager, InnerTunnel } from "./QueryItemManager";

export class Back {
    storage: BackStorage;
    optionsManager: OptionsManager;

    exchange: Exchange;

    queryItemManager: QueryItemManager;

    private constructor(
        storage: BackStorage,
        optionsManager: OptionsManager,
        exchange: Exchange,
        queryItemManager: QueryItemManager,
    ) {
        this.storage = storage;
        this.optionsManager = optionsManager;

        this.exchange = exchange;

        this.queryItemManager = queryItemManager;
    }

    static async load(
        platformStorage: InnerStorage,
        platformExchange: InnerExchange,
        platformTunnel: InnerTunnel,
    ): Promise<Back> {
        const storage = new BackStorage(platformStorage);

        // Load options manager.
        const optionsStorageHandle = storage.optionsHandle()!;
        const optionsManager = await OptionsManager.load(optionsStorageHandle);
        const options = optionsManager.options;

        // Initialize the providers from the stored options.
        // const providers = loadProviders(options.back.providers);
        const providers: Provider[] = [];

        // Load message exchange.
        const exchange = await Exchange.load(platformExchange, {
            getOptions: async () => options,
            changeOptions: async (im) => optionsManager.change(im.options),
        });

        // Initialize the query handler.
        const queryItemManager = await QueryItemManager.load(platformTunnel, providers);

        return new Back(storage, optionsManager, exchange, queryItemManager);
    }
}
