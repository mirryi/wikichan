import PlatformStorage from "./PlatformStorage";

class CentralStorage {
    private inner: PlatformStorage<unknown>;
    private handles: { [key: string]: StorageHandle<unknown> };

    constructor(inner: PlatformStorage<unknown>) {
        this.inner = inner;
        this.handles = {};
    }

    registerHandle<T>(
        prefix: string,
        validator: (val: unknown) => Promise<boolean>,
    ): StorageHandle<T> {
        const handle = new StorageHandle<T>(
            new CentralStorageInterface<T>(this.inner, validator),
        );

        this.handles[prefix] = handle;
        return handle;
    }

    unregisterHandle(prefix: string): void {
        const handle = this.handles[prefix];
        handle.unregister();
        delete this.handles[prefix];
    }
}

/**
 * Storage interface exposed to `StorageHandler`s by `CentralStorage`.
 *
 * The inner storage of `CentralStorage` is typed by `unknown`; it's the
 * responsibility of this class to validate retrieved objects.
 */
class CentralStorageInterface<T> implements PlatformStorage<T> {
    private inner: PlatformStorage<unknown>;
    private checkValid: (val: unknown) => Promise<boolean>;

    /**
     * Creates a new `CentralStorageInterface`.
     */
    constructor(
        inner: PlatformStorage<unknown>,
        validator: (val: unknown) => Promise<boolean>,
    ) {
        this.inner = inner;
        this.checkValid = async (val: unknown) => validator(val);
    }

    async set(entries: { [key: string]: T }): Promise<void> {
        await this.inner.set(entries);
    }

    async get(keys: string[]): Promise<{ [key: string]: T }> {
        const pairs = await this.inner.get(keys);
        const entries = await Promise.all(
            Object.entries(pairs).map(async ([key, val]) => {
                if (await this.checkValid(val)) {
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

export class StorageHandle<T> implements PlatformStorage<T> {
    private inner: CentralStorageInterface<T>;

    constructor(inner: CentralStorageInterface<T>) {
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

export default CentralStorage;
