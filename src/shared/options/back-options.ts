import * as s from "superstruct";

import { ProvidersOptions, ValidationSchema } from "@providers";

export interface BackOptions {
    providers: ProvidersOptions;
}

export namespace BackOptions {
    export const Schema: ValidationSchema<BackOptions> = s.object({
        providers: ProvidersOptions.Schema,
    });
}
