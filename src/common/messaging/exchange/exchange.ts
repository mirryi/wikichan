import { Sender, Receiver } from ".";

export interface Exchange<I, O> extends Sender<I, O>, Receiver<I, O> {
    connect(): Promise<void>;

    connected(): boolean;
}

export class DisconnectedExchangeError extends Error {
    type: "send" | "receive";

    constructor(type: "send" | "receive") {
        super(`Attempted to ${type} via a disconnected exchange`);
        this.type = type;
    }
}

export class UnsupportedOperationError extends Error {
    type: "send" | "receive";

    constructor(type: "send" | "receive") {
        super(`Unsupported operation ${type}`);
        this.type = type;
    }
}
