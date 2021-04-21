export interface FrontOptions {}

export namespace FrontOptions {
    export function Default(): FrontOptions {
        return {};
    }

    export function guard(x: any): x is FrontOptions {
        return true;
    }
}
