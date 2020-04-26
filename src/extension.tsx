import * as React from "react";
import * as ReactDOM from "react-dom";
import { fromEvent } from "rxjs";
import { Float } from "./components/float";
import { RootComponent } from "./components/root";
import { ProviderMerge } from "./provider";
import { DummyProvider } from "./providers/dummy";
import { getTextSourceFromPoint, ExpandMode } from "./selector";

if (self === top) {
  const floatRef = React.createRef<Float>();
  const rootRef = React.createRef<RootComponent>();

  const providers = new ProviderMerge([new DummyProvider()]);
  const frameWidth = 475;
  const frameHeight = 315;

  const ext = (
    <Float ref={floatRef} frameWidth={frameWidth} frameHeight={frameHeight}>
      <RootComponent ref={rootRef} providers={providers} />
    </Float>
  );

  const tmp = document.createElement("div");
  ReactDOM.render(ext, tmp);
  document.body.appendChild(tmp.childNodes[0]);

  fromEvent(window, "click").subscribe((e: Event) => {
    const me = e as MouseEvent;
    if (me.altKey) {
      const x = me.clientX;
      const y = me.clientY;

      let ts = getTextSourceFromPoint(x, y, [2, 0], [2, 0]);
      if (ts === null) {
        return;
      }

      const query = ts?.text();
      rootRef.current?.searchProviders([query]);

      floatRef.current?.open(x, y);
    } else {
      floatRef.current?.close();
    }
  });
}
