import { WikiQueryParams } from './params';

export class WikiQuery {

    private endpoint: string;
    private params: WikiQueryParams[];
    private _type: WikiQueryType;

    constructor(endpoint: string, type?: WikiQueryType) {
        this.endpoint = endpoint;
        this.params = new Array<WikiQueryParams>();
        this._type = type;

        this.addParam('origin', '*')
            .addParam('format', 'json');
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

    get type(): WikiQueryType {
        return this._type;
    }

}


export enum WikiQueryType {
    EXTRACT,
}