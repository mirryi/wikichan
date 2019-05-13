import { Page } from "../model/page";
import { Set } from "../util/set";

const rivets = require("rivets");

export class Display {
    static DEFAULT_WIDTH: number = 475;
    static DEFAULT_HEIGHT: number = 300;

    top: number;
    left: number;
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
        this.frame.style.top = `${top}px`;
        this.frame.style.left = `${left}px`;
        this.frame.style.visibility = "visible";

        rivets.bind(this.resultsContainer, pages);
    }

    close(): void {
        this.frame.style.visibility = "hidden";
    }

    get documentContainer(): Document {
        return this.frame.contentWindow.document;
    }

    get resultsContainer(): HTMLElement {
        return this.documentContainer.getElementById("results");
    }
}
