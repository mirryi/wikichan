export interface EqualityChecker {
    equals(other: object): boolean;
}

export interface Comparable {
    compareTo(other: object): number;
}