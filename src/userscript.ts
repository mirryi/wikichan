import "core-js/stable";
import "regenerator-runtime/runtime";
import "gm4-polyfill";

import { register } from "@common/foreground";
import { Provider, ProviderMerge } from "@providers";
import {
  WikipediaLanguage,
  CachedProvider as CachedWikipediaProvider,
} from "@providers/wikipedia";
import { CachedProvider as CachedOwlBotProvider } from "@providers/owlbot";

import GMStorage from "./userscript/GMStorage";

(function (): void {
  if (self !== top) {
    return;
  }

  const cache = new GMStorage("");
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
