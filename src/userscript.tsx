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

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  async set(key: string, val: string): Promise<void> {
    return GM.setValue(`${this.prefix}_${key}`, val);
  }

  async get(key: string): Promise<string | undefined> {
    return GM.getValue(`${this.prefix}_${key}`);
  }

  async list(): Promise<Record<string, string>> {
    const list = await GM.listValues();

    const tuples = await Promise.all(
      list.map(
        async (k): Promise<[string, string]> => {
          const get = await GM.getValue(k);
          let val: string;
          if (!get) {
            val = "";
          } else {
            val = String(get);
          }
          return [k, val];
        },
      ),
    );

    const record: Record<string, string> = {};
    for (const [k, v] of tuples) {
      record[k] = v;
    }

    return record;
  }
}

(function (): void {
  if (self !== top) {
    return;
  }

  const cache = new GMCache("");

  const providers: Provider[] = [
    new CachedWikipediaProvider(WikipediaLanguage.EN, cache),
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
