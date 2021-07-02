import { Component, forwardRef, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as Quill from 'quill';
import * as Delta from 'quill-delta';
import { Constants } from 'src/app/shared/models/constants';
import { ToastMessageService } from 'src/app/services/toast-message.service';

/**Used to integrate component into template-driven forms.  */
export const EDITOR_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DifMarkupsEditorComponent),
  multi: true
};
const INSERT_COLOR = "blue";
const HEX_BLUE_COLOR = "#0000ff";
const DELETE_COLOR = "red";
const INSERT_ATTR = { "color": INSERT_COLOR, "strike": null };
const DELETE_ATTR = { "color": DELETE_COLOR, "strike": true };
const DEFAULT_ATTR = { "color": "black", "strike": null };

/**
 *  Code to integrate with spell check. Spell check tags spell blot as FONT,
 * so we need to register this as a new Blot.
*/
declare let $: any;

const Inline: any = Quill.import('blots/inline');

class CustomColor extends Inline {
  constructor(domNode, value) {
    super(domNode, value);

    // Map <font> properties
    domNode.style.color = domNode.color;

    const span = this.replaceWith(new Inline(Inline.create()));

    span.children.forEach(child => {
      if (child.attributes) child.attributes.copy(span);
      if (child.unwrap) child.unwrap();
    });

    this.remove();

    return span;
  }
}

CustomColor.blotName = "customColor";
CustomColor.tagName = "FONT";

Quill.register(CustomColor, true);

/** Component */
@Component({
  selector: 'app-dif-markups-editor',
  templateUrl: './dif-markups-editor.component.html',
  styleUrls: ['./dif-markups-editor.component.css'],
  providers: [EDITOR_VALUE_ACCESSOR]
})
/**
 * MarkUps Editor. Based on Quill Rich-Text Editor.
 * Marks new text in blue color. Deleted text strike red color.

 */
export class DifMarkupsEditorComponent implements OnInit {
  @Output() onTextChange: EventEmitter<any> = new EventEmitter();
  currentText: string = '';
  @Input() set text(val) {
    if (val === null || val === undefined) {
      return;
    }
    if (!val) {
      val = '';
    }
    this.currentText = val;
    this.updateView();
  }

  get text(): string {
    return this.currentText;
  }

  @Input() height = '100px';
  @Input() minHeight = '100%';
  @Input() maxLength = 0;
  @Input() set provDialogDisable(value: boolean) {
    this.enabled = !value;
    this.enableQuillEditor();
  }
  modifiedDelta: string;
  _saveAsDelta: boolean = true;
  @Input() set saveAsDelta(val: boolean) {
    if (val !== null && val !== undefined) {
      this._saveAsDelta = val;
      this.updateView();
    }
  }


  /** The original text. Next updates are compared against this value. */
  @Input() set originalText(val: string) {
    if (val === null || val === undefined) {
      return;
    }
    this.textToCompare = val;
    this.updateView();
  }
  textToCompare: string = '';
  @Input() scrollContainer: string;
  get updatedText(): string {
    return this.getTextFromDelta(this.quill.getContents());
  }
  @ViewChild('markuped',{static: true}) markupEd;
  @ViewChild('qlcontainer',{static: true}) qlContainer;
  /** the Quill Text Editor */
  quill: any;

  onModelChange: Function = () => { };
  onModelTouched: Function = () => { };
  enabled: boolean = true;
  notify: boolean = false;


  constructor(private toastService: ToastMessageService) { }

  ngOnInit() {
    this.quill = new Quill(this.markupEd.nativeElement, {
      scrollingContainer: this.qlContainer.nativeElement
    });

    this.quill.on('text-change', (delta, oldContents, source) => {
      if (source === 'user') {
        this.quillOnTextChange(delta, oldContents);
      }
      // Update text value.
      this.modifiedDelta = JSON.stringify(
        this.calculateModifedDelta(this.quill.getContents()));
      if (this.notify) {
        // Notify changes in model.
        if (this._saveAsDelta) {
          this.onModelChange(this.modifiedDelta);
        } else {
          this.onModelChange(this.updatedText);
        }
        this.onModelTouched();
      }
      this.notify = true;
    });
    if (this.currentText == null) {
      this.currentText = '';
    }
    this.writeValue(this.currentText);
    if (this.provDialogDisable) {
      this.enabled = !this.provDialogDisable;
    }
    this.enableQuillEditor();
    this.notify = true;
  }

