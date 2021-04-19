import { Storage } from "webextension-polyfill-ts";

import PlatformStorage from "@common/storage/PlatformStorage";

type StorageArea = Storage.StorageArea;

abstract class BrowserStorage<T> implements PlatformStorage<T> {
    private inner: StorageArea;

    constructor(inner: StorageArea) {
        this.inner = inner;
    }

    async set(entries: { [key: string]: T }): Promise<void> {
        await this.inner.set(entries);
    }

    async get(keys: string[]): Promise<{ [key: string]: T }> {
        const item = await this.inner.get(keys);

        // Asynchronously parse and validate values.
        const parsed = Object.entries(item).map(
            async ([key, val]): Promise<[string, T] | undefined> => {
                if (item[key] && (await this.checkValid(val))) {
                    // Safety: `parsed` is a `T` as checked by `this.checkValid`.
                    // eslint-ignore-next-line @typescript-eslint/consistent-type-assertions
                    return [key, val as T];
                }

                return undefined;
            },
        );

        const entries = await Promise.all(parsed);
        return Object.fromEntries(entries.filter((x): x is [string, T] => !!x));
    }

    async del(keys: string[]): Promise<void> {
        await this.inner.remove(keys);
    }

    abstract checkValid(val: any): Promise<boolean>;
}

export default BrowserStorage;
