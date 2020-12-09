import React, { RefObject } from "react";
import ReactDOM from "react-dom";
import { fromEvent } from "rxjs";

import Float from "@view/Float";
import RootComponent from "@view/Root";
import { ProviderMerge } from "@providers";

import TextSource, { ExpandMode } from "./TextSource";

// eslint-disable-next-line no-useless-escape
const PUNCT_RE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;
const SPACE_RE = /\s+/g;

export function register(w: Window, providers: ProviderMerge): void {
  const doc = w.document;
  const [floatRef, rootRef] = injectFrame(doc, providers);

  let lastSource: TextSource | undefined = undefined;
  let interval: number;

  const closeFrame = (): void => {
    floatRef.current?.close();
    if (interval) {
      clearInterval(interval);
    }
  };

  fromEvent(w, "mousemove").subscribe((e: Event) => {
    const me = e as MouseEvent;
    // Only proceed if <Ctrl> is held down
    if (!me.ctrlKey) {
      return;
    }

    const x = me.clientX;
    const y = me.clientY;

    // Check if mouse has to a different range from the last movement
    // If still in same range, do nothing
    if (lastSource) {
      const lastRect = lastSource.range.getBoundingClientRect();
      if (pointInRect(x, y, lastRect)) {
        return;
      }
    }

    // Close frame and clear interval for previous opening
    closeFrame();

    // Scrape the text at the current spot
    const ts = TextSource.getFromPoint(x, y, [1, 0], [1, 0]);
    if (ts === null) {
      return;
    }

    // Construct query strings by expanding selection left and right
    const queries = queriesFromExpansions(ts, 5);
    console.log(queries);

    // Start provider searches
    rootRef.current?.searchProviders(queries);

    // Create interval to open when first result is returned
    interval = w.setInterval(() => {
      const rootState = rootRef.current?.state;
      if (rootState && rootState.items.length > 0) {
        floatRef.current?.open(x, y);
        clearInterval(interval);
      }
    }, 100);

    lastSource = ts;
  });

  // Click handler to close frame
  fromEvent(w, "click").subscribe((e: Event): void => {
    const me = e as MouseEvent;
    if (!me.ctrlKey && !floatRef.current?.containsPoint(me.x, me.y)) {
      lastSource = undefined;
      closeFrame();
    }
  });
}

function injectFrame(
  doc: Document,
  providerMerge: ProviderMerge,
): [RefObject<Float>, RefObject<RootComponent>] {
  const floatRef = React.createRef<Float>();
  const rootRef = React.createRef<RootComponent>();

  const frameWidth = 600;
  const frameHeight = 400;

  const injectedStyle = doc.getElementById("wikichan-styles") as HTMLStyleElement;
  const inlineStyles = injectedStyle.innerHTML;

  const ext = (
    <React.StrictMode>
      <Float
        ref={floatRef}
        frameWidth={frameWidth}
        frameHeight={frameHeight}
        inlineStyles={inlineStyles}
      >
        <RootComponent ref={rootRef} providers={providerMerge} />
      </Float>
    </React.StrictMode>
  );

  const tmp = doc.createElement("div");
  ReactDOM.render(ext, tmp);
  doc.body.appendChild(tmp.childNodes[0]);

  return [floatRef, rootRef];
}

function queriesFromExpansions(ts: TextSource, n: number): string[] {
  let queries: string[] = [ts.text()];

  let stopLeft = false;
  let stopRight = false;
  for (let i = 0; i < n; i++) {
    if (!stopRight) {
      const rex = ts.expandNext(ExpandMode.word);
      if (rex !== null) {
        queries = queries.concat(getTexts(rex));
      } else {
        stopRight = true;
      }
    }

    if (!stopLeft) {
      const lex = ts.expandPrev(ExpandMode.word);
      if (lex !== null) {
        queries = queries.concat(getTexts(lex));
        ts = lex;
      } else {
        stopLeft = true;
      }
    }

    if (!stopRight) {
      const rex = ts.expandNext(ExpandMode.word);
      if (rex !== null) {
        queries = queries.concat(getTexts(rex));
        ts = rex;
      }
    }
  }
  return queries;
}

function getTexts(ts: TextSource): string[] {
  const text = ts.text();
  return [text, text.replace(PUNCT_RE, " ").replace(SPACE_RE, " ").trim()];
}

function pointInRect(x: number, y: number, rect: DOMRect): boolean {
  return (
    x >= rect.left &&
    x <= rect.left + rect.width &&
    y >= rect.top &&
    y <= rect.top + rect.height
  );
}
