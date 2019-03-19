export class WikiApiResponse {
    private _redirects: Redirect[];
    private _pages: WikiPage[];

    constructor() {
        this._redirects = [];
        this._pages = [];
    }

    addRedirect(r: Redirect) {
        this._redirects.push(r);
    }

    addPage(p: WikiPage) {
        this._pages.push(p);
    }

    get redirects(): Redirect[] {
        return this._redirects;
    }

    get pages(): WikiPage[] {
        return this._pages;
    }

    static fromJson(json: {
        normalized: { from: string, to: string }[],
        redirects: { from: string, to: string }[],
        pages: any
    }): WikiApiResponse {
        const res = new WikiApiResponse();

        if (json.normalized) {
            json.normalized.forEach(n => {
                res.addRedirect(Redirect.fromJson(n));
            });
        }

        if (json.redirects) {
            json.redirects.forEach(r => {
                res.addRedirect(Redirect.fromJson(r));
            });
        }

        Object.keys(json.pages).forEach((k, v) => {
            if (+k < 0) {
                return;
            }
            res.addPage(WikiPage.fromJson(json.pages[k]));
        });

        return res;
    }

}

export class WikiPage {
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

    static fromJson(json: { pageid: number, title: string, extract: string, ns: number }) {
        const res = new WikiPage();
        res._id = json.pageid;
        res._title = json.title;
        res._summary = json.extract;
        return res;
    }

}

class Redirect {
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
        const res = new Redirect();
        res._from = json.from;
        res._to = json.to;
        return res;
    }
}