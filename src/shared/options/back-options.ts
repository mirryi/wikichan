import * as s from "superstruct";

import { ProvidersOptions, ValidationSchema } from "@providers/loader";

export interface BackOptions {
    providers: ProvidersOptions;
}

export namespace BackOptions {
    export const Schema: ValidationSchema<BackOptions> = s.object({
        providers: ProvidersOptions.Schema,
    });
}
