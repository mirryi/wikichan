import { merge } from "rxjs";
import { map } from "rxjs/operators";

import { BackTunnel, ObservableTunnel } from "@common/messaging/tunnel";
import { Provider } from "@providers";
import { QueryRequest, QueryResponse } from "@shared/messaging";

export type InnerTunnel = BackTunnel<QueryRequest, QueryResponse>;
export class QueryItemManager {
    constructor(
        private tunnel: ObservableTunnel<QueryRequest, QueryResponse>,
        private providers: Provider[],
    ) {}

    static async load(
        platformTunnel: InnerTunnel,
        providers: Provider[],
    ): Promise<QueryItemManager> {
        const innerTunnel = new ObservableTunnel(platformTunnel);
        const self = new QueryItemManager(innerTunnel, providers);

        // Wait for tunnel to connect.
        await self.connect();

        // Listen for requests and pass queries to providers.
        self.tunnel
            .received()
            .pipe(
                map((request) => {
                    const queries = request.queries;
                    const searches = self.providers.map((provider) =>
                        provider.search(queries),
                    );

                    const itemStream = merge(...searches);
                    itemStream
                        .pipe(map((item) => self.send({ batchn: request.batchn, item })))
                        .subscribe();
                }),
            )
            .subscribe();

        return self;
    }

    private async connect(): Promise<void> {
        await this.tunnel.connect();
    }

    private async send(om: QueryResponse): Promise<void> {
        await this.tunnel.send(om);
    }
}
