import { Observable } from "rxjs";

import { Item } from "./Item";

export interface Provider<T extends Item = Item> {
    search(queries: string[]): Observable<T>;
    uniq(stream: Observable<T>): Observable<T>;
}
