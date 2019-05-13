import { WikiQuery } from "./query";

import { Language } from "../model/language";
import { Page } from "../model/page";

export class WikiService {
    private lang: Language;

    constructor(lang: Language) {
        this.lang = lang;
    }

    public fetchExtract(article: string) {
        const query = this.constructQuery(article);

        return fetch(query.url).then(res => {
            if (res.status !== 200) {
                return;
            }

            res.json().then(data => {
                console.log(data);
            });
        });
    }

    private constructQuery(article: string): WikiQuery {
        const endpoint: string =
            "https://" + this.lang.id.toLowerCase() + ".wikipedia.org/w/api.php?";
        let query = new WikiQuery(endpoint);
        query
            .addParam("action", "query")
            .addParam("prop", "info|description|categories|extlinks|pageterms|extracts&exintro")
            .addParam("inprop", "url")
            .addParam("redirects", "1")
            .addParam("titles", article);
        return query;
    }
}
