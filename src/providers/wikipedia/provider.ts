import axios, { AxiosInstance } from "axios";
import { from, merge, Observable } from "rxjs";
import { distinct, filter, map } from "rxjs/operators";

import { isNotUndefined } from "@util/guards";

import { Provider } from "..";
import { Lang, WikipediaItem, Wikipedia, wikipedias } from ".";

const RENDERER = "WIKI";

export class WikipediaProvider<C extends Lang> implements Provider<WikipediaItem> {
    private wiki: Wikipedia<C>;

    private client: AxiosInstance = axios.create();

    constructor(langcode: C) {
        this.wiki = wikipedias[langcode];
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
        const tags: WikipediaItem["tags"] = { lang: this.wiki.code };
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

        // Safety: entries with undefined pageid's were just filtered out
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const pageid = entry.pageid!;
        const item: WikipediaItem = {
            pageid,
            title: entry.title,
            urls,
            description: entry.description ? entry.description : "No description.",
            longDescription: entry.extract,
            tags,
            searchTerm: query,
            meta: {
                uid: pageid.toString(),
                source: { uid: `wiki.${this.wiki.name}`, name: this.wiki.name },
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
        let url = `https://${this.wiki.code}.wikipedia.org/w/api.php?`;
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
