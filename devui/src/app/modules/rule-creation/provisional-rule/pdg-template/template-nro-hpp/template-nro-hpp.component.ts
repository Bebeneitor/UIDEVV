import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Constants } from 'src/app/shared/models/constants';
import { EclFileDto } from 'src/app/shared/models/ecl-file';
import { PdgConstants } from '../pdg-constants';
import { PdgUtil } from '../pdg-util';
import { ReferenceComponent } from '../reference/reference.component';
import { PdgTemplateService } from 'src/app/services/pdg-template.service';

const MIN_HEIGHT_OFFSET = 2; 
enum TEXTAREA {
  codeDesc = 'codeDesc', notes = 'notes', ruleLogic ='ruleLogic', msspRevisions= 'msspRevisions'
}

@Component({
  selector: 'app-template-nro-hpp',
  templateUrl: './template-nro-hpp.component.html',
  styleUrls: ['./template-nro-hpp.component.css']
})
export class TemplateNroHPPComponent implements OnInit {
  
  @Output() messageSend = new EventEmitter<any>();
  @Input("_pdgOption") pdgOption: any;
  @Input() provDialogDisable: boolean;
  @Output() claimTypeChanged =  new EventEmitter<any>();  

  tempPdgCode: any;
  toolTips: any = {
    selectedClaimTypesToolTip: '',
    selectedRCodeToolTip: '',
    selectedStateToolTip: ''
  };
  
  textAreaType = TEXTAREA;

  _ruleInfo: any = null;
  @Input() set ruleInfo(data: any) {
    if (data) {
      this._ruleInfo = data;
      if (!this._ruleInfo.pdgTemplateDto.dosFrom) {
        this._ruleInfo.pdgTemplateDto.dosFrom = Constants.DEFAULT_DATE_FROM;
      }
      if (!this._ruleInfo.pdgTemplateDto.dosTo) {
        this._ruleInfo.pdgTemplateDto.dosTo = Constants.DEFAULT_DATE_TO;
      }
      this.dosFrom = this.getDateFromString(this._ruleInfo.pdgTemplateDto.dosFrom);
      this.dosTo = this.getDateFromString(this._ruleInfo.pdgTemplateDto.dosTo);
      this.toolTips.selectedClaimTypesToolTip = '';
      this.toolTips.selectedRCodeToolTip = '';
      this.toolTips.selectedStatesTooltip = '';
      this.cvCodeSelected = this.pdgUtil.setCVCode(this._optionCvCodes, this._ruleInfo);
      this.pdgUtil.setClaimType(this.pdgTemplateObj, this._optionClaimTypes, this.toolTips);
      this.reasonCodeSelected = this.pdgUtil.setReasonCode(this._optionReasonCodes, this._ruleInfo, this.toolTips)
      this.industryUpdateSelected = this.pdgUtil.setIndustryUpdateReq(this._optionIndustryUpdate, this._ruleInfo);
      if (this._selectedStates && this._selectedStates.length > 0 && !this.industryUpdateSelected ) {
        this.industryUpdateSelected = this.pdgUtil.getIndUpdateFromState(this._selectedStates, this._optionIndustryUpdate);
      }
      if (!this._ruleInfo.pdgTemplateDto.industryUpdateRequired) {
        this._ruleInfo.pdgTemplateDto.industryUpdateRequired = this.industryUpdateSelected;
      }      
      this.pdgUtil.setStateToolTip(this._selectedStates, this.optionStates, this.toolTips);
    }
    
  }

  _refSourceOpts: any;
  @Input() set refSourceOpts(opts: any[]) {
    if (opts) {
      this._refSourceOpts = opts;
    }
  }

  @Input() optionStates: any[] = [];
  _selectedStates: any[] = [];
  @Input() set selectedStates(states: any[]) {
    this._selectedStates = states;
    this.pdgUtil.setStateToolTip(this._selectedStates, this.optionStates, this.toolTips);
    if (this._selectedStates && this._selectedStates.length > 0 && !this._ruleInfo.pdgTemplateDto.industryUpdateRequired) {
      let ind:any = this.pdgUtil.getIndUpdateFromState(this._selectedStates, this._optionIndustryUpdate);
      ind ? this.industryUpdateSelected = ind : '';
      this._ruleInfo.pdgTemplateDto.industryUpdateRequired = ind;
    }
  }

  _optionClaimTypes: any[] = [];
  @Input() set optionClaimTypes(opts: any[]) {
    this._optionClaimTypes = opts;
    this.pdgUtil.setClaimType(this.pdgTemplateObj, this._optionClaimTypes, this.toolTips);
  }

  cvCodeSelected: any;
  _optionCvCodes: any[] = [];
  @Input() set optionCvCodes(options: any[]) {
    this._optionCvCodes = options;
    this.cvCodeSelected = this.pdgUtil.setCVCode(this._optionCvCodes, this._ruleInfo);
  }

  reasonCodeSelected: any;
  _optionReasonCodes: any[] = [];
  @Input() set optionReasonCodes(options: any[]) {
    this._optionReasonCodes = options;
    this.reasonCodeSelected = this.pdgUtil.setReasonCode(this._optionReasonCodes, this._ruleInfo, this.toolTips)
  }

  industryUpdateSelected: any;
  _optionIndustryUpdate: any[] = []
  @Input() set optionIndustryUpdate(options: any[]) {
    this._optionIndustryUpdate = options;
    this.industryUpdateSelected = this.pdgUtil.setIndustryUpdateReq(this._optionIndustryUpdate, this._ruleInfo);
    if (this._selectedStates && !this.industryUpdateSelected && !this._ruleInfo.pdgTemplateDto.industryUpdateRequired) {
      let ind: any = this.pdgUtil.getIndUpdateFromState(this._selectedStates, this._optionIndustryUpdate);
      ind ? this.industryUpdateSelected = ind : '';
      this._ruleInfo.pdgTemplateDto.industryUpdateRequired = this.industryUpdateSelected;
    }
  }
  @Input() optionRefTitle: any[] = [];

