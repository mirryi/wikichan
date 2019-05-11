export function hide(event: Event) {
    const button: HTMLElement = <HTMLElement>event.srcElement;
    const header: HTMLElement = button.parentElement.parentElement.parentElement;
    const content: HTMLElement = <HTMLElement>header.nextElementSibling;
    content.style.display = content.style.display === "none" ? "block" : "none";
    button.innerText = button.innerText === "+" ? "–" : "+";
}