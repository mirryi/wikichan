import { WikiApi } from "./api/wikiapi";
import { getSourceUnderCursor } from "./doc-bind/mouse-bind";
import { TextSource } from "./doc-bind/text-source";
import { ResponseDisplay } from "./doc-bind/display";

declare global {
	interface Window {
		wikiframe: ResponseDisplay;
	}
}

class Wikichan {
    private wikic: WikiApi;

    constructor() {
        this.wikic = new WikiApi();
    }

    prepare() {
        window.addEventListener('mousedown', this.onMouseOver.bind(this));
        window.wikiframe = new ResponseDisplay(0, 0, 0, 0);
    }

    onMouseOver(e: MouseEvent) {
        const source: TextSource = getSourceUnderCursor(e);
        this.wikic.fetchExtract(source.phrase(0, 0))
            .then(function (res) {
                console.log(res);
            });
    }

}

const wikichan = new Wikichan();
wikichan.prepare();
