import path from "path";
import { Configuration } from "webpack";
import UserscriptPlugin from "webpack-userscript";
import CopyPlugin from "copy-webpack-plugin";

import { dir } from "./common.config";

const config = (production: boolean): Configuration => {
  const dist = path.resolve(dir.dist, "qutebrowser");

  const copyPatterns = production
    ? [{ from: path.join(dir.root, "qutebrowser"), to: dist }]
    : [];

  return {
    devtool: production ? undefined : "inline-source-map",
    entry: {
      wikichan: path.resolve(dir.src, "qutebrowser"),
    },
    output: {
      path: dist,
      filename: "[name].user.js",
    },
    plugins: [
      new UserscriptPlugin({
        headers: {
          name: "[name]",
          description: "[description]",
          author: "[author]",
          version: production ? "[version]" : "[version]-build.[buildNo]",
          include: "*://*/*",
          grant: ["GM.setValue", "GM.getValue", "GM.listValues", "GM.deleteValue"],
        },
        pretty: false,
      }),
      new CopyPlugin({
        patterns: copyPatterns,
      }),
    ],
  };
};

export default config;