  _selectedReferences: any[] = [];
  @Input() set selectedReferences(refData: any[]) {
    this._selectedReferences = refData;
  }

  @Input() stage: number;
  @Input() pdgTemplateObj: any;
  @Output() stateChanged =  new EventEmitter<any>();  
  _pdgType : string;
  @Input() set pdgType (data:string) { 
    this._pdgType = data;
    if (data == 'HPP') {
      this.isHpp = true;
      this.heading = 'MSSP ';
    } else {
      this.isHpp = false;
      this.heading = '';
    }

  }

  dosFrom: Date;
  dosTo: Date;
  yearValidRange = `${Constants.PR_CODE_MIN_VALID_YEAR}:${Constants.PR_CODE_MAX_VALID_YEAR}`;
  disabled: boolean = true;
  expandRuleLogic: boolean = false;
  expandSubRuleNotes: boolean = false;
  expandCodeDesc: boolean = false;
  expandRevision: boolean = false;
  claimTypesSelection: any;
  addedClientGridFiles: EclFileDto[];
  addedCodeCovFiles: EclFileDto[];
  addedClaimTypeFiles: EclFileDto[];
  addedSubRuleDosFiles: EclFileDto[];
  addedOtherInfoFiles: EclFileDto[];
  addedItuFiles: EclFileDto[];
  addedCptFiles: EclFileDto[];
  literals : any = PdgConstants;  
  isHpp : boolean = false;
  heading : string = '';  
  headingLabels : any = PdgConstants;
  

  @ViewChild(ReferenceComponent,{static: false}) refData: ReferenceComponent;

  constructor(private pdgTemplateService: PdgTemplateService, private pdgUtil: PdgUtil) { }

  ngOnInit() {
    this.addedClientGridFiles = [];
    this.addedCodeCovFiles = [];
    this.addedClaimTypeFiles = [];
    this.addedSubRuleDosFiles = [];
    this.addedOtherInfoFiles = [];
    this.addedItuFiles = [];
    this.addedCptFiles = [];
    this.toolTips.selectedClaimTypesToolTip = '';
    this.toolTips.selectedLobToolTip = '';
    this.toolTips.selectedRCodeToolTip = '';
    this.toolTips.selectedStatesTooltip = '';
    this.pdgUtil.setDefaultValueForDuplicateCheck(this._ruleInfo);
    !this._ruleInfo.pdgTemplateDto.industryUpdateRequired? this._ruleInfo.pdgTemplateDto.industryUpdateRequired = this.industryUpdateSelected: '';
  }

  findIdByLabel(label: string, arr: any[]): string {
    let id = null;
    arr.filter(item => {
      return item.label === label;
    }).map(item => {
      id = item.value;
    })
    return id;
  }


  getDateFromString(dateStr: any) {
    if (dateStr)
      return new Date(dateStr);
    return null;
  }

  getSelectedRefList() {
    return this.refData.referenceList;
  }

  onStateSelection() {
    this.pdgUtil.setStateToolTip(this._selectedStates, this.optionStates, this.toolTips);
    this.industryUpdateSelected = this.pdgUtil.getIndUpdateFromState(this._selectedStates,this._optionIndustryUpdate);
    this.stateChanged.emit(this._selectedStates);
  }

  setIndustryUpdate(states) {
    this.industryUpdateSelected = this.pdgUtil.getIndUpdateFromState(states,this._optionIndustryUpdate);
    this._ruleInfo.pdgTemplateDto.industryUpdateRequired = this.industryUpdateSelected;
  }

  validateCharacterLimit(e: ClipboardEvent, textAreaId: string, value: string) {
    if (textAreaId == 'txtSubRuleNotes') {
      this.messageSend.emit(this.pdgUtil.validatePaste(e, 'Pdg Template', PdgConstants.MAXLEN_4000, value));
    } else if (textAreaId == 'txtCodeDesc'){
      this.messageSend.emit(this.pdgUtil.validatePaste(e, 'Pdg Template', PdgConstants.MAXLEN_32600, value));
    } else {
      this.messageSend.emit(this.pdgUtil.validatePaste(e, 'Pdg Template', PdgConstants.MAXLEN_5000, value));
    }
  }

  getRuleDescription() {
    if (this._ruleInfo.pdgTemplateDto.hppMr) {
      if (this._ruleInfo.pdgTemplateDto.hppMr != '') {
        this.pdgTemplateService.getMidRuleDescription(this._ruleInfo.pdgTemplateDto.hppMr).then(response => {
          if (response !== null && response !== undefined) {
            if (response.data && response.data.ruleDesc)
              this._ruleInfo.pdgTemplateDto.hppRuleDesc = response.data.ruleDesc;
          }
        });
        
      }
    }
  }

  expandTextArea(e: any, type) {
    if (!this.provDialogDisable && e && (e.type == "click" || e.type == "paste" || e.keyCode == Constants.ENTER_KEY_EVENT )) {
      if (type == TEXTAREA.codeDesc) {
        this.expandCodeDesc = true;
      } else if (type == TEXTAREA.ruleLogic) {
        this.expandRuleLogic = true;
      } else if (type == TEXTAREA.notes) {
        this.expandSubRuleNotes = true;
      } else if (type == TEXTAREA.msspRevisions) {
        this.expandRevision = true;
      }
      e.target.style.height = e.target.scrollHeight + MIN_HEIGHT_OFFSET + "px";
    }
  }

}