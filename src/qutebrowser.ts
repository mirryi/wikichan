import "gm4-polyfill";

import { register } from "@common/foreground";
import { Provider, ProviderMerge } from "@providers";
import {
    WikipediaLanguage,
    CachedProvider as CachedWikipediaProvider,
} from "@providers/wikipedia";
import { CachedProvider as CachedOwlBotProvider } from "@providers/owlbot";

// import ServerStorage from "./platform/qutebrowser/ServerStorage";
import GMStorage from "./platform/userscript/GMStorage";

(function (): void {
    if (self !== top) {
        return;
    }

    const gmCache = new GMStorage("");
    // const globalCache = new ServerCache("http://127.0.0.1:5000");

    const defaultCacheDuration = 24 * 60 * 60;

    const providers: Provider[] = [
        new CachedWikipediaProvider(WikipediaLanguage.EN, gmCache, defaultCacheDuration),
    ];
    const providerMerge = new ProviderMerge(providers);

    const owlbotToken = process.env.OWLBOT_TOKEN;
    if (!owlbotToken) {
        console.warn("OwlBot API token not provided; cannot query OwlBot");
    } else {
        providers.push(
            new CachedOwlBotProvider(
                owlbotToken as string,
                gmCache,
                defaultCacheDuration,
            ),
        );
    }

    register(window, providerMerge);
})();
