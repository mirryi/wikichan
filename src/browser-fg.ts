import "core-js/stable";
import "regenerator-runtime/runtime";

import { register } from "@common/foreground";
import { Provider, ProviderMerge } from "@providers";
import {
    CachedProvider as CachedWikipediaProvider,
    WikipediaLanguage,
} from "@providers/wikipedia";
import { CachedProvider as CachedOwlBotProvider } from "@providers/owlbot";

import StorageMessenger from "./platform/browser/StorageMessenger";

(function (): void {
    if (self !== top) {
        return;
    }

    const cache = new StorageMessenger();
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
