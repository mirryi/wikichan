import * as path from "path";
import fs from "fs";

import { BuildOpts, Opts } from "./opts";

const SERVER_FILES = ["schema.sql", "server.py"];

export function buildopts(opts: Opts): BuildOpts {
    const outdir = path.resolve(opts.outdir, "qutebrowser");

    return {
        bo: {
            entryPoints: [path.resolve(opts.srcdir, "qutebrowser.ts")],
            outfile: path.resolve(outdir, opts.name + ".user.js"),

            banner: {
                js: renderBanner({
                    name: opts.name,
                    desc: opts.desc,
                    author: opts.author,
                    version: opts.version,
                    homepage: opts.homepage,
                    include: "*://*/*",
                    grant: [
                        "GM.setValue",
                        "GM.getValue",
                        "GM.listValues",
                        "GM.deleteValue",
                    ],
                }),
            },
        },
        post: async () => {
            const copyPromises = SERVER_FILES.map((f) =>
                fs.promises.copyFile(
                    path.resolve(opts.rootdir, "qutebrowser", f),
                    path.resolve(outdir, f),
                ),
            );

            await Promise.all(copyPromises);
        },
    };
}

interface Banner {
    name: string;
    desc: string;
    author: string;
    version: string;
    homepage: string;
    include: string;
    grant: string[];
}

function renderBanner(b: Banner): string {
    return `// ==UserScript==
// @name        ${b.name}
// @version     ${b.version}
// @author      ${b.author}
// @description ${b.desc}
// @homepage    ${b.homepage}
// @include     ${b.include}
// @grant       ${b.grant.reduce((acc, g) => acc + `\n// @grant       ${g}`)}
// ==/UserScript==
`;
}
