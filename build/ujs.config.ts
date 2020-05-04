import path from "path";
import { Configuration } from "webpack";

import { dir } from "./common.config";

const config = (): Configuration => {
  const dist = path.resolve(dir.dist, "ujs");

  return {
    entry: {
      wikichan: path.resolve(dir.src, "extension"),
    },
    output: {
      path: dist,
      filename: "[name].user.js",
    },
  };
};

export default config;
