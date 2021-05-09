import { Item, Provider } from ".";
import { ALL as WIKIPEDIA_LOADERS } from "./wikipedia";
import { ALL as OWLBOT_LOADERS } from "./owlbot";

const ALL_CONFIGS = {
    ...WIKIPEDIA_LOADERS,
    ...OWLBOT_LOADERS,
} as const;
type AllConfigsType = typeof ALL_CONFIGS;

export interface ProviderOptions<C> {
    enabled: boolean;

    cached: boolean;
    cacheDuration: number;

    specific: C;
}

export namespace ProviderOptions {
    export function Default<C>(specificDefault: () => C): ProviderOptions<C> {
        // TODO: Disable by default
        return {
            enabled: false,
            cached: true,
            cacheDuration: 24 * 60 * 60,
            specific: specificDefault(),
        };
    }
}

export interface LoaderConfig<C, T extends Item, P extends Provider<T>> {
    /*
     * Get the loader for this provider type.
     */
    getLoader: () => Loader<C, T, P>;
}

export interface Loader<C, T extends Item, P extends Provider<T>> {
    load(opts: C): P;
    reload(opts: C, provider: P): P;
    defaultOptions: () => C;

    cachedValidator: () => (x: unknown) => x is T;
}

type ExtractLoaderPairType<L> = L extends LoaderConfig<unknown, Item, Provider<Item>>
    ? ReturnType<L["getLoader"]>
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

type ExtractOptionsType<L> = L extends LoaderConfig<infer C, Item, Provider<Item>>
    ? C
    : never;
export type ProvidersOptions = {
    [Name in keyof AllConfigsType]: ProviderOptions<
        ExtractOptionsType<AllConfigsType[Name]>
    >;
};

export namespace ProvidersOptions {
    export const Default: () => ProvidersOptions = (() => {
        const pairs = Object.entries(LOADERS).map(([name, config]) => {
            const opts = ProviderOptions.Default(() => config.defaultOptions());
            // TODO: Temporary
            if (name === "wiki.en") {
                opts.enabled = true;
            }
            return [name, opts] as const;
        });

        // Safety: Above mapping creates the correct pairs.
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        return () => Object.fromEntries(pairs) as ProvidersOptions;
    })();
}
