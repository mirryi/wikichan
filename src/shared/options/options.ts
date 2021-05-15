import * as s from "superstruct";

import { ValidationSchema } from "@common/storage";
export { ValidationSchema };

import { BackOptions } from "./back-options";
import { FrontOptions } from "./front-options";

export interface Options {
    back: BackOptions;
    front: FrontOptions;
}

export namespace Options {
    export const Schema: ValidationSchema<Options> = s.object({
        back: BackOptions.Schema,
        front: FrontOptions.Schema,
    });
}
