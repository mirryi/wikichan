export interface Equals<T> {
    equals(other: T): boolean;
}

export interface Comparable<T> {
    compareTo(other: T): number;
}

export type Comparator<T> = (a: T, b: T) => number;