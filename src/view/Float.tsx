import React, { Component, CSSProperties, ReactNode, RefObject } from "react";
import Frame from "react-frame-component";

import styles from "./Float.module.scss";

export interface FloatProps {
    width: number;
    height: number;
    styles?: string[];
}

export interface FloatState {
    frameVisibility: boolean;
    frameLeft: number;
    frameTop: number;
}

class Float extends Component<FloatProps, FloatState> {
    innerRef: RefObject<HTMLDivElement>;

    constructor(props: FloatProps) {
        super(props);

        this.state = {
            frameVisibility: false,
            frameLeft: 0,
            frameTop: 0,
        };
        this.innerRef = React.createRef();
    }

    render(): ReactNode {
        const style: CSSProperties = {
            width: this.props.width,
            height: this.props.height,
            left: this.state.frameLeft,
            top: this.state.frameTop,
        };

        const classes = [
            styles.frame,
            this.state.frameVisibility ? styles.frameVisible : styles.frameHidden,
        ];

        const head = this.props.styles?.map((style, i) => <style key={i}>{style}</style>);

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
            frameVisibility: true,
            frameLeft: left + offset.x,
            frameTop: top + offset.y,
        });
    }

    hideFrame(): void {
        this.setState({ frameVisibility: false });
    }

    containsPoint(x: number, y: number): boolean {
        return (
            x > this.state.frameLeft &&
            x < this.state.frameLeft + this.props.width &&
            y > this.state.frameTop &&
            y < this.state.frameTop + this.props.height
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
