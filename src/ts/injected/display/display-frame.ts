import { TemplateHandler } from './template-handler';
import { WikiPage } from '../api/page';
import { Set, SortedSet } from '../util/set';
import { WikiLang } from '../api/lang';

export class WikiFrame {

	private static DEFAULT_WIDTH = 475;
	private static DEFAULT_HEIGHT = 300;

	private _frame: HTMLIFrameElement;
	private _articles: SortedSet<WikiPage>;
	private _disambiguations: SortedSet<WikiPage>;

	private handler: TemplateHandler;

	private _top: number;
	private _left: number;
	private _width: number;
	private _height: number;
	private _visible: boolean;

	constructor() {
		this.handler = new TemplateHandler();
		this._articles = new SortedSet<WikiPage>();
		this._disambiguations = new SortedSet<WikiPage>();

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
		this._visible = false;

		document.body.appendChild(this._frame);
	}

	update(): void {
		this.clean();

		if (this.disambiguations.elements.length > 0) {
			this.disambiguationsCountContainer.innerText =
				this.disambiguations.elements.length + " disambiguation(s) hidden";

			this.disambiguations.sort();
			this.disambiguations.elements.forEach(d => {
				const div = document.createElement('div');
				div.classList.add('disambiguation');
				div.innerHTML = this.handler.compileDisambiguation(d);
				this.disambiguationsContainer.appendChild(div);
			});
		}

		const langs: Set<WikiLang> = new Set<WikiLang>();

		this.articles.sort();
		this.articles.elements.forEach((a: WikiPage) => {
			const div = document.createElement('div');
			div.classList.add("entry", a.lang.id);
			div.innerHTML = this.handler.compilePage(a);
			div.getElementsByClassName("hide-button")[0]
				.addEventListener("click", (event) => {
					const button: HTMLElement = <HTMLElement>event.srcElement;
					const header: HTMLElement = button.parentElement.parentElement.parentElement;
					const content: HTMLElement = <HTMLElement>header.nextElementSibling;
					content.style.display = content.style.display === 'none' ? 'block' : 'none';
					button.innerText = button.innerText === '+' ? '–' : '+'

				});
			langs.add(a.lang);
			this.responseContainer.appendChild(div);
		});

		langs.elements.forEach((la: WikiLang) => {
			const div = document.createElement('div');
			div.classList.add("lang-filter");
			div.innerHTML = this.handler.compileLangFilter(la);
			div.getElementsByClassName("filter")[0].addEventListener("change", (event) => {
				Array.from(this.responseContainer.getElementsByClassName(la.id))
					.forEach((elem: HTMLElement) => {
						elem.style.display = elem.style.display === 'none' ? 'block' : 'none';
					});
			});

			this.filtersContainer.appendChild(div);
		});

	}

	clean(): void {
		this.disambiguationsCountContainer.innerText = "";
		while (this.disambiguationsContainer.lastChild) {
			this.disambiguationsContainer.removeChild(this.disambiguationsContainer.lastChild);
		}

		while (this.filtersContainer.lastChild) {
			this.filtersContainer.removeChild(this.filtersContainer.lastChild);
		}

		while (this.responseContainer.lastChild) {
			this.responseContainer.removeChild(this.responseContainer.lastChild);
		}
	}

	open(): void {
		this.frame.style.top = `${this.top}px`;
		this.frame.style.left = `${this.left}px`;
		this.frame.style.visibility = 'visible';
		this._visible = true;

		this.articles.clear();
		this.disambiguations.clear();
	}

	close(): void {
		this.frame.style.visibility = 'hidden';
		this._visible = false;
		this.clean();
	}

	setLocation(x: number, y: number): void {
		const offset = this.calculateOffset(x, y);
		this.top = y + offset.y;
		this.left = x + offset.x;
	}

	calculateOffset(x: number, y: number): { x: number, y: number } {
		let offset = { x: 10, y: 10 };
		if (x + offset.x + this.width > window.innerWidth) {
			offset.x = -(offset.x + this.width);
		}

		if (y + offset.y + this.height > window.innerHeight) {
			offset.y = -(offset.y + this.height);
		}

		return offset;
	}

	addArticle(page: WikiPage): void {
		if (!page.isDisambiguation()) {
			this._articles.add(page);
		} else {
			this._disambiguations.add(page);
		}
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

	get disambiguationsCountContainer(): HTMLElement {
		return this.documentContainer.getElementById('disambiguations-count');
	}

	get disambiguationsContainer(): HTMLElement {
		return this.documentContainer.getElementById('disambiguations-list');
	}

	get filtersContainer(): HTMLElement {
		return this.documentContainer.getElementById('filters');
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

	get articles(): SortedSet<WikiPage> {
		return this._articles;
	}

	get disambiguations(): SortedSet<WikiPage> {
		return this._disambiguations;
	}

	get visible(): boolean {
		return this._visible;
	}

}