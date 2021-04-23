import React, { Component, CSSProperties, ReactNode, RefObject } from "react";
import Frame from "react-frame-component";

import styles from "./Float.module.scss";

export interface FloatProps {
    width: number;
    height: number;
    styles?: string[];
}

export interface FloatState {
    open: boolean;
    left: number;
    top: number;
}

class Float extends Component<FloatProps, FloatState> {
    innerRef: RefObject<HTMLDivElement>;

    constructor(props: FloatProps) {
        super(props);

        this.state = {
            open: false,
            left: 0,
            top: 0,
        };
        this.innerRef = React.createRef();
    }

    render(): ReactNode {
        const style: CSSProperties = {
            width: this.props.width,
            height: this.props.height,
            left: this.state.left,
            top: this.state.top,
        };

        const head =
            this.props.styles?.map((style, i) => <style key={i}>{style}</style>) ?? [];

        const classes = [
            styles.frame,
            this.state.open ? styles.frameVisible : styles.frameHidden,
        ];
        return (
            <Frame head={head} className={classes.join(" ")} style={style}>
                <div style={{ maxHeight: this.props.height }} ref={this.innerRef}>
                    {this.props.children}
                </div>
            </Frame>
        );
    }

    open(left: number, top: number): void {
        this.hideFrame();

        this.showFrame(left, top);
    }

    close(): void {
        this.hideFrame();
    }

    showFrame(left: number, top: number): void {
        const offset = this.calculateOffset(
            left,
            top,
            this.props.width,
            this.props.height,
        );
        this.setState({
            open: true,
            left: left + offset.x,
            top: top + offset.y,
        });
    }

    hideFrame(): void {
        this.setState({ open: false });
    }

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

export default Float;
