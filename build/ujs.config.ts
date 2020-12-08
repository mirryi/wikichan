import path from "path";
import { Configuration } from "webpack";
import UserscriptPlugin from "webpack-userscript";

import { dir } from "./common.config";

const config = (production: boolean): Configuration => {
  const dist = path.resolve(dir.dist, "ujs");

  return {
    entry: {
      wikichan: path.resolve(dir.src, "userscript"),
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
        proxyScript: {
          baseUrl: "http://127.0.0.1:5503",
          filename: "[basename].proxy.user.js",
          enable: !production,
        },
      }),
    ],
  };
};

export default config;
