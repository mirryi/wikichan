import { browser } from "webextension-polyfill-ts";
import * as mobx from "mobx";

import { Back } from "@back/Back";
import {
    BackMessage,
    FrontMessage,
    QueryRequest,
    QueryResponse,
} from "@shared/messaging";

import { BrowserStorage } from "./platform/browser/storage";
import { BrowserBackExchange } from "./platform/browser/messaging/exchange";
import { BrowserBackTunnel } from "./platform/browser/messaging/tunnel";

(async () => {
    mobx.configure({
        useProxies: "never",
    });

    const storage = new BrowserStorage(browser.storage.local);
    const exchange = new BrowserBackExchange<FrontMessage, BackMessage>();
    const tunnel = new BrowserBackTunnel<QueryRequest, QueryResponse>();

    await Back.load(storage, exchange, tunnel);
})();
