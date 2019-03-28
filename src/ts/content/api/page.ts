import { EqualityChecker, Comparable } from "../util/interfaces";
import { Redir } from "../util/type-alias";
import { WikiLang } from "./lang";

export class WikiPage implements EqualityChecker, Comparable {
    private _id: number;
    private _title: string;
    private _summary: string;
    private _description: string;
    private _aliases: string[];
    private _categories: string[];

    private _lang: WikiLang;
    private _url: string;
    private _editUrl: string;
    private _extlinks: string[];
    private _redirects: WikiRedirect[];

    private _searchPhrase: string;

    constructor() {
        this._aliases = [];
        this._categories = [];
        this._extlinks = [];
        this._redirects = [];
    }

    get id(): number {
        return this._id;
    }

    get title(): string {
        return this._title;
    }

    get summary(): string {
        return this._summary;
    }

    get description(): string {
        return this._description;
    }

    get aliases(): string[] {
        return this._aliases;
    }

    get categories(): string[] {
        return this._categories;
    }

    get lang(): WikiLang {
        return this._lang;
    }

    get url(): string {
        return this._url;
    }

    get editUrl(): string {
        return this._editUrl;
    }

    get extlinks(): string[] {
        return this._extlinks;
    }

    get redirects(): WikiRedirect[] {
        return this._redirects;
    }

    get searchPhrase(): string {
        return this._searchPhrase;
    }

    set searchPhrase(value: string) {
        this._searchPhrase = value;
    }

    get searchLink(): string {
        return "https://en.wikipedia.org/w/index.php?"
            + "profile=advanced&fulltext=1&search=" + this.searchPhrase;
    }

    addRedirect(r: WikiRedirect): void {
        this._redirects.push(r);
    }

    isDisambiguation(): boolean {
        for (let i = 0; i < this.categories.length; i++) {
            if (this.categories[i] === this.lang.disambiguationId) {
                return true;
            }
        }
        return false;
    }

    equals(other: WikiPage): boolean {
        return this.id === other.id
            && this.lang.id === other.lang.id;
    }

    compareTo(other: WikiPage): number {
        if (this.lang.value < other.lang.value) {
            return -1;
        } else if (this.lang.value > other.lang.value) {
            return 1;
        } else {
            if (this.title.length < other.title.length) {
                return -1;
            } else if (this.title.length > other.title.length) {
                return 1;
            }
        }
        return 0;
    }

    static fromJson(json: { lang: WikiLang, redirects: Redir[]; page: any }): WikiPage {
        const res = new WikiPage();

        if (json.redirects) {
            json.redirects.forEach(r => {
                res.addRedirect(WikiRedirect.fromJson(r));
            });
        }

        const page = json.page;
        res._id = page.pageid;
        res._title = page.title;
        res._summary = page.extract;
        res._description = page.description;
        res._url = page.fullurl;
        res._editUrl = page.editurl;
        res._lang = json.lang;

        if (page.extlinks) {
            page.extlinks.forEach((e: any) => {
                res._extlinks.push(e["*"]);
            });
        }
        if (page.terms.alias) {
            page.terms.alias.forEach((a: string) => {
                res._aliases.push(a);
            });
        }
        if (page.categories) {
            page.categories.forEach((c: { ns: number, title: string }) => {
                res._categories.push(c.title)
            })
        }
        if (page.redirects) {
            page.redirects.forEach((r: Redir) => {
                res._redirects.push(WikiRedirect.fromJson(r));
            });
        }
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

    static fromJson(json: Redir) {
        const res = new WikiRedirect();
        res._from = json.from;
        res._to = json.to;
        return res;
    }
}