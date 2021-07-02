import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { CrosswalkService } from '../../../../services/crosswalk.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { BlockableUI } from 'primeng/api';


const HIGHLIGHT_RED_SET = ['highlight-red', 'highlight-remove-red'];
const HIGHLIGHT_BLUE_SET = ['highlight-blue', 'highlight-remove-blue'];
const HIGHLIGHT_PINK_SET = ["hl-cotiviti-pink"];

/**
 * @author Jeffrey King
 * Please Transform this into a sharable code.
 * ~ ~ ~ ~ ~ ~ ~ TODO List ~ ~ ~ ~ ~ ~ ~ ~ ~
 * Change name to highlight-rules          ~
 * Move to Share Folders                   ~
 * Make it more Modular                    ~
 * ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 */
@Component({
  selector: 'mid-rule-box',
  templateUrl: './mid-rule-box.component.html',
  styleUrls: ['./mid-rule-box.component.css']
})
export class MidRuleBoxComponent implements OnInit {

  @ViewChild('editable',{static: true}) high: ElementRef;
  @Output() midTextOutput: EventEmitter<string[]> = new EventEmitter();
  @Output() midTextLengthOutput: EventEmitter<number> = new EventEmitter();
  @Output() enterTrigger: EventEmitter<any> = new EventEmitter();

  midText: string = '';
  updatedMidText: string = '';
  midTextLength: number = 0;
  commaMode: boolean = false;
  invalidList: string[] = [];
  _midTextBoxCss: string = 'mid-text-box';
  midLoading: boolean = false;
  @Input() set midTextBoxCss(value) {
    this._midTextBoxCss = value;
  }
  @Input() set loading(value: boolean) {
    this.midLoading = value;
  }
  
  constructor(private crossService: CrosswalkService, private sanitizer: DomSanitizer) { }

  ngOnInit() { }

  /**
   * Step will remove extra spaces in the updatedMidText
   */
  validCheck() {
    let noSpacetext = this.updatedMidText.replace(/\s/g, '');
    let result = noSpacetext.split(';');
    this.checkMidRuleIds(result);
  }

  /**
   * Dynamic method to remove span by its ID. If comma is not null it will be removed along with it
   * @param e ID that being passed through.
   */
  removeRuleId(e) {
    const enterKey = {
      key: "Enter"
    }
    const id = document.getElementById(e).id;
    document.getElementById(e).remove();
    if (document.getElementById(e + 'comma') !== null) {
      document.getElementById(e + 'comma').remove();
    }
    const updatedList = this.high.nativeElement.textContent.split(',');
    this.midTextOutput.emit(updatedList);
    if (id.includes('v')) {
      this.enterTrigger.emit(enterKey);
    } else {
      this.checkMidRuleIds(updatedList, this.invalidList, true);
    }
  }

  /**
   *  Apply HighLight to Text that are invalid or not. Creating elements to append on the viewChild's div.
   * @param text - text to be highlighted or added onto setText
   * @param boolean - To be highlighted if true.
   * @param setText - Text that being added onto by 'text' (Text Building)
   * @param setCheck - Check if last inserted text of the list that is invalided
   * @param lastCheck - Very last item of the setText to be inserted
   */
  applyHighlights(text: string, boolean?: boolean, setText?: string, setCheck?: boolean, lastCheck?: boolean): string {
    let span = document.createElement('span');
    span.textContent = setText;
    // APPLY HIGHLIGHT FOR INVALID RULES
    if (boolean) {
      if (this.commaMode) {
        this.setHighLight('i', text, setCheck, HIGHLIGHT_RED_SET);
      } else {
        const highlighted = this.createSpanElement(text + status, HIGHLIGHT_PINK_SET[0], text, 'true', false);
        this.high.nativeElement.appendChild(span);
        this.high.nativeElement.appendChild(highlighted);
        return ';'
      }
    } else {
      // APPLY HIGHLIGHT FOR VALID RULE IF COMMAMODE TRUE
      if (this.commaMode) {
        this.setHighLight('v', text, setCheck, HIGHLIGHT_BLUE_SET);
      } else {
        if (!setCheck) {
          return this.setMode(setText, text);
        } else {
          if (!lastCheck) {
            return this.setMode(setText, text);
          } else {
            setText = setText.concat(text)
            span.textContent = setText;
            this.high.nativeElement.appendChild(span);
            return ''
          }
        }
      }
    }
  }

  /**
   * Set HighLight for Invalid or Valid Rules
   * @param status - Used as a unique Identifier! MUST BE UNIQUE!
   * @param text - text that will be used as the ID and be added
   * @param setCheck - End of the array Loop. (Last Item)
   * @param className - String Array you can pass as many to use in setting up span elements
   */
  setHighLight(status: string, text: string, setCheck: boolean, className: string[]) {
    let span = document.createElement('span');
    let highlighted = this.createSpanElement(text + status, className[0], text, 'false', false);
    const removable = this.createSpanElement(text + status, 'fa fa-times', '', 'false', true);
    const commaRemovable = this.createSpanElement(text + 'comma', '', ',', 'false', false);
    // Order Matters here.
    highlighted.appendChild(removable);
    this.high.nativeElement.appendChild(highlighted);
    if (!setCheck) {
      this.high.nativeElement.appendChild(commaRemovable);
    } else {
      span.textContent = ' ';
      span.className = "keep-space";
      this.high.nativeElement.appendChild(span);
    }
  }