  private enableQuillEditor() {
    if (this.quill) {
      this.quill.enable(this.enabled);
    }
  }

  updateView() {
    if (!this.currentText || !this.textToCompare) {
      return;
    }
    if (!this.quill) {
      return;
    }
    this.notify = false;
    try {
      let modDelta = this.readModDeltaFromText(this.text);
      if (modDelta) {
        this.modifiedDelta = this.text;
        this.setInitValueFromModDelta(modDelta);
      } else {
        this.updateViewForText();
      }
      if (this._saveAsDelta) {
        this.onModelChange(this.modifiedDelta);
      } else {
        this.onModelChange(this.updatedText);
      }
      this.onModelTouched();
    } catch (e) {
    }
  }

  readModDeltaFromText(val: string) {
    try {
      if (!val) {
        return null;
      }
      let modDelta = JSON.parse(val);
      if (Array.isArray(modDelta)) {
        return modDelta;
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  updateViewForText() {
    let initDl: Delta;
    if (this.textToCompare !== this.currentText && !isNaN(+this.textToCompare)) {
      // numeric case:
      initDl = new Delta().insert(this.textToCompare, DELETE_ATTR)
        .insert(this.currentText, INSERT_ATTR);
    } else {
      // Calculate diff, returned as a Delta:
      initDl = this.stringDiff(this.textToCompare, this.currentText);
    }
    this.quill.setContents(initDl)
  }

  writeValue(value: any): void {
    this.currentText = value;
    if (this.quill) {
      if (value) {
        this.setInitialText(value);
      } else {
        this.setInitialText("");
      }
      this.updateView();
    }
  }

  /**
   * Set the initial value for Control.
   * @param initTxt Initial value, This value is compared to originalText to set initial
   *  contet.
   */
  setInitialText(initTxt: string) {
    if (this.textToCompare == null) {
      this.textToCompare = "";
    }
    try {
      let modDelta = this.readModDeltaFromText(initTxt);
      if (modDelta) {
        this.modifiedDelta = initTxt;
        this.setInitValueFromModDelta(modDelta);
      } else {
        this.setInitValueFromText(initTxt);
      }
    } catch (e) {
    }
    this.currentText = initTxt;
  }

  /**
   * Set initial value from modifedDelta. Modified Delta is a small Delta'srepresentation.
   * It is an array of objects: {i|d|r: string|number}
   *  (i: inserted, value is string inserted; d: deleted text,  values is the length of
   * deleted text; r: retatined text, values is the length of retained text)
   * @param modDelta modifedDelta.
   */
  setInitValueFromModDelta(modDelta: any[]) {
    let delta: Delta = new Delta();
    let ind = 0;
    modDelta.forEach((md: any) => {
      if (md.i != null) {
        delta.insert(md.i, INSERT_ATTR);
      } else if (md.d != null) {
        delta.insert(this.textToCompare.substr(ind, md.d), DELETE_ATTR);
        ind += md.d;
      } else if (md.r != null) {
        delta.insert(this.textToCompare.substr(ind, md.r), DEFAULT_ATTR);
        ind += md.r;
      }
    });
    this.quill.setContents(delta);
  }
  /**
   * Set initial value from String value. Calculates initial delta
   * using StringDiff algorithm.
   * @param initTxt Init value string.
   */
  setInitValueFromText(initTxt: string) {
    if (initTxt) {
      this.currentText = initTxt;
    } else {
      this.currentText = this.textToCompare;
    }
    let initDl: Delta;
    if (this.textToCompare !== this.currentText && !isNaN(+this.textToCompare)) {
      // numeric case:
      initDl = new Delta().insert(this.textToCompare, DELETE_ATTR)
        .insert(this.currentText, INSERT_ATTR);
    } else {
      // Calculate diff, returned as a Delta:
      initDl = this.stringDiff(this.textToCompare, this.currentText);
    }
    this.modifiedDelta = JSON.stringify(
      this.calculateModifedDelta(initDl));
    this.quill.setContents(initDl)
  }

  /**
   * Response to TextChange event.
   * @param delta Changes.
   * @param oldContents Previous control contents (as a Delta)
   */
  quillOnTextChange(delta, oldContents) {
    let stSel = 1;
    let curSel = this.quill.getSelection();
    if (curSel != null) {
      stSel = curSel.index;
    }
    let ind = 0;
    // Proceed to add blue/red text for each op in delta.
    delta.ops.forEach(d => {
      if (d.retain != null) {
        ind += d.retain;
      }
      if (d.insert != null) { // Insert operation
        this.quill.formatText(ind, d.insert.length, INSERT_ATTR, "api");
        //If inserted text matches some previously deleted text, then remove mark up.
        let fnd = this.getLargestPrevDeletedText(oldContents, stSel - 1, d.insert);
        this.quill.deleteText(stSel, fnd, 'api');
        this.quill.removeFormat(stSel - 1, fnd, 'api');
        this.maxLengthRestriction(stSel, d, fnd, ind, true);
      }
      if (d.delete != null) {  // Delete operation.
        // Get deleted String and content affected by deletion.
        let s = this.getOpsAffectdByDelete(oldContents, ind, d.delete);
        let posToIns = stSel;
        s.forEach(opStr => { // for each oldContent's affected operation:
          if (this.isOpDelete(opStr.op)) {
            // If old content was marked as delete, un-delete it.
            this.quill.insertText(posToIns, opStr.substr, DEFAULT_ATTR, "api");
            posToIns += (opStr.substr.length);
          } else if (!this.isOpInsert(opStr.op)) {
            // Old content was original text. Mark it as deleted.
            this.quill.insertText(posToIns, opStr.substr, DELETE_ATTR, "api");
            posToIns += (opStr.substr.length);
          }
        });
        this.maxLengthRestriction(posToIns, d, null, s, false);
        if (curSel != null) {
          this.quill.setSelection(curSel);
        }
      }
    });
  }
  /**
   * Validating maxLength
   * @param startSelection - Start selection of text
   * @param delta - delta I don't know?
   * @param find - Finding the previously deleted text?
   * @param inDel -flag to check if insert or deletion operation
   */
  private maxLengthRestriction(stSel: any, d: any, fnd: any, ind, inDel: boolean) {
    let exceedLength = this.updatedText.length - this.maxLength;
    if (!this.maxLength || exceedLength <= 0) {
      return;
    } else {
      this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, "Cannot add more than " + this.maxLength + " characters");
    }
    if (inDel) {
      if (d.insert && fnd === 0) {         // Remove Insert or re-apply deleted attribute
        this.quill.deleteText(ind, d.insert.length, 'api');
      } else {
        this.quill.formatText(stSel - 1, fnd, DELETE_ATTR, 'api');
      }
    } else {
      let posToIns = stSel - d.delete;
      ind.forEach(opStr => {
        if (this.isOpDelete(opStr.op)) {  // Re-apply delete attribute over maxLength
          this.quill.formatText(posToIns, d.delete, DELETE_ATTR, "api");
          posToIns += (opStr.substr.length);
        }
      });
    }
  }

  /**
   * Calculate "modified" delta from quill's contents
   * Transform data to represent a delta in the form:
   * [{i|d|r : string | number},{i|d|r : string | number},...]
   * i: inserted text (value is text inserted)
   * d: deleted text (value is delted text length)
   * r: retained text (value is retained text length)
   * @param contents Quill contents.
   */
  calculateModifedDelta(contents: any): any[] {
    let modDeltaArr: any[] = [];
    if (contents == null || contents.ops == null) {
      return modDeltaArr;
    }
    contents.ops.forEach((op: any) => {
      if (op.insert == null) {
        return;
      }
      if (this.isOpInsert(op) || op.insert === '\n')  {
        modDeltaArr.push({ i: op.insert });
      } else if (this.isOpDelete(op)) {
        modDeltaArr.push({ d: op.insert.length });
      } else {
        modDeltaArr.push({ r: op.insert.length });
      }
    });
    if (modDeltaArr.length > 0) {
      let last = modDeltaArr[modDeltaArr.length - 1];
      if (last['i'] === '\n') {
        modDeltaArr.pop();
      }
    }
    return modDeltaArr;
  }


  /**
   * Get largest String marked as deleted.
   * @param oldContents content's delta.
   * @param index Initial positio.
   * @param newText New Text to add.
   * @returns length of the String.
   */
  getLargestPrevDeletedText(oldContents, index: number, newText: string): number {
    let curInd = 0;
    let cont = true;
    let ret: number = 0;
    for (let j = 0; j < oldContents.ops.length; j++) {
      let op = oldContents.ops[j];
      if (op.insert == null) {
        continue;
      }
      if (curInd + op.insert.length <= index) {
        curInd += op.insert.length;
        continue;
      }
      if (!this.isOpDelete(op)) {
        return 0;
      }
      let sub: string = op.insert.substring(index - curInd);
      while (ret < newText.length && newText.charAt(ret) == sub.charAt(ret)) {
        ret++;
      }
      return ret;
    }
    return ret;
  }

  /**
   * Given two strings, get the largest match.
   * @param thisString First string.
   * @param otherString Second string.
   * @returns string with the largest match.
   */
  stringLargestMatch(thisString: string, otherString: string): string {
    if (otherString.length < thisString.length)
      return this.stringLargestMatch(otherString, thisString);

    let matchingLength = thisString.length;
    let possibleMatch = "";
    let index = 0;

    while (matchingLength) {
      index = 0;
      while (index + matchingLength <= otherString.length) {
        possibleMatch = thisString.substr(index, matchingLength);
        if (otherString.indexOf(possibleMatch) >= 0)
          return possibleMatch;
        index++;
      }
      matchingLength--;
    }
    return '';
  }

  /**
   * Get a Delta to move from one string to other.
   * @param thisString Source string.
   * @param newValue Target string.
   * @returns Delta with needed operations.
   */
  stringDiff(thisString: string, newValue: string): Delta {
    // Find largest match.
    let largestMatch = this.stringLargestMatch(thisString, newValue);
    if (!largestMatch) {
      // No match. Source string is deleted and target string is added:
      let ret = new Delta();
      if (thisString) {
        ret.insert(thisString, DELETE_ATTR)
      }
      if (newValue) {
        ret.insert(newValue, INSERT_ATTR);
      }
      return ret;
    } else {
      // Partial match. Work recursively on remaining parts
      let preNew = newValue.substr(0, newValue.indexOf(largestMatch));
      let preOld = thisString.substr(0, thisString.indexOf(largestMatch));
      let postNew = newValue.substr(preNew.length + largestMatch.length);
      let postOld = thisString.substr(preOld.length + largestMatch.length);
      return this.stringDiff(preOld, preNew)
        .insert(largestMatch, DEFAULT_ATTR)
        .concat(this.stringDiff(postOld, postNew));
    }
  }

  /**
   * Get string represented by delta. Removes text from Delete operations.
   * @param delta 
   * @returns string represented by delta.
   */
  getTextFromDelta(delta): string {
    let t = delta.map(op => {
      if (typeof op.insert === 'string') {
        if (this.isOpDelete(op)) {
          return "";
        }
        return op.insert;
      }
    }).join('');
    return t.replace(/\n$/, '');
  }
  /**
   * Determine if Operation has color as attribute.
   * @param op  OPeratio.
   * @param color color name.
   */
  opHasColor(op, color): boolean {
    if (op == null) {
      return false;
    }
    if (op.insert == null || op.attributes == null) {
      return false;
    }
    return color === op.attributes.color;
  }

  isOpDelete(op) {
    return this.opHasColor(op, DELETE_COLOR);
  }

  isOpInsert(op) {
    return this.opHasColor(op, INSERT_COLOR) || this.opHasColor(op, HEX_BLUE_COLOR);
  }

  /**
   * Get all operations affected for a delete operation.
   * @param oldContents Previous content.
   * @param ind Start index.
   * @param length Length of deleted part.
   * @return array of {op, substring} operation's affected.
   */
  getOpsAffectdByDelete(oldContents: Delta, ind: number, length: number): any[] {
    let result = [];
    let lastValueChecked: number = 0;
    let lastLengthChecked: number = 0;
    let checkLength = ind;
    const uncheckLength = ind + length;
    for (let i = 0; oldContents.ops.length > i; i++) {
      let value = oldContents.ops[i];
      if (value !== null && i !== oldContents.ops.length) {
        if (lastValueChecked + value.insert.length > ind) {
          if (checkLength < uncheckLength) {
            let temp = value.insert.length;
            value.insert = value.insert.substr((ind >= lastValueChecked) ? ind - lastValueChecked : 0, (length - lastLengthChecked));
            result.push({ op: value, substr: value.insert });
            checkLength += value.insert.length;
            lastLengthChecked += value.insert.length;
            lastValueChecked += temp;
          } else {
            break;
          }
        }
        lastValueChecked += value.insert.length
      }
    }
    if (result.length === 0) {
      result.push({ op: oldContents.ops[0], substr: oldContents.ops[0].insert.substr(ind) });
    }
    return result;
  }

  /** Required form template-driven forms. */
  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }
  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

}
