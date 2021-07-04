import { Entries } from "@util";

import { PlatformStorage } from "./platform";

export class KeyedStorage<C> {
    constructor(private inner: PlatformStorage<C[keyof C]>) {}

    async set<K extends keyof C>(entries: Pick<C, K>): Promise<void> {
        return await this.inner.set(entries);
    }

    async get<K extends Extract<keyof C, string>>(keys: K[]): Promise<Pick<C, K>> {
        // Safety: Inner storage always returns { [key: string]: C[keyof C] },
        // and key must be K.
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        return (await this.inner.get(keys)) as Pick<C, K>;
    }

    async del<K extends Extract<keyof C, string>>(keys: K[]): Promise<void> {
        return await this.inner.del(keys);
    }
}

export type Validators<C> = {
    [K in keyof C]: (x: unknown) => x is C[K];
};
export class ValidatedKeyedStorage<C> {
    private inner: KeyedStorage<C>;

    constructor(
        inner: PlatformStorage<C[keyof C]> | KeyedStorage<C>,
        private validators: Validators<C>,
    ) {
        if (inner instanceof KeyedStorage) {
            this.inner = inner;
        } else {
            this.inner = new KeyedStorage(inner);
        }
    }

    async set<K extends keyof C>(entries: Pick<C, K>): Promise<void> {
        return await this.inner.set(entries);
    }

    async get<K extends Extract<keyof C, string>>(keys: K[]): Promise<Pick<C, K>> {
        const entries = await this.inner.get(keys);
        const checked = Entries.iter(entries).filter(([key, val]) =>
            this.validators[key](val),
        );
        return Entries.collect(checked);
    }

    async del<K extends Extract<keyof C, string>>(keys: K[]): Promise<void> {
        return await this.inner.del(keys);
    }
}
