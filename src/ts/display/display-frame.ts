import { TemplateHandler } from './template-handler';
import { WikiPage } from '../api/page';
import { Set } from '../util/set';

export class WikiFrame {

	private static DEFAULT_WIDTH = 500;
	private static DEFAULT_HEIGHT = 300;

	private _frame: HTMLIFrameElement;
	private _articles: Set<WikiPage>;

	private handler: TemplateHandler;

	private _top: number;
	private _left: number;
	private _width: number;
	private _height: number;

	constructor() {
		this.handler = new TemplateHandler();
		this._articles = new Set<WikiPage>();

		this._width = WikiFrame.DEFAULT_WIDTH;
		this._height = WikiFrame.DEFAULT_HEIGHT;

		this._frame = document.createElement('iframe');
	}

	prepare(): void {
		this.frame.id = "wikichan";
		this.frame.name = "wikichan";
		this.frame.src = browser.runtime.getURL('frame.html');

		this.frame.frameBorder = "0";
		this.frame.style.width = `${this.width}px`;
		this.frame.style.height = `${this.height}px`;
		this.frame.style.position = 'fixed';
		this.frame.style.visibility = 'hidden';

		document.body.appendChild(this._frame);

		const injectedStyles = document.createElement("link");
		injectedStyles.rel = "stylesheet";
		injectedStyles.type = "text/css";
		injectedStyles.href = browser.runtime.getURL('css/injected.css');
		document.head.appendChild(injectedStyles);
	}

	update(): void {
		this.clean();
		this.articles.elements.forEach(a => {
			const div = document.createElement('div');
			div.classList.add("entry");
			div.innerHTML = this.handler.compile(a);
			this.responseContainer.prepend(div);
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

	// TODO: implement closing if click outside frame
	close(): void {
		this.frame.style.visibility = 'hidden';
		this.clean();
	}

	setLocation(x: number, y: number): void {
		const offset = this.calculateOffset(x, y);
		this.top = y + offset.y;
		this.left = x + offset.x;
	}

	calculateOffset(x: number, y: number): { x: number, y: number } {
		return { x: 5, y: 5 };
	}

	addArticle(page: WikiPage): void {
		this._articles.add(page);
	}

	addArticles(pages: WikiPage[]): void {
		pages.forEach(p => {
			this.addArticle(p);
		})
	}

	containsPoint(x: number, y: number) {
		return x > this.left && x < this.left + this.width
			&& y > this.top && y < this.top + this.height;
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

	get frame(): HTMLIFrameElement {
		return this._frame;
	}

	get articles(): Set<WikiPage> {
		return this._articles;
	}

}