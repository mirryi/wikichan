import PlatformStorage from "@common/PlatformStorage";
import { CachedProvider } from "@providers";

import OwlBotItem from "./Item";
import OwlBotProvider from "./Provider";

class CachedOwlBotProvider extends CachedProvider<OwlBotItem> {
  constructor(token: string, Storage: PlatformStorage, StorageDuration: number) {
    super(new OwlBotProvider(token), Storage, StorageDuration);
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
