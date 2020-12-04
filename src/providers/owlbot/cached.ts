import Cache from "@common/cache";
import { CachedProvider } from "@providers";

import { OwlBotItem, OwlBotProvider } from "./index";

class CachedOwlBotProvider extends CachedProvider<OwlBotItem> {
  constructor(token: string, cache: Cache, cacheDuration: number) {
    super(new OwlBotProvider(token), cache, cacheDuration);
    this.cache = cache;
  }

  serializeItem(item: OwlBotItem): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toSerialize = item as any;
    toSerialize.tags = [...item.tags.entries()];
    return JSON.stringify(toSerialize);
  }

  deserializeItem(str: string): OwlBotItem {
    const parsed = JSON.parse(str);
    const item = parsed as OwlBotItem;
    item.tags = new Map(parsed["tags"]);
    item.provider = this.provider as OwlBotProvider;
    return item;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  distinctProperty(item: OwlBotItem): any {
    return item.title;
  }

  key(k: string): string {
    return "owlbot_" + k;
  }
}

export default CachedOwlBotProvider;
