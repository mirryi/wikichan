export interface BackOptions {
    providers: ProvidersOptions;
}

export type ProvidersOptions = {
    [key: string]: ProviderOptions;
};

export interface ProviderOptions {
    enabled: boolean;
    cached: boolean;
}

export namespace BackOptions {
    export function Default(): BackOptions {
        return {
            providers: ProvidersOptions.Default(),
        };
    }
}

export namespace ProvidersOptions {
    export function Default(): ProvidersOptions {
        return {};
    }
}

export namespace ProviderOptions {
    type Self = ProviderOptions;

    export function Default(): Self {
        // TODO: Disable by default
        return { enabled: true, cached: true };
    }
}
