import * as React from "react";
import { Component, CSSProperties, ReactNode } from "react";
import * as ReactDOM from "react-dom";
import { RootComponent } from "./root";
import { ProviderMerge } from "../provider";
import { fromEvent } from "rxjs";
import Frame from "react-frame-component";
import styles from "./float.scss";

export interface FloatProps {
  providers: ProviderMerge;
  frameWidth: number;
  frameHeight: number;
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

    fromEvent(window, "click").subscribe((e: Event) => {
      const me = e as MouseEvent;
      if (me.altKey) {
        this.open(me.clientX, me.clientY);
      }
    });
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

    return (
      <Frame id="wikichan" className={styles.frame} style={style} frameBorder="0">
        <RootComponent providers={this.props.providers} />
      </Frame>
    );
  }

  open(left: number, top: number) {
    this.hideFrame();

    this.showFrame(left, top);
  }

  showFrame(left: number, top: number) {
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

  hideFrame() {
    this.setState({ frameVisibility: false });
  }

  private calculateOffset(
    x: number,
    y: number,
    w: number,
    h: number,
  ): { x: number; y: number } {
    let offset = { x: 10, y: 10 };
    if (x + offset.x + w > window.innerWidth) {
      offset.x = -(offset.x + w);
    }

    if (y + offset.y + h > window.innerHeight) {
      offset.y = -(offset.y + h);
    }

    return offset;
  }
}
