import { PlatformStorage } from "./PlatformStorage";

export class CentralStorage {
    private inner: PlatformStorage<unknown>;
    private handles: { [key: string]: CentralStorage.Handle<unknown> };

    constructor(inner: PlatformStorage<unknown>) {
        this.inner = inner;
        this.handles = {};
    }

    /**
     * Register a new storage handle for a given type and prefix.
     *
     * If a handle with this prefix is already registered, do nothing and
     * return undefined.
     */
    registerHandle<T>(prefix: string): CentralStorage.Handle<T> | undefined {
        if (this.handles[prefix]) {
            return undefined;
        }

        const handle = new CentralStorage.Handle<T>(
            new StorageInterface<T>(this.inner, prefix),
        );
        this.handles[prefix] = handle;
        return handle;
    }

    /**
     * Unregister the storage handle with the given prefix, if it exists.
     */
    unregisterHandle(prefix: string): void {
        const handle = this.handles[prefix];
        if (handle) {
            handle.unregister();
            delete this.handles[prefix];
        }
    }
}

export namespace CentralStorage {
    export class Handle<T> implements PlatformStorage<T> {
        private inner: StorageInterface<T>;

        constructor(inner: StorageInterface<T>) {
            this.inner = inner;
        }

        unregister(): void {
            this.set = async (_entries: { [key: string]: T }) => {
                throw new UnregisteredHandleError();
            };
            this.get = async (_keys: string[]) => {
                throw new UnregisteredHandleError();
            };
            this.del = async (_keys: string[]) => {
                throw new UnregisteredHandleError();
            };
        }

        async set(entries: { [key: string]: T }): Promise<void> {
            await this.inner.set(entries);
        }

        async get(keys: string[]): Promise<{ [key: string]: T }> {
            return this.inner.get(keys);
        }

        async del(keys: string[]): Promise<void> {
            await this.inner.del(keys);
        }
    }

    export class UnregisteredHandleError extends Error {
        constructor() {
            super("Attempted to use an unregistered storage handle");
        }
    }
}

/**
 * Storage interface exposed to `CentralStorage.Handle`s by `CentralStorage`.
 */
class StorageInterface<T> implements PlatformStorage<T> {
    private inner: PlatformStorage<unknown>;
    private prefix: string;

    private deprefixRegex: RegExp;

    constructor(inner: PlatformStorage<unknown>, prefix: string) {
        this.inner = inner;
        this.prefix = prefix;

        this.deprefixRegex = new RegExp(`^(${this.prefix})`);
    }

    async set(entries: { [key: string]: T }): Promise<void> {
        // Prefix keys before setting.
        const pairs = Object.entries(entries).map(([k, v]): [string, T] => [
            this.prefixKey(k),
            v,
        ]);
        // Access storage.
        const newEntries = Object.fromEntries(pairs);

        await this.inner.set(newEntries);
    }

    async get(keys: string[]): Promise<{ [key: string]: T }> {
        // Prefix keys before accessing storage.
        const prefixedKeys = keys.map((k) => this.prefixKey(k));
        // Access storage.
        const entries = await this.inner.get(prefixedKeys);
        // De-prefix keys to get user-facing keys.
        const pairs = Object.entries(entries).map(([k, v]): [string, T] => [
            this.deprefixKey(k),
            // Safety: StorageInterface doesn't guarantee type safety of values.
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            v as T,
        ]);

        return Object.fromEntries(pairs);
    }

    async del(keys: string[]): Promise<void> {
        await this.inner.del(keys);
    }

    prefixKey(key: string): string {
        return `${this.prefix}__${key}`;
    }

    deprefixKey(prefixedKey: string): string {
        return prefixedKey.replace(this.deprefixRegex, "");
    }
}
