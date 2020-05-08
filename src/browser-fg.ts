import "core-js/stable";
import "regenerator-runtime/runtime";

import { register } from "@common/foreground";
import { Provider, ProviderMerge } from "@providers";
import { WikipediaLanguage, WikipediaProvider } from "@providers/wikipedia";
import { OwlBotProvider } from "@providers/owlbot";

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
