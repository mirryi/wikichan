import merge from "webpack-merge";

import { default as common, Mode } from "./build/common.config";
import ujsConfig from "./build/ujs.config";

export enum Target {
  ujs = "ujs",
}

const mode = Mode[process.env.MODE] || Mode.production;
console.log(mode);
const target = Target[process.env.TARGET];

let config = common(mode);

switch (target) {
  case Target.ujs:
    config = merge(config, ujsConfig());
    break;
  default:
    console.log(`Invalid target: ${target}`);
    process.exit(1);
}

module.exports = config;
