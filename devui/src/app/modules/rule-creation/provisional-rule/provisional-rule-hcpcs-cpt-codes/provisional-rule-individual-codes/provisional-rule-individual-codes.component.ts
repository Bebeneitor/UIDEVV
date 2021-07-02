import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { Constants } from 'src/app/shared/models/constants';
import { RuleCodeDto } from 'src/app/shared/models/dto/rule-code-dto';
import { AppUtils } from 'src/app/shared/services/utils';

@Component({
  selector: 'app-provisional-rule-individual-codes',
  templateUrl: './provisional-rule-individual-codes.component.html',
  styleUrls: ['./provisional-rule-individual-codes.component.css']
})
export class ProvisionalRuleIndividualCodesComponent implements OnInit {

  @Input() ruleInfo: any;
  @Output() addRowToCodes: EventEmitter<any> = new EventEmitter();
  @Input() tabType: string;

  private _procTypeOptions: any[];
  @Input() set procTypeOptions(resp: any[]) {
    if(resp){
      this._procTypeOptions = resp; 
    }
  }

  @Input() modifierOptions: any[];
  @Input() posOptions: any[];
  @Input() revenueCodeOptions: any[];

  private _rowToEdit: any;
  @Input() set rowToEdit(mode) {

    if (mode) {
      this._rowToEdit = mode;
      this.clearData();
      this.populateInputsWithRowData(this._rowToEdit);
    }
  }

  codeRangeFrom: string = "";
  codeRangeTo: string = "";
  modifier: any[];
  daysLo: number;
  daysHi: number;
  dateFrom: string = this.datepipe.transform(
    Constants.CODES_DEF_DATE_FROM, Constants.DATE_FORMAT_IN_ECL_TABLE);
  dateTo: string = this.datepipe.transform(
    Constants.CODES_DEF_DATE_TO, Constants.DATE_FORMAT_IN_ECL_TABLE);;
  category: number;
  revenueFrom: string;
  revenueTo: string;
  pos: any[];
  bwDeny: boolean = false;
  override: boolean = false;
  icd: boolean = false;
  action: string = null;
  codeId: number = null;
  originalCodeId: number = null;

  yearValidRange = `${Constants.EFT_MIN_VALID_YEAR}:${Constants.EFT_MAX_VALID_YEAR}`;
  dateFormat: string = Constants.DATE_FORMAT;


  templateColumnsConstant: any = EclColumn;

  cols: any;
  modifyAllOption = "*";
  posAllOption = "%"
  modifierCode = "* - All Applicable";
  disableRangeCodes: boolean = false;

  constructor(private utils: AppUtils, private datepipe: DatePipe,
    private toastService: ToastMessageService) { }

  ngOnInit() {
  }

  clearData() {
    this.codeRangeFrom = '';
    this.codeRangeTo = '';
    this.modifier = null;
    this.daysLo = null;
    this.daysHi = null;
    this.dateFrom = this.datepipe.transform(
        Constants.CODES_DEF_DATE_FROM, Constants.DATE_FORMAT_IN_ECL_TABLE);
    this.dateTo = this.datepipe.transform(
      Constants.CODES_DEF_DATE_TO, Constants.DATE_FORMAT_IN_ECL_TABLE);;
    this.revenueFrom = null;
    this.revenueTo = null;
    this.pos = null;
    this.category = null;
    this.icd = false;
    this.bwDeny = false;
    this.override = false;
    this.action = null;
    this.codeId = null;
    this.originalCodeId = null;
  }

