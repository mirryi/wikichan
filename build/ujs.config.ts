import path from "path";
import { Configuration } from "webpack";
import UserscriptPlugin from "webpack-userscript";

import { dir } from "./common.config";

const config = (): Configuration => {
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
          version: "[version]",
          include: "*://*/*",
        },
        pretty: false,
      }),
    ],
  };
};

export default config;
