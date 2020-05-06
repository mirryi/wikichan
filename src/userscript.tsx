import "core-js/stable";
import "regenerator-runtime/runtime";

import { Cache } from "@common/cache";
import { register } from "@common/foreground";
import { Provider, ProviderMerge } from "@providers";
import { WikipediaLanguage, WikipediaProvider } from "@providers/wikipedia";
import { OwlBotProvider } from "@providers/owlbot";

/* eslint-disable @typescript-eslint/camelcase */
declare function GM_setValue(key: string, val: GMValue): Promise<void>;
declare function GM_getValue(key: string): Promise<GMValue>;
/* eslint-enable @typescript-eslint/camelcase */

type GMValue = string | number | boolean;

class GMCache implements Cache {
  prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  set(key: string, val: GMValue): Promise<void> {
    return GM_setValue(key, val).then(() => {
      return;
    });
  }

  async get(key: string): Promise<GMValue> {
    return GM_getValue(key);
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