  populateInputsWithRowData(_rowToEdit: RuleCodeDto) {
    this.codeRangeFrom = _rowToEdit.codeRangeFrom;
    this.codeRangeTo = _rowToEdit.codeRangeTo;

    // If codes are retired then we do not let the user edit code range.
    if (_rowToEdit.isCodeRangeFromRetired === "Y" || _rowToEdit.isCodeRangeToRetired === "Y" ) {
      this.disableRangeCodes =  true;
    } else {
      this.disableRangeCodes = false;
    }

    this.modifier = this.getModifierFromSelectedItems(this.modifierOptions, _rowToEdit.modifier);
    this.daysLo = _rowToEdit.daysLo;
    this.daysHi = _rowToEdit.daysHi;

    this.dateFrom = this.datepipe.transform(_rowToEdit.dateFrom, 'MM/dd/yyyy');
    this.dateTo = this.datepipe.transform(_rowToEdit.dateTo, 'MM/dd/yyyy');
    this.pos = this.getSelectedValuesFromLabels(this.posOptions, _rowToEdit.posJoiner);
    this.category = this.getProcCategoryFromId(_rowToEdit.category);
    this.icd = this.getCheckboxStatusFromId(_rowToEdit.icd);
    this.bwDeny = this.getCheckboxStatusFromId(_rowToEdit.bwDeny);
    this.override = this.getCheckboxStatusFromId(_rowToEdit.override);
    this.codeId = _rowToEdit.codeId;
    this.originalCodeId = _rowToEdit.originalCodeId;
    this.action = 'edit';

    this.revenueFrom = _rowToEdit.revenueCodeFrom;
    this.revenueTo = _rowToEdit.revenueCodeTo;

  }

  getRevenueDescriptionFromId(id: string) {
    if(id) {
      let rev = this.revenueCodeOptions.find(rev => rev.value == id);
      if(rev != null) {
        return rev.label;
      }
    }
  }

  getProcCategoryFromId(id: number) {
    if (id) {
      let cat = this._procTypeOptions.find(cat => cat.value == id);
      if (cat != null) {
        return cat.value;
      }
    }
  }

  getSelectedValuesFromLabels(optionList: any, labels: string) {
    if (!labels) {
      return [];
    }
    let newArr = [];
    const descs:string[] = labels.split(",");
    descs.forEach(c => {
      c = c.trim();
      let obj = optionList.find(pos => pos.label === c);
      if (obj) {
        newArr.push(obj.value);
      }
      else if(c.startsWith(this.posAllOption)){
        //Transform option '%' to '% - All Applicable'
        obj = optionList.find(pos => pos.label.startsWith(this.posAllOption));
        if(obj){
          newArr.push(obj.value);
        }
      }
    })
    return newArr
  }

  getSelectedCodeFromModifier(optionList: any, selectedModifierList: any) {
    if (selectedModifierList) {
      let newArr = [];
      let obj;
      selectedModifierList.forEach((mod) => {
        //Transform '* - All Applicable' to '*'
        if(mod.modifierCode.startsWith(this.modifyAllOption)){
          newArr=[this.modifyAllOption];
        }
        else{
          obj = optionList.find(item => item.value == mod);
          if (obj != null) {
            newArr.push(obj.label);
          }
        }
      });
      return newArr;
    }
  }

  getModifierFromSelectedItems(optionList: any, selectedModifierList: any) {       
    let allModifier = {
      modifierCode: this.modifierCode,
      modifierDesc: "ALL MODIFIERS"
    }
    if (selectedModifierList) {
      let newArr = [];
      let obj;
      selectedModifierList.forEach((mod) => {
        obj = optionList.find(item => item.label == mod);
        if (obj != null) {
          newArr.push(obj.value);
        }
        //Transform '*' to '* - All Applicable'
        else if (mod===this.modifyAllOption){ 
          newArr=[];       
          newArr.push(allModifier);
        }
      });
      return newArr;
    }
  }

  getCheckboxStatusFromId(status: string) {
    return status == 'Y';
  }

  getIdFromBoolean(status: boolean) {
    return status ? 'Y' : 'N';
  }

