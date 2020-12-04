import React, { RefObject } from "react";
import ReactDOM from "react-dom";
import { fromEvent } from "rxjs";

import Float from "@components/float";
import RootComponent from "@components/root";
import { ProviderMerge } from "@providers";

import { ExpandMode, getTextSourceFromPoint, TextSource } from "./selector";

// eslint-disable-next-line no-useless-escape
const PUNCT_RE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;
const SPACE_RE = /\s+/g;

export function register(w: Window, providers: ProviderMerge): void {
  const doc = w.document;
  const [floatRef, rootRef] = injectFrame(doc, providers);

  let lastSource: TextSource | undefined = undefined;
  let interval: number;

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
    floatRef.current?.close();
    if (interval) {
      clearInterval(interval);
    }

    // Scrape the text at the current spot
    const ts = getTextSourceFromPoint(x, y, [1, 0], [1, 0]);
    if (ts === null) {
      return;
    }

    // Construct query strings by expanding selection left and right
    const queries = queriesFromExpansions(ts, 5);

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
      floatRef.current?.close();
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

  const ext = (
    <Float ref={floatRef} frameWidth={frameWidth} frameHeight={frameHeight}>
      <RootComponent ref={rootRef} providers={providerMerge} />
    </Float>
  );

  const tmp = doc.createElement("div");
  ReactDOM.render(ext, tmp);
  doc.body.appendChild(tmp.childNodes[0]);

  return [floatRef, rootRef];
}

function queriesFromExpansions(ts: TextSource, n: number): string[] {
  const queries: string[] = [ts.text()];

  let stopLeft = false;
  let stopRight = false;
  for (let i = 0; i < n; i++) {
    if (!stopRight) {
      const rex = ts.expandNext(ExpandMode.word);
      if (rex !== null) {
        queries.push(tsText(rex));
      } else {
        stopRight = true;
      }
    }

    if (!stopLeft) {
      const lex = ts.expandPrev(ExpandMode.word);
      if (lex !== null) {
        queries.push(tsText(lex));
        ts = lex;
      } else {
        stopLeft = true;
      }
    }

    if (!stopRight) {
      const rex = ts.expandNext(ExpandMode.word);
      if (rex !== null) {
        queries.push(tsText(rex));
        ts = rex;
      }
    }
  }
  return queries;
}

function tsText(ts: TextSource): string {
  const text = ts.text();
  return text.replace(PUNCT_RE, "").replace(SPACE_RE, " ");
}

function pointInRect(x: number, y: number, rect: DOMRect): boolean {
  return (
    x >= rect.left &&
    x <= rect.left + rect.width &&
    y >= rect.top &&
    y <= rect.top + rect.height
  );
}
