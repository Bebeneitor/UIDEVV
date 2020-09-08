import { ProcedureCodeValidationDto } from 'src/app/shared/models/dto/proc-code-validation-dto';
import { DiffArrayUtils } from './diff-array-utils';
import { ProcCodesUtils } from './proc-codes-utils';
import { ProcCodeClassesHelper } from './proc-code-classes-helper';
import { Constants } from 'src/app/shared/models/constants';


/**
 * Helper class for ProcedureCodeBox component.
 */
export class ProcCodeBoxHelper {
    public static INVALID_CODE_TOOLTIP = 'Invalid code';
    public static BAD_FORMAT_TOOLTIP = 'Bad format';
    /**Valid - invalid status.*/
    public static VALID_CODE_STR = 'Valid';
    public static INVALID_CODE_STR = 'Invalid';


    /** the element to control. */
    public nativeElem: Element;
    /** the original codesString */
    public origCodesString: string;
    /** Procedure codes Validation result */
    public procCodesValResult: ProcedureCodeValidationDto[] = [];
    /** flag to indicate should compare to original */
    public compareToOriginal:boolean = false;

    public procCodeType: string = 'ALL';

    /**
     * Constructor.
     * @param nativEl Native element to help.
     */
    constructor(nativEl: Element) {
        this.nativeElem = nativEl;
    }
    /**
     * Get updated text from codes box.
     */
    public get updatedText(): string {
        if (!this.nativeElem) {
            return '';
        }
        return this.calculateUpdatedText();
    }

    /**
     * Clears codes box content.
     */
    public clearBoxContent() {
        if (this.nativeElem) {
            if (this.nativeElem.childNodes.length) {
                while(this.nativeElem.lastChild) {
                    this.nativeElem.removeChild(this.nativeElem.lastChild);
                }
            }
            this.nativeElem.appendChild(this.createSpanElemForCodeItem(''));
        }
    }
    /**
     * Create a Span element with given parameters.
     * @param text element text.
     * @param className element class name.
     * @param title element title (tooltip)
     */
    private createSpanElement(text: string, className?: string, title?:string): Element {
        let spanElem = document.createElement('span');
        if (className) {
            spanElem.className = className;
        }
        if (title) {
            spanElem.title = title;
        }
        let txtElem = document.createTextNode(text);
        spanElem.appendChild(txtElem);
        return spanElem;
    }
    /**
     * Determines class name to a new span element according to validation status.
     * @param procCodeVal Procedure code validation dto.
     */
    public static getCodeSpanClass(procCodeVal: ProcedureCodeValidationDto):string {
        if (!procCodeVal) {
            return '';
        }
        switch (procCodeVal.codeStatus) {
            case this.VALID_CODE_STR:
                return ProcCodeClassesHelper.VALID_CODE_CLASS;
            case this.INVALID_CODE_STR:  
                return ProcCodeClassesHelper.INVALID_CODE_CLASS;
            default:
                return '';
        }
    }
    /**
     * Create the span element to represent a code itemp.
     * @param codeItem String representing the procedure code item.
     * @param codesVal List of code's validation result.
     */
    private createSpanElemForCodeItem(codeItem: string, 
        codesVal?: ProcedureCodeValidationDto[]): Element {
        let codeValDto = null;
        if (!DiffArrayUtils.isArrayEmpty(codesVal) && codeItem !== ProcCodesUtils.CODE_LIST_SEP 
            && codeItem !== ProcCodesUtils.CODE_RANGE_SEP) {
            codeValDto = codesVal.find(pcVal => pcVal.codeName === codeItem);
        }
        let title = null;
        if (codeValDto) {
            title = codeValDto.desc || ProcCodeBoxHelper.INVALID_CODE_TOOLTIP;
        }
        let spanClass = '';
        if (ProcCodesUtils.isCodeSeparator(codeItem)) {
            spanClass = this.compareToOriginal? ProcCodeClassesHelper.ADDED_SEP_CLASS : 
            ProcCodeClassesHelper.CODE_SEP_CLASS;
        } else {
            if (!ProcCodesUtils.isProcCodeTypeFormat(codeItem, this.procCodeType)) {
                // this is an invalid format item.
                spanClass = this.compareToOriginal ? ProcCodeClassesHelper.ADDED_BAD_CODE_CLASS : 
                ProcCodeClassesHelper.BAD_FORMAT_CODE_CLASS;
                title = ProcCodeBoxHelper.BAD_FORMAT_TOOLTIP;
            } else {
                spanClass = this.compareToOriginal ? ProcCodeClassesHelper.ADDED_CODE_CLASS : 
                ProcCodeClassesHelper.ITEM_CODE_CLASS;
            }
            if (codesVal) {
                spanClass = ProcCodeBoxHelper.getCodeSpanClass(codeValDto);
            }
        }
        return this.createSpanElement(codeItem, spanClass, title);
    }

