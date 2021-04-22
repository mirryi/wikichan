import { Provider } from "@providers";
import { debug, info } from "@util/logging";

import { BackStorage, InnerStorage } from "./BackStorage";
import { Exchange, InnerExchange } from "./Exchange";
import { OptionsManager } from "./OptionsManager";
import { QueryItemManager, InnerTunnel } from "./QueryItemManager";

export { InnerStorage, InnerExchange, InnerTunnel };

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
        info("Initializing...");
        const storage = new BackStorage(platformStorage);

        // Load options manager.
        //
        // Safety: TODO: error handling; should be theoretically fine
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const optionsStorageHandle = storage.optionsHandle()!;
        debug("Loading options from local storage...");
        const optionsManager = await OptionsManager.load(optionsStorageHandle);
        const options = optionsManager.options;

        // Initialize the providers from the stored options.
        // const providers = loadProviders(options.back.providers);
        const providers: Provider[] = [];

        // Load message exchange.
        debug("Connecting messgage exchange...");
        const exchange = await Exchange.load(platformExchange, {
            getOptions: async () => options,
            changeOptions: async (im) => optionsManager.change(im.options),
        });

        // Initialize the query handler.
        debug("Connecting tunnel...");
        const queryItemManager = await QueryItemManager.load(platformTunnel, providers);

        const back = new Back(storage, optionsManager, exchange, queryItemManager);
        info("Finished initializing!");
        return back;
    }
}
