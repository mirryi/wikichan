import { BuildOptions } from "esbuild";
import * as path from "path";

import { Opts } from "./opts";

export function buildopts(opts: Opts): BuildOptions {
    return {
        entryPoints: [path.resolve(opts.srcdir, "qutebrowser.ts")],
        outfile: path.resolve(opts.outdir, opts.name + ".user.js"),

        banner: {
            js: renderBanner({
                name: opts.name,
                desc: opts.desc,
                author: opts.author,
                version: opts.version,
                homepage: opts.homepage,
                include: "*://*/*",
                grant: ["GM.setValue", "GM.getValue", "GM.listValues", "GM.deleteValue"],
            }),
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
