import { Item } from "@providers";

export interface QueryRequest {
    batchn: number;
    queries: string[];
}

export interface QueryResponse {
    batchn: number;
    item: Item;
}
