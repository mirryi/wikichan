import { load } from "@front";

import { BrowserFrontExchange } from "./platform/browser/messaging/exchange";
import { BrowserFrontTunnel } from "./platform/browser/messaging/tunnel";

void (async () => {
    await load(new BrowserFrontExchange(), new BrowserFrontTunnel());
})();
