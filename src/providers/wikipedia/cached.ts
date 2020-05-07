import { Observable, from, of, merge } from "rxjs";
import { tap, mergeMap } from "rxjs/operators";

import { Cache } from "@common/cache";

import { WikipediaProvider, WikipediaLanguage, WikipediaItem } from "./index";

export class CachedWikipediaProvider extends WikipediaProvider {
  cache: Cache;

  constructor(language: WikipediaLanguage, cache: Cache) {
    super(language);
    this.cache = cache;
  }

  search(queries: string[]): Observable<WikipediaItem> {
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

        return super.search([v as string]).pipe(
          tap((item) => {
            const serialized = this.serializeItem(item);
            this.cache.set(this.key(item.searchTerm), serialized);
          }),
        );
      }),
    );
  }

  private serializeItem(item: WikipediaItem): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toSerialize = item as any;
    toSerialize.tags = [...item.tags.entries()];
    return JSON.stringify(toSerialize);
  }

  private deserializeItem(str: string): WikipediaItem {
    const parsed = JSON.parse(str);
    const item = parsed as WikipediaItem;
    item.tags = new Map(parsed["tags"]);
    item.provider = this;
    return item;
  }

  private key(k: string): string {
    return "wikipedia_" + k;
  }
}
