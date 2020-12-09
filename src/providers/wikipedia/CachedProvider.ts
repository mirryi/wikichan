import PlatformStorage from "@common/PlatformStorage";
import CachedProvider from "@providers/CachedProvider";

import WikipediaProvider, { WikipediaLanguage } from "./Provider";
import WikipediaItem from "./Item";

class CachedWikipediaProvider extends CachedProvider<WikipediaItem> {
  constructor(
    language: WikipediaLanguage,
    storage: PlatformStorage,
    storageDuration: number,
  ) {
    super(new WikipediaProvider(language), storage, storageDuration);
  }

  serializeItem(item: WikipediaItem): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toSerialize = item as any;
    toSerialize.tags = [...item.tags.entries()];
    return JSON.stringify(toSerialize);
  }

  deserializeItem(str: string): WikipediaItem {
    const parsed = JSON.parse(str);
    const item = parsed as WikipediaItem;
    item.tags = new Map(parsed["tags"]);
    item.provider = this.provider as WikipediaProvider;
    return item;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  distinctProperty(item: WikipediaItem): any {
    return item.pageid;
  }

  key(k: string): string {
    return "wikipedia_" + k;
  }
}

export default CachedWikipediaProvider;
