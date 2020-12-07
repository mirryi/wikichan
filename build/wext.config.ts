import path from "path";
import { Configuration } from "webpack";
import WebExtensionPlugin from "webpack-webextension-plugin";

import { dir } from "./common.config";

export enum Browser {
  firefox = "firefox",
  chrome = "chrome",
  edge = "edge",
  opera = "opera",
}

const config = (_: boolean, browser: Browser): Configuration => {
  const dist = path.resolve(dir.dist, browser);
  return {
    entry: {
      fg: path.resolve(dir.src, "browser-fg"),
      bg: path.resolve(dir.src, "browser-bg"),
    },
    output: {
      path: dist,
      filename: "[name].bundle.js",
    },
    plugins: [
      new WebExtensionPlugin({
        vendor: browser,
      }),
    ],
  };
};

export default config;
