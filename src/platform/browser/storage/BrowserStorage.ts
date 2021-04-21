import { Storage } from "webextension-polyfill-ts";

import { PlatformStorage } from "@common/storage";

type StorageArea = Storage.StorageArea;

class BrowserStorage<T> implements PlatformStorage<T> {
    private inner: StorageArea;

    constructor(inner: StorageArea) {
        this.inner = inner;
    }

    async set(entries: { [key: string]: T }): Promise<void> {
        await this.inner.set(entries);
    }

    async get(keys: string[]): Promise<{ [key: string]: T }> {
        return await this.inner.get(keys);
    }

    async del(keys: string[]): Promise<void> {
        await this.inner.remove(keys);
    }
}

export default BrowserStorage;