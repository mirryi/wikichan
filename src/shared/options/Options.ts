import { BackOptions } from "./BackOptions";
import { FrontOptions } from "./FrontOptions";

export interface Options {
    back: BackOptions;
    front: FrontOptions;
}

export namespace Options {
    export function Default(): Options {
        return {
            back: BackOptions.Default(),
            front: FrontOptions.Default(),
        };
    }

    export function guard(x: any): x is Options {
        return !!x && BackOptions.guard(x.back);
    }
}
