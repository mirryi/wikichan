import { MousePoint } from "./mousepoint";
import {WikiApi } from "./wikiapi";

const FAKE_DATA = ['lorem ipsum', 'anime'];

export function onMouseMove(e: MouseEvent) {
    const mousePosition = new MousePoint(e.pageX, e.pageY);
    let elem = <HTMLElement>document.elementFromPoint(mousePosition.x, mousePosition.y);

    if (elem.tagName.toLowerCase() !== 'span') {
        return;
    }
    //elem.style.backgroundColor = "#e0e2e2";

    const siblings: HTMLElement[] = Array.prototype.slice.call(elem.parentElement.children);
    const index = siblings.indexOf(elem);

    let result: string;
    for (let i = 0; i <= 4; i++) {
        result = findSearch(siblings, index, i);
        if (result != "") {
            break;
        }
    }
    console.log(result);
    new WikiApi().fetchArticle(result);
}

function findSearch(spans: HTMLElement[], index: number, length: number): string {
    let search: string = "";
    for (let i = 0; i <= length; i++) {
        let start: number = Math.max(index - length + i, 0);
        let end: number = Math.min(index + i + 1, spans.length)
        search = constructSearch(spans, start, end);
        if (FAKE_DATA.indexOf(search) != -1) {
            return search;
        }
    }
    return "";
}

function constructSearch(spans: HTMLElement[], start: number, end: number) {
    let search = "";
    for (let i = start; i < end; i++) {
        search += spans[i].innerText;
        search += " ";
    }
    return search.trim().toLowerCase();
}