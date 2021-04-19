import { Subscription } from "rxjs";

import View from "./View";
import InputHandler from "./InputHandler";

class Front {
    dataflow?: Subscription;

    constructor() {}

    async load(): Promise<void> {
        // Load settings from back.
        // When settings change, propagate to back.
    }

    async register(w: Window): Promise<void> {
        const view = new View({
            frameHeight: 400,
            frameWidth: 600,
            handleQueries: (queries: string[]) => this.handleQueries(queries),
        });

        const inputHandler = new InputHandler({
            // TODO: get options from back
            options: {
                holdkeys: {
                    ctrl: true,
                    shift: false,
                    alt: false,
                },
            },
            handleQueries: (queries: string[]) => this.handleQueries(queries),
            handleClose: () => view.float?.close(),
            shouldClose: (x: number, y: number) => {
                if (view.float) {
                    return !view.float?.containsPoint(x, y);
                } else {
                    return true;
                }
            },
        });

        view.render(w);
        inputHandler.register(w);
    }

    /**
     * Send queries to back to get results, which should be streamed back via
     * `itemSubscription`.
     */
    async handleQueries(queries: string[]) {}
}

export default Front;
