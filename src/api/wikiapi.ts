import { WikiApiQuery } from './query';
import { WikiApiResponse, WikiPage } from './response';

export class WikiApi {
    private endpoint: string = 'https://en.wikipedia.org/w/api.php?';

    public async fetchExtract(articleName: string) {
        let query = new WikiApiQuery(this.endpoint);
        query.addParam('action', 'query')
            .addParam('prop', 'extracts&exintro&explaintext')
            .addParam('redirects', '1')
            .addParam('origin', '*')
            .addParam('titles', articleName)
            .addParam('format', 'json');
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
                    const response: WikiApiResponse = WikiApiResponse.fromJson(json);
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
                })
            }
            xhr.send();
        });
    }
}