  /**
   * createSpanElement` to create a span element for highlighted item.
   * @param id - Identifier to target the element for removal or changes.
   * @param className - element class to be styled
   * @param text - content for the element
   * @param editable - ContentEditable to turn it off or on
   * @param event - Pass an event trigger to remove the element by it's id
   */
  createSpanElement(id: string, className: string, text: string, editable: string, event: boolean): HTMLSpanElement {
    let span = document.createElement('span');
    span.id = id;
    span.className = className;
    span.textContent = text;
    span.contentEditable = editable;
    if (event) {
      span.addEventListener('click', () => {
        this.removeRuleId(id);
      })
    }
    return span;
  }


  /**
   *  Comma or Semi-colon
   * @param setText
   * @param text
   */
  setMode(setText, text) {
    if (!this.commaMode) {
      return setText.concat(text + ';');
    } else {
      return setText.concat(text + ',')
    }
  }

  /**
   * Update the Model with the latest value and send to the parent for updating
   * @param e Latest Text
   */
  updateModel(e) {
    this.updatedMidText = e.replace(/\r?\n|\r/g, '');
    if (e && e.trim()) {
      if (this.updatedMidText.includes(';')) {
        this.midTextOutput.emit(this.updatedMidText.split(';'));
      } else {
        let array: string[] = [this.updatedMidText];
        this.midTextOutput.emit(array);
      }
    } else {
      if (this.midText.includes(';')) {
        this.midTextOutput.emit(this.midText.split(';'));
      } else {
        this.clearBoxContent();
        this.midTextLengthOutput.emit(0);
        let array: string[] = [this.midText];
        this.midTextOutput.emit(array);
      }
    }
  }

  /**
   * Remove child spans and it's content to give a clean slate.
   */
  clearBoxContent() {
    if (this.high.nativeElement) {
      let span = document.createElement('span');
      if (this.high.nativeElement.childNodes.length) {
        while (this.high.nativeElement.lastChild) {
          this.high.nativeElement.removeChild(this.high.nativeElement.lastChild);
        }
      }
      this.resetCaret();
      this.high.nativeElement.innerTEXT = '';
      this.high.nativeElement.style = '';
      this.high.nativeElement.appendChild(span);
    }
  }

  resetCaret() {
    let parentNode = document.getElementById("editable").parentNode;
    let sel = window.getSelection()
    let range = sel.getRangeAt(0);
    sel.collapseToStart();
    let pre_range = document.createRange();
    // Have this range select the entire contents of the editable div
    pre_range.selectNodeContents(parentNode);
    // Set the end point of this range to the start point of the cursor
    pre_range.setEnd(range.startContainer, range.startOffset);
  }

  /**
   * checkMidRuleIds send to the service to check
   * @param midRuleIds - List of mid rule Id from the user
   * @returns - return the list of invalid rules Id to used for highlighting
   */
  checkMidRuleIds(idList: string[], invalid?: string[], rr?: boolean) {
    let requestBody = {
      midRuleIds: idList
    };
    idList = idList.filter(s => s);
    if (!rr) {
      this.crossService.getAllInvalidMidRuleIds(requestBody).subscribe(response => {
        let { invalidMidRuleIds } = response.data;
        this.midTextLength = invalidMidRuleIds.length;
        this.midTextLengthOutput.emit(this.midTextLength);
        let lastCheck: boolean = false;
        let setText: string = '';
        let setCheck: boolean = false;
        this.high.nativeElement.textContent = '';
        idList.forEach((ele, index) => {
          ele = ele.trim();
          if (ele !== '') {
            if (invalidMidRuleIds.includes(ele)) {
              if (index !== idList.length - 1) {
                setText = this.applyHighlights(ele, true, setText);
              } else {
                setText = this.applyHighlights(ele, true, setText, true);
              }
              setCheck = true;
            } else {
              if (index === idList.length - 1) {
                lastCheck = true;
                setCheck = true;
              }
              setText = this.applyHighlights(ele, false, setText, setCheck, lastCheck);
            }
          }
        });
      });
    } else {
      this.midTextLength = 0;
      this.invalidList = invalid;
      this.commaMode = rr;
      let lastCheck: boolean = false;
      let setText: string = '';
      let setCheck: boolean = false;
      this.high.nativeElement.textContent = '';
      idList.forEach((ele, index) => {
        ele = ele.trim();
        if (ele !== '') {
          if (invalid.includes(ele)) {
            this.midTextLength++;
            if (index !== idList.length - 1) {
              setText = this.applyHighlights(ele, true, setText);
            } else {
              setText = this.applyHighlights(ele, true, setText, true);
              setCheck = true;
            }
          } else {
            if (index === idList.length - 1) {
              lastCheck = true;
              setCheck = true;
            }
            setText = this.applyHighlights(ele, false, setText, setCheck, lastCheck);
          }
        }
      });
      this.midTextLengthOutput.emit(this.midTextLength);
    }
  }

  /**
   * cleanCopyHTML will make sure copy is clean and remove any scripted/html elements
   * @param e clipboard event
   */
  cleanCopyHTML(e: ClipboardEvent) {
    const sel = document.getSelection().toString();
    this.sanitizer.sanitize(SecurityContext.HTML, sel);
    e.clipboardData.setData('text/plain', sel);
    e.preventDefault();
    this.midTextLengthOutput.emit(0);
  }

  /**
   * triggerEvent only triggers when user hit the 'Enter' Key
   * @param e keyEvent to send towards the parent.
   */
  triggerEvent(e) {
    this.enterTrigger.emit(e);
  }

  resetBox() {
    this.midText = '';
    this.updatedMidText = '';
    this.updateModel('');
    this.midTextLength = 0;
  }

}
