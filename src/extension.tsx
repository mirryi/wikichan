import * as React from "react";
import * as ReactDOM from "react-dom";
import { fromEvent } from "rxjs";
import { Float } from "./components/float";
import { RootComponent } from "./components/root";
import { ProviderMerge } from "./provider";
import { WikipediaLanguage, WikipediaProvider } from "./providers/wikipedia";
import { ExpandMode, getTextSourceFromPoint } from "./selector";

if (self === top) {
  const floatRef = React.createRef<Float>();
  const rootRef = React.createRef<RootComponent>();

  const providers = new ProviderMerge([new WikipediaProvider(WikipediaLanguage.EN)]);
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

      let ts = getTextSourceFromPoint(x, y, [1, 0], [1, 0]);
      if (ts === null) {
        return;
      }

      const queries: string[] = [ts.text()];

      let stopLeft = false;
      let stopRight = false;
      for (let i = 0; i < 5; i++) {
        if (!stopRight) {
          const rex = ts.expandNext(ExpandMode.word);
          if (rex !== null) {
            queries.push(rex.text());
          } else {
            stopRight = true;
          }
        }

        if (!stopLeft) {
          const lex = ts.expandPrev(ExpandMode.word);
          if (lex !== null) {
            queries.push(lex.text());
            ts = lex;
          } else {
            stopLeft = true;
          }
        }

        if (!stopRight) {
          const rex = ts.expandNext(ExpandMode.word);
          if (rex !== null) {
            queries.push(rex.text());
            ts = rex;
          }
        }
      }
      rootRef.current?.searchProviders(queries);

      floatRef.current?.open(x, y);
    } else {
      floatRef.current?.close();
    }
  });
}
