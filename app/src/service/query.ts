export class WikiQuery {
    private endpoint: string;
    private params: WikiQueryParams[];

    constructor(endpoint: string) {
        this.endpoint = endpoint;
        this.params = new Array<WikiQueryParams>();

        this.addParam("origin", "*").addParam("format", "json");
    }

    addParam(key: string, value: string): WikiQuery {
        const param = new WikiQueryParams(key, value);
        this.params.push(param);
        return this;
    }

    get url(): string {
        let query: string = this.endpoint;
        this.params.forEach(p => {
            query += p.key + "=" + p.value + "&";
        });
        return query;
    }
    
}

class WikiQueryParams {
    private _key: string;
    private _value: string;

    constructor(key: string, value: string) {
        this._key = key;
        this._value = value;
    }

    get key(): string {
        return this._key;
    }

    set key(value: string) {
        this._key = value;
    }

    get value(): string {
        return this._value;
    }

    set value(value: string) {
        this._value = value;
    }
}
