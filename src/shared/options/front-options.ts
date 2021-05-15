import s from "superstruct";

import { ValidationSchema } from ".";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FrontOptions {}

export namespace FrontOptions {
    export const Schema: ValidationSchema<FrontOptions> = s.object({});
}
