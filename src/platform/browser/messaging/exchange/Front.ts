import {
    BackExchange,
    DisconnectedExchangeError,
    Receiver,
} from "@common/messaging/exchange";

import { browser } from "webextension-polyfill-ts";

export class BrowserFrontExchange<I, O> implements BackExchange<I, O> {
    /**
     * Callback to be executed when an incoming message is received.
     */
    private receiver?: Receiver.Callback<I, O>;

    private _connected: boolean;

    constructor() {
        this._connected = false;
    }

    async connect(): Promise<void> {
        // If not yet connected, connect.
        if (!this._connected) {
            this._connected = true;

            // Enable send method.
            this.send = this.connectedSend;
            // Begin to listen for incoming messages.
            browser.runtime.onMessage.addListener((im) => this.receive(im));
        }
    }

    connected(): boolean {
        return this._connected;
    }

    async send(_om: O): Promise<I> {
        throw new DisconnectedExchangeError("send");
    }

    async connectedSend(om: O): Promise<I> {
        return await browser.runtime.sendMessage(undefined, om);
    }

    onReceive(cb: Receiver.Callback<I, O>): void {
        this.receiver = cb;
        this.receive = this.connectedReceive;
    }

    private async receive(_im: I): Promise<O | undefined> {
        return undefined;
    }

    private async connectedReceive(im: I): Promise<O | undefined> {
        // Safety: connectedReceive is only called after onReceive is called;
        // receiver is no longer undefined.
        // eslint-ignore-next-line @typescript-eslint/no-non-null-assertion
        return await this.receiver!(im);
    }
}
