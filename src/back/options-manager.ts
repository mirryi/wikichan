import { observable, autorun } from "mobx";

import { Options } from "@shared/options";
import { DeepPartial } from "@util";
import { deepmerge } from "@util/deepmerge";

import { OptionsHandle } from "./back-storage";

const OPTIONS_KEY = "root";

export class OptionsManager {
    options: Options;

    private storageHandle: OptionsHandle;

    private constructor(options: Options, storageHandle: OptionsHandle) {
        this.storageHandle = storageHandle;

        this.options = observable(options);
        autorun(async () => await this.save());
    }

    static async load(storageHandle: OptionsHandle): Promise<OptionsManager> {
        // TODO: less duplicate code
        const loaded = await storageHandle.get([OPTIONS_KEY]);
        const options = loaded[OPTIONS_KEY] || Options.Default();

        return new OptionsManager(options, storageHandle);
    }

    // TODO: reexport the newOptions type from message module.
    change(newOptions: DeepPartial<Options>): void {
        this.options = deepmerge(this.options, newOptions);
    }

    async load(): Promise<void> {
        const loaded = await this.storageHandle.get([OPTIONS_KEY]);
        this.options = loaded[OPTIONS_KEY] || Options.Default();
    }

    async save(): Promise<void> {
        await this.storageHandle.set({ [OPTIONS_KEY]: this.options });
    }
}
