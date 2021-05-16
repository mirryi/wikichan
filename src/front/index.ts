import { setLogger } from "@util/logging";

import { Front, InnerExchange, InnerTunnel } from "./front";

export const load = async (
    exchange: InnerExchange,
    tunnel: InnerTunnel,
): Promise<void> => {
    setLogger("wikichan::front");

    const front = await Front.load(exchange, tunnel);
    await front.register(window);
};
