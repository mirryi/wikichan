import { WikiApi } from "./api/wikiapi";
import { TextSelector } from "./text/text-selector";
import { TextSource } from "./text/text-source";
import { WikiFrame } from "./display/display-frame";
import { WikiPage } from "./api/page";
import * as logger from "loglevel";
import { WikiLang } from "./api/lang";
// import * as _ from 'underscore';

declare global {
    interface Window {
        wikichan: Wikichan;
        wikiframe: WikiFrame;
    }
}

class Wikichan {
    private wikic: WikiApi;
    private selector: TextSelector;

    constructor() {
        this.wikic = new WikiApi(WikiLang.EN);
        this.selector = new TextSelector();
    }

    prepare() {
        const eventType = 'mousedown';
        window.addEventListener(eventType, this.onMouseOver.bind(this));
        logger.info("Added " + eventType + " listener for Wikichan");
    }

    put(p: WikiPage): void {
        if (!p.isDisambiguation()) {
            window.wikiframe.addArticle(p)
            window.wikiframe.update();
        }
    }

    onMouseOver(e: MouseEvent) {
        if (!e.altKey) {
            if (window.wikiframe) {
                window.wikiframe.close();
            }
            return;
        }

        const source: TextSource = this.selector.getSourceUnderCursor(e);

        if (!window.wikiframe) {
            window.wikiframe = new WikiFrame();
            window.wikiframe.prepare();
        } else {
            window.wikiframe.clean();
        }
        window.wikiframe.setLocation(e.clientX, e.clientY);
        window.wikiframe.open();

        for (let before = 0; before < 4; before++) {
            for (let after = 0; after < 4; after++) {
                const search = source.phrase(before, after);
                this.wikic.fetchExtract(search)
                    .then((p: WikiPage) => {
                        p.searchPhrase = search;
                        this.put(p);
                    });
            }
        }
    }
}

logger.enableAll();
window.wikichan = new Wikichan();
const wikichan = window.wikichan;
wikichan.prepare();