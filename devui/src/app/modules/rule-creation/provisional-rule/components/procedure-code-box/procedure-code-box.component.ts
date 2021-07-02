import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import { ProcCodeBoxHelper } from 'src/app/modules/rule-creation/provisional-rule/components/procedure-code-box/proc-box-helper/proc-code-box-helper';
import { ProcCodeCaretHandler } from 'src/app/modules/rule-creation/provisional-rule/components/procedure-code-box/proc-box-helper/proc-code-caret-hdlr';
import { ProcCodeEditionHandler } from 'src/app/modules/rule-creation/provisional-rule/components/procedure-code-box/proc-box-helper/proc-code-edition-hdlr';
import { ProcCodesUtils } from 'src/app/modules/rule-creation/provisional-rule/components/procedure-code-box/proc-box-helper/proc-codes-utils';
import { ProcedureCodeValidationDto } from 'src/app/shared/models/dto/proc-code-validation-dto';
import { ProcedureCodesService } from 'src/app/services/procedure-codes.service';
import { Constants } from 'src/app/shared/models/constants';

declare let $ : any;
const NOT_VALIDATED_MSG = ' Codes not validated';
const ALL_VALID_CODES_MSG = ' All codes are valid';
const NO_CODES_MSG = ' No codes to validate';

@Component({
  selector: 'app-procedure-code-box',
  templateUrl: './procedure-code-box.component.html',
  styleUrls: ['./procedure-code-box.component.css']
})

export class ProcedureCodeBoxComponent implements OnInit, OnDestroy {

  @ViewChild('procCodeBox',{static: true}) procCodeBox: ElementRef;

  @Input() boxTitle:string = '';
  /** Procedure code type: HCPCS, IDC10, ALL */
  _procCodeType = 'ALL';
  @Input() set procCodeType(val: string) {
    if (val) {
      this._procCodeType = val;
      if (this.procCodeBoxHelper) {
        this.procCodeBoxHelper.procCodeType = val;
      }
    }
  }
  @Input() set procedureCodes(val: string) {
    if (val === undefined) {
      return;
    }
    if (this.procCodesString !== val) {
      this.initialCodesString = val;
      this.procCodesString = val;
      this.parseProcedureCodes();
      let valRes = this.procedureCodesService.getLatestValidationResult(this.boxTitle);
      if (valRes && valRes.length) {
        this.processValidationResult(valRes);
      } else {
        this.resetValidationStatus();
      }
    }
  }

  @Input() codeAndOption: boolean = false;

  get procedureCodes(): string {
    return this.procCodesString;
  }

  @Output() procedureCodesChange = new EventEmitter<String>();
  /** Notify codes validation result */
  @Output() onValidationResult = new EventEmitter<any>();

  @Input() set originalProcedureCodes(val: string) {
    if (this.origProcCodeString !== val) {
      this.origProcCodeString = val;
      if (this.procCodeBoxHelper) {
        this.procCodeBoxHelper.origCodesString = val;
        this.parseProcedureCodes();
      }
    }
  }

  get originalProcedureCodes():string {
    return this.origProcCodeString;
  }

  @Input() set readOnly(value: boolean)  {
    if (value !== null) {
      this._readOnly = value;
    }
    this.enableBoxCode();
  }
  _compareToOriginal: boolean;
  @Input() set compareToOriginal(value: boolean) {
    if (value !== null) {
      this._compareToOriginal = value;
      if (this.procCodeBoxHelper) {
        this.procCodeBoxHelper.compareToOriginal = value;
      }
    }
  }

  get compareToOriginal(): boolean {
    return this._compareToOriginal;
  }

  _readOnly:boolean = false;
  validationMsg:string = NOT_VALIDATED_MSG;
  validationTooltip: string = '';
  private procCodesString = '';
  private origProcCodeString = '';
  blocked:boolean = false;
  currCodes: string[];
  valMsgClass = 'text-dark';
  procCodeBoxHelper: ProcCodeBoxHelper;
  procCodeEditionHandler: ProcCodeEditionHandler;
  procCodeCaretHandler: ProcCodeCaretHandler;
  onModelChange: Function = () => {};
  onModelTouched: Function = () => {};
  private initialCodesString = '';
  get isDirty() :boolean {
    return this.initialCodesString !== this.procCodesString;
  }


  constructor(private procedureCodesService: ProcedureCodesService) { }

