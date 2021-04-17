import * as path from "path";

import { BuildOpts, Opts } from "./opts";

export function buildopts(opts: Opts): BuildOpts {
    const outdir = path.resolve(opts.outdir, "userscript");

    return {
        bo: {
            entryPoints: [path.resolve(opts.srcdir, "userscript.ts")],
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
