import { autorun, observable } from "mobx";

import { Options } from "@shared/options";
import { debug, info } from "@util/logging";

import { Exchange, InnerExchange } from "./Exchange";
import { InputEvent, InputHandler } from "./InputHandler";
import { QueryItemManager, InnerTunnel } from "./QueryItemManager";
import { SelectionManager } from "./SelectionManager";
import { View } from "./View";

export { InnerExchange, InnerTunnel };

export class Front {
    private view: View;
    private inputHandler: InputHandler;
    private selectionManager: SelectionManager;

    private queryItemManager: QueryItemManager;
    private exchange: Exchange;

    private options: Options;

    private _registered: boolean;

    private constructor(
        exchange: Exchange,
        queryItemManager: QueryItemManager,
        options: Options,
    ) {
        this.view = new View({
            frameHeight: 400,
            frameWidth: 600,
            handleQueries: (queries: string[]) => this.handleQueries(queries),
        });
        this.selectionManager = new SelectionManager();
        // TODO: get options from back
        this.inputHandler = new InputHandler({
            holdkeys: {
                ctrl: true,
                shift: false,
                alt: false,
            },
        });

        this.exchange = exchange;
        this.queryItemManager = queryItemManager;

        // When options change, propagate to back.
        this.options = observable(options);
        // TODO: use disopser?
        autorun(async () => {
            await this.exchange.changeOptions({ options: this.options });
        });

        this._registered = false;
    }

    static async load(
        platformExchange: InnerExchange,
        platformTunnel: InnerTunnel,
    ): Promise<Front> {
        info("Initializing...");
        // Connect message exchange.
        debug("Connecting message exchange...");
        const exchange = await Exchange.load(platformExchange);

        // Load settings from back.
        debug("Retrieving options from background...");
        const options = await exchange.getOptions();

        // Initialize query-item manager.
        debug("Connecting tunnel...");
        const queryItemManager = await QueryItemManager.load(platformTunnel);

        info("Finished initializing!");
        return new Front(exchange, queryItemManager, options);
    }

    async register(w: Window): Promise<void> {
        // If already registered, do nothing.
        if (this._registered) {
            return;
        }
        this._registered = true;

        // Register the UI into the window.
        const itemStream = this.queryItemManager.itemsStream();
        this.view.register(w, itemStream);

        // Register the input handler and define handler for input events.
        const inputStream = this.inputHandler.register(w);
        inputStream?.subscribe((e) => this.handleInputEvent(e));
    }

    registered(): boolean {
        return this._registered;
    }

    private handleInputEvent(e: InputEvent): void {
        switch (e.kind) {
            // Pass mousemove events to the selection manager.
            case "MOUSEMOVE":
                const x = e.x;
                const y = e.y;
                // TODO: get n from options
                const queries = this.selectionManager.selectNewIntoQueries(x, y, 5);
                if (queries) {
                    this.view?.close();
                    this.view?.setPosition(x, y);
                    this.handleQueries(queries);
                }
                break;
            // Check if click events are within view.
            case "MOUSECLICK":
                // When user clicks outside of floating frame, close the frame
                // and clear the most recent selection.
                if (!this.view.float?.containsPoint(e.x, e.y)) {
                    this.view.close();
                    this.selectionManager.clearCurrent();
                }
                break;
        }
    }

    private handleQueries(queries: string[]): void {
        this.queryItemManager.send(queries);
    }
}
