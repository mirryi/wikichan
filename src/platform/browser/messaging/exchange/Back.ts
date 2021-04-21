import {
    BackExchange,
    DisconnectedExchangeError,
    Receiver,
    UnsupportedOperationError,
} from "@common/messaging/exchange";

import { browser } from "webextension-polyfill-ts";

export class BrowserBackExchange<I, O> implements BackExchange<I, O> {
    private _connected: boolean;
    private receiver: Receiver.Callback<I, O>;

    constructor() {
        this._connected = false;
        this.receiver = async (_im: I) => {
            throw new UnsupportedOperationError("receive");
        };
    }

    async connect(): Promise<void> {
        if (!this._connected) {
            this._connected = true;

            this.send = this.connectedSend;
            browser.runtime.onMessage.addListener((im) => this.receive(im));
        }
    }

    connected(): boolean {
        return this._connected;
    }

    async send(_om: O): Promise<I> {
        throw new DisconnectedExchangeError("send");
    }

    async connectedSend(_om: O): Promise<I> {
        throw new UnsupportedOperationError("send");
    }

    onReceive(cb: Receiver.Callback<I, O>): void {
        this.receiver = cb;
    }

    private async receive(im: I): Promise<O | undefined> {
        return await this.receiver(im);
    }
}
