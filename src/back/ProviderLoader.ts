import { Provider, ProvidersOptions, ALL_LOADERS } from "@providers";
import { Entries, StringLiteral } from "@util";

type LoaderName = keyof typeof ALL_LOADERS;
type Loaders = {
    [Name in LoaderName]: ReturnType<typeof ALL_LOADERS[Name]>;
};

const LOADERS = ((): Loaders => {
    const pairs = Object.entries(ALL_LOADERS).map(([name, loaderfn]) => [
        name,
        loaderfn(),
    ]);

    // Safety: Above mapping maps to correct pairs.
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return Object.fromEntries(pairs) as Loaders;
})();

const load = async <K extends LoaderName>(
    name: StringLiteral<K>,
    opts: ProvidersOptions[StringLiteral<K>],
): Promise<Provider> => {
    const loader = LOADERS[name];
    // TODO: Better way to accomplish these type shenanigans?
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
