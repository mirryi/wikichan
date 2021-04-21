import { observable, autorun, IReactionDisposer } from "mobx";

import { Options } from "@shared/options";

import { OptionsHandle } from "./BackStorage";

const OPTIONS_KEY = "root";

export class OptionsManager {
    options: Options;

    private storageHandle: OptionsHandle;
    private autoSaveDispose: IReactionDisposer;

    private constructor(options: Options, storageHandle: OptionsHandle) {
        this.storageHandle = storageHandle;

        this.options = observable(options);
        this.autoSaveDispose = autorun(async () => await this.save());
    }

    close(): void {
        this.autoSaveDispose();
    }

    static async load(storageHandle: OptionsHandle): Promise<OptionsManager> {
        // TODO: less duplicate code
        const loaded = await storageHandle.get([OPTIONS_KEY]);
        const options = loaded[OPTIONS_KEY] || Options.Default();

        return new OptionsManager(options, storageHandle);
    }

    async load(): Promise<void> {
        const loaded = await this.storageHandle.get([OPTIONS_KEY]);
        this.options = loaded[OPTIONS_KEY] || Options.Default();
    }

    async save(): Promise<void> {
        await this.storageHandle.set({ [OPTIONS_KEY]: this.options });
    }
}
