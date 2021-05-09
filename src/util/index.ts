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
    export const from = <T>(o: T): Entries<T> => Object.entries(o) as Entries<T>;
    export const into = <T>(entries: Entries<T>): T => Object.fromEntries(entries) as any;
    /* eslint-enable @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return */
}

export type StringLiteral<T> = T extends string ? (string extends T ? never : T) : never;
