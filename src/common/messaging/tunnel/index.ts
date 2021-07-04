export interface Sender<I, O> {
    /**
     * Send an outgoing message.
     */
    send(om: O): Promise<I | undefined>;
}

export interface Receiver<I> {
    /**
     * Define the callback for when the tunnel receives an incoming message.
     */
    onReceive(cb: Receiver.Callback<I>): void;
}

export namespace Receiver {
    export type Callback<I> = (im: I) => Promise<void>;
}

export * from "./Tunnel";
export * from "./BackTunnel";
export * from "./FrontTunnel";
export * from "./ObservableTunnel";
