import * as s from "superstruct";

import { Entries } from "@util";

import { Loader, RendererLoader, RendererLoaderConfig, ValidationSchema } from "./common";
import { WikipediaRendererLoader } from "./wikipedia";
import { OwlBotRendererLoader } from "./owlbot";

/**
 * All provider loader configurations merged in one place.
 */
const ALL_CONFIGS = {
    ...WikipediaRendererLoader.ALL,
    ...OwlBotRendererLoader.ALL,
} as const;
type AllConfigsType = typeof ALL_CONFIGS;

type Loaders = {
    [N in keyof AllConfigsType]: AllConfigsType[N] extends RendererLoaderConfig<
        infer C,
        infer T,
        infer P
    >
        ? RendererLoader<C, T, P>
        : never;
};
export const RENDERER_LOADERS: Loaders = Entries.map<typeof ALL_CONFIGS, Loaders>(
    ALL_CONFIGS,
    ([name, config]) => [name, config.getLoader()],
);

export type RenderersOptions = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [N in keyof Loaders]: Loaders[N] extends Loader<infer C, infer P> ? C : never;
};

export namespace RenderersOptions {
    type SchemaType = {
        [L in keyof Loaders]: ReturnType<Loaders[L]["optionsSchema"]>;
    };

    export const Schema: ValidationSchema<RenderersOptions> = s.object(
        Entries.map<typeof RENDERER_LOADERS, SchemaType>(
            RENDERER_LOADERS,
            ([name, loader]) => {
                const optionsSchema = loader.optionsSchema();
                return [
                    name,
                    // Safety: Mapping ensures the correct pairs.
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions
                    s.defaulted(optionsSchema as any, optionsSchema.create({})),
                ];
            },
        ),
    );
}
