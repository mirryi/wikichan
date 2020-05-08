import { Cache } from "@common/cache";
import { browser } from "webextension-polyfill-ts";

export class BrowserCache implements Cache {
  prefix: string;

  private static delimit = ":::::";

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  async set(key: string, val: string, duration: number): Promise<void> {
    const item: { [key: string]: string } = {};

    const k = this.prefixedKey(key);
    const expires = new Date(Date.now() + 1000 * duration);
    const v = expires.getTime() + BrowserCache.delimit + val;

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

  private async checkParseValue(key: string, rawVal: any): Promise<string | undefined> {
    if (rawVal === undefined) {
      await this.remove(key);
      return undefined;
    }

    const parts = (rawVal as string).split(BrowserCache.delimit, 2);
    if (parts.length < 2) {
      await this.remove(key);
      return undefined;
    }

    const expires = new Date(Number(parts[0]));
    if (Date.now() > expires.getTime()) {
      await this.remove(key);
      return undefined;
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
