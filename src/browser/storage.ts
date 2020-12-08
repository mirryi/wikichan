import { browser } from "webextension-polyfill-ts";

import Storage from "@common/storage";

import RuntimeMessage from "./message";

export type StorageMessage = StorageGetMessage | StorageSetMessage | StorageListMessage;

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

export class StorageMessenger implements Storage {
  async set(key: string, val: string, duration?: number): Promise<void> {
    const message: StorageSetMessage = {
      kind: "cache::set",
      key: key,
      value: val,
      duration: duration,
    };
    return await browser.runtime.sendMessage(message).then(() => {
      return;
    });
  }

  async get(key: string): Promise<string | undefined> {
    const message: StorageGetMessage = {
      kind: "cache::get",
      key: key,
    };

    return await browser.runtime.sendMessage(message);
  }

  async list(): Promise<Record<string, string>> {
    const message: StorageListMessage = {
      kind: "cache::list",
    };

    return await browser.runtime.sendMessage(message);
  }
}

class BrowserStorage implements Storage {
  prefix: string;

  private static readonly DELIMIT = ":::::";

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  async set(key: string, val: string, duration?: number): Promise<void> {
    const item: { [key: string]: string } = {};

    const k = this.prefixedKey(key);

    let v = val;
    if (duration) {
      const expires = new Date(Date.now() + 1000 * duration);
      v = expires.getTime() + BrowserStorage.DELIMIT + v;
    } else {
      v = "-1" + BrowserStorage.DELIMIT + v;
    }

    item[k] = v;
    return browser.storage.local.set(item);
  }

  async get(key: string): Promise<string | undefined> {
    const k = this.prefixedKey(key);
    const v = await browser.storage.local.get(key).then((v) => v[key]);
    return this.checkParseValue(k, v);
  }

  async list(): Promise<Record<string, string>> {
    const result = await browser.storage.local.get(null);

    const record: Record<string, string> = {};
    for (const k in result) {
      const v = await this.checkParseValue(k, result[k]);
      if (v === undefined) {
        continue;
      }

      const key = this.parseRawKey(k);
      if (!key) {
        await this.remove(k);
        continue;
      }

      record[key] = v;
    }

    return record;
  }

  private async remove(prefixedKey: string): Promise<void> {
    return browser.storage.local.remove(prefixedKey);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async checkParseValue(key: string, rawVal: any): Promise<string | undefined> {
    if (rawVal === undefined) {
      await this.remove(key);
      return undefined;
    }

    const parts = (rawVal as string).split(BrowserStorage.DELIMIT, 2);
    if (parts.length < 2) {
      await this.remove(key);
      return undefined;
    }

    const expiresNum = Number(parts[0]);
    if (expiresNum !== -1) {
      const expires = new Date(expiresNum);
      if (Date.now() > expires.getTime()) {
        await this.remove(key);
        return undefined;
      }
    }

    return parts[1];
  }

  private parseRawKey(rawKey: string): string | undefined {
    const prefix = this.prefix + "_";
    if (rawKey.length <= prefix.length || rawKey.indexOf(prefix) !== 0) {
      return undefined;
    }
    return rawKey.substring(prefix.length + 1);
  }

  private prefixedKey(key: string): string {
    return `${this.prefix}_${key}`;
  }
}

export default BrowserStorage;
