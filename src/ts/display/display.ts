import { ResponseContainer } from './response-container';

export class ResponseDisplay {

	private _container: HTMLIFrameElement;
	private _responses: ResponseContainer;

	private _top: number;
	private _left: number;
	private _width: number;
	private _height: number;

	constructor() {
		this._container = document.createElement('iframe');
		this._container.src = browser.runtime.getURL('frame.html');
		this._container.style.visibility = 'hidden';

		this._container.id = "wikichan";

		this._container.style.width = '300px';
		this._container.style.height = '300px';
		this._container.style.position = 'fixed';

		document.body.appendChild(this._container);
	}

	show() {
		this._container.style.top = `${this.top}px`;
		this._container.style.left = `${this.left}px`;
		this._container.style.visibility = 'visible';
	}

	setLocation(x: number, y: number): void {
		this.top = y;
		this.left = x;
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

}