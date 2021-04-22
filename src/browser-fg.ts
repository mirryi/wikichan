import * as mobx from "mobx";

import { Front } from "@front/Front";
import {
    BackMessage,
    FrontMessage,
    QueryRequest,
    QueryResponse,
} from "@shared/messaging";

import { BrowserFrontExchange } from "./platform/browser/messaging/exchange";
import { BrowserFrontTunnel } from "./platform/browser/messaging/tunnel";

(async () => {
    if (self !== top) {
        return;
    }

    mobx.configure({
        useProxies: "never",
    });

    const exchange = new BrowserFrontExchange<BackMessage, FrontMessage>();
    const tunnel = new BrowserFrontTunnel<QueryResponse, QueryRequest>();

    await Front.load(exchange, tunnel);

    await front.register(window);
})();
