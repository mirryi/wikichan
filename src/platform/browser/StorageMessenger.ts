import { browser } from "webextension-polyfill-ts";

import PlatformStorage from "@common/storage/PlatformStorage";
import { TemporaryValue } from "@common/storage/TemporaryStorage";
import {
    StorageDelMessage,
    StorageGetMessage,
    StorageSetMessage,
} from "./StorageMessage";

class StorageMessenger<T> implements PlatformStorage<TemporaryValue<T>> {
    async set(key: string, val: TemporaryValue<T>): Promise<void> {
        const message: StorageSetMessage<TemporaryValue<T>> = {
            kind: "cache::set",
            key: key,
            value: val,
        };

        return await browser.runtime.sendMessage(message).then(() => {
            return;
        });
    }

    async get(key: string): Promise<TemporaryValue<T> | undefined> {
        const message: StorageGetMessage = {
            kind: "cache::get",
            key: key,
        };

        return await browser.runtime.sendMessage(message);
    }

    async del(key: string): Promise<void> {
        const message: StorageDelMessage = {
            kind: "cache::del",
            key: key,
        };

        return await browser.runtime.sendMessage(message);
    }
}

export default StorageMessenger;
