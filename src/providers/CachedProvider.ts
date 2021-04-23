import { merge, Observable, from, of } from "rxjs";
import { mergeMap, tap } from "rxjs/operators";

import { TemporaryStorage } from "@common/storage";

import { Item } from "./Item";
import { Provider } from "./Provider";

class CachedProvider<T extends Item> implements Provider<T> {
    storage: TemporaryStorage<T>;
    storageDuration: number;
    inner: Provider<T>;

    constructor(
        provider: Provider<T>,
        storage: TemporaryStorage<T>,
        storageDuration: number,
    ) {
        this.inner = provider;
        this.storage = storage;
        this.storageDuration = storageDuration;
    }

    search(queries: string[]): Observable<T> {
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
    }

    uniq(stream: Observable<T>): Observable<T> {
        return this.inner.uniq(stream);
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

export default CachedProvider;
