import { fromEvent, Observable, merge } from "rxjs";
import { map, filter } from "rxjs/operators";

export type InputEvent = InputEvent.Mousemove | InputEvent.Mouseclick;

export namespace InputEvent {
    export interface Mousemove {
        kind: "MOUSEMOVE";
        x: number;
        y: number;
        inner: MouseEvent;
    }

    export interface Mouseclick {
        kind: "MOUSECLICK";
        x: number;
        y: number;
        inner: MouseEvent;
    }
}

export namespace InputHandler {
    export interface Options {
        holdkeys: {
            ctrl: boolean;
            alt: boolean;
            shift: boolean;
        };
    }
}

/**
 * Handler for user input. Produces a stream of input events, filtering out
 * events based on criteria.
 */
export class InputHandler {
    constructor(private options: InputHandler.Options) {}

    /**
     * Registers event handlers in the given window and returns a stream of
     * observable events.
     */
    register(w: Window): Observable<InputEvent> | undefined {
        const moveEvents = fromEvent(w, "mousemove").pipe(
            // Safety: event should be a MouseEvent.
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            map((e) => e as MouseEvent),
            // Ensure that required holdkeys are held.
            filter((e) => {
                const holdkeys = this.options.holdkeys;
                return !(
                    (holdkeys.ctrl && !e.ctrlKey) ||
                    (holdkeys.shift && !e.shiftKey) ||
                    (holdkeys.alt && !e.altKey)
                );
            }),
            map(
                (e): InputEvent.Mousemove => {
                    return { kind: "MOUSEMOVE", x: e.clientX, y: e.clientY, inner: e };
                },
            ),
        );

        const clickEvents = fromEvent(w, "click").pipe(
            map(
                (e): InputEvent.Mouseclick => {
                    // Safety: event should be a MouseEvent.
                    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                    const me = e as MouseEvent;
                    return { kind: "MOUSECLICK", x: me.x, y: me.y, inner: me };
                },
            ),
        );

        return merge(moveEvents, clickEvents);
    }

    setOptions(options: InputHandler.Options): void {
        this.options = options;
    }
}
