export interface Sender<O> {
    send(om: O): Promise<void>;
}

export interface Receiver<I, O> {
    onReceive(cb: Receiver.Callback<I, O>): void;
}

export namespace Receiver {
    export type Callback<I, O> = (im: I) => Promise<O>;
}

interface Tunnel<I, O> extends Sender<O>, Receiver<I, O> {
    connect(): Promise<void>;
}

export class DisconnectedTunnelError extends Error {
    type: "send" | "receive";

    constructor(type: "send" | "receive") {
        super(`Attempted to ${type} via a disconnected tunnel`);
        this.type = type;
    }
}

export default Tunnel;
