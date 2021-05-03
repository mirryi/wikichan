import { BackOptions } from "./back-options";
import { FrontOptions } from "./front-options";

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
}