    /**
     * Determine class name for new added child.
     * @param codeItOp Operation on code items.
     * @param codeValue Text code value.
     */
    private getClassNameForItemOperation(codeItOp: any, codeValue:string) {
        if (codeItOp.inserted) {
            if (ProcCodesUtils.isCodeSeparator(codeValue)) {
                return ProcCodeClassesHelper.ADDED_SEP_CLASS;
            }
            if (ProcCodesUtils.isProcCodeTypeFormat(codeValue, this.procCodeType)) {
                return ProcCodeClassesHelper.ADDED_CODE_CLASS;
            }
            return ProcCodeClassesHelper.ADDED_BAD_CODE_CLASS;
        }
        if (codeItOp.deleted) {
            if (ProcCodesUtils.isCodeSeparator(codeValue)) {
                return ProcCodeClassesHelper.DELETED_SEP_CLASS;
            }
            return ProcCodeClassesHelper.DELETED_CODE_CLASS;
        }
        if (codeItOp.retained) {
            if (ProcCodesUtils.isCodeSeparator(codeValue)) {
                return ProcCodeClassesHelper.RETAINED_SEP_CLASS;
            }
            if (ProcCodesUtils.isProcCodeTypeFormat(codeValue, this.procCodeType)) {
                return ProcCodeClassesHelper.RETAINED_CODE_CLASS;
            }
            return ProcCodeClassesHelper.RETAINED_BAD_CODE_CLASS;
        }
    }
    /**
     * Create span elements to represent code items according to operation.
     * @param codeItOp Operation (insert, retained, deleted) on Procedure codes.
     * @param codeValResult code's validation result.
     */
    private createSpanElemForOperation(codeItOp: any, codeValResult: ProcedureCodeValidationDto[]): Element[] {
        let result: Element[] = [];
        let values:string[] = [];
        if (codeItOp.inserted) {
            values = codeItOp.inserted;
        } else if (codeItOp.deleted) {
            values = codeItOp.deleted;
        } else if (codeItOp.retained) {
            values = codeItOp.retained;
        }
        values.forEach( pc => {
            result.push(this.createSpanElement(pc, this.getClassNameForItemOperation(codeItOp, pc)));
        })
        return result;
    }
    /**
     * Appends an element.
     * @param codeItem String representing codeItem.
     */
    public appendChildForCodeItem(codeItem: string) {
        if (this.nativeElem === null) {
            return;
        }
        this.nativeElem.appendChild(this.createSpanElemForCodeItem(codeItem));
    }

    /**
     * Updates procedure code box content, adding spans to represent codes items.
     * @param codesString string representing codes.
     * @param origCodesString original codes.
     * @param procCodesValResult Code's validation result.
     */
    public updateBoxContent(codesString: string, origCodesString?: string, 
        procCodesValResult?: ProcedureCodeValidationDto[]) {
        if (!this.nativeElem || (!codesString && !origCodesString)) {
            return;
        }
        this.clearBoxContent();
        this.origCodesString = origCodesString;
        this.procCodesValResult = procCodesValResult;
        this.addToElementContent(this.nativeElem.firstElementChild, 0, codesString, this.compareToOriginal);
    }

