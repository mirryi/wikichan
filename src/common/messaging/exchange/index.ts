export interface Sender<I, O> {
    /**
     * Send an outgoing message.
     */
    send(om: O): Promise<I>;
}

export interface Receiver<I, O> {
    /**
     * Define the callback for when the tunnel receives an incoming message.
     */
    onReceive(cb: Receiver.Callback<I, O>): void;
}

export namespace Receiver {
    export type Callback<I, O> = (im: I) => Promise<O | undefined>;
}

export * from "./Exchange";
export * from "./BackExchange";
export * from "./FrontExchange";
