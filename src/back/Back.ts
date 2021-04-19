import { observable, autorun } from "mobx";

import { Provider } from "@providers";

import BackStorage, { InnerStorage, OptionsHandle } from "./BackStorage";
import Options from "./Settings";

class Back {
    storage: BackStorage;
    optionsStorageHandle: OptionsHandle;
    options: Options;

    providers: Provider[];

    constructor(innerStorage: InnerStorage) {
        this.storage = new BackStorage(innerStorage);
    }

    async load(): Promise<void> {
        // Load the options from storage.
        await this.loadOptions();

        // Initialize the providers from the stored options;
        this.providers = Object.entries(this.options.providers).reduce(
            (providers, [name, { enabled }]) => {
                if (enabled) {
                    // providers.push()
                }
                return providers;
            },
            [],
        );
    }

    async loadOptions(): Promise<void> {
        this.optionsStorageHandle = this.storage.optionsHandle();
        // TODO: proper key
        const settingsKey = "root";
        const loadedSettings = await this.optionsStorageHandle.get([settingsKey]);
        if (loadedSettings[settingsKey]) {
            this.options = loadedSettings[settingsKey];
        } else {
            this.options = Options.Default();
        }

        // When settings changes, persist to storage.
        this.options = observable(this.options);
        autorun(() => {
            this.optionsStorageHandle.set({ settingsKey: this.options });
        });
    }
}

export default Back;
