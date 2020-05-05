import { default as React, Component, CSSProperties, ReactNode } from "react";
import Frame from "react-frame-component";

import styles from "./float.module.scss";

export interface FloatProps {
  frameWidth: number;
  frameHeight: number;
  inlineStyles: string[];
}

export interface FloatState {
  frameVisibility: boolean;
  frameLeft: number;
  frameTop: number;
}

export class Float extends Component<FloatProps, FloatState> {
  constructor(props: FloatProps) {
    super(props);

    this.state = {
      frameVisibility: false,
      frameLeft: 0,
      frameTop: 0,
    };
  }

  render(): ReactNode {
    const style: CSSProperties = {
      visibility: this.state.frameVisibility ? "visible" : "hidden",
      position: "fixed",
      width: this.props.frameWidth,
      height: this.props.frameHeight,
      left: this.state.frameLeft,
      top: this.state.frameTop,
    };

    const head = this.props.inlineStyles.map((style) => (
      <style key={style}>{style}</style>
    ));

    return (
      <Frame head={head} className={styles.frame} style={style} frameBorder="0">
        {this.props.children}
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
      this.props.frameWidth,
      this.props.frameHeight,
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
