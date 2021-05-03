/* 
eslint-disable
    @typescript-eslint/explicit-module-boundary-types,
    @typescript-eslint/no-explicit-any,
    @typescript-eslint/no-unsafe-member-access
*/

import { BackOptions } from "./back-options";
import { FrontOptions } from "./front-options";
import { Options } from "./options";

export function isOptions(x: any): x is Options {
    return !!x && isBackOptions(x.back) && isFrontOptions(x.front);
}

export function isFrontOptions(_x: any): _x is FrontOptions {
    return true;
}

export function isBackOptions(x: any): x is BackOptions {
    // TODO: Fix
    return !!x;
}
