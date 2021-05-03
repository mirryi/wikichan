import { Provider, ProvidersOptions, LOADERS } from "@providers";
import { Entries } from "@util";

const load = async <K extends keyof typeof LOADERS>(
    name: K,
    opts: ProvidersOptions[K],
): Promise<Provider> => {
    const loader = LOADERS[name];
    // Safety: The types of the loader parameter and options must match.
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-explicit-any
    return await loader.load(opts.specific as any);
};

const loadAll = async (opts: ProvidersOptions): Promise<Provider[]> => {
    const entries = Entries.from(opts);
    const promises = entries
        .filter(([, popts]) => popts.enabled)
        .map((pair) => load(pair[0], pair[1]));

    return await Promise.all(promises);
};

export const ProviderLoader = { load, loadAll };
