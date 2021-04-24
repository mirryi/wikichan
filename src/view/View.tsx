import React, { Component } from "react";

import { Item } from "@providers";

import { Float } from "./Float";
import { Root } from "./Root";

export interface ViewProps {
    height: number;
    width: number;
    styles?: string[];

    handleQueries: (queries: string[]) => void;
}

export interface ViewState {
    open: boolean;
    height: number;
    width: number;
    left: number;
    top: number;

    items: Item[];
}

export class View extends Component<ViewProps, ViewState> {
    constructor(props: ViewProps) {
        super(props);

        this.state = {
            open: false,
            height: props.height,
            width: props.width,
            left: 0,
            top: 0,

            items: [],
        };
    }

    render(): JSX.Element {
        return (
            <React.StrictMode>
                <Float {...this.state} styles={this.props.styles}>
                    <Root
                        items={this.state.items}
                        handleSearch={(query: string) =>
                            this.props.handleQueries([query])
                        }
                    />
                </Float>
            </React.StrictMode>
        );
    }

    setItems(items: Item[]): Promise<void> {
        return new Promise((resolve, _reject) => {
            this.setState({ items }, () => resolve());
        });
    }

    /**
     * Open the float at the given position. If no position is given, the float
     * is opened at its last position.
     */
    open(pos?: [number, number]): void {
        if (pos) {
            const [left, top] = pos;
            const offset = this.calculateOffset(
                left,
                top,
                this.props.width,
                this.props.height,
            );
            this.setState({ open: true, left: left + offset.x, top: top + offset.y });
        } else {
            this.setState({ open: true });
        }
    }

    /**
     * Close the float.
     */
    close(): void {
        this.setState({ open: false });
    }

    /**
     * Toggle the visibility of the float.
     */
    toggle(): void {
        this.setState((prev, _props) => ({
            open: !prev.open,
        }));
    }

    /**
     * Set the position of the float.
     */
    setPosition(left: number, top: number): void {
        this.setState({ left, top });
    }

    /**
     * Return true if the given coordinate is within the area of the float.
     */
    containsPoint(x: number, y: number): boolean {
        return (
            x > this.state.left &&
            x < this.state.left + this.props.width &&
            y > this.state.top &&
            y < this.state.top + this.props.height
        );
    }

    private calculateOffset(
        x: number,
        y: number,
        w: number,
        h: number,
    ): { x: number; y: number } {
        const offset = { x: 10, y: 10 };
        if (x + offset.x + w > window.innerWidth) {
            offset.x = -(offset.x + w);
        }

        if (y + offset.y + h > window.innerHeight) {
            offset.y = -(offset.y + h);
        }

        return offset;
    }
}
