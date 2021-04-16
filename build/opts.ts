import { BuildOptions } from "esbuild";

export interface BuildOpts {
    bo: BuildOptions;
    pre?: () => Promise<void>;
    post?: () => Promise<void>;
}

export interface Opts {
    name: string;
    version: string;
    author: string;
    desc: string;
    homepage: string;

    target: Platform;
    production: boolean;

    srcdir: string;
    outdir: string;
    rootdir: string;
}

type Platform = Browser | "qutebrowser" | "userscript";
type Browser = "chrome" | "edge" | "firefox" | "opera";

export const isBrowser = (s: string): s is Browser => {
    return s == "chrome" || s == "edge" || s == "firefox" || s == "opera";
};

export const isPlatform = (s: string): s is Platform => {
    return isBrowser(s) || s == "qutebrowser" || s == "userscript";
};
