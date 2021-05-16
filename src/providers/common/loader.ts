import * as s from "superstruct";

import { ValidationSchema } from "@shared/options";
export { ValidationSchema };

import { Item, Provider } from ".";

export interface ProviderOptions {
    enabled: boolean;

    cached: boolean;
    cacheDuration: number;
}

export namespace ProviderOptions {
    export const Schema: ValidationSchema<ProviderOptions> = s.object({
        enabled: s.defaulted(s.boolean(), false),
        cached: s.defaulted(s.boolean(), true),
        cacheDuration: s.defaulted(s.number(), 24 * 60 * 60),
    });
}

export interface LoaderConfig<
    C extends ProviderOptions,
    T extends Item,
    P extends Provider<T>
> {
    /*
     * Get the loader for this provider type.
     */
    getLoader: () => Loader<C, T, P>;
}

export interface Loader<
    C extends ProviderOptions,
    T extends Item,
    P extends Provider<T>
> {
    load(opts: C): P;

    optionsSchema(): ValidationSchema<C>;
    itemSchema(): ValidationSchema<T>;
}
