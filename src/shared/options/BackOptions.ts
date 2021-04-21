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

    export function guard(x: unknown): x is BackOptions {
        // eslint-ignore-next-line @typescript-eslint/no-explicit-any
        const v = x as any;
        return !!v && ProvidersOptions.guard(v.providers);
    }
}

export namespace ProvidersOptions {
    export function Default(): ProvidersOptions {
        return {};
    }

    export function guard(x: unknown): x is ProvidersOptions {
        return (
            typeof x === "object" &&
            Object.entries(x).filter(
                ([_k, v]: [string, unknown]) => !ProviderOptions.guard(v),
            ).length > 0
        );
    }
}

export namespace ProviderOptions {
    type Self = ProviderOptions;

    export function Default(): Self {
        // TODO: Disable by default
        return { enabled: true, cached: true };
    }

    export function guard(x: unknown): x is ProviderOptions {
        // eslint-ignore-next-line @typescript-eslint/no-explicit-any
        const v = x as any;
        return typeof v?.enabled === "boolean" && typeof v?.cached === "boolean";
    }
}
