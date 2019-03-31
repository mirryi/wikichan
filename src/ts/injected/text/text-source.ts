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

        if (isChar(this.text.charAt(this.offset))) {
            begin = this.offset - before;
            end = this.offset + after + 1;

        } else {
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
        }

        let segment = this.text.substring(begin, end).trim();
        segment = clean(segment);
        return segment;
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

function matchBreak(c: string): boolean {
    return c === " " || /(\\n)/.test(JSON.stringify(c));
}

function clean(s: string): string {
    return s.replace(/([.,\'\"\/#!$%\^&\*;:{}=\-_`~()]、。)/, "").trim();
}

function isChar(s: string): boolean {
    const code: number = s.charCodeAt(0);
    return (code >= 12288 && code <= 12543) ||
        (code >= 65280 && code <= 65519) ||
        (code >= 19968 && code <= 40879) ||
        (code >= 13312 && code <= 19903);

}