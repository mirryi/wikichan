import { merge, Observable, from, of } from "rxjs";
import { mergeMap, tap, distinct } from "rxjs/operators";

import TemporaryStorage from "@common/storage/TemporaryStorage";

import Item from "./Item";
import Provider from "./Provider";

abstract class CachedProvider<T extends Item, P> implements Provider<T> {
    storage: TemporaryStorage<T>;
    storageDuration: number;
    provider: Provider<T>;

    name(): string {
        return this.provider.name();
    }

    constructor(
        provider: Provider<T>,
        storage: TemporaryStorage<T>,
        storageDuration: number,
    ) {
        this.provider = provider;
        this.storage = storage;
        this.storageDuration = storageDuration;
    }

    search(queries: string[]): Observable<T> {
        const promises = queries.map(async (q) => {
            const key = this.key(q);
            const item = await this.storage.get([key]);
            if (item[key]) {
                return item[key].payload;
            } else {
                return q;
            }
        });

        return merge(...promises.map((p) => from(p))).pipe(
            mergeMap(
                (v): Observable<T> => {
                    if (typeof v !== "string") {
                        return of(v);
                    }

                    return this.provider.search([v as string]).pipe(
                        tap((item: T): void => {
                            this.storage.set({
                                [this.key(item.searchTerm)]: {
                                    duration: this.storageDuration,
                                    payload: item,
                                },
                            });
                        }),
                        distinct((item: T) => this.distinctProperty(item)),
                    );
                },
            ),
        );
    }

    protected abstract distinctProperty(item: T): P;

    key(k: string): string {
        return `${this.name()}__${k}`;
    }
}

export default CachedProvider;
