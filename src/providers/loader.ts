import { Item, Provider } from ".";
import { WIKIPEDIA_LOADERS as WIKIPEDIA_LOADERS } from "./wikipedia";
import { OwlBotProviderLoader } from "./owlbot";

export interface LoaderConfig<C, T extends Item, P extends Provider<T>> {
    getLoader: () => Loader<C, T, P>;
    defaultOptions: () => C;
}

export interface Loader<C, T extends Item, P extends Provider<T>> {
    load(opts: C): Promise<P>;
    reload(opts: C, provider: P): Promise<P>;
}

export interface ProviderOptions<C> {
    enabled: boolean;
    cached: boolean;

    specific: C;
}

export namespace ProviderOptions {
    type Self<C> = ProviderOptions<C>;

    export function Default<C>(specificDefault: () => C): Self<C> {
        // TODO: Disable by default
        return { enabled: true, cached: true, specific: specificDefault() };
    }
}

/*
 * Utility type to extract the specific provider options type from a Loader class.
 */
type ExtractOptionsType<L> = L extends Loader<infer C, Item, Provider<Item>> ? C : never;

export type ProvidersOptions = {
    [Name in keyof typeof ALL_LOADERS]: ProviderOptions<
        ExtractOptionsType<ReturnType<typeof ALL_LOADERS[Name]>>
    >;
};

export namespace ProvidersOptions {
    export const Default = (): ProvidersOptions => {};
}

export const ALL_LOADERS = {
    ...WIKIPEDIA_LOADERS,
    owlbot: () => new OwlBotProviderLoader(),
} as const;