  validateInfo() {

    if (this.tabType === 'copyPaste') {
      let procCodeDto = new RuleCodeDto();
      this.fetchCommonFields(procCodeDto);
      this.disableRangeCodes = false;
      this.addRowToCodes.emit({ type: 'copy', data: procCodeDto });
    } else {
      if (this.codeRangeFrom) {
        let procCodeDto = new RuleCodeDto();
        this.fetchCommonFields(procCodeDto);
        procCodeDto.codeRangeFrom = this.codeRangeFrom.toUpperCase();
        procCodeDto.codeRangeTo = this.codeRangeTo;
        if (procCodeDto.codeRangeTo == null || procCodeDto.codeRangeTo == '') {
          procCodeDto.codeRangeTo = procCodeDto.codeRangeFrom;
        }
        procCodeDto.codeRangeTo = procCodeDto.codeRangeTo.toUpperCase();
        procCodeDto.action = this.action;
        procCodeDto.codeId = this.codeId;
        procCodeDto.originalCodeId = this.originalCodeId;
        

        if (procCodeDto != null) {
          this.disableRangeCodes = false;
          this.addRowToCodes.emit({ type: 'individually', data: procCodeDto });
        }
        else {
          this.toastService.messageError(Constants.TOAST_SUMMARY_ERROR, 'Please enter a value in HCPCS/CPT from field');
        }
      } else {
        this.toastService.messageError(Constants.TOAST_SUMMARY_ERROR, 'Please enter a value in HCPCS/CPT from field');
      }
    }
    this._rowToEdit = null;
  }

  fetchCommonFields(procCodeDto: RuleCodeDto) {
    procCodeDto.ruleId = this.ruleInfo.ruleId;
    procCodeDto.modifier = this.getSelectedCodeFromModifier(this.modifierOptions, this.modifier);
    procCodeDto.daysLo = this.daysLo;
    procCodeDto.daysHi = this.daysHi;
    procCodeDto.dateFrom = this.datepipe.transform(this.dateFrom, 'MM-dd-yyyy');
    procCodeDto.dateTo = this.datepipe.transform(this.dateTo, 'MM-dd-yyyy');
    if (this.category != 0)
      procCodeDto.category = this.category;
    procCodeDto.icd = this.getIdFromBoolean(this.icd);
    procCodeDto.bwDeny = this.getIdFromBoolean(this.bwDeny);
    procCodeDto.override = this.getIdFromBoolean(this.override);
    procCodeDto.pos = this.pos && this.pos.length ? this.pos : null;

    let revenueFrom = this.revenueFrom != null ? this.revenueFrom.split('-')[0] : '';
    let revenueTo = this.revenueTo != null ? this.revenueTo.split('-')[0] : '';
    let revenueFromDesc = this.getRevenueDescriptionFromId(this.revenueFrom);
    let revenueToDesc = this.getRevenueDescriptionFromId(this.revenueTo);
    
    if(revenueFromDesc != null) {
      if(revenueFromDesc.includes('-')) {
        revenueFromDesc = revenueFromDesc.split('-').slice(1).join('-');
      }
    }

    if(revenueToDesc != null) {
      if(revenueToDesc.includes('-')) {
        revenueToDesc = revenueToDesc.split('-').slice(1).join('-');
      }
    }

    procCodeDto.revenueCodeFrom = revenueFrom;
    procCodeDto.revenueCodeTo = revenueTo;
    procCodeDto.revenueCodeDescFrom = revenueFromDesc;
    procCodeDto.revenueCodeDescTo = revenueToDesc;

  }

  hideRangeField() {
    if (this.tabType === 'copyPaste') {
      return false;
    } else {
      return true;
    }
  }

  /**
   * This method will be remove all the values as long as there is '*' as selected element.
   * @param $event 
   */
  onChangeMultiSelectModifiers() {
    this.modifier.forEach(item => {     
      if (item.modifierCode === this.modifierCode) {
        this.modifier = [];
        this.modifier.push(item);
      }
    });
  }

  /**
   * This method will be remove all the values as long as there is '%' as selected element.
   * @param $event 
   */
  onChangeMultSelectPos() {    
    let allOption = this.posOptions.filter(v => v.label.startsWith(this.posAllOption))[0].value;
    this.pos.forEach(item => {
      if (item == allOption) {
        this.pos = [];
        this.pos.push(item);
      }
    });
  }
}
