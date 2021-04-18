import TemporaryStorage from "@common/storage/TemporaryStorage";
import CachedProvider from "@providers/CachedProvider";

import WikipediaProvider, { WikipediaLanguage } from "./Provider";
import WikipediaItem from "./Item";

class CachedWikipediaProvider extends CachedProvider<WikipediaItem, number> {
    constructor(
        language: WikipediaLanguage,
        storage: TemporaryStorage<WikipediaItem>,
        storageDuration: number,
    ) {
        super(new WikipediaProvider(language), storage, storageDuration);
    }

    distinctProperty(item: WikipediaItem): number {
        return item.pageid;
    }
}

export default CachedWikipediaProvider;
