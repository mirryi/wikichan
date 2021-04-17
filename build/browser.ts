import * as path from "path";
import fs from "fs";

import { BuildOpts, Opts } from "./opts";

const ENTRIES = ["browser-fg.ts", "browser-bg.ts"];

export function buildopts(opts: Opts): BuildOpts {
    const outdir = path.resolve(opts.outdir, opts.target);
    return {
        bo: {
            entryPoints: ENTRIES.map((f) => path.resolve(opts.srcdir, f)),
            outdir,
        },
        post: async () => {
            await fs.promises.copyFile(
                path.resolve(opts.rootdir, "manifest.json"),
                path.resolve(outdir, "manifest.json"),
            );
        },
    };
}
