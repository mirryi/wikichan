import * as React from "react";
import * as ReactDOM from "react-dom";
import { ProviderMerge } from "./provider";
import { Float } from "./components/float";

if (self == top) {
  const providers = new ProviderMerge([]);
  const frameWidth = 475;
  const frameHeight = 315;

  const ext = (
    <Float providers={providers} frameWidth={frameWidth} frameHeight={frameHeight} />
  );

  const tmp = document.createElement("div");
  ReactDOM.render(ext, tmp);
  document.body.appendChild(tmp.childNodes[0]);
}
