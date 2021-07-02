import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import * as Quill from 'quill';
import * as Delta from 'quill-delta';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { Constants } from 'src/app/shared/models/constants';
import { RuleCodeDto } from 'src/app/shared/models/dto/rule-code-dto';
@Component({
  selector: 'app-provisional-rule-copy-paste',
  templateUrl: './provisional-rule-copy-paste.component.html',
  styleUrls: ['./provisional-rule-copy-paste.component.css']
})
export class ProvisionalRuleCopyPasteComponent implements OnInit {
  codeRanges: any = '';
  @Output() addRowToCodes = new EventEmitter<any>();
  @Input() rowToEdit: any;
  @Input() ruleInfo: any;
  @ViewChild('markuped',{static: true}) markupEd;
  @ViewChild('qlcontainer',{static: true}) qlContainer;
  @Input() procTypeOptions: any[];
  @Input() modifierOptions: any[];
  @Input() posOptions: any[];
  @Input() revenueCodeOptions: any[];
  @ViewChild('individuallyTag',{static: true}) individuallyTag;

  _errorMap: any;
  @Input() set errorMap(value: any) {
    if (value) {
      this.isQuillEnabled = false;
      this._errorMap = value;
    }
  }
  get errorMap() {
    return this._errorMap;
  }


  quill: any;
  isQuillEnabled: boolean = false;

  constructor(private toastService: ToastMessageService) { }

  clearData() {
    this.codeRanges = '';
    this.quill.setContents([{insert:'\n'}]);
    this.individuallyTag.clearData();
  }

  addRowToCodesTable(rowToAdd: any) {
    this._errorMap = null;
    this.rowToEdit = null;
    let dtoList: RuleCodeDto[];
    dtoList = this.generateRuleProcedureCode(rowToAdd.data);
    if (dtoList)
      this.addRowToCodes.emit(dtoList);
    else{
      this.toastService.messageError(Constants.TOAST_SUMMARY_ERROR, 'Please enter valid code(s)');
    }

  }

  generateRuleProcedureCode(rowToAddData: RuleCodeDto) {
    let splittedCodes = this.codeRanges.split(",");
    let procCodeDtoList: RuleCodeDto[] = [];

    if (this.codeRanges != '') {
      splittedCodes.forEach(codes => {

        if(codes && codes!='') {
          let procCodeDto = new RuleCodeDto();
          if (codes.indexOf('-') !== -1) {
            let splitRange = codes.split('-');
            procCodeDto.codeRangeFrom = splitRange[0];
            procCodeDto.codeRangeTo = splitRange[1];
          } else {
            procCodeDto.codeRangeFrom = codes;
            procCodeDto.codeRangeTo = codes;
          }
          procCodeDto.ruleId = this.ruleInfo.ruleId;
          procCodeDto.codeRangeFrom = procCodeDto.codeRangeFrom.toUpperCase();
          procCodeDto.codeRangeTo = procCodeDto.codeRangeTo.toUpperCase();
          procCodeDto.modifier = rowToAddData.modifier;
          procCodeDto.daysLo = rowToAddData.daysLo;
          procCodeDto.daysHi = rowToAddData.daysHi;
          procCodeDto.dateFrom = rowToAddData.dateFrom;
          procCodeDto.dateTo = rowToAddData.dateTo
          procCodeDto.category = rowToAddData.category;
          procCodeDto.icd = rowToAddData.icd;
          procCodeDto.bwDeny = rowToAddData.bwDeny;
          procCodeDto.override = rowToAddData.override;
          procCodeDto.pos = rowToAddData.pos;
          procCodeDto.revenueCodeDescFrom = rowToAddData.revenueCodeDescFrom;
          procCodeDto.revenueCodeDescTo = rowToAddData.revenueCodeDescTo;
          procCodeDto.revenueCodeFrom = rowToAddData.revenueCodeFrom;
          procCodeDto.revenueCodeTo = rowToAddData.revenueCodeTo;

          if (procCodeDto)
            procCodeDtoList.push(procCodeDto);
      }
      });
      if (procCodeDtoList.length)
        return procCodeDtoList;
    } else {
      this.toastService.messageError(Constants.TOAST_SUMMARY_ERROR, 'Please enter a value in Add codes field');
    }
  }

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
    this.enableQuillEditorForErrorCodes();
  }

  enableQuillEditorForErrorCodes() {
    if (this._errorMap !== undefined && this._errorMap !== null && !this.isQuillEnabled) {
      if ((this._errorMap.INVALID_CODETYPE !== undefined && this._errorMap.INVALID_CODETYPE !== null)) {
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

}
