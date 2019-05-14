import { Wikichan } from "./controller/controller";

const controller = new Wikichan();
window.addEventListener("mousedown", controller.open.bind(controller));

const injectedStyles = document.createElement("link");
injectedStyles.rel = "stylesheet";
injectedStyles.type = "text/css";
injectedStyles.href = browser.runtime.getURL("css/wikichan.css");
document.head.appendChild(injectedStyles);
