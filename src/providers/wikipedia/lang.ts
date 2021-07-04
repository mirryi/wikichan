import { wikipedias as _wikipedias } from "./wikipedias";

export type Lang = keyof typeof wikipedias;
export type Wikipedia<C extends Lang> = typeof _wikipedias[C];

export type Wikipedias = {
    [C in keyof typeof _wikipedias]: Wikipedia<C>;
};

/**
 * Map of all available Wikipedias, keyed by language code.
 */
export const wikipedias: Wikipedias = _wikipedias;
