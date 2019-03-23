import {Redir} from '../util/type-alias';
import { WikiPage } from './page';
import { WikiQueryType, WikiQuery } from './query';

export class WikiApi {
    private endpoint: string = 'https://en.wikipedia.org/w/api.php?';

    fetchExtract(articleName: string) {
        const query = this.constructQuery(articleName, WikiQueryType.EXTRACT);
        return new Promise<WikiPage>(function (resolve: any, reject: any) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', query.url);
            xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            xhr.onloadend = function () {
                if (this.status >= 200 && this.status < 300) {
                    const json = JSON.parse(this.responseText).query;
                    if (Object.keys(json.pages).indexOf("-1") !== -1 && Object.keys(json.pages).length === 1) {
                        return;
                    }
                    const parsed = WikiApi.parseResponse(json);
                    const response = WikiPage.fromJson(parsed);
                    resolve(response);
                } else {
                    reject({
                        status: this.status,
                        statusText: this.statusText
                    });
                }
            }
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: this.statusText
                });
            }
            xhr.send();
        });
    }

    // TODO: Refactor for different types of queries
    constructQuery(article: string, type: WikiQueryType) {
        let query = new WikiQuery(this.endpoint, type);
        query.addParam('action', 'query')
            .addParam('prop', 'info|extracts|description|extlinks|pageterms')
            .addParam('inprop', 'url')
            .addParam('redirects', '1')
            .addParam('titles', article);
        return query;
    }

    static parseResponse(json: {
        normalized: Redir[],
        redirects: Redir[],
        pages: any;
    }): {
        redirects: Redir[],
        page: object
    } {
        const redirects: Redir[] = [];
        if (json.normalized) {
            redirects.concat(json.normalized);
        }
        if (json.redirects) {
            redirects.concat(json.redirects);
        }

        const key: string = Object.keys(json.pages)[0];
        return {
            redirects: redirects,
            page: json.pages[key]
        };
    }

}
