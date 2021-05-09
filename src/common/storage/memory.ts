import { Entries } from "@util";
import { isNotUndefined } from "@util/guards";

import { PlatformStorage } from "./platform";

export class MemoryStorage<T> implements PlatformStorage<T> {
    private map = new Map<string, T>();

    async set(entries: { [key: string]: T }): Promise<void> {
        await Promise.all(
            Entries.from(entries).map(async ([key, val]) => this.map.set(key, val)),
        );
    }

    async get(keys: string[]): Promise<{ [key: string]: T }> {
        const pairs = keys
            .map((key) => {
                const val = this.map.get(key);
                if (val === undefined) {
                    return undefined;
                } else {
                    return [key, val] as const;
                }
            })
            .filter(isNotUndefined);
        return Object.fromEntries(pairs);
    }

    async del(keys: string[]): Promise<void> {
        await Promise.all(keys.map(async (key) => this.map.delete(key)));
    }

    inner(): Map<string, T> {
        return this.map;
    }
}
