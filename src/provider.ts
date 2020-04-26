import { ReactNode } from "react";
import { Observable, merge } from "rxjs";

export interface Item {
  title: string;
  subtitle: string;

  description: string;
  longDescription: string;

  tags: Record<string, string | string[]>;
  urls: URL[];

  searchTerm: string;

  provider: Provider<Item>;
}

export interface Provider<T extends Item> {
  search(query: string): Observable<T>;
  renderf(): (item: T) => ReactNode;
}

export class ProviderMerge {
  providers: Provider<Item>[];

  constructor(providers: Provider<Item>[]) {
    this.providers = providers;
  }

  search(query: string): Observable<Item> {
    return merge(...this.providers.map((pr) => pr.search(query)));
  }
}
