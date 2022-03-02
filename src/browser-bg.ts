import browser from "webextension-polyfill";

import { load } from "@back";

import { BrowserBackExchange } from "./platform/browser/messaging/exchange";
import { BrowserBackTunnel } from "./platform/browser/messaging/tunnel";
import { BrowserStorage } from "./platform/browser/storage";

void (async () => {
    await load(
        new BrowserStorage(browser.storage.local),
        new BrowserBackExchange(),
        new BrowserBackTunnel(),
    );
})();
