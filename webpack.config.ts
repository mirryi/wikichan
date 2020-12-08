import webpack from "webpack";
import merge from "webpack-merge";

import common from "./build/common.config";
import ujsConfig from "./build/ujs.config";
import qutebrowserConfig from "./build/qutebrowser.config";
import browserConfig, { Browser } from "./build/wext.config";

enum OtherTargets {
  ujs = "ujs",
  qutebrowser = "qutebrowser",
}

const Target = { ...Browser, ...OtherTargets };
type Target = typeof Target;

function errorExit(message: string): void {
  console.error(message);
  process.exit(1);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
module.exports = (env: any): webpack.Configuration => {
  if (!env || !env.target) {
    errorExit("A target must be specified: --env target=<target>");
  }

  const target = Target[env.target];
  const production: boolean = env.production || false;

  let config = common(production);
  switch (target) {
    case Target.ujs:
      config = merge(config, ujsConfig(production));
      break;
    case Target.qutebrowser:
      config = merge(config, qutebrowserConfig(production));
      break;
    case Target.firefox:
    case Target.chrome:
    case Target.opera:
    case Target.edge:
      config = merge(config, browserConfig(production, target));
      break;
    default:
      errorExit(`Invalid target: ${target}`);
  }

  return config;
};
