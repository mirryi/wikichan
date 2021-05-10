import React from "react";
import ReactDOM from "react-dom";

import { Item } from "@providers";
import { View, ViewProps } from "@view/View";

export class ViewManager {
    private viewRef: React.RefObject<View>;

    private _registered: boolean;

    constructor(
        /**
         * Props to be passed to created View.
         */
        private props: ViewProps,
    ) {
        this.viewRef = React.createRef();

        this._registered = false;
    }

    register(w: Window): void {
        if (this._registered) {
            return;
        }
        this._registered = true;

        const doc = w.document;
        const inlineStyles = Array.from(
            doc.querySelectorAll(".wikichan-styles"),
            (tag) => tag.innerHTML,
        );

        const component = this.component({
            styles: inlineStyles,
            ...this.props,
        });

        const tmp = doc.createElement("div");
        ReactDOM.render(component, tmp);
        // Safety: previous line inserts React compnonent as first child of
        // tmp.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        doc.body.appendChild(tmp.childNodes[0]!);

        return;
    }

    private component(props: ViewProps): JSX.Element {
        return <View {...props} ref={this.viewRef} />;
    }

    /**
     * Returns true if this View is registered.
     */
    registered(): boolean {
        return this._registered;
    }

    setItems(items: Item[]): void {
        this.view()?.setItems(items);
    }

    open(): void {
        this.view()?.open();
    }

    /**
     * Close the float.
     */
    close(): void {
        this.view()?.close();
    }

    /**
     * Set the position to open the float at the next time it is opened.
     */
    setPosition(left: number, top: number): void {
        this.view()?.setPosition(left, top);
    }

    containsPoint(x: number, y: number): boolean | undefined {
        return this.view()?.containsPoint(x, y);
    }

    private view(): View | null {
        return this.viewRef.current;
    }
}
