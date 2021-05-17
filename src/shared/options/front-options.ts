import * as s from "superstruct";

import { RenderersOptions } from "@providers";

import { ValidationSchema } from ".";

export interface FrontOptions {
    renderers: RenderersOptions;
}

export namespace FrontOptions {
    export const Schema: ValidationSchema<FrontOptions> = s.object({
        renderers: s.defaulted(
            RenderersOptions.Schema,
            RenderersOptions.Schema.create({}),
        ),
    });
}
