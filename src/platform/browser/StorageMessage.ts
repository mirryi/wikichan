export interface RuntimeMessage {
  kind: string;
}

type StorageMessage = StorageGetMessage | StorageSetMessage | StorageListMessage;

export interface StorageGetMessage extends RuntimeMessage {
  kind: "cache::get";
  key: string;
}

export interface StorageSetMessage extends RuntimeMessage {
  kind: "cache::set";
  key: string;
  value: string;
  duration?: number;
}

export interface StorageListMessage extends RuntimeMessage {
  kind: "cache::list";
}

export function isStorageGetMessage(object: RuntimeMessage): object is StorageGetMessage {
  return object.kind === "cache::get";
}

export function isStorageSetMessage(object: RuntimeMessage): object is StorageSetMessage {
  return object.kind === "cache::set";
}

export function isStorageListMessage(
  object: RuntimeMessage,
): object is StorageListMessage {
  return object.kind === "cache::list";
}

export default StorageMessage;
