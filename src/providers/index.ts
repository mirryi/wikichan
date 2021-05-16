export * from "./common";

import * as s from "superstruct";

import { Entries } from "@util";

import { ProviderLoader, ProviderLoaderConfig, ValidationSchema } from "./common";
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

type ExtractLoaderPairType<L> = L extends ProviderLoaderConfig<infer C, infer T, infer P>
    ? ProviderLoader<C, T, P>
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
type ExtractOptionsType<L> = L extends ProviderLoaderConfig<infer C, infer T, infer P>
    ? C
    : never;
export type ProvidersOptions = {
    [Name in keyof AllConfigsType]: ExtractOptionsType<AllConfigsType[Name]>;
};

export namespace ProvidersOptions {
    type SchemaType = {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [L in keyof Loaders]: Loaders[L] extends ProviderLoader<infer C, infer T, infer P>
            ? ValidationSchema<C>
            : never;
    };

    export const Schema: ValidationSchema<ProvidersOptions> = s.object(
        Entries.map<typeof LOADERS, SchemaType>(LOADERS, ([name, loader]) => {
            const optionsSchema = loader.optionsSchema();
            // TODO: Temporary
            const defaultIn = name === "wiki.en" ? { enabled: true } : {};
            return [
                name,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions
                s.defaulted(optionsSchema as any, optionsSchema.create(defaultIn)),
            ];
        }),
    );
}
