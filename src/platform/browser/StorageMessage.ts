type StorageMessage<T> = StorageGetMessage | StorageSetMessage<T> | StorageDelMessage;

export interface StorageGetMessage {
    kind: "cache::get";
    key: string;
}

export interface StorageSetMessage<T> {
    kind: "cache::set";
    key: string;
    value: T;
    duration?: number;
}

export interface StorageDelMessage {
    kind: "cache::del";
    key: string;
}

export function isStorageGetMessage<T>(
    object: StorageMessage<T>,
): object is StorageGetMessage {
    return object.kind === "cache::get";
}

export function isStorageSetMessage<T>(
    object: StorageMessage<T>,
): object is StorageSetMessage<T> {
    return object.kind === "cache::set";
}

export function isStorageDelMessage<T>(
    object: StorageMessage<T>,
): object is StorageDelMessage {
    return object.kind === "cache::del";
}

export default StorageMessage;
