export type Immutable<T> = {
    readonly [K in keyof T]: Immutable<T[K]>;
};

export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
