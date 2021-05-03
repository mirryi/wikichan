import { ProvidersOptions } from "@providers/loader";

export interface BackOptions {
    providers: ProvidersOptions;
}

export namespace BackOptions {
    export function Default(): BackOptions {
        return {
            providers: ProvidersOptions.Default(),
        };
    }
}