  ngOnInit() {
    this.procCodeBoxHelper = new ProcCodeBoxHelper(this.procCodeBox.nativeElement);
    this.procCodeBoxHelper.procCodeType = this._procCodeType;
    this.procCodeBoxHelper.compareToOriginal = this.compareToOriginal;
    this.procCodeEditionHandler = new ProcCodeEditionHandler(this.procCodeBoxHelper);
    this.procCodeCaretHandler = new ProcCodeCaretHandler(this.procCodeBox.nativeElement);

    this.enableBoxCode();
    this.parseProcedureCodes();
    this.procCodeBox.nativeElement.addEventListener('keydown', (evt:KeyboardEvent) => {
      this.onKeyDown(evt);
    })
    this.procCodeBox.nativeElement.addEventListener('paste', (evt: ClipboardEvent) => {
      this.handlePasteEvent(evt);
    })
    this.procedureCodesService.registerCodeBox(this);
    let valRes = this.procedureCodesService.getLatestValidationResult(this.boxTitle);
    if (valRes && valRes.length) {
      this.processValidationResult(valRes);
    } else {
      this.resetValidationStatus();
    }
  }
  /**
   * enable / disable code box.
   */
  enableBoxCode() {
    if (this.procCodeBox) {
      if (this._readOnly) {
        this.procCodeBox.nativeElement.contentEditable = 'false'
        this.procCodeBox.nativeElement.classList.add('cb-disabled');  
      } else {
        this.procCodeBox.nativeElement.contentEditable = 'true'
        this.procCodeBox.nativeElement.classList.remove('cb-disabled');  
      }
    }
  }
  /**
   * Extract procedure code from input string and present them in code box.
   */
  parseProcedureCodes() {
    if (this.procCodeBoxHelper && (this.procCodesString || this.origProcCodeString)) {
      this.procCodeBoxHelper.updateBoxContentAndFormat(this.procCodesString,
        this.origProcCodeString);
    }
    this.resetValidationStatus();
  }
  /**
   * Service call to validate procedure codes.
   */
  validateProcedureCodes() {
    let codesString = this.calculateUpdatedText();
    if (!codesString) {
       this.resetValidationStatus(true);
      return;
    }
    this.blocked = true;
    let codes = ProcCodesUtils.extractUniqueProcedureCodes(codesString);
    if (codes.length == 0 && !ProcCodesUtils.containsGlobalRange(codesString)) {
      this.processValidationResult([]);
    } else {
      this.procedureCodesService.validateCodes(codes, this._procCodeType)
      .subscribe( resp => {
        this.processValidationResult(resp.data);
      })
    }
  }
  /**
   * Keyboard event management.
   * @param ev Keyboard event.
   */
  onKeyDown(ev: KeyboardEvent) {
    if (ev.key.length == 1) {
      if (ev.ctrlKey || ev.altKey || ev.metaKey) {
        return;
      }
      ev.preventDefault();
      this.handleInsert(ev.key);
      this.procedureCodesChange.emit(this.procCodesString);
      this.resetValidationStatus();
    } else {
      if (ev.key === 'Enter' || ev.key == 'PageDown' || ev.key == 'PageUp') {
        ev.preventDefault();
      } else if (ev.key === 'Backspace' || ev.key === 'Delete') {
        ev.preventDefault();
        this.handleDelete(ev);
        this.procedureCodesChange.emit(this.procCodesString);
        this.resetValidationStatus();
      }
    }
  }
  /**
   * Handle kwyboard or paset input string.
   * @param val Value to insert.
   */
  private handleInsert(val: string) {
    if (!val) {
      return;
    }
    let curPos = this.procCodeCaretHandler.getCaretPosition();
    let startEnd = this.procCodeCaretHandler.getStartEndSelectionPosition();
    if (startEnd == null) {
      return;
    }
    let cntToDelete = startEnd.endPos - startEnd.startPos;
    if (cntToDelete) {
      this.procCodeEditionHandler.deleteStringAtPosition(startEnd.startPos, cntToDelete);
    }
    this.procCodeEditionHandler.addStringAtPosition(val, curPos, this.codeAndOption);
    this.procCodesString = this.calculateUpdatedText();
    this.procCodeCaretHandler.setCaretPosition(curPos + 1);
  }
  /**
   * Handle string deletion.
   * @param ev keyboard event.
   */
  handleDelete(ev: KeyboardEvent) {
    let startEnd = this.procCodeCaretHandler.getStartEndSelectionPosition();
    if (startEnd == null) {
      return;
    }
    let cntToDelete = startEnd.endPos - startEnd.startPos;
    if (cntToDelete == 0) {
      cntToDelete = 1;
    }
    if (ev.key === 'Backspace') {
      if (startEnd.startPos <= 0) {
        return;
      }
      startEnd.startPos--;
    }
    this.procCodeEditionHandler.deleteStringAtPosition(startEnd.startPos, cntToDelete);
    this.procCodesString = this.calculateUpdatedText();
    this.procCodeCaretHandler.setCaretPosition(startEnd.startPos);
  }
  /** 
   * Process validation result. Mark codes as valid / invalid according to service
   * validation response.
   */
  processValidationResult(codeValidationResult: ProcedureCodeValidationDto[]) {
    let badCodes = this.procCodeBoxHelper.getAllBadFormatCodes();
    this.procCodeBoxHelper.updateValidationStatus(codeValidationResult);
    let invalidCodes = codeValidationResult.filter(cv => cv.codeStatus === Constants.CODE_INVALID_STATUS);
    let validCodes = codeValidationResult.filter(cv => cv.codeStatus === Constants.CODE_VALID_STATUS);
    if (invalidCodes.length || badCodes.length) {
      let setInv = new Set(invalidCodes.map(v => v.codeName).concat(badCodes));
      let invCodesCnt = setInv.size;
      this.validationMsg = `You have ${invCodesCnt} invalid codes`;
      this.validationTooltip = [...setInv].join(', ');
      this.valMsgClass = 'text-danger';
    } else {
      this.validationMsg = this.procCodesString ? ALL_VALID_CODES_MSG : NO_CODES_MSG;
      this.valMsgClass = 'text-success';
    }
    this.onValidationResult.emit({
      name: this.boxTitle,
      isDirty: this.isDirty,
      validated: true,
      validCodes: validCodes, 
      invalidCodes: invalidCodes,
      codesString: this.procCodesString});
    this.blocked = false;
  }
  /**
   * Reset validation status.
   * @param valStat value for the validated flag.
   */
  resetValidationStatus(valStat:boolean = false) {
    this.valMsgClass = valStat? 'text-success':'text-dark';
    this.validationMsg = valStat ? NO_CODES_MSG : NOT_VALIDATED_MSG;
    this.validationTooltip = '';
    this.blocked = false;
    this.onValidationResult.emit({
      name: this.boxTitle,
      validated: valStat,
      isDirty: this.isDirty,
      validCodes: [],
      invalidCodes: [],
      codesString: this.procCodesString});
  }
  /**
   * 
   * @param procCodeStr Codes String.
   * @param origProcCodeStr Original codes String.
   * @param codeValidationResult Validation result.
   */
  updateProcBoxContent(procCodeStr: string, origProcCodeStr?: string, codeValidationResult?: ProcedureCodeValidationDto[]) {
    this.procCodeBoxHelper.updateBoxContent(procCodeStr, origProcCodeStr, codeValidationResult);
  }
  /**
   * Paste event handling: extract data as text and try to parser as codes.
   * @param evt Clipboard event.
   */
  handlePasteEvent(evt: ClipboardEvent) {
    if (!evt) {
      return;
    }
    evt.preventDefault();
    if (evt.clipboardData) {
      let str = evt.clipboardData.getData('text/plain');
      this.handleInsert(str);
      this.procCodesString = this.calculateUpdatedText();
      this.procedureCodesChange.emit(this.procCodesString);
      this.resetValidationStatus();
    }
  }
  /**
   * Calculate updated text (usen in case we have original codes)
   */
  calculateUpdatedText():string {
    return this.procCodeBoxHelper.calculateUpdatedText();
  }

  removeAllInvalidCodes() {
    if (this.procCodeBoxHelper) {
      this.procCodeBoxHelper.removeAllInvalidCodes();
      this.procCodesString = this.calculateUpdatedText();
      this.procedureCodesChange.emit(this.procCodesString);
    }
  }

  hasCodesChanges(): boolean {
    if (this.compareToOriginal) {
      return this.origProcCodeString !== this.procCodesString;
    } else {
      return this.procCodesString && this.procCodesString.length > 0
    }
  }

  ngOnDestroy() {
    this.procedureCodesService.unregisterCodeBox(this);
  }
}

