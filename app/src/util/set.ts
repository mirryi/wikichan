import { Equals, Comparable, Comparator } from "./interface";

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

    sort(comparator: (a: T, b: T) => number): void {
        this.elements = this.elements.sort(comparator);
    }
}

export class SortedSet<T extends Equals<T> & Comparable<T>> extends Set<T> {
    constructor(set?: T[]) {
        super(set);
        this.sort();
    }

    add(t: T, comparator?: Comparator<T>): boolean {
        for (let i = 0; i < this.elements.length; i++) {
            if (comparator(t, this.elements[i]) < 0) {
                this.elements.splice(i, 0, t);
                return true;
            }
        }
        return false;
    }

    sort(comparator?: Comparator<T>): void {
        if (!comparator) {
            super.sort(comparator);
        } else {
            this.elements.sort((a: T, b: T) => a.compareTo(b));
        }
    }
}
