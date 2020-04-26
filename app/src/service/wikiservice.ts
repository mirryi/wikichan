import { WikiQuery } from "./query";

import { Language } from "../model/language";
import { Page, Redirect } from "../model/page";

export class WikiService {
    private lang: Language;

    constructor(lang: Language) {
        this.lang = lang;
    }

    public fetchExtract(article: string): Promise<Page> {
        const query = this.constructQuery(article);

        return fetch(query.url)
            .then(res => {
                if (res.status !== 200) {
                    return;
                }

                return res;
            })
            .then(res => res.json())
            .then((data: { batchcomplete: string; query: any }) => data.query)
            .then((data: { normalized: { from: string; to: string }[]; pages: any }) => {
                if (
                    Object.keys(data.pages).indexOf("-1") !== -1 &&
                    Object.keys(data.pages).length === 1
                ) {
                    return;
                }

                const page = new Page();
                const entry: MediaWikiPage = data.pages[Object.keys(data.pages)[0]];

                if (data.normalized) {
                    data.normalized.forEach(norm => {
                        page.redirects.push(<Redirect>norm);
                    });
                }
                if (entry.categories) {
                    entry.categories.forEach(c => {
                        page.categories.push(c.title);
                    });
                }
                if (entry.extlinks) {
                    entry.extlinks.forEach(link => {
                        page.extlinks.push(link["*"]);
                    });
                }
                if (entry.terms.alias) {
                    entry.terms.alias.forEach(alias => {
                        page.aliases.push(alias);
                    });
                }

                page.id = entry.pageid;
                page.title = entry.title;
                page.url = entry.fullurl;
                page.editUrl = entry.editurl;
                page.description = entry.description;
                page.summary = entry.extract;
                page.lang = this.lang;
                page.searchPhrase = article;
                return page;
            });
    }

    private constructQuery(article: string): WikiQuery {
        const endpoint: string =
            "https://" + this.lang.id.toLowerCase() + ".wikipedia.org/w/api.php?";
        let query = new WikiQuery(endpoint);
        query
            .addParam("action", "query")
            .addParam(
                "prop",
                "info|description|categories|extlinks|pageterms|extracts&exintro"
            )
            .addParam("inprop", "url")
            .addParam("redirects", "1")
            .addParam("titles", article);
        return query;
    }
}

type MediaWikiPage = {
    canonicalurl: string;
    categories: { ns: number; title: string }[];
    contentmodel: string;
    description: string;
    descriptionsource: string;
    editurl: string;
    extlinks: { "*": string }[];
    extract: string;
    fullurl: string;
    lastrevid: number;
    length: number;
    ns: number;
    pageid: number;
    pagelanguage: string;
    pagelanguagedir: string;
    pagelanguagehtmlcode: string;
    terms: {
        alias: string[];
        description: string[];
        label: string[];
    };
    title: string;
    touched: string;
};
