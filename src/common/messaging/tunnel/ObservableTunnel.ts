import { Observable, Subscriber } from "rxjs";

import { DisconnectedTunnelError, Tunnel } from "./Tunnel";

export class ObservableTunnel<I, O> {
    private inner: Tunnel<I, O>;
    private stream: Observable<I>;
    private subscriber: Subscriber<I>;

    constructor(inner: Tunnel<I, O>) {
        this.subscriber = new Subscriber();
        this.stream = new Observable<I>((subscriber) => {
            this.subscriber = subscriber;
        });

        this.inner = inner;
        this.inner.onReceive(async (im: I) => {
            this.subscriber.next(im);
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
        return this.stream;
    }
}
