import axios, { AxiosInstance } from "axios";
import { from, merge, Observable } from "rxjs";
import { distinct, filter, map } from "rxjs/operators";

import { isNotUndefined } from "@util/guards";

import { Provider } from "..";
import { WikipediaItem } from "./Item";

const RENDERER = "WIKI";

export class WikipediaProvider implements Provider<WikipediaItem> {
    private language: Language;

    private client: AxiosInstance;

    constructor(language: Language) {
        this.language = language;

        this.client = axios.create({ baseURL: language.baseURL() });
    }

    search(queries: string[]): Observable<WikipediaItem> {
        const observables = queries.map((q) => {
            const req = this.request(q);
            return from(req).pipe(
                filter(isNotUndefined),
                map((data) => {
                    const seen = new Map();
                    const entries = Object.entries(data.pages)
                        .filter(([k]) => {
                            if (Number(k) === -1 || seen.has(k)) {
                                return false;
                            }
                            seen.set(k, true);
                            return true;
                        })
                        .map(([, v]) => v);

                    if (entries.length < 1) {
                        return undefined;
                    }

                    return entries[0];
                }),
                filter(isNotUndefined),
                filter((entry) => entry.pageid !== undefined),
                map((entry) => this.convertResponse(entry, q)),
            );
        });
        return this.uniq(merge(...observables));
    }

    uniq(stream: Observable<WikipediaItem>): Observable<WikipediaItem> {
        return stream.pipe(distinct((item) => item.pageid));
    }

    private convertResponse(entry: MediaWikiPage, query: string): WikipediaItem {
        const tags: WikipediaItem["tags"] = { lang: this.language.id };
        if (entry.categories) {
            tags["categories"] = entry.categories.map((c) => c.title);
        }
        if (entry.terms?.alias) {
            tags["aliases"] = entry.terms.alias;
        }

        const urls = [entry.fullurl, entry.editurl];
        if (entry.extlinks) {
            urls.push(...entry.extlinks.map((link) => link["*"]));
        }

        const item: WikipediaItem = {
            // Safety: entries with undefined pageid's were just filtered out
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            pageid: entry.pageid!,
            title: entry.title,
            urls,
            description: entry.description ? entry.description : "No description.",
            longDescription: entry.extract,
            tags,
            searchTerm: query,
            meta: {
                renderer: RENDERER,
            },
        };

        return item;
    }

    private async request(query: string): Promise<MediaWikiResponse | undefined> {
        const url = this.queryString(query).toString();
        try {
            const response = await this.client.get<{ query: MediaWikiResponse }>(url);
            return response.data.query;
        } catch (e: unknown) {
            return undefined;
        }
    }

    private queryString(query: string): URL {
        let url = `${this.language.baseURL()}/w/api.php?`;
        const params = {
            origin: "*",
            format: "json",
            action: "query",
            prop: "info|description|categories|extlinks|pageterms|extracts&exintro",
            inprop: "url",
            redirects: "1",
            titles: encodeURIComponent(query),
        };

        for (const [k, v] of Object.entries(params)) {
            url += `${k}=${v}&`;
        }

        return new URL(url);
    }
}

export class Language {
    id: string;
    name: string;
    disambID: string;

    constructor(id: string, name: string, disambID: string) {
        this.id = id;
        this.name = name;
        this.disambID = disambID;
    }

    baseURL(): string {
        return `https://${this.id.toLowerCase()}.wikipedia.org`;
    }
}

export namespace Language {
    export const EN = new Language(
        "EN",
        "English",
        "Category:All article disambiguation pages",
    );
}

type MediaWikiResponse = {
    normalized: { from: string; to: string }[];
    pages: { [n: number]: MediaWikiPage };
};

type MediaWikiPage = {
    canonicalurl: string;
    categories?: { ns: number; title: string }[];
    contentmodel: string;
    description?: string;
    descriptionsource?: string;
    editurl: string;
    extlinks?: { "*": string }[];
    extract?: string;
    fullurl: string;
    lastrevid?: number;
    length?: number;
    ns: number;
    pageid?: number;
    pagelanguage: string;
    pagelanguagedir: string;
    pagelanguagehtmlcode: string;
    terms?: {
        alias: string[];
        description: string[];
        label: string[];
    };
    title: string;
    touched?: string;
};
