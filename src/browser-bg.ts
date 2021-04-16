import { browser } from "webextension-polyfill-ts";

import BrowserStorage from "./platform/browser/BrowserStorage";
import {
    RuntimeMessage,
    StorageGetMessage,
    StorageSetMessage,
    isStorageGetMessage,
    isStorageSetMessage,
    isStorageListMessage,
} from "./platform/browser/StorageMessage";

(function (): void {
    const cache = new BrowserStorage("");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cacheHandler = async (m: RuntimeMessage): Promise<any> => {
        if (isStorageGetMessage(m)) {
            const message = m as StorageGetMessage;
            return await cache.get(message.key);
        } else if (isStorageSetMessage(m)) {
            const message = m as StorageSetMessage;
            return await cache.set(message.key, message.value, message.duration);
        } else if (isStorageListMessage(m)) {
            return await cache.list();
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

            const message = m as RuntimeMessage;
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
