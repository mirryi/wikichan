import React, { CSSProperties } from "react";
import Frame from "react-frame-component";

import styles from "./Float.module.scss";

export interface FloatProps {
    children?: JSX.Element;

    open: boolean;
    left: number;
    top: number;
    width: number;
    height: number;

    styles?: string[];
}

export const Float = (props: FloatProps): JSX.Element => {
    const style: CSSProperties = {
        width: props.width,
        height: props.height,
        left: props.left,
        top: props.top,
    };

    const head = props.styles?.map((style, i) => <style key={i}>{style}</style>) ?? [];

    const classes = [styles.frame, props.open ? styles.frameVisible : styles.frameHidden];
    return (
        <Frame head={head} className={classes.join(" ")} style={style}>
            <div style={{ maxHeight: props.height }}>{props.children}</div>
        </Frame>
    );
};
