import { merge, Observable, from, of } from "rxjs";
import { mergeMap, tap } from "rxjs/operators";

import { TemporaryStorage } from "@common/storage";

import { Item } from "./Item";

export interface Provider<T extends Item = Item> {
    search(queries: string[]): Observable<T>;
    uniq(stream: Observable<T>): Observable<T>;
}

export class CachedProvider<T extends Item> implements Provider<T> {
    private inner: Provider<T>;
    private storage: TemporaryStorage<T>;
    private storageDuration: number;

    private caching: boolean;

    constructor(
        inner: Provider<T>,
        storage: TemporaryStorage<T>,
        storageDuration: number,
    ) {
        this.inner = inner;
        this.storage = storage;
        this.storageDuration = storageDuration;

        this.caching = true;
    }

    search(queries: string[]): Observable<T> {
        if (this.caching) {
            const promises = queries.map(async (query) => {
                const val = await this.getCached(query);
                return val ?? query;
            });

            const stream = merge(...promises.map((p) => from(p))).pipe(
                mergeMap(
                    (v): Observable<T> => {
                        if (typeof v !== "string") {
                            return of(v);
                        }

                        return this.inner.search([v]).pipe(
                            tap((item: T): void => {
                                // Branch off to store value.
                                void this.setCached(item);
                            }),
                        );
                    },
                ),
            );

            return this.uniq(stream);
        } else {
            return this.inner.search(queries);
        }
    }

    uniq(stream: Observable<T>): Observable<T> {
        return this.inner.uniq(stream);
    }

    enableCaching(): void {
        this.caching = true;
    }

    disableCaching(): void {
        this.caching = false;
    }

    isCaching(): boolean {
        return this.caching;
    }

    private async getCached(query: string): Promise<T | undefined> {
        const item = await this.storage.get([query]);
        return item[query]?.payload;
    }

    private async setCached(item: T): Promise<void> {
        await this.storage.set({
            [item.searchTerm]: {
                duration: this.storageDuration,
                payload: item,
            },
        });
    }
}
