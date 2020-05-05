import "core-js/stable";
import "regenerator-runtime/runtime";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { fromEvent } from "rxjs";
import { Float } from "./components/float";
import { RootComponent } from "./components/root";
import { ProviderMerge } from "./provider";
import { WikipediaLanguage, WikipediaProvider } from "./providers/wikipedia/provider";
import { ExpandMode, getTextSourceFromPoint, TextSource } from "./selector";

if (self === top) {
  const floatRef = React.createRef<Float>();
  const rootRef = React.createRef<RootComponent>();

  const providers = new ProviderMerge([new WikipediaProvider(WikipediaLanguage.EN)]);
  const frameWidth = 600;
  const frameHeight = 400;

  const styles = document.getElementById("wikichan-styles") as HTMLDivElement;

  const ext = (
    <Float
      ref={floatRef}
      frameWidth={frameWidth}
      frameHeight={frameHeight}
      inlineStyles={Array.from(styles.children).map((c) => c.innerHTML)}
    >
      <RootComponent ref={rootRef} providers={providers} />
    </Float>
  );

  const tmp = document.createElement("div");
  ReactDOM.render(ext, tmp);
  document.body.appendChild(tmp.childNodes[0]);

  let lastSource: TextSource | null = null;

  let interval: number;

  fromEvent(window, "mousemove").subscribe((e: Event) => {
    const me = e as MouseEvent;
    if (me.ctrlKey) {
      const x = me.clientX;
      const y = me.clientY;

      if (lastSource) {
        const lastRect = lastSource.range.getBoundingClientRect();
        if (
          x >= lastRect.left &&
          x <= lastRect.left + lastRect.width &&
          y >= lastRect.top &&
          y <= lastRect.top + lastRect.height
        ) {
          return;
        }
      }

      if (interval) {
        clearInterval(interval);
      }
      floatRef.current?.close();

      let ts = getTextSourceFromPoint(x, y, [1, 0], [1, 0]);
      if (ts === null) {
        return;
      }
      const initialSource = ts;

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

      interval = window.setInterval(() => {
        const rootState = rootRef.current?.state;
        if (rootState && rootState.items.length > 0) {
          floatRef.current?.open(x, y);
          clearInterval(interval);
        }
      }, 100);

      lastSource = initialSource;
    }
  });

  fromEvent(window, "click").subscribe((e: Event): void => {
    const me = e as MouseEvent;
    if (!me.ctrlKey) {
      floatRef.current?.close();
    }
  });
}
