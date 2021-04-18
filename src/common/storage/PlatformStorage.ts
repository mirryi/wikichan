interface PlatformStorage<T> {
    set(entries: { [key: string]: T }): Promise<void>;
    get(keys: string[]): Promise<{ [key: string]: T }>;
    del(keys: string[]): Promise<void>;

    checkValid(val: T): Promise<boolean>;
}

export default PlatformStorage;
