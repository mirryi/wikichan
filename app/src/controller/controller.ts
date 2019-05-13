import { WikiService } from "../service/wikiservice";
import { Language } from "../model/language";
import { Page } from "../model/page";

import { Set } from "../util/set";

import { TextSelector } from "../selector/text-selector";
import { TextSource } from "../selector/text-source";
import { Display } from "../component/display";

export class Wikichan {
    private service: WikiService;
    private selector: TextSelector;

    private display: Display;
    private pages: Set<Page>;

    constructor(service?: WikiService) {
        this.pages = new Set<Page>();
        this.service = service || new WikiService(Language.EN);
        this.selector = new TextSelector();
        this.display = new Display();
    }

    get(e: MouseEvent) {
        if (!e.altKey) {
            this.pages.clear();
            this.display.close();
            return;
        }

        const source: TextSource = this.selector.getSourceUnderCursor(e);
        
        this.display.open(e.clientY, e.clientX, this.pages);

        for (let before = 0; before < 4; before++) {
            for (let after = 0; after < 4; after++) {
                const search = source.phrase(before, after);
                this.service.fetchExtract(search).then(p => {
                    // console.log(p);
                });
            }
        }
    }
}
