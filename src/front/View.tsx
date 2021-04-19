import React from "react";
import ReactDOM from "react-dom";

import Float from "@view/Float";
import RootComponent from "@view/Root";

import { Item } from "@providers";

export interface ViewProps {
    frameHeight: number;
    frameWidth: number;

    handleQueries: (queries: string[]) => void;
}

class View {
    private props: ViewProps;

    private floatRef: React.RefObject<Float>;
    private rootRef: React.RefObject<RootComponent>;

    constructor(props: ViewProps) {
        this.props = props;
        this.floatRef = React.createRef<Float>();
        this.rootRef = React.createRef<RootComponent>();
    }

    render(w: Window) {
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
                    <RootComponent
                        ref={this.rootRef}
                        handleSearch={(query: string) => this.handleQueries([query])}
                    />
                </Float>
            </React.StrictMode>
        );

        const tmp = doc.createElement("div");
        ReactDOM.render(component, tmp);
        doc.body.appendChild(tmp.childNodes[0]);
    }

    handleQueries(queries: string[]): void {
        this.props.handleQueries(queries);
    }

    async pushItem(item: Item): Promise<void> {
        return new Promise((resolve, _reject) => {
            const root = this.rootRef.current;
            root?.setState(
                {
                    items: [...root.state.items, item],
                },
                () => resolve(),
            );
        });
    }

    async clearItems(): Promise<void> {
        return new Promise((resolve, _reject) => {
            this.rootRef.current?.setState({ items: [] }, () => resolve());
        });
    }

    get float(): Float | null {
        return this.floatRef.current;
    }

    get root(): RootComponent | null {
        return this.rootRef.current;
    }
}

export default View;
