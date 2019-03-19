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

    public get url(): string {
        let query: string = this.endpoint;
        this.params.forEach(p => {
            query += p.key + "=" + p.value + "&";
        });
        return query;
    }

}

class WikiApiQueryParams {
    
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