import { WikiQueryType, WikiQuery } from './query';
import { WikiResponse } from './response';

export class WikiApi {
    private endpoint: string = 'https://en.wikipedia.org/w/api.php?';

    async fetchExtract(articleName: string) {
        const query = this.constructQuery(articleName, WikiQueryType.EXTRACT);
        return new Promise(function (resolve: any, reject: any) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', query.url);
            xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            xhr.onloadend = function () {
                if (this.status >= 200 && this.status < 300) {
                    const json = JSON.parse(this.responseText).query;
                    if (Object.keys(json.pages).indexOf("-1") !== -1 && Object.keys(json.pages).length === 1) {
                        return;
                    }
                    console.log(json.pages);
                    const response: WikiResponse = WikiResponse.fromJson(json);
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
            .addParam('prop', 'info|extracts')
            .addParam('inprop', 'url')
            .addParam('redirects', '1')
            .addParam('titles', article);
        return query;
    }

}
