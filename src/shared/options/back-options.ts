import * as s from "superstruct";

import { ProvidersOptions } from "@providers";

import { ValidationSchema } from ".";

export interface BackOptions {
    providers: ProvidersOptions;
}

export namespace BackOptions {
    export const Schema: ValidationSchema<BackOptions> = s.object({
        providers: s.defaulted(
            ProvidersOptions.Schema,
            ProvidersOptions.Schema.create({}),
        ),
    });
}