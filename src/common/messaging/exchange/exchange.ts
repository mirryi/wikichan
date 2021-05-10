import { Sender, Receiver } from ".";

export interface Exchange<I, O> extends Sender<I, O>, Receiver<I, O> {
    connect(): Promise<void>;

    connected(): boolean;
}

export type ExchangeErrorType = "send" | "receive";

export class DisconnectedExchangeError extends Error {
    constructor(type: ExchangeErrorType) {
        super(`Attempted to ${type} via a disconnected exchange`);
    }
}

export class UnsupportedOperationError extends Error {
    constructor(type: ExchangeErrorType) {
        super(`Unsupported operation ${type}`);
    }
}
