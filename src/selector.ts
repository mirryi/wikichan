export function getTextSourceFromPoint(
  x: number,
  y: number,
  leftEx: [number, number],
  rightEx: [number, number],
): TextSource | null {
  const range = caretRangeFromPoint(x, y);
  if (range === null) {
    return null;
  }

  let ts = new TextSource(range);
  const expandFor = (mode: ExpandMode, times: number, right: boolean) => {
    for (let i = 0; i < times; i++) {
      const ex = right ? ts.expandNext(mode) : ts.expandPrev(mode);
      if (ex === null) {
        break;
      }
      ts = ex;
    }
  };

  expandFor(ExpandMode.word, leftEx[0], false);
  expandFor(ExpandMode.character, leftEx[1], false);
  expandFor(ExpandMode.word, rightEx[0], true);
  expandFor(ExpandMode.character, rightEx[1], true);

  return ts;
}

export class TextSource {
  range: Range;

  constructor(range: Range) {
    this.range = range;
  }

  text(): string {
    return this.range.toString();
  }

  /**
   * expandNext returns a new TextSource with the next character or text until a break (space, period, etc.) incorporated.
   */
  expandNext(mode: ExpandMode): TextSource | null {
    return this.expand(mode, true);
  }

  expandPrev(mode: ExpandMode): TextSource | null {
    return this.expand(mode, false);
  }

  private expand(mode: ExpandMode, right: boolean): TextSource | null {
    const range = this.range;

    // Return a new TextSource with same range but ending offset increased by one
    if (mode === ExpandMode.character) {
      let newStartContainer = range.startContainer;
      let newStartOffset = range.startOffset;
      let newEndContainer = range.endContainer;
      let newEndOffset = range.endOffset;

      if (right) {
        if (range.endContainer.textContent === null) {
          return null;
        }
        const maxOffset = range.endContainer.textContent.length - 1;

        if (range.endOffset + 1 > maxOffset) {
          const nextNode = getNextNode(range.endContainer);
          if (nextNode === null) {
            return null;
          }
          newEndContainer = nextNode;
          newEndOffset = 0;
        } else {
          newEndOffset = range.endOffset + 1;
        }
      } else {
        if (range.startContainer.textContent === null) {
          return null;
        }
        const minOffset = 0;

        if (range.startOffset - 1 < minOffset) {
          const prevNode = getPreviousNode(range.startContainer);
          if (prevNode === null) {
            return null;
          }
          newStartContainer = prevNode;

          if (newStartContainer.textContent === null) {
            return null;
          }
          newStartOffset = newStartContainer.textContent.length - 1;
        } else {
          newStartOffset = range.startOffset - 1;
        }
      }

      const expandedRange = newRange(
        newStartContainer,
        newStartOffset,
        newEndContainer,
        newEndOffset,
      );

      return new TextSource(expandedRange);
    } else if (mode === ExpandMode.word) {
      let expandedSource: TextSource = this;

      const exp = expandedSource.expand(ExpandMode.character, right);
      if (exp === null) {
        return expandedSource;
      }
      expandedSource = exp;

      while (true) {
        const expandedRange = expandedSource.range;

        if (right) {
          const endText = expandedRange.endContainer.textContent;
          if (endText === null) {
            return null;
          }

          const lastChar = endText.charAt(expandedRange.endOffset);
          if (matchBreak(lastChar)) {
            break;
          }
        } else {
          const startText = expandedRange.startContainer.textContent;
          if (startText === null) {
            return null;
          }

          const firstChar = startText.charAt(expandedRange.startOffset);
          if (matchBreak(firstChar)) {
            break;
          }
        }

        const exp = expandedSource.expand(ExpandMode.character, right);
        if (exp === null) {
          break;
        }
        expandedSource = exp;
      }

      return expandedSource;
    }

    return null;
  }
}

export enum ExpandMode {
  word,
  character,
}

/**
 * caretRangeFromPoint returns a Range from document.caretRangeFromPoint or
 * document.caretPositionFromPoint, depending on compatibility.
 */
function caretRangeFromPoint(x: number, y: number): Range | null {
  if (typeof document.caretRangeFromPoint === "function") {
    return document.caretRangeFromPoint(x, y);
  } else if (typeof document.caretPositionFromPoint === "function") {
    const position = document.caretPositionFromPoint(x, y);
    if (position == null) {
      return null;
    }

    const node = position.offsetNode;
    if (node === null) {
      return null;
    }

    const range = document.createRange();
    const offset = node.nodeType === Node.TEXT_NODE ? position.offset : 0;
    try {
      range.setStart(node, offset);
      range.setEnd(node, offset);
    } catch (_) {
      return null;
    }
    return range;
  }

  return null;
}

function newRange(
  startContainer: Node,
  startOffset: number,
  endContainer: Node,
  endOffset: number,
): Range {
  const range = new Range();
  range.setStart(startContainer, startOffset);
  range.setEnd(endContainer, endOffset);
  return range;
}

function getNextNode(node: Node): Node | null {
  let sibling = node.nextSibling;
  if (sibling === null) {
    const parentNode = node.parentNode;
    if (!parentNode) {
      return null;
    }
    sibling = parentNode.nextSibling;
  }

  return sibling;
}

function getPreviousNode(node: Node): Node | null {
  let sibling = node.previousSibling;
  if (!sibling) {
    const parentNode = node.parentNode;
    if (!parentNode) {
      return null;
    }
    sibling = parentNode.previousSibling;
  }

  return sibling;
}
function matchBreak(c: string): boolean {
  return c === " " || /(\\n)/.test(JSON.stringify(c));
}
