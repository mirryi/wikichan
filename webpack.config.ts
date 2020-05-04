import merge from "webpack-merge";

import common from "./build/common.config";
import ujsConfig from "./build/ujs.config";

export enum Target {
  ujs = "ujs",
}

const target = Target[process.env.TARGET];

let config = common();

switch (target) {
  case Target.ujs:
    config = merge(config, ujsConfig());
    break;
  default:
    console.log(`Invalid target: ${target}`);
    process.exit(1);
}

module.exports = config;
