import "core-js/stable";
import "regenerator-runtime/runtime";

import { browser } from "webextension-polyfill-ts";

import { Cache } from "@common/cache";
import { register } from "@common/foreground";
import { Provider, ProviderMerge } from "@providers";
import { WikipediaLanguage, WikipediaProvider } from "@providers/wikipedia";
import { OwlBotProvider } from "@providers/owlbot";

type BrowserCacheValue = number | string | boolean | Array<number | string | boolean>;

class BrowserCache implements Cache {
  prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  async set(key: string, value: string): Promise<void> {
    const item: { [key: string]: BrowserCacheValue } = {};
    item[key] = value;

    return browser.storage.local.set(item);
  }

  async get(key: string): Promise<string | undefined> {
    return browser.storage.local.get(key).then((v) => v[key]);
  }

  async list(): Promise<Record<string, string>> {
    return browser.storage.local.get(null);
  }
}

(function (): void {
  if (self !== top) {
    return;
  }

  const providers: Provider[] = [new WikipediaProvider(WikipediaLanguage.EN)];
  const providerMerge = new ProviderMerge(providers);

  const owlbotToken = process.env.OWLBOT_TOKEN;
  if (!owlbotToken) {
    console.warn("OwlBot API token not provided; cannot query OwlBot");
  } else {
    providers.push(new OwlBotProvider(owlbotToken as string));
  }

  register(window, providerMerge);
})();
