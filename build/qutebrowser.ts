import * as path from "path";
import fs from "fs";

import * as userscript from "./userscript";
import { BuildOpts, Opts, deepmerge } from "./opts";

const SERVER_FILES = ["schema.sql", "server.py"];

export function buildopts(opts: Opts): BuildOpts {
    const outdir = path.resolve(opts.outdir, "qutebrowser");

    const bo = userscript.buildopts(opts);
    bo.bo.entryPoints = [path.resolve(opts.srcdir, "qutebrowser.ts")];

    return deepmerge(bo, {
        bo: {
            outfile: path.resolve(outdir, opts.name + ".user.js"),
        },
        post: async () => {
            await Promise.all(
                SERVER_FILES.map((f) =>
                    fs.promises.copyFile(
                        path.resolve(opts.rootdir, "qutebrowser", f),
                        path.resolve(outdir, f),
                    ),
                ),
            );
        },
    });
}
