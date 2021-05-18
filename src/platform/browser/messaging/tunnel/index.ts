import { browser, Runtime } from "webextension-polyfill-ts";

import {
    BackTunnel,
    DisconnectedTunnelError,
    FrontTunnel,
    Receiver,
} from "@common/messaging/tunnel";

// TODO: Less scuffed way of doing this?
interface ConnectionEstablishedMessage {
    __status: "CONNECTED";
}

export class BrowserFrontTunnel<I, O> implements FrontTunnel<I, O> {
    /**
     * Connection port.
     */
    private port?: Runtime.Port;
    /**
     * Callback to execute when the tunnel receives an incoming message.
     */
    private receiver: Receiver.Callback<I>;

    private _connected: boolean;

    constructor(
        /**
         * Name to be passed as the port name on connection.
         */
        private name: string = "",
    ) {
        // Receiver is initially no-op.
        this.receiver = async (_im: I) => undefined;

        // Initially disconnected.
        this._connected = false;
    }

    async connect(): Promise<void> {
        return new Promise((resolve, _reject) => {
            // If not connect, make connection.
            if (!this._connected) {
                const port = browser.runtime.connect(undefined, { name: this.name });

                // Listen for connection confirmation message from other side.
                //
                // Safety: listener takes any arg
                // eslint-disable-next-line @typescript-eslint/no-explicit-any,
                const initialListener = (im: any): void => {
                    // When received, resolve promise and enable tunnel functions.
                    //
                    // Safety: fine for purposes
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    if (!!im && typeof im === "object" && im.__status === "CONNECTED") {
                        this._connected = true;
                        this.send = (om: O) => this.connectedSend(om);
                        this.receive = (im: I) => this.connectedReceive(im);

                        port.onMessage.removeListener(initialListener);
                        // Safety: returning a promise is correct in this scenario?
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        port.onMessage.addListener((im) => this.receive(im));
                        resolve();
                    }
                };

                port.onMessage.addListener(initialListener);

                this.port = port;
            }
        });
    }

    connected(): boolean {
        return this._connected;
    }

    async send(_om: O): Promise<void> {
        throw new DisconnectedTunnelError("send");
    }

    private async connectedSend(om: O): Promise<void> {
        this.port?.postMessage(om);
    }

    onReceive(cb: Receiver.Callback<I>): void {
        this.receiver = cb;
    }

    private async receive(_im: I): Promise<void> {
        throw new DisconnectedTunnelError("receive");
    }

    private async connectedReceive(im: I): Promise<void> {
        await this.receiver(im);
    }
}

export class BrowserBackTunnel<I, O> implements BackTunnel<I, O> {
    /**
     * Set of content script messaage ports that have connected.
     */
    private ports: { [key: number]: Runtime.Port };
    /**
     * Function to filter incoming port connections by.
     */
    private filter: BrowserBackTunnel.PortFilter;

    /**
     * Callback to execute when the tunnel receives an incoming message.
     */
    private receiver: Receiver.Callback<I>;

    private _status: "disconnected" | "connecting" | "connected";

    constructor(filter: BrowserBackTunnel.PortFilter = (_name: string) => true) {
        // No ports initially.
        this.ports = {};
        this.filter = filter;

        // Receiver is initially no-op.
        this.receiver = async (_im: I) => undefined;

        // Initially disconnected.
        this._status = "disconnected";
    }

    async connect(): Promise<void> {
        return new Promise((resolve, _reject) => {
            // If not connected, connect.
            if (this._status === "disconnected") {
                this._status = "connecting";

                const listener = (port: Runtime.Port): void => {
                    // If the connection is from an ID'd tab and name passes
                    // the filter, save the port and begin listening for messages.
                    // TODO: handle undefined case?
                    if (port?.sender?.tab?.id && this.filter(port.name)) {
                        // Save the port by tab ID.
                        this.ports[port.sender.tab.id] = port;

                        // If this is the first connection, enable the send and
                        // receive methods.
                        if (this._status === "connecting") {
                            this._status = "connected";
                            this.send = (om: O) => this.connectedSend(om);
                            this.receive = (im: I) => this.connectedReceive(im);
                        }

                        // Send a message to the port indicating that the
                        // connection has been established.
                        const connectedMessage: ConnectionEstablishedMessage = {
                            __status: "CONNECTED",
                        };
                        port.postMessage(connectedMessage);

                        // Begin to accept messages on the port.
                        // Safety: returning a promise is correct in this scenario?
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        port.onMessage.addListener((im) => this.receive(im));
                    }
                };

                // Begin to listen for content script connections.
                const initialListener = (port: Runtime.Port): void => {
                    listener(port);

                    browser.runtime.onConnect.removeListener(initialListener);
                    browser.runtime.onConnect.addListener(listener);

                    // Resolve as connected.
                    resolve();
                };

                browser.runtime.onConnect.addListener(initialListener);
            }
        });
    }

    connected(): boolean {
        return this._status === "connected";
    }

    /**
     * Send a message to all connected content scripts ports.
     */
    async send(_om: O): Promise<void> {
        throw new DisconnectedTunnelError("send");
    }

    /**
     * Set the callback to be executed when an incoming message is received.
     */
    onReceive(cb: Receiver.Callback<I>): void {
        this.receiver = cb;
    }

    private async connectedSend(om: O): Promise<void> {
        for (const port of Object.values(this.ports)) {
            port.postMessage(om);
        }
    }

    private async receive(_im: I): Promise<void> {
        throw new DisconnectedTunnelError("receive");
    }

    private async connectedReceive(im: I): Promise<void> {
        await this.receiver(im);
    }
}

export namespace BrowserBackTunnel {
    export type PortFilter = (name: string) => boolean;
}
