import { observe } from "rxjs-observe";
import { switchMap } from "rxjs/operators";

import { Options } from "@shared/options";
import { DeepPartial } from "@util";
import { deepmerge } from "@util/deepmerge";

import { OptionsHandle } from "./back-storage";

const OPTIONS_KEY = "root";

interface OptionsProxy {
    options: Options;
}
export class OptionsManager {
    private proxy: OptionsProxy;

    private constructor(options: Options, private storageHandle: OptionsHandle) {
        const { observables, proxy } = observe({ options });
        this.proxy = proxy;

        observables.options.pipe(switchMap(() => this.save())).subscribe();
    }

    static async load(storageHandle: OptionsHandle): Promise<OptionsManager> {
        // TODO: less duplicate code
        const loaded = await storageHandle.get([OPTIONS_KEY]);

        // TODO: Catch validation error
        const options = Options.Schema.create(loaded[OPTIONS_KEY] || {});

        return new OptionsManager(options, storageHandle);
    }

    // TODO: reexport the newOptions type from message module.
    change(newOptions: DeepPartial<Options>): void {
        this.proxy.options = deepmerge(this.proxy.options, newOptions);
    }

    async load(): Promise<void> {
        const loaded = await this.storageHandle.get([OPTIONS_KEY]);
        this.proxy.options = Options.Schema.create(loaded[OPTIONS_KEY]);
    }

    async save(): Promise<void> {
        await this.storageHandle.set({ [OPTIONS_KEY]: this.proxy.options });
    }

    get options(): Options {
        return this.proxy.options;
    }
}
