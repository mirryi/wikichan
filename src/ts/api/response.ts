import { WikiPage, WikiRedirect } from './page';

// TODO: refactor redirects into WikiPage
export class WikiResponse {
    private _redirects: WikiRedirect[];
    private _pages: WikiPage[];

    constructor() {
        this._redirects = [];
        this._pages = [];
    }

    addRedirect(r: WikiRedirect) {
        this._redirects.push(r);
    }

    addPage(p: WikiPage) {
        this._pages.push(p);
    }

    get redirects(): WikiRedirect[] {
        return this._redirects;
    }

    get pages(): WikiPage[] {
        return this._pages;
    }

    static fromJson(json: {
        normalized: { from: string, to: string }[],
        redirects: { from: string, to: string }[],
        pages: any
    }): WikiResponse {
        const res = new WikiResponse();

        if (json.normalized) {
            json.normalized.forEach(n => {
                res.addRedirect(WikiRedirect.fromJson(n));
            });
        }

        if (json.redirects) {
            json.redirects.forEach(r => {
                res.addRedirect(WikiRedirect.fromJson(r));
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