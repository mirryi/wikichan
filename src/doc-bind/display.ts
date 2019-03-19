import { WikiPage } from '../api/response';

export class ResponseDisplay {

    private _top: number;
    private _left: number;
    private _width: number;
    private _height: number;

	private _articles: WikiPage[];
	
	private _hidden: boolean;

	constructor(top: number, left: number, width: number, height: number) {
		this._top = top;
		this._left = left;
		this._width = width;
        this._height = height;
        this._articles = [];
	}
	
	show() {
		const display: HTMLIFrameElement = document.createElement("iframe");
		display.setAttribute("src", "../frame.html");

	}

    addArticle(page: WikiPage): void {
        this._articles.push(page);
    }

    addArticles(...pages: WikiPage[]): void {
        pages.forEach(p => {
            this.addArticle(p);
        });
    }

    clearArticles(): void {
        this.articles = [];
    }
    
	get top(): number {
		return this._top;
	}

	set top(value: number) {
		this._top = value;
	}

	get left(): number {
		return this._left;
	}

	set left(value: number) {
		this._left = value;
	}

	get height(): number {
		return this._height;
	}

	set height(value: number) {
		this._height = value;
	}

	get width(): number {
		return this._width;
	}

	set width(value: number) {
		this._width = value;
    }
    
	get articles(): WikiPage[] {
		return this._articles;
	}

	set articles(value: WikiPage[]) {
		this._articles = value;
	}
    
    
}