import { CachedProvider, Provider, ProvidersOptions, LOADERS } from "@providers";
import { Entries } from "@util";
import { BackStorage } from "./back-storage";

type ExtractItemType<P> = P extends Provider<infer T> ? T : never;
export class ProviderLoader {
    constructor(private storage: BackStorage) {}

    async load<K extends keyof typeof LOADERS & string>(
        name: K,
        opts: ProvidersOptions[K],
    ): Promise<Provider> {
        const loader = LOADERS[name];
        // Safety: The types of the loader parameter and options must match.
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-explicit-any
        const provider = loader.load(opts as any);

        if (opts.cached) {
            // TODO: Handle undefined case
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const handler = this.storage.cacheHandle<ExtractItemType<typeof provider>>(
                `provider::${name}`,
                // Safety: The types of the loader and the schema it returns
                // must match.
                // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-explicit-any
                loader.itemSchema() as any,
            )!;
            return new CachedProvider(provider, handler, opts.cacheDuration);
        } else {
            return provider;
        }
    }

    async loadAll(opts: ProvidersOptions): Promise<Provider[]> {
        const entries = Entries.iter(opts);
        const promises = entries
            .filter(([, popts]) => popts.enabled)
            .map((pair) => this.load(pair[0], pair[1]));

        return await Promise.all(promises);
    }
}
