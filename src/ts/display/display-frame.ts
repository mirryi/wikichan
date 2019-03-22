import { TemplateHandler } from './template-handler';
import { WikiPage } from '../api/page';
import { Set } from '../util/set';

export class WikiFrame {

	private _frame: HTMLIFrameElement;
	private _articles: Set<WikiPage>;
	
	private handler: TemplateHandler;

	private _top: number;
	private _left: number;

	constructor() {
		this.handler = new TemplateHandler();

		this._articles = new Set<WikiPage>();

		this._frame = document.createElement('iframe');
		this.frame.id = "wikichan";
		this.frame.name = "wikichan";
		this.frame.src = browser.runtime.getURL('frame.html');

		this.frame.style.width = '300px';
		this.frame.style.height = '300px';
		this.frame.style.position = 'fixed';
		this.frame.style.visibility = 'hidden';

		document.body.appendChild(this._frame);
	}

	update(): void {
		this.clean();
		this.articles.elements.forEach(a => {
			const rep = document.createElement('div');
			rep.innerHTML = this.handler.compile(a);
			this.responseContainer.appendChild(rep);
		});
	}

	clean(): void {
		while (this.responseContainer.lastChild) {
			this.responseContainer.removeChild(this.responseContainer.lastChild);
		}
	}

	open(): void {
		this.frame.style.top = `${this.top}px`;
		this.frame.style.left = `${this.left}px`;
		this.frame.style.visibility = 'visible';
	}

	close(): void {
		this.frame.style.visibility = 'hidden';
		this.clean();
	}

	setLocation(x: number, y: number): void {
		this.top = y;
		this.left = x;
	}

	addArticle(page: WikiPage): void {
		this._articles.add(page);
	}

	addArticles(pages: WikiPage[]): void {
		pages.forEach(p => {
			this.addArticle(p);
		})
	}

	get documentContainer(): Document {
		return this._frame.contentWindow.document;
	}

	get responseContainer(): HTMLElement {
		return this.documentContainer.getElementById('results');
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

	get frame(): HTMLIFrameElement {
		return this._frame;
	}

	get articles(): Set<WikiPage> {
		return this._articles;
	}

}