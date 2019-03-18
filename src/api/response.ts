export class WikiApiResponse {
    private _redirects: Redirect[];
    private _pages: WikiPage[];
}

class WikiPage {
    private _id: number;
    private title: string;
    private summary: string;
}

class Redirect {
    private _from: string;
    private _to: string;

    constructor(from: string, to: string) {
        this._from = from;
        this._to = to;
    }

	public get from(): string {
		return this._from;
	}

	public set from(value: string) {
		this._from = value;
	}

	public get to(): string {
		return this._to;
    }
    
	public set to(value: string) {
		this._to = value;
	}
}