import React from "react";
import ReactDOM from "react-dom";
import { Observable } from "rxjs";

import { Item } from "@providers";
import Float from "@view/Float";
import { Root } from "@view/Root";

import { switchMap } from "rxjs/operators";

export interface ViewProps {
    frameHeight: number;
    frameWidth: number;

    handleQueries: (queries: string[]) => void;
}

export class View {
    private props: ViewProps;

    private floatRef: React.RefObject<Float>;
    private rootRef: React.RefObject<Root>;

    private _registered: boolean;

    constructor(props: ViewProps) {
        this.props = props;
        this.floatRef = React.createRef<Float>();
        this.rootRef = React.createRef<Root>();

        this._registered = false;
    }

    register(w: Window, itemsStream: Observable<Item[]>): void {
        if (this._registered) {
            return;
        }
        this._registered = true;

        const doc = w.document;

        const inlineStyles = Array.from(doc.querySelectorAll(".wikichan-styles")).map(
            (tag) => tag.innerHTML,
        );
        const component = (
            <React.StrictMode>
                <Float
                    ref={this.floatRef}
                    width={this.props.frameWidth}
                    height={this.props.frameHeight}
                    styles={inlineStyles}
                >
                    <Root
                        ref={this.rootRef}
                        handleSearch={(query: string) => this.handleQueries([query])}
                    />
                </Float>
            </React.StrictMode>
        );

        const tmp = doc.createElement("div");
        ReactDOM.render(component, tmp);
        // Safety: previous line inserts React compnonent as first child of
        // tmp.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        doc.body.appendChild(tmp.childNodes[0]!);

        // Handle the item stream.
        itemsStream
            .pipe(
                // TODO: not sure if this is good design?
                switchMap(
                    (items): Promise<void> =>
                        new Promise((resolve, _reject) => {
                            this.root?.setState({ items }, () => resolve());
                        }),
                ),
            )
            .subscribe();

        return;
    }

    registered(): boolean {
        return this._registered;
    }

    handleQueries(queries: string[]): void {
        this.props.handleQueries(queries);
    }

    open(x: number, y: number): void {
        this.float?.open(x, y);
    }

    close(): void {
        this.float?.close();
    }

    get float(): Float | null {
        return this.floatRef.current;
    }

    get root(): Root | null {
        return this.rootRef.current;
    }
}
