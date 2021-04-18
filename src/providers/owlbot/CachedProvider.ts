import TemporaryStorage from "@common/storage/TemporaryStorage";
import { CachedProvider } from "@providers";

import OwlBotItem from "./Item";
import OwlBotProvider from "./Provider";

class CachedOwlBotProvider extends CachedProvider<OwlBotItem, string> {
    constructor(
        token: string,
        storage: TemporaryStorage<OwlBotItem>,
        storageDuration: number,
    ) {
        super(new OwlBotProvider(token), storage, storageDuration);
    }

    distinctProperty(item: OwlBotItem): string {
        return item.title;
    }
}

export default CachedOwlBotProvider;
