import { Storage } from "webextension-polyfill-ts";

import PlatformStorage from "@common/storage/PlatformStorage";

type StorageArea = Storage.StorageArea;

abstract class BrowserStorage<T> implements PlatformStorage<T> {
    private inner: StorageArea;

    constructor(inner: StorageArea) {
        this.inner = inner;
    }

    async set(entries: { [key: string]: T }): Promise<void> {
        // Asynchronously stringify values.
        const iter = Object.entries(entries);
        const serialized = await Promise.all(
            iter.map(async ([key, val]) => [key, JSON.stringify(val)]),
        );

        const item = Object.fromEntries(serialized);
        await this.inner.set(item);
    }

    async get(keys: string[]): Promise<{ [key: string]: T | undefined }> {
        const item = await this.inner.get(keys);

        // Asynchronously parse and validate values.
        const parsed = Object.entries(item).map(
            async ([key, val]): Promise<[string, T | undefined]> => {
                if (!item[key] || typeof [key] !== "string") {
                    return [key, undefined];
                }

                try {
                    const parsed = JSON.parse(val);
                    if (await this.checkValid(parsed)) {
                        // Safety: `parsed` is a `T` as checked by `this.checkValid`.
                        // eslint-ignore-next-line @typescript-eslint/consistent-type-assertions
                        return [key, parsed as T];
                    }
                } catch (_e: unknown) {}

                return [key, undefined];
            },
        );

        const entries = await Promise.all(parsed);
        return Object.fromEntries(entries);
    }

    async del(keys: string[]): Promise<void> {
        await this.inner.remove(keys);
    }

    abstract checkValid(val: T): Promise<boolean>;
}

export default BrowserStorage;
