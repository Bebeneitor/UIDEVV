import { ProcCodeBoxHelper } from './proc-code-box-helper';
/**
 * Caret position handler for Procedure Code Box.
 */
export class ProcCodeCaretHandler {
    /** The procedure codes box. */
    nativeElement: Element;
    /**
     * Constructor.
     * @param elem codes box.
     */
    constructor(elem: Element) {
        this.nativeElement = elem;
    }
    /**
     * Finds current selected range.
     */
    public static getCurrentRange(): Range {
        let curSel: Selection = document.getSelection();
        if (curSel == null) {
            return null;
        }
        if (curSel.rangeCount == 0) {
            return null;
        }
        return curSel.getRangeAt(0);
    }

    public static getFocusProcCodeElement(): Element {
        let sel = document.getSelection();
        if (sel == null) {
            return null;
        }
        let node:Element = sel.focusNode as Element;
        if (node.tagName && node.tagName.toLowerCase() === 'span') {
            return node;
        }
        if (node.parentElement.tagName.toLowerCase() === 'span') {
            return node.parentElement;
        }
        return null;
    }
    /**
     * Set the caret to a given position.
     * @param pos Pos to set.
     */
    public setCaretPosition(pos: number) {
        let sel: Selection = document.getSelection();
        let node = ProcCodeBoxHelper.getElementAtTextPosition(this.nativeElement, pos);
        if (node == null) {
            return;
        }
        let range = document.createRange();
        let prevLength = ProcCodeBoxHelper.getStringLengthBeforeElement(this.nativeElement, 
            node);
        let nodePos = pos - prevLength;
        if (nodePos > node.firstChild.nodeValue.length) {
            nodePos = node.firstChild.nodeValue.length;
        }
        range.setStart(node.firstChild, nodePos);
        range.collapse();
        sel.removeAllRanges();
        sel.addRange(range);
    }
    /**
     * Retrieves caret position relative to codes box text content.
     */
    public getCaretPosition(): number {
        if (!this.nativeElement) {
            return -1;
        }
        let sel: Selection = document.getSelection();
        if (sel.rangeCount == 0) {
            return -1;
        }
        let range: Range = sel.getRangeAt(0);
        let pos = ProcCodeBoxHelper.getStringLengthBeforeElement(this.nativeElement, 
            range.startContainer.parentElement);
        return pos + range.startOffset;
    }
    /**
     * Retrieves start and end selection relative to code box string content.
     */
    public getStartEndSelectionPosition(): any {
        if (!this.nativeElement) {
            return null;
        }
        let sel: Selection = document.getSelection();
        if (sel.rangeCount == 0) {
            return null;
        }
        let range: Range = sel.getRangeAt(0);
        let startPos = ProcCodeBoxHelper.getStringLengthBeforeElement(this.nativeElement, 
            range.startContainer.parentElement);
        let endPos = ProcCodeBoxHelper.getStringLengthBeforeElement(this.nativeElement, 
                range.endContainer.parentElement);
        if (endPos + range.endOffset < startPos + range.startOffset) {
            return {startPos: endPos + range.endOffset, endPos: startPos + range.startOffset};    
        }
        return {startPos: startPos + range.startOffset, endPos: endPos + range.endOffset};        
    }

}