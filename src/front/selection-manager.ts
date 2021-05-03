import { Selector, ExpandMode, TextSource } from "./Selector";

export class SelectionManager {
    private lastSource?: TextSource;
    private _selector: Selector;

    constructor() {
        this.lastSource = undefined;
        this._selector = new Selector();
    }

    selectNewIntoQueries(x: number, y: number, n: number): string[] | undefined {
        const source = this.selectNew(x, y);
        if (!source) {
            return undefined;
        } else {
            const queries = buildQueries(this._selector, source, n);
            return [...new Set(queries)];
        }
    }

    selectNew(x: number, y: number): TextSource | undefined {
        // Check if mouse has to a different range from the last movement
        // If still in same range, do nothing
        if (this.lastSource) {
            const lastRect = this.lastSource.range.getBoundingClientRect();
            if (pointInRect(x, y, lastRect)) {
                return undefined;
            }
        }

        // Scrape the text at the current spot.
        const source = this._selector.fromPoint(x, y, [1, 0], [1, 0]);
        if (!source) {
            this.lastSource = undefined;
            return undefined;
        } else {
            this.lastSource = source;
            return this.lastSource;
        }
    }

    clearCurrent(): void {
        this.lastSource = undefined;
    }

    selector(): Selector {
        return this._selector;
    }
}

function buildQueries(selector: Selector, ts: TextSource, n: number): string[] {
    let queries: string[] = [ts.text()];

    let stopLeft = false;
    let stopRight = false;
    for (let i = 0; i < n; i++) {
        if (!stopRight) {
            const rex = selector.expandNext(ts, ExpandMode.word);
            if (rex !== null) {
                queries = queries.concat(getTexts(rex));
            } else {
                stopRight = true;
            }
        }

        if (!stopLeft) {
            const lex = selector.expandPrev(ts, ExpandMode.word);
            if (lex !== null) {
                queries = queries.concat(getTexts(lex));
                ts = lex;
            } else {
                stopLeft = true;
            }
        }

        if (!stopRight) {
            const rex = selector.expandNext(ts, ExpandMode.word);
            if (rex !== null) {
                queries = queries.concat(getTexts(rex));
                ts = rex;
            }
        }
    }
    return queries;
}

const PUNCT_RE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;
const SPACE_RE = /\s+/g;
function getTexts(ts: TextSource): string[] {
    const text = ts.text();
    return [text, text.replace(PUNCT_RE, " ").replace(SPACE_RE, " ").trim()];
}

function pointInRect(x: number, y: number, rect: DOMRect): boolean {
    return (
        x >= rect.left &&
        x <= rect.left + rect.width &&
        y >= rect.top &&
        y <= rect.top + rect.height
    );
}
