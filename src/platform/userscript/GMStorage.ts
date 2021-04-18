import PlatformStorage from "@common/storage/PlatformStorage";

abstract class GMStorage<T> implements PlatformStorage<T> {
    async set(entries: { [key: string]: T }): Promise<void> {
        const iter = Object.entries(entries);
        await Promise.all(
            iter.map(async ([key, val]) => GM.setValue(key, JSON.stringify(val))),
        );
    }

    async get(keys: string[]): Promise<{ [key: string]: T | undefined }> {
        const parsed = keys.map(async (key) => {
            const val = GM.getValue(key);

            if (!val || typeof val !== "string") {
                return [key, undefined];
            }

            try {
                const parsed = JSON.parse(val);
                if (await this.checkValid(parsed)) {
                    // Safety: `parsed` is a `T` as checked by `this.checkValid`.
                    // eslint-ignore-next-line @typescript-eslint/consistent-type-assertions
                    return [key, parsed as T] as [string, T];
                }
            } catch (_e: unknown) {}

            return [key, undefined];
        });

        const entries = await Promise.all(parsed);
        return Object.fromEntries(entries);
    }

    async del(keys: string[]): Promise<void> {
        await Promise.all(keys.map(async (k) => GM.deleteValue(k)));
    }

    abstract checkValid(val: T): Promise<boolean>;
}

export default GMStorage;
