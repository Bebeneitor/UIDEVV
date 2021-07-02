import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit, Output, ViewChild,EventEmitter } from '@angular/core';
import { ProcedureCodesService } from 'src/app/services/procedure-codes.service';
import { RuleInfoService } from 'src/app/services/rule-info.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { Constants } from 'src/app/shared/models/constants';
import { RuleCodeDto } from 'src/app/shared/models/dto/rule-code-dto';
import { ProcedureCodeDto } from 'src/app/shared/models/dto/procedure-code-dto';
import { ValidateRuleCodeRequest } from 'src/app/shared/models/validate-rule-code-request';
import { ValidateRuleCodeResponse } from 'src/app/shared/models/validate-rule-code-response';
import { RuleInfo } from 'src/app/shared/models/rule-info';
import * as Quill from 'quill';

@Component({
  selector: 'app-icd-copy-paste',
  templateUrl: './icd-copy-paste.component.html',
  styleUrls: ['./icd-copy-paste.component.css']
})
export class IcdCopyPasteComponent implements OnInit {

  _ruleInfo: RuleInfo = new RuleInfo();
  codeRanges: any = '';
  quill: any;
  isQuillEnabled: boolean = false;
  _categories: any[] = [];
  _primarySecondary: any[] = [];
  _errorMap: any;

  @Output() addRowToCodes = new EventEmitter();
  private _fromDate: any;
  _toDate: any;
  @Input() set ruleInfo(value: RuleInfo) {
    if (value) {
      this._ruleInfo = value;
    }
  }
  @Input() set errorMap(value: any) {
    if (value) {
      this.isQuillEnabled = false;
      this._errorMap = value;
    }
  }
  get errorMap() {
    return this._errorMap;
  }
  @Input() set categories(value: any){
    if (value) {
      this._categories = value;
    }
  }

  @Input() set primarySecondary(value: any){
    if (value) {
      this._primarySecondary = value;
    }
  }

  @Input() set fromDate(value: any){
    if (value) {
      this._fromDate = value;
    }
  }

  @Input() set toDate(value: any){
    if (value) {
      this._toDate = value;
    }
  }
  @ViewChild('markuped',{static: true}) markupEd;
  @ViewChild('qlcontainer',{static: true}) qlContainer;

  icdRuleCodeObj: any = {
    dateFrom: this.datepipe.transform(
      Constants.CODES_DEF_DATE_FROM, Constants.DATE_FORMAT_IN_ECL_TABLE),
    dateTo: this.datepipe.transform(
      Constants.CODES_DEF_DATE_TO, Constants.DATE_FORMAT_IN_ECL_TABLE),
    category: null,
    primarySecondary: null,
    override: false,
    claim: false
  }

  yearValidRange = `${Constants.EFT_MIN_VALID_YEAR}:${Constants.EFT_MAX_VALID_YEAR}`;

  constructor(private datepipe: DatePipe) { }

  ngOnInit() {
    this.quill = new Quill(this.markupEd.nativeElement, {
      scrollingContainer: this.qlContainer.nativeElement
    });
    this.quill.on('text-change', (delta, oldContents, source) => {
      let ranges = '';
      this.quill.getContents().ops.forEach(d => {
        if (d.insert != null) {
          ranges += d.insert;
        }
      });
      this.codeRanges = ranges.replace("[^a-zA-Z0-9]", "");
      this.codeRanges = this.codeRanges.trim().toUpperCase();
    });
  }
  ngAfterViewChecked() {
    this.enableQuillEditorForErrorCodes()
  }

   /* Method to emit the copy paste and selected ICD object details */
  addRowToCodesTable() {
    this._errorMap = null;
    let data = {
      codeRange:this.codeRanges,
      icdObj: this.icdRuleCodeObj
    };
    this.addRowToCodes.emit({ type: 'copypaste', data: data } );
  }

  /* Method to show the color code in the copy paste text area */
  enableQuillEditorForErrorCodes() {
    if (this._errorMap !== undefined && this._errorMap !== null && !this.isQuillEnabled) {
      if (this._errorMap.INVALID_CODETYPE !== undefined && this._errorMap.INVALID_CODETYPE !== null) {
        if (this.quill) {
          this.quill.enable();
        }
        this.quill.setText(this.codeRanges);
        if (this._errorMap.INVALID_CODETYPE.length) {
          this._errorMap.INVALID_CODETYPE.forEach(element => {
            let index = this.codeRanges.indexOf(element);
            let length = element.length;
            this.quill.formatText(index, length, {
              'color': 'red'
            });
          });

        }
        this.isQuillEnabled = true;
      }
    }
    else if (this._errorMap === undefined || this._errorMap === null) {
      let length = this.codeRanges.length;
      this.quill.formatText(0, length, {
        'color': '#000'
      });
    }
  }

  clearData() {
    this.codeRanges = '';
    this.quill.setContents([{insert:'\n'}]);
    this.icdRuleCodeObj = {
      dateFrom: this.datepipe.transform(
        Constants.CODES_DEF_DATE_FROM, Constants.DATE_FORMAT_IN_ECL_TABLE),
      dateTo: this.datepipe.transform(
        Constants.CODES_DEF_DATE_TO, Constants.DATE_FORMAT_IN_ECL_TABLE),
      category: null,
      primarySecondary: null,
      override: false,
      claim: false
    }
  }

}
