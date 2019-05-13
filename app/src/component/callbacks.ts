export module Callbacks {
    export function hide() {
        const header: HTMLElement = this.parentElement.parentElement.parentElement;
        const content: HTMLElement = <HTMLElement>header.nextElementSibling;
        content.style.display = content.style.display === "none" ? "block" : "none";
        this.innerText = this.innerText === "+" ? "–" : "+";
    }
}
