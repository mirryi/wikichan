import "core-js/stable";
import "regenerator-runtime/runtime";

import { register } from "@common/foreground";
import { Provider, ProviderMerge } from "@providers";
import { CachedWikipediaProvider, WikipediaLanguage } from "@providers/wikipedia";
import { CachedOwlBotProvider } from "@providers/owlbot";

import { CacheMessenger } from "./browser/cache";

(function (): void {
  if (self !== top) {
    return;
  }

  const cache = new CacheMessenger();
  const defaultCacheDuration = 24 * 60 * 60;

  const providers: Provider[] = [
    new CachedWikipediaProvider(WikipediaLanguage.EN, cache, defaultCacheDuration),
  ];
  const providerMerge = new ProviderMerge(providers);

  const owlbotToken = process.env.OWLBOT_TOKEN;
  if (!owlbotToken) {
    console.warn("OwlBot API token not provided; cannot query OwlBot");
  } else {
    providers.push(
      new CachedOwlBotProvider(owlbotToken as string, cache, defaultCacheDuration),
    );
  }

  register(window, providerMerge);
})();
