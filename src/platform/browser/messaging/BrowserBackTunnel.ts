import { browser, Runtime } from "webextension-polyfill-ts";

import { BackTunnel, DisconnectedTunnelError, Receiver } from "@common/messaging";

class BrowserBackTunnel<I, O> implements BackTunnel<I, O> {
    private ports: { [key: number]: Runtime.Port };
    private connected: boolean;

    private receiver: Receiver.Callback<I, O>;

    constructor() {
        this.ports = {};
        this.connected = false;
    }

    async connect(): Promise<void> {
        browser.runtime.onConnect.addListener((port) => {
            // TODO: handle undefined case?
            if (port?.sender?.tab?.id) {
                // Save the port by tab ID.
                this.ports[port.sender.tab.id] = port;

                if (!this.connected) {
                    this.connected = true;
                    this.send = this.connectedSend;
                    this.receive = this.connectedReceive;
                }

                port.onMessage.addListener((im) => this.receive(im, port));
            }
        });
    }

    async send(_om: O): Promise<void> {
        throw new DisconnectedTunnelError("send");
    }

    private async connectedSend(om: O): Promise<void> {
        for (const port of Object.values(this.ports)) {
            port.postMessage(om);
        }
    }

    onReceive(cb: Receiver.Callback<I, O>): void {
        this.receiver = cb;
    }

    private async receive(_im: I, _port: Runtime.Port): Promise<void> {
        throw new DisconnectedTunnelError("receive");
    }

    private async connectedReceive(im: I, port: Runtime.Port): Promise<void> {
        const response = await this.receiver(im);
        port.postMessage(response);
    }
}

export default BrowserBackTunnel;
