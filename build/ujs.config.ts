import path from "path";
import { Configuration } from "webpack";

import { dir } from "./common.config";

function modify(config: Configuration): Configuration {
  config.entry = {
    wikichan: path.resolve(dir.src, "extension"),
  };
  config.output = {
    path: path.resolve(dir.dist, "ujs"),
    filename: "[name].bundle.js",
  };
  return config;
}

export default modify;
