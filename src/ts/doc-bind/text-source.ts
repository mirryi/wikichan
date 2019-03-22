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

        let begin: number = 0;
        let end: number = 0;

        if (matchBreak(this.text[this.offset])) {
            return "";
        }

        // Find the index of the end of the phrase
        let k: number = this.offset;
        for (let i = 0; i <= after; i++) {
            // Find the end of the word
            while (matchBreak(this.text[k]) === false) {
                if (k >= this.text.length - 1) {
                    if (!getNextNode(this.rightNode)) {
                        break;
                    }
                    this.joinAfter();
                    k--;
                }
                k++;
            }
            k++;
        }
        end = k;

        let oldOffset: number = this.offset.valueOf();
        k = this.offset;
        for (let i = 0; i <= before; i++) {
            while (matchBreak(this.text[k]) === false) {
                if (k <= 0) {
                    if (!getPreviousNode(this.leftNode)) {
                        break;
                    }
                    const adjustOffset = (v: number) => v + this.offset - oldOffset;
                    this.joinBefore();
                    k = adjustOffset(k);
                    end = adjustOffset(end);
                    oldOffset = this.offset;
                    k++;
                }
                k--;
            }
            k--;
        }
        k += 2;
        begin = k;

        return this.text.substring(begin, end).trim();
    }

    private joinAfter(): void {
        this.rightNode = getNextNode(this.rightNode);
        this.addAfter(this.rightNode.textContent);
    }

    private joinBefore(): void {
        this.leftNode = getPreviousNode(this.leftNode);
        this.addBefore(this.leftNode.textContent);
    }

    private addAfter(text: string): void {
        this.text += text;
    }

    private addBefore(text: string): void {
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

function splitText(s: string) {
    return s.split(/([\s.,\/#!$%\^&\*;:{}=\-_`~()])/)
        .filter((v, i, arr) => {
            return v.trim().length != 0
        });
}

function matchBreak(c: string): boolean {
    return c === " " || /(\\n)/.test(JSON.stringify(c));
}

function cleanString(s: string): string {
    return s.replace(/([.,\/#!$%\^&\*;:{}=\-_`~()])/, "").trim();
}