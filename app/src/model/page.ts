import { Equals } from "src/util/interface";
import { Language } from "./language";

export class Page implements Equals<Page> {
    id: number;
    title: string;
    summary: string;
    description: string;
    aliases: string[];
    categories: string[];

    lang: Language;
    url: string;
    editUrl: string;
    extlinks: string[];
    redirects: Redirect[];

    searchPhrase: string;

    constructor() {
        this.aliases = [];
        this.categories = [];
        this.extlinks = [];
        this.redirects = [];
    }

    get searchLink(): string {
        return (
            this.lang.url +
            "/w/index.php?" +
            "profile=advanced&fulltext=1&search=" +
            this.searchPhrase
        );
    }

    get isDisambiguation(): boolean {
        return this.categories.indexOf(this.lang.disambId) !== -1;
    }

    equals(other: Page): boolean {
        if (other === null) {
            return false;
        }

        return this.id === other.id;
    }
}

export class Redirect {
    from: string;
    to: string;

    constructor(from: string, to: string) {
        this.from = from;
        this.to = to;
    }

    static fromJson(json: { from: string; to: string }) {
        return new Redirect(json.from, json.to);
    }
}
