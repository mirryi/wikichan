import path from "path";
import { Configuration } from "webpack";
import UserscriptPlugin from "webpack-userscript";

import { dir } from "./common.config";

const config = (production: boolean): Configuration => {
  const dist = path.resolve(dir.dist, "qutebrowser");

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
    ],
  };
};

export default config;
