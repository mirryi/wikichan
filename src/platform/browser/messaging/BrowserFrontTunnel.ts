import { browser, Runtime } from "webextension-polyfill-ts";

import { DisconnectedTunnelError, FrontTunnel, Receiver } from "@common/messaging";

class BrowserFrontTunnel<I, O> implements FrontTunnel<I, O> {
    private name: string;
    private port: Runtime.Port | undefined = undefined;

    private receiver: Receiver.Callback<I, O>;

    constructor(name: string) {
        this.name = name;
    }

    async connect(): Promise<void> {
        this.port = browser.runtime.connect(undefined, { name: this.name });
        this.port.onMessage.addListener((im) => this.receive(im));

        this.send = this.connectedSend;
        this.receive = this.connectedReceive;
    }

    async send(_om: O): Promise<void> {
        throw new DisconnectedTunnelError("send");
    }

    private async connectedSend(om: O): Promise<void> {
        this.port?.postMessage(om);
    }

    onReceive(cb: Receiver.Callback<I, O>): void {
        this.receiver = cb;
    }

    private async receive(_im: I): Promise<void> {
        throw new DisconnectedTunnelError("receive");
    }

    private async connectedReceive(im: I): Promise<void> {
        const response = await this.receiver(im);
        this.send(response);
    }
}

export default BrowserFrontTunnel;
