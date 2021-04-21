import { browser, Runtime } from "webextension-polyfill-ts";

import {
    BackTunnel,
    FrontTunnel,
    DisconnectedTunnelError,
    Receiver,
} from "@common/messaging/tunnel";

// TODO: Less scuffed way of doing this?
interface ConnectionEstablishedMessage {
    __status: "CONNECTED";
}

export class BrowserFrontTunnel<I, O> implements FrontTunnel<I, O> {
    /**
     * Name to be passed as the port name on connection.
     */
    private name: string;

    /**
     * Connection port.
     */
    private port?: Runtime.Port;
    /**
     * Callback to execute when the tunnel receives an incoming message.
     */
    private receiver: Receiver.Callback<I>;

    private _connected: boolean;

    constructor(name: string) {
        this.name = name;

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
                const initialListener = (im: any) => {
                    // When received, resolve promise and enable tunnel functions.
                    if (im.__status === "CONNECTED") {
                        this._connected = true;
                        this.send = this.connectedSend;
                        this.receive = this.connectedReceive;

                        port.onMessage.removeListener(initialListener);
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

                // Begin to listen for content script connections.
                browser.runtime.onConnect.addListener((port) => {
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
                            this.send = this.connectedSend;
                            this.receive = this.connectedReceive;
                        }

                        // Send a message to the port indicating that the
                        // connection has been established.
                        const connectedMessage: ConnectionEstablishedMessage = {
                            __status: "CONNECTED",
                        };
                        port.postMessage(connectedMessage);

                        // Begin to accept messages on the port.
                        port.onMessage.addListener(async (im) => await this.receive(im));

                        // Resolve as connected.
                        resolve();
                    }
                });
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
export * from "./Front";
