import { TextSource } from "./text-source";

export class TextSelector {

    getSourceUnderCursor(event: MouseEvent) {
        const range: CaretPosition = document.caretPositionFromPoint(event.clientX, event.clientY);
        const textNode: HTMLObjectElement = <HTMLObjectElement>range.offsetNode;
    
        const offset: number = range.offset;
    
        const source = new TextSource(textNode, offset);
        return source;
    }

}