export class WikiArticle {

}

export class WikiApiQueryParams {
    
    private _key: string;
    private _value: string;

    constructor(key: string, value: string) {
        this._key = key;
        this._value = value;
    }

	public get key(): string {
		return this._key;
	}

	public set key(value: string) {
		this._key = value;
	}

	public get value(): string {
		return this._value;
	}

	public set value(value: string) {
		this._value = value;
	}


}

export class WikiApiQuery {

    private endpoint: string;
    private params: WikiApiQueryParams[];

    constructor(endpoint: string) {
        this.endpoint = endpoint;
        this.params = new Array<WikiApiQueryParams>();
    }

    public addParam(key: string, value: string): WikiApiQuery {
        const param = new WikiApiQueryParams(key, value);
        this.params.push(param);
        return this;
    }

    public build(): string {
        let query: string = this.endpoint;
        this.params.forEach(p => {
            query += p.key + "=" + p.value + "&";
        });
        return query;
    }

}

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
        this.xhr.open('GET', query.build());
        this.xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        this.xhr.onreadystatechange = function() {
            //console.log(this.responseText);
        }
        this.xhr.send();
    }
}