import { WikiService } from "../service/wikiservice";
import { Language } from "../model/language";
import { Page } from "../model/page";

import { Set } from "../util/set";

import { TextSelector } from "../selector/text-selector";
import { TextSource } from "../selector/text-source";
import { Display } from "../component/display";

export class Wikichan {
    service: WikiService;
    selector: TextSelector;

    display: Display;
    pages: Set<Page>;

    constructor(service?: WikiService) {
        this.service = service || new WikiService(Language.EN);
        this.selector = new TextSelector();
        this.display = new Display();
        this.pages = new Set<Page>();
    }

    open(e: MouseEvent): void {
        this.pages.clear();

        if (!e.altKey) {
            this.display.close();
            return;
        }

        const source: TextSource = this.selector.getSourceUnderCursor(e);
        for (let before = 0; before < 4; before++) {
            for (let after = 0; after < 4; after++) {
                const search = source.phrase(before, after);
                this.service.fetchExtract(search).then(p => {
                    if (p) {
                        this.addPage(p);
                    }
                });
            }
        }

        this.display.open(e.clientY, e.clientX, this.pages);
        const search: HTMLInputElement = <HTMLInputElement>(
            this.display.documentContainer.getElementById("search-box")
        );
        search.addEventListener("input", event => {
            this.pages.clear();
            this.search(search.value);
        });
    }

    search(term: string) {
        this.pages.clear();
        const terms: string[] = term.split(" ");
        for (let i = terms.length; i > 0; i--) {
            for (let j = 0; j + i <= terms.length; j++) {
                this.service.fetchExtract(terms.slice(j, j + i).join(" ")).then(p => {
                    if (p) {
                        this.addPage(p);
                    }
                });
            }
        }
    }

    private addPage(p: Page) {
        this.pages.add(p);
        this.pages.sort(
            (a: Page, b: Page): number => {
                if (a.searchPhrase.length < b.searchPhrase.length) {
                    return 1;
                } else if (a.searchPhrase.length > b.searchPhrase.length) {
                    return -1;
                }

                if (a.title.length < b.title.length) {
                    return 1;
                } else if (a.title.length > b.title.length) {
                    return -1
                }
                return 0;
            }
        );
    }
}
