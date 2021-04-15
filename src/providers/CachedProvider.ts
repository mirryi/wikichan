import { merge, Observable, from, of } from "rxjs";
import { mergeMap, tap, distinct } from "rxjs/operators";

import PlatformStorage from "@common/PlatformStorage";

import Item from "./Item";
import Provider from "./Provider";

abstract class CachedProvider<T extends Item> implements Provider<T> {
  storage: PlatformStorage;
  storageDuration: number;
  provider: Provider<T>;

  name(): string {
    return this.provider.name();
  }

  constructor(provider: Provider<T>, storage: PlatformStorage, storageDuration: number) {
    this.provider = provider;
    this.storage = storage;
    this.storageDuration = storageDuration;
  }

  search(queries: string[]): Observable<T> {
    const promises = queries.map((q) => {
      return this.storage.get(this.key(q)).then(
        (v: string | undefined): T | string => {
          if (!v) {
            return q;
          }
          return this.deserializeItem(v);
        },
        () => {
          return q;
        },
      );
    });

    return merge(...promises.map((p: Promise<T | string>) => from(p))).pipe(
      mergeMap(
        (v: T | string): Observable<T> => {
          if (typeof v !== "string") {
            return of(v);
          }

          return this.provider.search([v as string]).pipe(
            tap((item: T): void => {
              const serialized = this.serializeItem(item);
              this.storage.set(
                this.key(item.searchTerm),
                serialized,
                this.storageDuration,
              );
            }),
            distinct((item: T) => this.distinctProperty(item)),
          );
        },
      ),
    );
  }

  protected abstract serializeItem(item: T): string;
  protected abstract deserializeItem(str: string): T;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract distinctProperty(item: T): any;

  abstract key(k: string): string;
}

export default CachedProvider;
