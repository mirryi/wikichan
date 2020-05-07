import { ReactNode } from "react";
import { merge, Observable, from, of } from "rxjs";
import { mergeMap, tap } from "rxjs/operators";

import { Cache } from "@common/cache";

export interface Item {
  title: string;
  subtitle?: string;

  description: string;
  longDescription?: string;

  tags?: Map<string, string | string[]>;
  urls?: string[];

  searchTerm: string;

  provider: Provider<Item>;
}

export interface Provider<T extends Item = Item> {
  name(): string;

  search(queries: string[]): Observable<T>;

  renderf?(item: T): ReactNode;
  renderLongDescription?(item: T): ReactNode;
}

export class ProviderMerge {
  providers: Provider<Item>[];

  constructor(providers: Provider<Item>[]) {
    this.providers = providers;
  }

  search(queries: string[]): Observable<Item> {
    const searches = this.providers.map((pr) => pr.search(queries));
    return merge(...searches);
  }
}

export abstract class CachedProvider<T extends Item> implements Provider<T> {
  cache: Cache;
  provider: Provider<T>;

  name(): string {
    return this.provider.name();
  }

  constructor(provider: Provider<T>, cache: Cache) {
    this.provider = provider;
    this.cache = cache;
  }

  search(queries: string[]): Observable<T> {
    const promises = queries.map(async (q) => {
      return this.cache.get(this.key(q)).then(
        (v) => {
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

    return merge(...promises.map((p) => from(p))).pipe(
      mergeMap((v) => {
        if (typeof v !== "string") {
          return of(v);
        }

        return this.provider.search([v as string]).pipe(
          tap((item) => {
            const serialized = this.serializeItem(item);
            this.cache.set(this.key(item.searchTerm), serialized);
          }),
        );
      }),
    );
  }

  abstract serializeItem(item: T): string;
  abstract deserializeItem(str: string): T;

  abstract key(k: string): string;
}
