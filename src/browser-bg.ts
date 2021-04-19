import { browser } from "webextension-polyfill-ts";

import TemporaryStorage from "@common/storage/TemporaryStorage";

import Back from "@back/Back";
import BrowserStorage from "./platform/browser/BrowserStorage";
import StorageMessage, {
    StorageDelMessage,
    StorageGetMessage,
    StorageSetMessage,
    isStorageDelMessage,
    isStorageGetMessage,
    isStorageSetMessage,
} from "./platform/browser/StorageMessage";

(function (): void {
    const cache = new TemporaryStorage(new BrowserStorage(browser.storage.local));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cacheHandler = async (m: StorageMessage<any>): Promise<any> => {
        if (isStorageGetMessage(m)) {
            const message = m as StorageGetMessage;
            return await cache.get(message.key);
        } else if (isStorageSetMessage(m)) {
            const message = m as StorageSetMessage<any>;
            return await cache.set(message.key, {
                duration: message.duration,
                payload: message.value,
            });
        } else if (isStorageDelMessage(m)) {
            const message = m as StorageDelMessage;
            return await cache.del(message.key);
        } else {
            return Promise.reject("invalid cache message type");
        }
    };

    browser.runtime.onMessage.addListener(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async (m: any): Promise<any> => {
            if (!m.kind) {
                return Promise.reject("invalid message structure");
            }

            // TODO: create new union message type that includes StorageMessage;
            const message = m as StorageMessage<any>;
            const baseKind = message.kind.split("::")[0];
            switch (baseKind) {
                case "cache": {
                    const response = await cacheHandler(message);
                    return response;
                }
                default: {
                    return Promise.reject("invalid message kind");
                }
            }
        },
    );
})();
