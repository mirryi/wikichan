import { Provider } from "@providers";
import { Provider as WikipediaProvider, WikipediaLanguage } from "@providers/wikipedia";
import { ProviderOptions, ProvidersOptions } from "@shared/options";

const NAME_MAP: { [key: string]: (opts: ProviderOptions) => Provider } = {
    "WIKI::EN": (_opts) => new WikipediaProvider(WikipediaLanguage.EN),
} as const;

export class ProviderLoader {
    loadAll(opts: ProvidersOptions): Provider[] {
        const guard = (p: Provider | undefined): p is Provider => p !== undefined;
        return Object.entries(opts)
            .map(([name, providerOpts]) => this.load(name, providerOpts))
            .filter(guard);
    }

    load(name: string, opts: ProviderOptions): Provider | undefined {
        if (opts.enabled) {
            const ctor = NAME_MAP[name];
            if (ctor) {
                return ctor(opts);
            }
        }
        return undefined;
    }
}