    /**
     * Updates procedure code box content, adding spans to represent codes items.
     * @param codesString string representing codes.
     * @param origCodesString original codes.
     * @param procCodesValResult Code's validation result.
     */
    public updateValidationStatus(procCodesValResult?: ProcedureCodeValidationDto[]) {
        if (!this.nativeElem) {
            return;
        }
        for (let i = 0; i < this.nativeElem.childElementCount; i++) {
            let elem: any = this.nativeElem.children[i];
            if (!ProcCodesUtils.isCodeSeparator(elem.firstChild.nodeValue)) {
                let valid = false;
                let vlRes = procCodesValResult.find( cv => cv.codeName === elem.firstChild.nodeValue);
                if (vlRes) {
                    valid = Constants.CODE_VALID_STATUS === vlRes.codeStatus; 
                } else {
                    valid = true;
                    vlRes = {codeName: elem.firstChild.nodeValue, 'codeDescription': 'No description'}
                }
                elem.className = ProcCodeClassesHelper.getProcValidationClass(elem, valid);
                if (valid) {
                    elem.title = vlRes.codeDescription;; 
                } else {
                    elem.title = ProcCodeBoxHelper.INVALID_CODE_TOOLTIP;
                }
            }
        }
    }


    /**
     * Updates procedure code in given children element, adding spans to represent codes items.
     * @param spanEl element to add new codes.
     * @param offsetPos Offset position (relative to spanEl)
     * @param codesString string representing codes.
     */
    public addToElementContent(spanEl: Element, offsetPos: number, codesString: string, initial:boolean = false) {
        if (!this.nativeElem || !spanEl || spanEl.parentElement !== this.nativeElem ||
            !ProcCodeBoxHelper.isElementSpan(spanEl)) {
            return;
        }
        if (!codesString) {
            return;
        }
        let nodeValue = spanEl.firstChild.nodeValue;
        if (offsetPos > 0 && offsetPos < nodeValue.length 
            && (ProcCodeClassesHelper.isItemDeleted(spanEl) ||
                ProcCodeClassesHelper.isItemRetained(spanEl))) {
            // do not modify deleted or retained items.
            return;
        }
        let startString = nodeValue.substring(0, offsetPos);
        let restString = nodeValue.substring(offsetPos);
        let allItems = [];
        if (ProcCodesUtils.isCodeSeparator(codesString)) {
            allItems.push(codesString)    
        } else {
            allItems = ProcCodesUtils.extractCodesAndSeparator(codesString);
        }
        if (DiffArrayUtils.isArrayEmpty(allItems)) {
            return;
        }
        if (!initial) {
            let beforeNode:Element = spanEl.nextElementSibling;
            if (startString) {
                spanEl = this.updateChildNodeTextValue(spanEl, startString);
            } else {
                beforeNode = spanEl;
            }
            if (restString && startString && !ProcCodeClassesHelper.isItemDeleted(spanEl)) {
                beforeNode = this.nativeElem.insertBefore(this
                    .createSpanElemForCodeItem(restString, this.procCodesValResult), beforeNode);
            }
            allItems.forEach(pcIt => {
            this.nativeElem.insertBefore(this
                .createSpanElemForCodeItem(pcIt, this.procCodesValResult), beforeNode);
            })
            this.checkToJoinChildren(spanEl);
            this.updateValidationClass(spanEl);
           this.joinCompatibleChildren();
           this.joinOppositeChildren();
        } else {
             let allOrigItems = ProcCodesUtils.extractCodesAndSeparator(this.origCodesString);
             let procOps = DiffArrayUtils.diff(allOrigItems, allItems);
             procOps.forEach(pcOp => {
                let spans = this.createSpanElemForOperation(pcOp, this.procCodesValResult);
                spans.forEach(s => this.nativeElem.appendChild(s));
             })
         }
         if (!spanEl.firstChild.nodeValue) {
            this.removeChildElement(spanEl);
        }
    }

    private static areCompatibleCodesClass(class1: string, class2: string): boolean {
        if (!class1 && !class2) {
            return true;
        }
        if (class1 === ProcCodeClassesHelper.DELETED_CODE_CLASS && 
            class2 == ProcCodeClassesHelper.DELETED_CODE_CLASS) {
            return true;
        }
        if (class1.indexOf('retained') >= 0) {
            return (class2.indexOf('retained') >= 0);
        }
        if (class1.indexOf('inserted') >= 0) {
            return (class2.indexOf( 'deleted') < 0);
        }
        if (class1.indexOf('deleted') >= 0) {
            return (class2.indexOf( 'inserted') < 0);
        }
        return true;
    }

