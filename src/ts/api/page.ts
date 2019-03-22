import { EqualityChecker } from '../util/set';

export class WikiPage implements EqualityChecker {
    private _id: number;
    private _title: string;
    private _summary: string;

    constructor() { }

    get id(): number {
        return this._id;
    }

    get title(): string {
        return this._title;
    }

    get summary(): string {
        return this._summary;
    }

    equals(other: WikiPage): boolean {
        return this.id === other.id;
    }

    static fromJson(json: { pageid: number, title: string, extract: string, ns: number }) {
        const res = new WikiPage();
        res._id = json.pageid;
        res._title = json.title;
        res._summary = json.extract;
        return res;
    }

}

export class WikiRedirect {
    private _from: string;
    private _to: string;

    constructor() { }

    get from(): string {
        return this._from;
    }

    get to(): string {
        return this._to;
    }

    static fromJson(json: { from: string, to: string }) {
        const res = new WikiRedirect();
        res._from = json.from;
        res._to = json.to;
        return res;
    }
}