import dotenv from "dotenv";

import { BuildOpts, Opts } from "./opts";
import stylePlugin from "./plugin/style";

export function buildopts(opts: Opts): BuildOpts {
    dotenv.config();
    const define = {};
    for (const k in process.env) {
        define[`process.env.${k}`] = JSON.stringify(process.env[k]);
    }

    return {
        bo: {
            bundle: true,
            minify: true,
            sourcemap: !opts.production ? "inline" : false,
            plugins: [
                stylePlugin({
                    minify: true,
                    inject: { classes: ["wikichan-styles"] },
                }),
            ],
            define,
        },
    };
}
