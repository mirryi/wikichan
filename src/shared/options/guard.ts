/* 
eslint-disable
    @typescript-eslint/explicit-module-boundary-types,
    @typescript-eslint/no-explicit-any,
    @typescript-eslint/no-unsafe-member-access
*/

import { BackOptions, ProviderOptions, ProvidersOptions } from "./BackOptions";
import { FrontOptions } from "./FrontOptions";
import { Options } from "./Options";

export function isOptions(x: any): x is Options {
    return !!x && isBackOptions(x.back) && isFrontOptions(x.front);
}

export function isFrontOptions(_x: any): _x is FrontOptions {
    return true;
}

export function isBackOptions(x: any): x is BackOptions {
    return !!x && isProvidersOptions(x.providers);
}

export function isProvidersOptions(x: any): x is ProvidersOptions {
    return (
        typeof x === "object" &&
        Object.entries(x).filter(([_k, v]: [string, unknown]) => !isProviderOptions(v))
            .length > 0
    );
}

export function isProviderOptions(x: any): x is ProviderOptions {
    return typeof x?.enabled === "boolean" && typeof x?.cached === "boolean";
}
