import { PlatformStorage } from "./PlatformStorage";

type Validator = ValidatedStorage.Validator;

export class ValidatedStorage<T> implements PlatformStorage<T> {
    private inner: PlatformStorage<T>;
    private validator: Validator;

    constructor(inner: PlatformStorage<T>, validator: Validator) {
        this.inner = inner;
        this.validator = validator;
    }

    async set(entries: { [key: string]: T }): Promise<void> {
        await this.inner.set(entries);
    }

    async get(keys: string[]): Promise<{ [key: string]: T }> {
        const pairs = await this.inner.get(keys);
        const entries = await Promise.all(
            Object.entries(pairs).map(async ([key, val]) => {
                if (await this.validator(val)) {
                    return [key, val as T];
                }
                return undefined;
            }),
        );

        return Object.fromEntries(entries.filter((x): x is [string, T] => !!x));
    }

    async del(keys: string[]): Promise<void> {
        await this.inner.del(keys);
    }
}

export namespace ValidatedStorage {
    export type Validator = (val: unknown) => Promise<boolean>;
}
