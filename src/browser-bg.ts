import "core-js/stable";
import "regenerator-runtime/runtime";
import { browser } from "webextension-polyfill-ts";

import BrowserCache, {
  CacheGetMessage,
  CacheSetMessage,
  isCacheGetMessage,
  isCacheSetMessage,
  isCacheListMessage,
} from "./browser/cache";
import RuntimeMessage from "./browser/message";

(function (): void {
  const cache = new BrowserCache("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cacheHandler = async (m: RuntimeMessage): Promise<any> => {
    if (isCacheGetMessage(m)) {
      const message = m as CacheGetMessage;
      return await cache.get(message.key);
    } else if (isCacheSetMessage(m)) {
      const message = m as CacheSetMessage;
      return await cache.set(message.key, message.value, message.duration);
    } else if (isCacheListMessage(m)) {
      return await cache.list();
    } else {
      return Promise.reject("invalid cache message type");
    }
  };

  browser.runtime.onMessage.addListener(
    async (m: any): Promise<any> => {
      if (!m.kind) {
        return Promise.reject("invalid message structure");
      }

      const message = m as RuntimeMessage;
      const baseKind = message.kind.split("::")[0];
      switch (baseKind) {
        case "cache": {
          const response = await cacheHandler(message);
          return response;
        }
        default: {
          return Promise.reject("invalid message kind");
        }
      }
    },
  );
})();
