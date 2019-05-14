import { Page } from "../model/page";
import { Set } from "../util/set";
import { Callbacks } from "./callbacks";

const rivets = require("rivets");

export class Display {
    static DEFAULT_WIDTH: number = 525;
    static DEFAULT_HEIGHT: number = 325;

    width: number;
    height: number;

    frame: HTMLIFrameElement;

    constructor() {
        this.width = Display.DEFAULT_WIDTH;
        this.height = Display.DEFAULT_HEIGHT;

        this.frame = document.createElement("iframe");
        this.frame.id = "wikichan";
        this.frame.name = "wikichan";
        this.frame.src = browser.runtime.getURL("frame.html");
        this.frame.frameBorder = "0";
        this.frame.style.width = `${this.width}px`;
        this.frame.style.height = `${this.height}px`;
        this.frame.style.position = "fixed";
        this.frame.style.visibility = "hidden";
        document.body.appendChild(this.frame);
    }

    open(top: number, left: number, pages: Set<Page>): void {
        const offset = this.calculateOffset(left, top);
        const x = left + offset.x;
        const y = top + offset.y;

        this.frame.style.top = `${y}px`;
        this.frame.style.left = `${x}px`;
        this.frame.style.visibility = "visible";

        rivets.bind(this.resultsContainer, {
            pages: pages,
            hide: Callbacks.hide
        });
    }

    close(): void {
        this.frame.style.visibility = "hidden";
        this.searchBox.value = "";
    }

    calculateOffset(x: number, y: number): { x: number; y: number } {
        let offset = { x: 10, y: 10 };
        if (x + offset.x + this.width > window.innerWidth) {
            offset.x = -(offset.x + this.width);
        }

        if (y + offset.y + this.height > window.innerHeight) {
            offset.y = -(offset.y + this.height);
        }

        return offset;
    }

    get documentContainer(): Document {
        return this.frame.contentWindow.document;
    }

    get resultsContainer(): HTMLElement {
        return this.documentContainer.getElementById("results");
    }

    get searchBox(): HTMLInputElement {
        return <HTMLInputElement>this.documentContainer.getElementById("search-box");
    }
}
