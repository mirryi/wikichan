import { merge } from "rxjs";
import { map } from "rxjs/operators";

import { BackTunnel, ObservableTunnel } from "@common/messaging/tunnel";
import { QueryRequest, QueryResponse } from "@shared/messaging";
import { Provider } from "@providers";

export class QueryItemManager {
    private tunnel: ObservableTunnel<QueryRequest, QueryResponse>;
    private providers: Provider[];

    constructor(
        inner: ObservableTunnel<QueryRequest, QueryResponse>,
        providers: Provider[],
    ) {
        this.tunnel = inner;
        this.providers = providers;
    }

    static async load(
        platformTunnel: QueryItemManager.InnerTunnel,
        providers: Provider[],
    ): Promise<QueryItemManager> {
        const innerTunnel = new ObservableTunnel(platformTunnel);
        const self = new QueryItemManager(innerTunnel, providers);

        // Wait for tunnel to connect.
        await self.connect();

        // Listen for requests and pass queries to providers.
        self.tunnel.received().pipe(
            map((request) => {
                const queries = request.queries;
                const searches = self.providers.map((provider) =>
                    provider.search(queries),
                );

                const itemStream = merge(...searches);
                itemStream.pipe(
                    map((item) => self.send({ batchn: request.batchn, item })),
                );
            }),
        );

        return self;
    }

    private async connect(): Promise<void> {
        await this.tunnel.connect();
    }

    private async send(om: QueryResponse): Promise<void> {
        await this.tunnel.send(om);
    }
}

export namespace QueryItemManager {
    export type InnerTunnel = BackTunnel<QueryRequest, QueryResponse>;
}
