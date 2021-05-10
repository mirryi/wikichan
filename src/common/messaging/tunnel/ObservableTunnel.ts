import { Observable, Subject } from "rxjs";

import { DisconnectedTunnelError, Tunnel } from "./Tunnel";

export class ObservableTunnel<I, O> {
    private stream: Subject<I>;

    constructor(private inner: Tunnel<I, O>) {
        this.stream = new Subject();

        this.inner.onReceive(async (im: I) => {
            this.stream.next(im);
        });
    }

    async connect(): Promise<void> {
        await this.inner.connect();
        this.received = () => this.connectedReceived();
    }

    async send(om: O): Promise<void> {
        await this.inner.send(om);
    }

    received(): Observable<I> {
        throw new DisconnectedTunnelError("receive");
    }

    private connectedReceived(): Observable<I> {
        return this.stream.pipe();
    }
}