    private areSameItemType(el1: Element, el2: Element) {
        if (!el1 || !el2) {
            return false;
        }
        let str1 = el1.textContent;
        let str2 = el2.textContent;
        if (ProcCodesUtils.isCodeSeparator(str1) && ProcCodesUtils.isCodeSeparator(str2)) {
            return el1.className === el2.className;
        }
        if (!ProcCodesUtils.isCodeSeparator(str1) && !ProcCodesUtils.isCodeSeparator(str2)) {
            return ProcCodeBoxHelper.areCompatibleCodesClass(el1.className, el2.className);
        }
        return false;
    }

    private areOpposite(el1: Element, el2: Element):boolean {
        if ((ProcCodeClassesHelper.isItemAdded(el1) && ProcCodeClassesHelper.isItemDeleted(el2)) ||
        (ProcCodeClassesHelper.isItemDeleted(el1) && ProcCodeClassesHelper.isItemAdded(el2))) {
            let str1 = el1.textContent;
            let str2 = el2.textContent;
            return str1.trim() === str2.trim();
        }
        return false;
    }
    /**
     * Chack and joins an element child with its next sibling (joins if that element and its
     *  sibling are not codes separator)
     * @param elToCheck Element to check.
     */
    public checkToJoinChildren(elToCheck: Element) {
        if (!this.isSpanChild(elToCheck)) {
            return;
        }
        if (elToCheck && elToCheck.nextElementSibling) {
            if (this.areSameItemType(elToCheck, elToCheck.nextElementSibling)) {
                this.updateChildNodeTextValue(elToCheck, elToCheck.firstChild.nodeValue +
                    elToCheck.nextElementSibling.textContent);
                this.removeChildElement(elToCheck.nextElementSibling);
            } else if (this.areOpposite(elToCheck, elToCheck.nextElementSibling)) {
                if (ProcCodeClassesHelper.isElementCode(elToCheck)) {
                    elToCheck.className = ProcCodeClassesHelper.RETAINED_CODE_CLASS;
                } else {
                    elToCheck.className = ProcCodeClassesHelper.RETAINED_SEP_CLASS;
                }
                this.removeChildElement(elToCheck.nextElementSibling);
            }
        }
    }

    private findNextInserted(el: Element): Element {
        while(el) {
            if (ProcCodeClassesHelper.isItemAdded(el)) {
                return el;
            }
            el = el.nextElementSibling;
        }
        return null;
    }
    private findNextDeleted(el: Element): Element {
        while(el) {
            if (ProcCodeClassesHelper.isItemDeleted(el)) {
                return el;
            }
            el = el.nextElementSibling;
        }
        return null;
    }
    /**
     * Iterate over all children to find and join opposite operations:
     *   inserted node cancelling a deleted node.
     */
    private joinOppositeChildren() {
        let childEl: Element = this.nativeElem.firstElementChild;
        while (childEl) {
            if (ProcCodeClassesHelper.isItemDeleted(childEl)) {
                let nextInserted = this.findNextInserted(childEl.nextElementSibling);
                if (nextInserted && this.areOpposite(childEl, nextInserted)) {
                    childEl.className = childEl.className === ProcCodeClassesHelper.DELETED_CODE_CLASS ?
                    ProcCodeClassesHelper.RETAINED_CODE_CLASS :
                    ProcCodeClassesHelper.RETAINED_SEP_CLASS;
                    this.removeChildElement(nextInserted);
                }
            }
            if (ProcCodeClassesHelper.isItemAdded(childEl)) {
                let nextDeleted = this.findNextDeleted(childEl.nextElementSibling);
                if (nextDeleted && this.areOpposite(childEl, nextDeleted)) {
                    if (ProcCodesUtils.isCodeSeparator(childEl.textContent)) {
                        childEl.className = ProcCodeClassesHelper.RETAINED_SEP_CLASS;
                    } else {
                        childEl.className = ProcCodeClassesHelper.RETAINED_CODE_CLASS;
                    }
                    this.removeChildElement(nextDeleted);
                }
            }
            childEl = childEl.nextElementSibling;
        }
    }

    private joinCompatibleChildren() {
        let childEl: Element = this.nativeElem.firstElementChild;
        while (childEl) {
            if (this.areSameItemType(childEl, childEl.nextElementSibling)) {
                this.updateChildNodeTextValue(childEl, childEl.firstChild.nodeValue + 
                        childEl.nextElementSibling.firstChild.nodeValue);
                this.removeChildElement(childEl.nextElementSibling);
            }
            childEl = childEl.nextElementSibling;
        }
    }

