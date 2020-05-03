import { Mode } from "./build/common.config";
import common from "./build/common.config";
import ujsConfig from "./build/ujs.config";

export enum Target {
  ujs = "ujs",
}

const mode = Mode[process.env.MODE] || Mode.development;
const target = Target[process.env.TARGET];

let config = common(mode);

switch (target) {
  case Target.ujs:
    config = ujsConfig(config);
    break;
  default:
    console.log(`Invalid target: ${target}`);
    process.exit(1);
}

module.exports = config;
