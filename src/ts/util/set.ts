export class Set<T extends EqualityChecker> {

    private _set: T[];

    constructor() {
        this._set = [];
    }

    add(t: T): boolean {
        if (!this.has(t)) {
            this._set.push(t);
            return true;
        }
        return false;
    }

    set(index: number, t: T) {
        this._set[index] = t;
    }

    remove(t: T): boolean {
        for (let i = 0; i < this._set.length; i++) {
            if (this._set[i].equals(t)) {
                this._set.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    clear() {
        this._set = [];
    }

    has(t: T): boolean {
        for (let elem of this._set) {
            if (elem.equals(t)) {
                return true;
            }
        }
        return false;
    }

    get elements(): T[] {
        return this._set;
    }

}

export interface EqualityChecker {
    equals(other: object): boolean;
}