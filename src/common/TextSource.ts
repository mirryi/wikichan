export enum ExpandMode {
  word,
  character,
}

export default class TextSource {
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

  static getFromPoint(
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

    const expandFor = (mode: ExpandMode, times: number, right: boolean): void => {
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
        newEndOffset = range.endOffset + 1;

        if (newEndOffset > maxOffset) {
          const nextNode = getNextNode(range.endContainer);
          if (nextNode === null) {
            return null;
          }
          newEndContainer = nextNode;
          newEndOffset = 0;
        }
      } else {
        if (range.startContainer.textContent === null) {
          return null;
        }
        const minOffset = 0;
        newStartOffset = range.startOffset - 1;

        if (newStartOffset < minOffset) {
          const prevNode = getPreviousNode(range.startContainer);
          if (prevNode === null) {
            return null;
          }
          newStartContainer = prevNode;

          if (newStartContainer.textContent === null) {
            return null;
          }
          newStartOffset = newStartContainer.textContent.length - 1;
        }
      }

      const expandedRange = newRange(
        newStartContainer,
        newStartOffset,
        newEndContainer,
        newEndOffset,
      );
      if (expandedRange === null) {
        return null;
      }

      return new TextSource(expandedRange);
    } else if (mode === ExpandMode.word) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let expandedSource: TextSource = this;

      const nextChar = right
        ? expandedSource.nextRightChar()
        : expandedSource.nextLeftChar();
      if (!nextChar || matchBreak(nextChar)) {
        return expandedSource;
      }

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const exp = expandedSource.expand(ExpandMode.character, right);
        if (exp === null) {
          break;
        }
        expandedSource = exp;

        const nextChar = right
          ? expandedSource.nextRightChar()
          : expandedSource.nextLeftChar();
        if (!nextChar || matchBreak(nextChar)) {
          const exp = expandedSource.expand(ExpandMode.character, right);
          if (exp) {
            expandedSource = exp;
          }
          break;
        }
      }

      return expandedSource;
    }

    return null;
  }

  nextRightChar(): string | null {
    const endText = this.range.endContainer.textContent;
    if (!endText) {
      return null;
    }

    const expandedSource = this.expandNext(ExpandMode.character);
    if (!expandedSource) {
      return null;
    }

    const expandedRange = expandedSource.range;
    if (!expandedRange.endContainer.textContent) {
      return null;
    }

    return expandedRange.endContainer.textContent.charAt(expandedRange.endOffset - 1);
  }

  nextLeftChar(): string | null {
    const startText = this.range.startContainer.textContent;
    if (!startText) {
      return null;
    }

    const expandedSource = this.expandPrev(ExpandMode.character);
    if (!expandedSource) {
      return null;
    }

    const expandedRange = expandedSource.range;
    if (!expandedRange.startContainer.textContent) {
      return null;
    }

    return expandedRange.startContainer.textContent.charAt(expandedRange.startOffset);
  }
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
    const offset = node.nodeType === Node.TEXT_NODE ? position.offset : 0;

    return newRange(node, offset, node, offset);
  }

  return null;
}

function newRange(
  startContainer: Node,
  startOffset: number,
  endContainer: Node,
  endOffset: number,
): Range | null {
  const range = new Range();
  try {
    range.setStart(startContainer, startOffset);
    range.setEnd(endContainer, endOffset);
  } catch (e) {
    return null;
  }
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
  return /[\s\p{Punctuation}]/u.test(c);
}
