import { merge, Observable } from "rxjs";

import Item from "./Item";
import Provider from "./Provider";

class ProviderMerge {
    providers: Provider<Item>[];

    constructor(providers: Provider<Item>[]) {
        this.providers = providers;
    }

    search(queries: string[]): Observable<Item> {
        const searches = this.providers.map((pr) => pr.search(queries));
        return merge(...searches);
    }
}

export default ProviderMerge;
