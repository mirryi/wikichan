import * as s from "superstruct";

import { ValidationSchema } from "@shared/options";
export { ValidationSchema };
import { Entries } from "@util";

import { Item, Provider } from ".";
import { ALL as WIKIPEDIA_LOADERS } from "./wikipedia";
import { ALL as OWLBOT_LOADERS } from "./owlbot";

/**
 * All provider loader configurations merged in one place.
 */
const ALL_CONFIGS = {
    ...WIKIPEDIA_LOADERS,
    ...OWLBOT_LOADERS,
} as const;
type AllConfigsType = typeof ALL_CONFIGS;

export interface ProviderOptions {
    enabled: boolean;

    cached: boolean;
    cacheDuration: number;
}

export namespace ProviderOptions {
    export const Schema: ValidationSchema<ProviderOptions> = s.object({
        enabled: s.defaulted(s.boolean(), () => false),
        cached: s.defaulted(s.boolean(), () => true),
        cacheDuration: s.defaulted(s.number(), () => 24 * 60 * 60),
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

type ExtractLoaderPairType<L> = L extends LoaderConfig<infer C, infer T, infer P>
    ? Loader<C, T, P>
    : never;
type Loaders = {
    [Name in keyof AllConfigsType]: ExtractLoaderPairType<AllConfigsType[Name]>;
};
export const LOADERS: Loaders = (() => {
    const pairs = Object.entries(ALL_CONFIGS).map(
        ([name, config]) => [name, config.getLoader()] as const,
    );

    // Safety: Above mapping creates the correct pairs.
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return Object.fromEntries(pairs) as Loaders;
})();

// TODO: Prevent Typescript from emitting warning?
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ExtractOptionsType<L> = L extends LoaderConfig<infer C, infer T, infer P>
    ? C
    : never;
export type ProvidersOptions = {
    [Name in keyof AllConfigsType]: ExtractOptionsType<AllConfigsType[Name]>;
};

export namespace ProvidersOptions {
    type SchemaType = {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [Name in keyof Loaders]: Loaders[Name] extends Loader<infer C, infer T, infer P>
            ? ValidationSchema<C>
            : never;
    };

    export const Schema: ValidationSchema<ProvidersOptions> = s.object(
        Entries.map<typeof LOADERS, SchemaType>(LOADERS, ([name, loader]) => [
            name,
            loader.optionsSchema(),
        ]),
    );
}
