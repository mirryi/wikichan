export class TextSource {
    private _leftNode: Node;
    private _rightNode: Node;
    private _text: string;
    private _offset: number;

    constructor(node: Node, offset: number) {
        this._leftNode = node;
        this._rightNode = node;
        this._text = node.textContent;
        this._offset = offset;
    }

    phrase(before: number, after: number): string {
        let i: number = this.offset;
        let begin: number;
        let end: number;

        for (let k = 0; k < before + 1; k++) {
            while (i > 0) {
                i--;
                if (this.text[i] === " ") break;
            }
            if (i < 0) {
                this.joinBefore();
            }
        }
        begin = i;

        i = this.offset;
        for (let k = 0; k < after + 1; k++) {
            while (i < this.text.length) {
                i++;
                if (this.text[i] === " ") break;
            }
            if (i > this.text.length) {
                this.joinAfter();
            }
        }
        end = i;
        return this.cleanString(this.text.substring(begin, end).trim());
    }

    cleanString(s: string): string {
        return s.replace("/[.,\/#!$%\^&\*;:{}=\-_`~()]/g", "");
    }

    joinAfter(): void {
        this.rightNode = getNextNode(this.rightNode);
        this.addAfter(this.rightNode.textContent);
    }

    joinBefore(): void {
        this.leftNode = getPreviousNode(this.leftNode);
        this.addBefore(this.leftNode.textContent);
    }

    addAfter(text: string): void {
        this.text += text;
    }

    addBefore(text: string): void {
        this.text = text + this.text;
        this.offset += text.length;
    }

    get text(): string {
        return this._text;
    }

    set text(value: string) {
        this._text = value;
    }

    get offset(): number {
        return this._offset;
    }

    set offset(value: number) {
        this._offset = value;
    }

    get leftNode(): Node {
        return this._leftNode;
    }

    set leftNode(value: Node) {
        this._leftNode = value;
    }

    get rightNode(): Node {
        return this._rightNode;
    }

    set rightNode(value: Node) {
        this._rightNode = value;
    }
}

function getNextNode(node: Node): Node {
    return node.nextSibling === null ? node.parentNode.nextSibling : node.nextSibling;
}

function getPreviousNode(node: Node): Node {
    return node.previousSibling === null ? node.parentNode.previousSibling : node.previousSibling;
}