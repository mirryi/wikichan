import { BuildOpts, Opts } from "./opts";
import envfilePlugin from "./plugin/envfile";
import stylePlugin from "./plugin/style";

export function buildopts(opts: Opts): BuildOpts {
    return {
        bo: {
            bundle: true,
            minify: true,
            sourcemap: !opts.production ? "inline" : false,
            plugins: [
                envfilePlugin(),
                stylePlugin({
                    minify: true,
                    inject: { classes: ["wikichan-styles"] },
                }),
            ],
        },
    };
}
