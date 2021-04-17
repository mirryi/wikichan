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

export function deepmerge<T>(target: T, ...sources: T[]): T | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function isObject(item: any): boolean {
        return item && typeof item === "object" && !Array.isArray(item);
    }

    if (!sources.length) {
        return target;
    }

    const source = sources.shift();
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                deepmerge(target[key], source[key]);
            } else if (Array.isArray(source[key])) {
                if (Array.isArray(target[key])) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    Object.assign(target, { [key]: [...target[key], ...source[key]] });
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return deepmerge(target, ...sources);
}
