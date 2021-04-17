import * as esbuild from "esbuild";
import * as path from "path";

import { Opts, isPlatform, BuildOpts, deepmerge } from "./opts";
import * as browser from "./browser";
import * as common from "./common";
import * as qutebrowser from "./qutebrowser";
import * as userscript from "./userscript";

import packagejson from "../package.json";

function buildopts(opts: Opts): BuildOpts {
    const bo = common.buildopts(opts);
    let sbo: BuildOpts;
    switch (opts.target) {
        case "qutebrowser":
            sbo = qutebrowser.buildopts(opts);
            break;
        case "userscript":
            sbo = userscript.buildopts(opts);
            break;
        default:
            sbo = browser.buildopts(opts);
            break;
    }

    return deepmerge(bo, sbo);
}

async function build(opts: Opts): Promise<void> {
    const bo = buildopts(opts);
    try {
        if (bo.pre) {
            await bo.pre();
        }

        // eslint-ignore-next-line @typescript-eslint/no-empty-function
        await esbuild.build(bo.bo).then((_result) => {});

        if (bo.post) {
            await bo.post();
        }
    } catch (_e) {}
}

async function serve(opts: Opts): Promise<void> {
    const bo = buildopts(opts);
    bo.bo.watch = {
        onRebuild: async (error, _result) => {
            if (error) {
                console.error("Rebuild failed!");
            } else {
                console.log("Rebuild succeeded!");
                await bo.post();
            }
        },
    };

    try {
        await esbuild.build(bo.bo);
    } catch (_e) {}
}

function exit(message: string): void {
    console.log("Failed: " + message);
    process.exit(1);
}

const args = process.argv.slice(2);
const cmd = args[0];

const rootdir = path.resolve(__dirname, "..");
const srcdir = path.resolve(rootdir, "src");
const outdir = path.resolve(rootdir, "dist");

if (cmd === "build") {
    const mode = args[1];
    let production: boolean;
    switch (mode) {
        case "production":
            production = true;
            break;
        case "development":
            production = false;
            break;
        default:
            exit(`invalid mode '${mode}', must be 'development' or 'production'`);
            break;
    }

    const target = args[2];
    if (!isPlatform(target)) {
        exit(`invalid target '${target}'`);
    } else {
        build({
            name: packagejson.name,
            version: packagejson.version,
            author: packagejson.author,
            desc: packagejson.description,
            homepage: packagejson.homepage,

            production: production,
            target: target,

            srcdir: srcdir,
            outdir: outdir,
            rootdir: rootdir,
        });
    }
} else if (cmd === "serve") {
    const target = args[1];
    if (!isPlatform(target)) {
        exit(`invalid target '${target}'`);
    } else {
        serve({
            name: packagejson.name,
            version: packagejson.version,
            author: packagejson.author,
            desc: packagejson.description,
            homepage: packagejson.homepage,

            production: false,
            target: target,

            srcdir: srcdir,
            outdir: outdir,
            rootdir: rootdir,
        });
    }
} else {
    exit(`invalid command '${cmd}', must 'build' or 'serve'`);
}
