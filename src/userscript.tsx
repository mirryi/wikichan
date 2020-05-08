import "core-js/stable";
import "regenerator-runtime/runtime";
import "gm4-polyfill";

import { Cache } from "@common/cache";
import { register } from "@common/foreground";
import { Provider, ProviderMerge } from "@providers";
import { WikipediaLanguage, CachedWikipediaProvider } from "@providers/wikipedia";
import { OwlBotProvider } from "@providers/owlbot";

type GMValue = string | number | boolean;

class GMCache implements Cache {
  prefix: string;

  private static delimit = ":::::";

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  async set(key: string, val: string, duration: number): Promise<void> {
    const k = `${this.prefix}_${key}`;

    const expires = new Date(Date.now() + 1000 * duration);
    const v = expires.getTime() + GMCache.delimit + val;

    return GM.setValue(k, v);
  }

  async get(key: string): Promise<string | undefined> {
    const k = `${this.prefix}_${key}`;
    return this.getRaw(k);
  }

  async list(): Promise<Record<string, string>> {
    const list = await GM.listValues();

    const tuples = (
      await Promise.all(
        list.map(
          async (k): Promise<[string, string] | undefined> => {
            const val = await this.getRaw(k);
            if (val === undefined) {
              return undefined;
            }
            return [k, val];
          },
        ),
      )
    ).filter((v) => v !== undefined) as [string, string][];

    const record: Record<string, string> = {};
    for (const [k, v] of tuples) {
      record[k] = v;
    }

    return record;
  }

  private async getRaw(fullKey: string): Promise<string | undefined> {
    const k = fullKey;
    const v = await GM.getValue(k);
    if (v === undefined) {
      await this.remove(k);
      return v;
    }

    const parts = (v as string).split(GMCache.delimit, 2);
    if (parts.length < 2) {
      await this.remove(k);
      return undefined;
    }

    const expires = new Date(Number(parts[0]));
    if (Date.now() > expires.getTime()) {
      await this.remove(k);
      return undefined;
    }

    return parts[1];
  }

  private async remove(fullKey: string): Promise<void> {
    return GM.deleteValue(fullKey);
  }
}

(function (): void {
  if (self !== top) {
    return;
  }

  const cache = new GMCache("");

  const providers: Provider[] = [
    new CachedWikipediaProvider(WikipediaLanguage.EN, cache, 24 * 60 * 60),
  ];
  const providerMerge = new ProviderMerge(providers);

  const owlbotToken = process.env.OWLBOT_TOKEN;
  if (!owlbotToken) {
    console.warn("OwlBot API token not provided; cannot query OwlBot");
  } else {
    providers.push(new OwlBotProvider(owlbotToken as string));
  }

  register(window, providerMerge);
})();