    /**
     * Updates procedure code box content, adding spans to represent codes items.
     * @param codesString string representing codes.
     * @param origCodesString original codes.
     * @param procCodes Code's validation result.
     */
    public updateBoxContentAndFormat(codesString: string, origCodesString?: string, 
        procCodes?: ProcedureCodeValidationDto[]) {
        this.updateBoxContent(codesString, origCodesString, procCodes);
        this.formatBoxContent();
    }


    /**
     * Calculate updates text. Iterate over span childs omitting spans that
     * represent deleted items.
     */
    public calculateUpdatedText():string {
        if (!this.nativeElem || this.nativeElem.children.length == 0) {
            return '';
        }
        let result: string = '';
        let curEl = this.nativeElem.firstElementChild;
        let prevSepEl = null;
        let prevEl = null;
        while (curEl) {
            // keep next sibling. curEl might be removed.
            let tmpEl = curEl.nextElementSibling;
            if (!ProcCodeClassesHelper.isItemDeleted(curEl)) {
                if (ProcCodeClassesHelper.isElementSep(curEl)) {
                    this.checkSepValue(curEl, prevSepEl, prevEl);
                    if (curEl.parentElement === this.nativeElem) {
                        prevSepEl = curEl;
                    }
                }
                result += curEl.textContent;
                prevEl = curEl;
            }
            curEl = tmpEl;
        }
        return result;
    }

    private getNextNotDeletedElement(el: Element): Element {
        if (!el) {
            return null;
        }
        el = el.nextElementSibling;
        while (ProcCodeClassesHelper.isItemDeleted(el)) {
            el = el.nextElementSibling;
        }
        return el;
    }

    private getPrevNotDeletedElement(el: Element): Element {
        if (!el) {
            return null;
        }
        el = el.previousElementSibling;
        while (ProcCodeClassesHelper.isItemDeleted(el)) {
            el = el.previousElementSibling;
        }
        return el;
    }
    /**
     * Check one sep element between two codes is not a blank string.
     * If this is the case, replace separator by a comma.
     * @param el separator element.
     */
    private checkSepValue(el: Element, prevSepEl: Element, prevEl: Element) {
        if (!el.firstChild.nodeValue.trim()) {
            if (ProcCodeClassesHelper.isElementCode(this.getNextNotDeletedElement(el))) {
                if (!el.firstChild.nodeValue) {
                    el.firstChild.nodeValue = ',';
                } else {
                    el.firstChild.nodeValue = ',' + el.firstChild.nodeValue.substring(1);
                }
            }
        }
        if (ProcCodeClassesHelper.isElementCode(prevEl)) {
            el.firstChild.nodeValue = ProcCodesUtils.correctSeparatorFormat(
                el.firstChild.nodeValue, prevSepEl ? prevSepEl.firstChild.nodeValue:'');
        } else {
            this.deleteChildContent(el);
        }
    }
    /**
     * Simple codes formatting.
     */
    public formatBoxContent() {
        if (this.nativeElem) {
            let spans = this.nativeElem.children;
            for (let i = 0; i < spans.length; i++) {
                if (ProcCodeBoxHelper.isElementSpan(spans[i])) {
                    if (spans[i].firstChild.nodeValue === ProcCodesUtils.CODE_LIST_SEP) {
                        spans[i].firstChild.nodeValue = ProcCodesUtils.CODE_LIST_SEP + ' ';
                    } else if (spans[i].firstChild.nodeValue === ProcCodesUtils.CODE_RANGE_SEP) {
                        spans[i].firstChild.nodeValue = ' ' + ProcCodesUtils.CODE_RANGE_SEP + ' ';
                    }
                }
            } 
        }
    }
    /**
     * Calculate string length before a given span children.
     * @param container Contailer.
     * @param span Span Element.
     */
    public static getStringLengthBeforeElement(container: Element, span: Element): number {
        if (!container && !span) {
            return -1;
        }
        if (span && !this.isElementSpan(span)) {
            span = span.parentElement;
        }
        if (!this.isElementSpan(span)) {
            return 0;
        }
        let res: number = 0;
        for (let i = 0; i < container.childElementCount; i++) {
            if (container.children[i] === span) {
                break;
            }
            res += container.children[i].textContent.length;
        }
        return res;
    }
    /**
     * Get the node (text node) containing the indicated text position.
     * @param container Container node.
     * @param textPos Text position.
     */
    public static getElementAtTextPosition(container: Element, textPos: number): Element {
        if (container == null) {
            return null;
        }
        let res: Element = container.firstElementChild;
        let strLen = 0;
        for (let i = 0; strLen <= textPos && i < container.childElementCount; i++) {
            res = container.children[i];
            strLen += res.textContent.length;
        }
        return (res ? res : null);
    }
    /**
     * Removes a children element fro nativeElem.
     * @param element Children to delete.
     */
    public removeChildElement(element: Element) {
        ProcCodeBoxHelper.removeNodeFromParent(this.nativeElem, element);
    }
    /**
     * Removes all children elements between two nativElem children.
     * @param initElem Initial element (not removed)
     * @param endElem End Element (not removed)
     */
    public removeChildBetweenTwoElements(initElem: Element, endElem: Element) {
        if (!initElem && !endElem) {
            return;
        }
        if (initElem.parentElement !== this.nativeElem || 
            endElem.parentElement !== this.nativeElem) {
            return;
        }
        let tmpElem = endElem.previousElementSibling;
        while(tmpElem && tmpElem !== initElem) {
            let tmpElem2 = tmpElem.previousElementSibling;
            this.removeChildElement(tmpElem);
            tmpElem = tmpElem2;
        }
    }

