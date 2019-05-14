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
            query += p.join() + "&";
        });
        return query;
    }
    
}

class WikiQueryParams {
    key: string;
    value: string;

    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }

    join(): string {
        return this.key + "=" + this.value;
    }

}
