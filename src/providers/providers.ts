import * as s from "superstruct";

import { Entries } from "@util";

import { Loader, ProviderLoader, ProviderLoaderConfig, ValidationSchema } from "./common";
import { OwlBotProviderLoader } from "./owlbot";
import { WikipediaProviderLoader } from "./wikipedia";

/**
 * All provider loader configurations merged in one place.
 */
const ALL_CONFIGS = {
    ...WikipediaProviderLoader.ALL,
    ...OwlBotProviderLoader.ALL,
} as const;
type AllConfigsType = typeof ALL_CONFIGS;

type Loaders = {
    [Name in keyof AllConfigsType]: AllConfigsType[Name] extends ProviderLoaderConfig<
        infer C,
        infer T,
        infer P
    >
        ? ProviderLoader<C, T, P>
        : never;
};
export const PROVIDER_LOADERS: Loaders = Entries.map(ALL_CONFIGS, ([name, config]) => [
    name,
    config.getLoader(),
]);

// TODO: Prevent Typescript from emitting warning?
export type ProvidersOptions = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [Name in keyof Loaders]: Loaders[Name] extends Loader<infer C, infer P> ? C : never;
};

export namespace ProvidersOptions {
    type SchemaType = {
        [L in keyof Loaders]: ReturnType<Loaders[L]["optionsSchema"]>;
    };

    export const Schema: ValidationSchema<ProvidersOptions> = s.object(
        Entries.map<typeof PROVIDER_LOADERS, SchemaType>(
            PROVIDER_LOADERS,
            ([name, loader]) => {
                const optionsSchema = loader.optionsSchema();
                // TODO: Temporary
                const defaultIn = name === "wiki.en" ? { enabled: true } : {};
                return [
                    name,
                    // Safety: Mapping ensures the correct pairs.
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions
                    s.defaulted(optionsSchema as any, optionsSchema.create(defaultIn)),
                ];
            },
        ),
    );
}
