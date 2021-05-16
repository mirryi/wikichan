export * from "./item";
export * from "./provider";
export * from "./renderer";
export * from "./loader";

import * as s from "superstruct";

import { Entries } from "@util";

import { Loader, LoaderConfig, ValidationSchema } from "./loader";
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
        Entries.map<typeof LOADERS, SchemaType>(LOADERS, ([name, loader]) => {
            const optionsSchema = loader.optionsSchema();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions
            return [name, s.defaulted(optionsSchema as any, optionsSchema.create({}))];
        }),
    );
}
