import { Equals, Comparable } from "./interface";

export class Set<T extends Equals<T>> {
    elements: T[];

    constructor(set?: T[]) {
        this.elements = set || [];
    }

    add(t: T): boolean {
        if (!this.has(t)) {
            this.elements.push(t);
            return true;
        }
        return false;
    }

    set(index: number, t: T): T {
        const ex = this.elements[index];
        this.elements[index] = t;
        return ex;
    }

    remove(t: T): T {
        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i].equals(t)) {
                const ex = this.elements[i];
                this.elements.splice(i, 1);
                return ex;
            }
        }
        return null;
    }

    clear(): void {
        this.elements = [];
    }

    has(t: T): boolean {
        for (let elem of this.elements) {
            if (elem.equals(t)) {
                return true;
            }
        }
        return false;
    }

    protected override(value: T[]) {
        this.elements = value;
    }
}

export class SortedSet<T extends Equals<T> & Comparable<T>> extends Set<T> {
    sort(): void {
        this.override(
            this.elements.sort(
                (a: T, b: T): number => {
                    return a.compareTo(b);
                }
            )
        );
    }
}