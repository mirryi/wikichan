import * as s from "superstruct";

import { RenderersOptions } from "@providers";

import { ValidationSchema } from ".";

export interface InputOptions {
    holdkeys: {
        ctrl: boolean;
        alt: boolean;
        shift: boolean;
    };
}

export namespace InputOptions {
    export const Schema: ValidationSchema<InputOptions> = s.object({
        holdkeys: s.defaulted(
            s.object({ ctrl: s.boolean(), alt: s.boolean(), shift: s.boolean() }),
            { ctrl: true, alt: false, shift: false },
        ),
    });
}

export interface FrontOptions {
    input: InputOptions;
    renderers: RenderersOptions;
}

export namespace FrontOptions {
    export const Schema: ValidationSchema<FrontOptions> = s.object({
        input: s.defaulted(InputOptions.Schema, InputOptions.Schema.create({})),
        renderers: s.defaulted(
            RenderersOptions.Schema,
            RenderersOptions.Schema.create({}),
        ),
    });
}
