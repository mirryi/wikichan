import * as mobx from "mobx";

import { setLogger } from "@util/logging";

import { Back, InnerExchange, InnerTunnel, InnerStorage } from "./back";
export { InnerExchange, InnerTunnel, InnerStorage };

export const load = async (
    storage: InnerStorage,
    exchange: InnerExchange,
    tunnel: InnerTunnel,
): Promise<void> => {
    setLogger("wikichan::back");
    mobx.configure({
        useProxies: "never",
    });

    await Back.load(storage, exchange, tunnel);
};
