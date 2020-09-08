import { ProcCodeBoxHelper } from './proc-code-box-helper';
import { ProcCodeClassesHelper } from './proc-code-classes-helper';

export class ProcCodeEditionHandler {
    private nativeElem: Element;
    procBoxHelper: ProcCodeBoxHelper;

    /**
     * Constructor.
     * @param natEle Element to control.
     */
    constructor (procCodeBoxHelper: ProcCodeBoxHelper) {
        if (procCodeBoxHelper) {
            this.nativeElem = procCodeBoxHelper.nativeElem;
            this.procBoxHelper = procCodeBoxHelper;
            }
    }

    public deleteStringAtPosition(startPos: number, count: number) {
        if (startPos < 0 || count === 0) {
            return;
        }
        let startEl = ProcCodeBoxHelper.getElementAtTextPosition(this.nativeElem, startPos);
        let endEl = ProcCodeBoxHelper.getElementAtTextPosition(this.nativeElem, startPos + count);
        let lengthStart = ProcCodeBoxHelper.getStringLengthBeforeElement(this.nativeElem, startEl);
        let lengthEnd = ProcCodeBoxHelper.getStringLengthBeforeElement(this.nativeElem, endEl);
        let startOffset = startPos - lengthStart;
        let endOffset = startPos + count - lengthEnd;
        let startStr = startEl.firstChild.nodeValue.substring(0, startOffset);
        let endStr = endEl.firstChild.nodeValue.substring(endOffset);
        if (startEl !== endEl) {
            this.procBoxHelper.deleteContentsBetweenTwoElements(startEl, endEl);
            this.procBoxHelper.updateChildNodeTextValue(startEl, startStr);
            this.procBoxHelper.updateChildNodeTextValue(endEl, endStr);
            if (startStr) {
                this.procBoxHelper.checkToJoinChildren(startEl);
            }
        } else {
            this.procBoxHelper.updateChildNodeTextValue(startEl, startStr + endStr);
        }
    }

    /**
     * Insert a given string in a given position.
     * @param str String to insert.
     * @param pos Position to insert.
     */
    public addStringAtPosition(str: string, pos: number, incCodeOPt:boolean = false) {
        if (!(this.nativeElem)) {
            return;
        }
        str = str.replace(/\r?\n|\r/, '');
            str = str.replace(/[^0-9A-Z\s\,\.\-]/ig, '');
            str = str.toUpperCase();
        if (str.length == 0) {
            return;
        }
        if (this.nativeElem.childElementCount == 0) {
            this.procBoxHelper.updateBoxContent(str);
        } else {
            let curCodeEl = ProcCodeBoxHelper.getElementAtTextPosition(this.nativeElem, pos);
            let lngBefore = ProcCodeBoxHelper.getStringLengthBeforeElement(this.nativeElem, curCodeEl);
            let offset = pos - lngBefore;
            this.procBoxHelper.addToElementContent(curCodeEl, offset, str);
        }
    }
}