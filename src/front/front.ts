import { observe } from "rxjs-observe";
import { switchMap } from "rxjs/operators";

import { Options } from "@shared/options";
import { debug, info } from "@util/logging";

import { Exchange, InnerExchange } from "./exchange";
import { InputEvent, InputHandler } from "./input-handler";
import { InnerTunnel, QueryItemManager } from "./query-item-manager";
import { SelectionManager } from "./selection-manager";
import { ViewManager } from "./view-manager";

export { InnerExchange, InnerTunnel };

interface OptionsProxy {
    options: Options;
}
export class Front {
    private view: ViewManager;
    private inputHandler: InputHandler;
    private selectionManager: SelectionManager;

    private queryItemManager: QueryItemManager;
    private exchange: Exchange;

    private proxy: OptionsProxy;

    private constructor(
        exchange: Exchange,
        queryItemManager: QueryItemManager,
        options: Options,
    ) {
        this.view = new ViewManager({
            height: 400,
            width: 600,
            handleQueries: (queries: string[]) => this.handleQueries(queries),
        });
        this.selectionManager = new SelectionManager();
        // TODO: get options from back
        this.inputHandler = new InputHandler(options.front.input);

        this.exchange = exchange;
        this.queryItemManager = queryItemManager;

        // When options change, propagate to back.
        const { observables, proxy } = observe({ options });
        this.proxy = proxy;
        observables.options
            .pipe(
                switchMap((options) => this.exchange.changeOptions({ options: options })),
            )
            .subscribe();
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
        // Register the UI into the window.
        this.view.register(w);

        // Handle the item stream.
        const itemStream = this.queryItemManager.itemsStream();
        itemStream
            .pipe(
                // TODO: not sure if this is good design?
                switchMap(async (items) => {
                    this.view?.setItems(items);
                    this.view?.open();
                }),
            )
            .subscribe();

        // Register the input handler and define handler for input events.
        const inputStream = this.inputHandler.register(w);
        inputStream?.subscribe((e) => this.handleInputEvent(e));
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
                if (!this.view?.containsPoint(e.x, e.y)) {
                    this.view.close();
                    this.selectionManager.clearCurrent();
                }
                break;
        }
    }

    private handleQueries(queries: string[]): void {
        void this.queryItemManager.send(queries);
    }
}
