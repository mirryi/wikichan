import { ValidationSchema } from "@shared/options";
export { ValidationSchema };

export interface LoaderConfig<C, P> {
    /*
     * Get the loader for this provider type.
     */
    getLoader: () => Loader<C, P>;
}

export interface Loader<C, P> {
    load(opts: C): P;

    optionsSchema(): ValidationSchema<C>;
}