    /**
     * Tests if a given element is a span element.
     * @param element element to test.
     */
    public static isElementSpan(element: Element): boolean {
        return (element && element.tagName && element.tagName.toLowerCase() ==='span');
    }
    /**
     * Remove child node from parent.
     * @param container container.
     * @param childToDel child to delete.
     */
    public static removeNodeFromParent(container: Element, childToDel: Node) {
        if (!container && !childToDel) {
            return;
        }
        while (childToDel && childToDel.parentElement !== container) {
            childToDel = childToDel.parentElement;
        }
        if (childToDel) {
            container.removeChild(childToDel);
        }
    }
    /**
     * Checks if an element is a natileElement's children span element
     * @param element element to test.
     */
    private isSpanChild(element: Element) {
        return (this.nativeElem && element && element.parentElement === this.nativeElem &&
            ProcCodeBoxHelper.isElementSpan(element));
    }

    /**
     * Delete content of  a span child. If child is a retained code, marks it as deleted
     *  otherwise,  childEl is removed from nativeElement.
     * @param childEl span child.
     */
    public deleteChildContent(childEl: Element) {
        if (!this.isSpanChild(childEl)) {
            return;
        }
        if (ProcCodeClassesHelper.isElementCodeDeleted(childEl)) {
            // Deleted element, switch to retained.
            childEl.className = ProcCodeClassesHelper.RETAINED_CODE_CLASS;
            return;
        }
        if (ProcCodeClassesHelper.isElementDeletedSep(childEl)) {
            // Deleted Sep, switch to retained.
            childEl.className = ProcCodeClassesHelper.RETAINED_SEP_CLASS;
            return;
        } 
        // Retained - switch to deeleted.
        if (ProcCodeClassesHelper.isElementRetained(childEl)) {
            childEl.className = ProcCodeClassesHelper.DELETED_CODE_CLASS;
        } else if (ProcCodeClassesHelper.isElementRetainedSep(childEl)) {
            childEl.className = ProcCodeClassesHelper.DELETED_SEP_CLASS;
        } else {
            this.nativeElem.removeChild(childEl);
            if (!this.nativeElem.childElementCount) {
                this.nativeElem.appendChild(this.createSpanElemForCodeItem(''));
            }
        }
    }

    /**
     * Deletes all children contents between two nativElem children.
     *  initialElem and endElem are excluded.
     * @param initElem Initial element
     * @param endElem End Element
     */
    public deleteContentsBetweenTwoElements(initElem: Element, endElem: Element) {
        if (!initElem && !endElem) {
            return;
        }
        if (initElem.parentElement !== this.nativeElem || 
            endElem.parentElement !== this.nativeElem) {
            return;
        }
        let tmpElem = endElem.previousElementSibling;
        while(tmpElem && tmpElem !== initElem) {
            let tmpElem2 = tmpElem.previousElementSibling;
            this.deleteChildContent(tmpElem);
            tmpElem = tmpElem2;
        }
    }

