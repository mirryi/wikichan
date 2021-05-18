import { Receiver, Sender } from ".";

export interface Tunnel<I, O> extends Sender<void, O>, Receiver<I> {
    /**
     * Make/listen for a connection. If the tunnel is already connected, this
     * should do nothing.
     *
     * After the returned Promise resolves, `connected()` should return true.
     */
    connect(): Promise<void>;

    /**
     * Return true if the tunnel is currently connected; false if it is not.
     */
    connected(): boolean;
}

export type TunnelErrorType = "send" | "receive";

export class DisconnectedTunnelError extends Error {
    constructor(type: TunnelErrorType) {
        super(`Attempted to ${type} via a disconnected tunnel`);
    }
}
