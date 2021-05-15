export type Immutable<T> = {
    readonly [K in keyof T]: Immutable<T[K]>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends Record<string, unknown> ? DeepPartial<T[P]> : T[P];
};

export type Entries<T> = {
    [P in keyof T]: [P, T[P]];
}[keyof T][];

export namespace Entries {
    /* eslint-disable @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return */
    export const iter = <T>(o: T): Entries<T> => Object.entries(o) as Entries<T>;

    export const collect = <T>(entries: Entries<T>): T =>
        Object.fromEntries(entries) as any;

    export const map = <T, U>(
        o: T,
        transform: ([k, v]: readonly [keyof T, T[keyof T]]) => [keyof U, U[keyof U]],
    ): U => Entries.collect(Entries.iter(o).map(([k, v]) => transform([k, v])));
    /* eslint-enable @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return */
}

export type StringLiteral<T> = T extends string ? (string extends T ? never : T) : never;
