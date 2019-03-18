import { WikiApiQuery } from './query';

export class WikiApi {

    private xhr: XMLHttpRequest;
    private endpoint: string = 'https://en.wikipedia.org/w/api.php?';

    constructor() {
        this.xhr = new XMLHttpRequest();
    }

    public fetchArticle(articleName: string) {
        let query = new WikiApiQuery(this.endpoint);
        query.addParam('action', 'query')
             .addParam('prop', 'extracts&exintro&explaintext')
             .addParam('origin', '*')
             .addParam('titles', articleName)
             .addParam('format', 'json');
        this.xhr.open('GET', query.url);
        this.xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        this.xhr.onreadystatechange = function() {
            //console.log(this.responseText);
        }
        this.xhr.send();
    }
}