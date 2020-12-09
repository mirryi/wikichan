import { browser } from "webextension-polyfill-ts";

import PlatformStorage from "@common/PlatformStorage";
import {
  StorageGetMessage,
  StorageListMessage,
  StorageSetMessage,
} from "./StorageMessage";

class StorageMessenger implements PlatformStorage {
  async set(key: string, val: string, duration?: number): Promise<void> {
    const message: StorageSetMessage = {
      kind: "cache::set",
      key: key,
      value: val,
      duration: duration,
    };
    return await browser.runtime.sendMessage(message).then(() => {
      return;
    });
  }

  async get(key: string): Promise<string | undefined> {
    const message: StorageGetMessage = {
      kind: "cache::get",
      key: key,
    };

    return await browser.runtime.sendMessage(message);
  }

  async list(): Promise<Record<string, string>> {
    const message: StorageListMessage = {
      kind: "cache::list",
    };

    return await browser.runtime.sendMessage(message);
  }
}

export default StorageMessenger;
