import { WikiApi } from "./api/wikiapi";
import { WikiResponse } from './api/response';
import { TextSelector } from "./doc-bind/text-selector";
import { TextSource } from "./doc-bind/text-source";
import { ResponseDisplay } from "./display/display";

declare global {
    interface Window {
        // wikiframe: ResponseDisplay;
    }
}

class Wikichan {
    private wikic: WikiApi;
    private selector: TextSelector;

    constructor() {
        this.wikic = new WikiApi();
        this.selector = new TextSelector();
    }

    prepare() {
        window.addEventListener('mousedown', this.onMouseOver.bind(this));
        // window.wikiframe = new ResponseDisplay(0, 0, 0, 0);
    }

    onMouseOver(e: MouseEvent) {
        const source: TextSource = this.selector.getSourceUnderCursor(e);

        let responses: WikiResponse[] = [];
        for (let before = 0; before < 4; before++) {
            for (let after = 0; after < 4; after++) {
                this.wikic.fetchExtract(source.phrase(before, after))
                    .then(function (res: WikiResponse) {
                        // console.log(res);
                        // responses.push(res);
                    }, function (e: Error) {
                        console.log(e.stack);
                    });
            }
        }

    }

}

const wikichan = new Wikichan();
wikichan.prepare();
