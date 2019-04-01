import { WikiApi } from "./api/wikiapi";
import { TextSelector } from "./text/text-selector";
import { TextSource } from "./text/text-source";
import { WikiFrame } from "./display/display-frame";
import { WikiPage } from "./api/page";
import * as logger from "loglevel";
import { WikiLang } from "./api/lang";

declare global {
    interface Window {
        wikichan: Wikichan;
        wikiframe: WikiFrame;
    }
}

class Wikichan {
    private wikis: WikiApi[];
    private selector: TextSelector;

    constructor() {
        this.selector = new TextSelector();

        this.wikis = [];
        WikiLang.ALL_LANGS.forEach((lang: WikiLang) => {
            this.wikis.push(new WikiApi(lang));
        })
    }

    prepare() {
        const eventType = 'mousedown';
        window.addEventListener(eventType, this.onMouseOver.bind(this));
        logger.info("Added " + eventType + " listener for Wikichan");
    }

    put(p: WikiPage): void {
        window.wikiframe.addArticle(p)
        window.wikiframe.update();
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
            
            const injectedStyles = document.createElement('link');
            injectedStyles.rel = 'stylesheet';
            injectedStyles.type = 'text/css';
            injectedStyles.href = browser.runtime.getURL('css/wikichan.css');
            document.head.appendChild(injectedStyles);
        } else {
            window.wikiframe.clean();
        }
        window.wikiframe.setLocation(e.clientX, e.clientY);
        window.wikiframe.open();

        for (let before = 0; before < 4; before++) {
            for (let after = 0; after < 4; after++) {
                const search = source.phrase(before, after);
                for (let w = 0; w < this.wikis.length; w++) {
                    this.wikis[w].fetchExtract(search)
                        .then((p: WikiPage) => {
                            console.log(p);
                            p.searchPhrase = search;
                            this.put(p);
                        });
                }
            }
        }
    }
}

logger.enableAll();
window.wikichan = new Wikichan();
const wikichan = window.wikichan;
wikichan.prepare();