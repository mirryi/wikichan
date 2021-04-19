import { fromEvent } from "rxjs";

import Selector, { ExpandMode, TextSource } from "./Selector";

export interface Props {
    options: Options;

    handleQueries: (queries: string[]) => void;
    handleClose: () => void;
    shouldClose: (x: number, y: number) => boolean;
}

export interface Options {
    holdkeys: {
        ctrl: boolean;
        alt: boolean;
        shift: boolean;
    };
}

class InputHandler {
    private props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    register(w: Window): void {
        let lastSource: TextSource | null = null;

        const selector = new Selector();
        fromEvent(w, "mousemove").subscribe((e: Event) => {
            // Safety: event should be a MouseEvent.
            // eslint-ignore-next-line @typescript-eslint/consistent-type-assertions
            const me = e as MouseEvent;

            // Ensure that required holdkeys are held.
            const holdkeys = this.props.options.holdkeys;
            if (
                (holdkeys.ctrl && !me.ctrlKey) ||
                (holdkeys.shift && !me.shiftKey) ||
                (holdkeys.alt && !me.altKey)
            ) {
                return;
            }

            const x = me.clientX;
            const y = me.clientY;

            // Check if mouse has to a different range from the last movement
            // If still in same range, do nothing
            if (lastSource) {
                const lastRect = lastSource.range.getBoundingClientRect();
                if (pointInRect(x, y, lastRect)) {
                    return;
                }
            }

            // Close frame.
            this.props.handleClose();

            // Scrape the text at the current spot.
            lastSource = selector.fromPoint(x, y, [1, 0], [1, 0]);
            if (!lastSource) {
                return;
            }

            // Construct query strings by expanding selection left and right.
            const queries = queriesFromExpansions(selector, lastSource, 5);
            // Handle queries.
            this.props.handleQueries(queries);
        });

        fromEvent(w, "click").subscribe((e: Event): void => {
            // Safety: event should be a MouseEvent.
            // eslint-ignore-next-line @typescript-eslint/consistent-type-assertions
            const me = e as MouseEvent;

            if (this.props.shouldClose(me.x, me.x)) {
                lastSource = null;
                this.props.handleClose();
            }
        });
    }

    setOptions(options: Options): void {
        this.props.options = options;
    }
}

function pointInRect(x: number, y: number, rect: DOMRect): boolean {
    return (
        x >= rect.left &&
        x <= rect.left + rect.width &&
        y >= rect.top &&
        y <= rect.top + rect.height
    );
}

function queriesFromExpansions(selector: Selector, ts: TextSource, n: number): string[] {
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

// eslint-disable-next-line no-useless-escape
const PUNCT_RE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;
const SPACE_RE = /\s+/g;

function getTexts(ts: TextSource): string[] {
    const text = ts.text();
    return [text, text.replace(PUNCT_RE, " ").replace(SPACE_RE, " ").trim()];
}

export default InputHandler;
