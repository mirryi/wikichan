import { WikiPage } from '../api/response';

export class ResponseContainer {
    private _articles: WikiPage[];

    constructor() {
        this._articles = [];
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

    get articles(): WikiPage[] {
        return this._articles;
    }

    set articles(value: WikiPage[]) {
        this._articles = value;
    }
    
}