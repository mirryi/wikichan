import { ReactNode } from "react";
import { Observable, of } from "rxjs";
import { Item, Provider } from "../provider";

export class DummyProvider implements Provider<Item> {
  search(query: string): Observable<Item> {
    const item: Item = {
      title: query.toUpperCase(),
      description: "jakwdkawkj",
      searchTerm: query,
      provider: this,
    };
    return of(item);
  }

  renderf(): ((item: Item) => ReactNode) | null {
    return null;
  }
}
