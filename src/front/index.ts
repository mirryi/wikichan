import * as mobx from "mobx";

import { setLogger } from "@util/logging";

import { Front, InnerExchange, InnerTunnel } from "./Front";

export const load = async (
    exchange: InnerExchange,
    tunnel: InnerTunnel,
): Promise<void> => {
    setLogger("wikichan::front");
    mobx.configure({
        useProxies: "never",
    });

    const front = await Front.load(exchange, tunnel);
    await front.register(window);
};
