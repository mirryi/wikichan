import { TextSource } from "./text-source";

window.addEventListener("mousedown", getWordUnderCursor);

function getWordUnderCursor(event: MouseEvent) {
    const range: CaretPosition = document.caretPositionFromPoint(event.clientX, event.clientY);
    const textNode: HTMLObjectElement = <HTMLObjectElement>range.offsetNode;
    const offset: number = range.offset;

    // console.log(getPreviousNode(textNode).textContent + data + getNextNode(textNode).textContent);

    const source = new TextSource(textNode, offset);
    console.log(source.phrase(2, 2));

    // console.log(source.text);
    // source.joinAfter();
    // source.joinBefore();
    // console.log(source.text);
}