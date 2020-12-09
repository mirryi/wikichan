import { ReactNode } from "react";
import { Observable } from "rxjs";

import Item from "./Item";

interface Provider<T extends Item = Item> {
  name(): string;

  search(queries: string[]): Observable<T>;

  renderf?(item: T): ReactNode;
  renderLongDescription?(item: T): ReactNode;
}

export default Provider;
