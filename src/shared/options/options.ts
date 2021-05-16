import * as s from "superstruct";

import { ValidationSchema } from "@common/storage";
export { ValidationSchema };

import { BackOptions } from "./back-options";
import { FrontOptions } from "./front-options";

export interface OptionsV1 {
    version: "v1";
    back: BackOptions;
    front: FrontOptions;
}

export type Options = OptionsV1;

export namespace Options {
    export const Schema: ValidationSchema<Options> = s.object({
        version: s.defaulted(s.literal("v1"), "v1"),
        back: s.defaulted(BackOptions.Schema, BackOptions.Schema.create({})),
        front: s.defaulted(FrontOptions.Schema, FrontOptions.Schema.create({})),
    });
}