    /**
     * Update the validation class of a given code element.
     * @param element element to validate.
     */
    private updateValidationClass(element: Element) {
        if (!element) {
            return;
        }
        let el: Element = element;
        if (!ProcCodeBoxHelper.isElementSpan(el)) {
            el = element.parentElement;
        }
        let className = el.className;
        if (ProcCodeClassesHelper.isItemDeleted(el)) {
            // delted items are not updated.
            return;
        }
        if (ProcCodeClassesHelper.isItemRetained(element)) {
            return;
        }
        if (ProcCodesUtils.isCodeSeparator(element.textContent)) {
            className = this.compareToOriginal ? ProcCodeClassesHelper.ADDED_SEP_CLASS :
            ProcCodeClassesHelper.CODE_SEP_CLASS;
        } else {
            className = ProcCodeClassesHelper.getProcFormatClass(element, 
                ProcCodesUtils.isProcCodeTypeFormat(element.textContent, this.procCodeType));
        }
        el.className = className;
    }

    private changeToDeletedClass(spanEl:Element) {
        if (!spanEl) {
            return;
        }
        let txtValue = spanEl.firstChild.nodeValue;
        if (ProcCodesUtils.isCodeSeparator(txtValue)) {
            spanEl.className = ProcCodeClassesHelper.DELETED_SEP_CLASS;
        } else {
            spanEl.className = ProcCodeClassesHelper.DELETED_CODE_CLASS;
        }
    }

    private changeToAddedClass(spanEl:Element) {
        if (!spanEl) {
            return;
        }
        let txtValue = spanEl.firstChild.nodeValue;
        if (ProcCodesUtils.isCodeSeparator(txtValue)) {
            spanEl.className = ProcCodeClassesHelper.ADDED_SEP_CLASS;
        } else if (ProcCodesUtils.isProcCodeTypeFormat(txtValue, this.procCodeType)) {
            spanEl.className = ProcCodeClassesHelper.ADDED_CODE_CLASS
        } else {
            spanEl.className = ProcCodeClassesHelper.ADDED_BAD_CODE_CLASS;
        }
    }

    public updateChildNodeTextValue(spanChild: Element, newValue: string): Element {
        if (!this.isSpanChild(spanChild)) {
            return null;
        }
        if (!newValue) {
            let retVal = spanChild.nextElementSibling || spanChild;
            this.deleteChildContent(spanChild);
            return retVal;
        } else {
            if (spanChild.firstChild.nodeValue === newValue) {
                return spanChild;
            }
            if (ProcCodeClassesHelper.isItemRetained(spanChild) ||
            ProcCodeClassesHelper.isItemDeleted(spanChild)) {
                // don't edit retained or deleted items
                return spanChild;
            } else {
                spanChild.firstChild.nodeValue = newValue;
                this.updateValidationClass(spanChild);
                return spanChild; 
            }
        }
    }

    /**
     * Remove all invalid codes.
     */
    public removeAllInvalidCodes() {
        if (!this.nativeElem) {
            return;
        }
        let spanEl: Element = this.nativeElem.lastElementChild;
        while (spanEl) {
            let tmpEl = spanEl.previousElementSibling;
            if (ProcCodeClassesHelper.isElementInvalidCode(spanEl)) {
                this.deleteChildContent(spanEl);
                tmpEl = this.removePrevSeparator(tmpEl);
            }
            spanEl = tmpEl;
        }
    }

    private removePrevSeparator(el: Element) {
        while (el && ProcCodesUtils.isCodeSeparator(el.textContent)) {
            let auxEl = this.getPrevNotDeletedElement(el);
            this.deleteChildContent(el);
            el = auxEl;
        }
        return el;
    }
    /**
     * gat an array of all bad format codes.
     */
    getAllBadFormatCodes(): string[] {
        let ret = [];
        if (this.nativeElem) {
            let el = this.nativeElem.firstElementChild;
            while (el) {
                if (ProcCodeClassesHelper.isElementBadCode(el)) {
                    ret.push(el.firstChild.nodeValue);
                }
                el = el.nextElementSibling;
            }
        }
        return ret;
    }
}