import { WikiApi } from "./api/wikiapi";
import { getSourceUnderCursor } from "./doc-bind/mouse-bind";
import { TextSource } from "./doc-bind/text-source";
import { ResponseDisplay } from "./doc-bind/display";
import { WikiApiResponse } from "./api/response";

declare global {
    interface Window {
        //wikiframe: ResponseDisplay;
    }
}

class Wikichan {
    private wikic: WikiApi;

    constructor() {
        this.wikic = new WikiApi();
    }

    prepare() {
        window.addEventListener('mousedown', this.onMouseOver.bind(this));
        //window.wikiframe = new ResponseDisplay(0, 0, 0, 0);
    }

    onMouseOver(e: MouseEvent) {
        const source: TextSource = getSourceUnderCursor(e);

        let responses: WikiApiResponse[] = [];
        for (let before = 0; before < 4; before++) {
            for (let after = 0; after < 4; after++) {
                this.wikic.fetchExtract(source.phrase(before, after))
                    .then(function (res: WikiApiResponse) {
                        console.log(res);
                        responses.push(res);
                    }, function (e: Error) {
                        console.log(e.stack);
                    });
            }
        }

    }

}

const wikichan = new Wikichan();
wikichan.prepare();
