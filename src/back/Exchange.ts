import { BackExchange } from "@common/messaging/exchange";
import { BackMessage, FrontMessage } from "@shared/messaging";
import { Options } from "@shared/options";

export type InnerExchange = BackExchange<FrontMessage, BackMessage>;
export interface Handlers {
    getOptions: () => Promise<Options>;
    changeOptions: (im: Omit<FrontMessage.ChangeOptions, "kind">) => Promise<void>;
}

export class Exchange {
    private inner: InnerExchange;
    private handlers: Handlers;

    private constructor(inner: InnerExchange, handlers: Handlers) {
        this.inner = inner;
        this.handlers = handlers;
    }

    static async load(inner: InnerExchange, handlers: Handlers): Promise<Exchange> {
        const self = new Exchange(inner, handlers);

        // Wait for exchange to connect.
        await self.inner.connect();

        // Begin to listen for messages.
        self.inner.onReceive(async (im: FrontMessage) => {
            switch (im.kind) {
                case "GET_OPTIONS":
                    const options = await self.handlers.getOptions();
                    return { kind: "GET_OPTIONS_RESULT", options };
                case "CHANGE_OPTIONS":
                    await self.handlers.changeOptions(im);
                    return { kind: "CHANGE_OPTIONS_RESULT" };
            }
        });

        return self;
    }
}
