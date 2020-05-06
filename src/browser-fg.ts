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

  set(key: string, value: BrowserCacheValue): Promise<void> {
    const item: { [key: string]: BrowserCacheValue } = {};
    item[key] = value;

    return browser.storage.local.set(item);
  }

  get(key: string): Promise<BrowserCacheValue> {
    return browser.storage.local.get(key).then((v) => v[key]);
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
