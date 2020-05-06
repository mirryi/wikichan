import merge from "webpack-merge";

import { default as common, Mode } from "./build/common.config";
import ujsConfig from "./build/ujs.config";
import { default as browserConfig, Browser } from "./build/wext.config";

enum OtherTargets {
  ujs = "ujs",
}

const Target = { ...Browser, ...OtherTargets };
type Target = typeof Target;

const mode = Mode[process.env.MODE] || Mode.production;
const target = Target[process.env.TARGET];

let config = common(mode);

switch (target) {
  case Target.ujs:
    config = merge(config, ujsConfig());
    break;
  case Target.firefox:
    config = merge(config, browserConfig(target));
    break;
  default:
    console.log(`Invalid target: ${target}`);
    process.exit(1);
}

module.exports = config;
