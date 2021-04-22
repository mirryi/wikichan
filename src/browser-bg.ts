import { browser } from "webextension-polyfill-ts";

import { load } from "@back";

import { BrowserStorage } from "./platform/browser/storage";
import { BrowserBackExchange } from "./platform/browser/messaging/exchange";
import { BrowserBackTunnel } from "./platform/browser/messaging/tunnel";

void (async () => {
    await load(
        new BrowserStorage(browser.storage.local),
        new BrowserBackExchange(),
        new BrowserBackTunnel(),
    );
})();
