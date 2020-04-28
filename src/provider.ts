import { ReactNode } from "react";
import { merge, Observable } from "rxjs";

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

export interface Provider<T extends Item> {
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
