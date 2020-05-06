import "core-js/stable";
import "regenerator-runtime/runtime";

import { register } from "@common/foreground";
import { WikipediaLanguage, WikipediaProvider } from "@providers/wikipedia";

(function (): void {
  if (self !== top) {
    return;
  }

  const providers = [new WikipediaProvider(WikipediaLanguage.EN)];
  register(window, providers);
})();
