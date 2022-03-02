import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";

import { FrontTunnel, ObservableTunnel } from "@common/messaging/tunnel";
import { Item } from "@providers";
import { QueryRequest, QueryResponse } from "@shared/messaging";

export type InnerTunnel = FrontTunnel<QueryResponse, QueryRequest>;
export class QueryItemManager {
    /**
     * Tunnel by which query requests and response are sent and received.
     */
    private tunnel: ObservableTunnel<QueryResponse, QueryRequest>;

    private batchn: number;
    private currentItems: Item[];
    private _itemsStream: Observable<Item[]>;

    private constructor(tunnel: InnerTunnel) {
        this.tunnel = new ObservableTunnel(tunnel);

        this.batchn = 0;
        this.currentItems = [];
        this._itemsStream = new Observable();
    }

    static async load(
        tunnel: FrontTunnel<QueryResponse, QueryRequest>,
    ): Promise<QueryItemManager> {
        const self = new QueryItemManager(tunnel);
        // Wait for tunnel to connect;
        await self.tunnel.connect();

        // Handle received item results.
        self._itemsStream = self.tunnel.received().pipe(
            // Ignore items from previous batches.
            filter((itemResult) => itemResult.batchn === self.batchn),
            map((itemResult) => {
                // Push self item to the list.
                if (itemResult.batchn === self.batchn) {
                    self.currentItems.push(itemResult.item);
                }

                return self.currentItems;
            }),
        );

        return self;
    }

    async send(queries: string[]): Promise<void> {
        // Increment batch number and clear current items.
        this.batchn += 1;
        // TODO: received item could pass filter before increment and push
        // after clearing.
        this.currentItems = [];

        // Request items.
        await this.tunnel.send({ batchn: this.batchn, queries });
    }

    itemsStream(): Observable<Item[]> {
        return this._itemsStream;
    }
}