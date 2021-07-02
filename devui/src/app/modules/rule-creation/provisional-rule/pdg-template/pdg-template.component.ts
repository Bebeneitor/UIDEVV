import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { PdgTemplateService } from 'src/app/services/pdg-template.service';
import { ReferenceService } from 'src/app/services/reference.service';
import { RuleNotesService } from 'src/app/services/rule-notes.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { Constants } from 'src/app/shared/models/constants';
import { EclReferenceDto } from 'src/app/shared/models/dto/ecl-reference-dto';
import { PdgTemplateDto } from 'src/app/shared/models/dto/pdg-dto';
import { PdgTemplateDownloadDto } from 'src/app/shared/models/dto/pdg-preview-dto';
import { ReferenceInfoDto } from 'src/app/shared/models/dto/reference-info-dto';
import { RuleNoteTabDto } from 'src/app/shared/models/dto/rule-notetab-dto';
import { EclFileDto } from 'src/app/shared/models/ecl-file';
import { EclReference } from 'src/app/shared/models/ecl-reference';
import { RuleInfo } from 'src/app/shared/models/rule-info';
import { RuleNotes } from 'src/app/shared/models/rule-notes';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';
import { isArray } from 'util';
import { TemplateNroHPPComponent } from './template-nro-hpp/template-nro-hpp.component';
import { PdgConstants } from './pdg-constants';
import { PdgUtil } from './pdg-util';
import { PdgReferenceInfoDto } from 'src/app/shared/models/dto/pdg-reference-dto';

//Local constants
const SUCCESS = "Success";

@Component({
  selector: 'app-pdg-template',
  templateUrl: './pdg-template.component.html',
  styleUrls: ['./pdg-template.component.css']
})
export class PdgTemplateComponent implements OnInit {
  _ruleInfo: RuleInfo;
  eclRefArr: EclReferenceDto[] = [];
  enablePreview : boolean = false;
  isPreviewEnabled :boolean = false;

  @Output() messageSend =  new EventEmitter<any>(); 
  @Output() stateChanged =  new EventEmitter<any>();  
  @Output() claimTypeChanged =  new EventEmitter<any>(); 
  pdgTemplateDto: PdgTemplateDto = new PdgTemplateDto();
  @Input() set ruleInfo(value: RuleInfo) {
    if (value) {
      this._ruleInfo = value;
      this.getRuleStage();
      if (!this._ruleInfo.pdgTemplateDto) {
        let dto: PdgTemplateDto = new PdgTemplateDto();
        this._ruleInfo.pdgTemplateDto = dto;
        this.enablePreview = false;
      } else if (this._ruleInfo.pdgTemplateDto.pdgId) {
        this.enablePreview = true;
      }
      this.pdgOptions.forEach(elem => {
        if (elem.value === 'preview' && !this.enablePreview) {
          elem.disabled = true;
        } else {
          elem.disabled = false;
        }
      });
      if (!this._ruleInfo.pdgTemplateDto.pdgType)
        this._ruleInfo.pdgTemplateDto.pdgType = 'NRO';

      if (this._ruleInfo.claimsType)
        this.pdgTemplateObj.claimTypesSelection = this._ruleInfo.claimsType.map(claim => claim.claimType.lookupId);

      if (this._ruleInfo.ruleId) {
        this.loadNotesTabData();
        if (this.isSavingFiles) {
          this.assignToRuleInfo();
          this.isSavingFiles = false;
        } else {
          this.clearAllAddedFiles();
          this.getPdgFiles();
        }
        if (this._ruleInfo.pdgTemplateDto.pdgId) {
          if (this._ruleInfo.pdgTemplateDto.pdgType == 'NRO') {
            this.disableNro = false;
            this.disableHpp = true;
          } else if (this._ruleInfo.pdgTemplateDto.pdgType == 'HPP') {
            this.disableNro = true;
            this.disableHpp = false;
          }
        }

      } else {
        this._ruleInfo.pdgTemplateDto.notes.ruleNotesDto = new RuleNotes();
      }
    }
  }
  @Input() fromMaintenanceProcess: boolean = false;
  @Input() provDialogDisable: boolean;
  @Input() selectedStates: any[] = [];

  isSavingReference: boolean = false;
  _selectedReferences: any[] = [];
  @Input() set selectedReferences(refData: any[]) {
    if (!this.isSavingReference) {
      this._selectedReferences = [];
      if (refData.length > 0) {
        let inactiveStatusCount: number = 0;
        refData.map((ref: EclReference, index: number) => {
          if (ref.statusId === 1) {
            this.eclReferenceService.getEclReference(ref.eclReferenceId).subscribe(response => {
              if (response.message === SUCCESS) {
                let refDto: EclReferenceDto = response.data;
                refDto.user = this.pdgTemplateService.getUserId();
                this._selectedReferences.push(refDto);
                if (refData.length === this._selectedReferences.length + inactiveStatusCount) {
                  this.setReferenceListOrder();
                }
              }
            });
          } else {
            inactiveStatusCount++;
          }
          if (inactiveStatusCount === refData.length) {
            this._selectedReferences = [];
            this.addEmptyRefTab();
          }
        })
      } else {
        this._selectedReferences = [];
        this.addEmptyRefTab();
      }
    }
  }
  @Input() optionLobs: any[] = [];
  @Input() optionStates: any[] = [];

  disabledView: boolean = false;
  @Input() ruleId: number;
  @Input() ruleCreationStatus: boolean;
  @ViewChild(TemplateNroHPPComponent,{static: true}) templateData: TemplateNroHPPComponent;

  getStates(): any[] {
    return this.templateData ? this.templateData.selectedStates : [];
  }

  pdgOptions: SelectItem[] = [{ label: "Select Option", value: '' },
  { label: "PDG Medicaid Template", value: 'template' },
  { label: "Final Preview", value: 'preview'}];

  refSourceOpts: SelectItem[] = [{ label: "Select Reference Source", value: { id: 0, name: '' } }];

  selectedPdgOption: any = 'template';
  response: boolean = false;
  ruleNoteTabData: RuleNoteTabDto;
  addedItuFiles: EclFileDto[];
  addedCptFiles: EclFileDto[];
  addedClientGridFiles: EclFileDto[];
  addedCodeCovFiles: EclFileDto[];
  addedClaimTypeFiles: EclFileDto[];
  addedSubRuleDosFiles: EclFileDto[];
  addedOtherInfoFiles: EclFileDto[];

  stage: number;
  pdgTemplateObj: any = {
    claimTypesSelection: [] = []
  };
  claimTypesOpts: any[] = [];
  cvCodeOpts: any[] = [];
  reasonCodeOpts: any[] = [{ label: "Select...", value: null }];
  industryUpdateOpts: any[] = [{ label: "Select...", value: null }];
  refTitleOpts: any = {
    primaryTitleOpts: [] = [],
    secondaryTitleOpts: [] = []
  }
  disableNro: boolean = false;
  disableHpp: boolean = false;
  isSavingFiles: boolean = false;
  previewRuleInfo : PdgTemplateDownloadDto;


  constructor(private pdgTemplateService: PdgTemplateService,
    private fileManagerService: FileManagerService,
    private ruleNoteService: RuleNotesService, private eclReferenceService: ReferenceService,
    private toastService: ToastMessageService, private pdgUtil: PdgUtil) { }


  ngOnInit() {
    this.isPreviewEnabled = false;
    this.pdgTemplateService.getRefSourceOptions(this.refSourceOpts).then(res => {
      this.refSourceOpts = [ ...this.refSourceOpts]
    });
    this.pdgTemplateService.getClaimTypeOptions(this.claimTypesOpts).then(res => {
      this.claimTypesOpts = [ ...this.claimTypesOpts]
    });
    this.pdgTemplateService.getCvCodeOptions(this.cvCodeOpts).then(res => {
      this.cvCodeOpts = [ ...this.cvCodeOpts];
    });
    this.pdgTemplateService.getReasonCodeOptions(this.reasonCodeOpts).then(res => {
      this.reasonCodeOpts = [ ...this.reasonCodeOpts]
    });
    this.pdgTemplateService.getIndustryUpdateOptions(this.industryUpdateOpts).then(res => {
      this.industryUpdateOpts = [ ...this.industryUpdateOpts]
    });
    this.pdgTemplateService.getRefTitleOptions(this.refTitleOpts).then(dest => {
      this.refTitleOpts.primaryTitleOpts = JSON.parse(JSON.stringify(dest));
      this.refTitleOpts.secondaryTitleOpts = JSON.parse(JSON.stringify(dest));
      this.refTitleOpts = { ...this.refTitleOpts };
    });
  }

  saveRefAttachments(ruleId, isSubmit: boolean = false): Promise<void> {
    this.isSavingFiles = true;
    return new Promise<void>((resolve,reject) => {
      if (isArray(ruleId)) {
        ruleId = ruleId[0];
      }
      this.setAttachedFiles(this.templateData);
      forkJoin([this.saveAllReferences(ruleId),
      this.uploadFile(this.addedClientGridFiles, PdgConstants.CLIENTGRID_FILES, ruleId),
      this.uploadFile(this.addedCptFiles, PdgConstants.CPT_FILES, ruleId),
      this.uploadFile(this.addedItuFiles, PdgConstants.ITU_FILES, ruleId),
      this.uploadFile(this.addedClaimTypeFiles, PdgConstants.CLAIM_FILES, ruleId),
      this.uploadFile(this.addedCodeCovFiles, PdgConstants.CODE_FILES, ruleId),
      this.uploadFile(this.addedOtherInfoFiles, PdgConstants.OTHER_FILES, ruleId),
      this.uploadFile(this.addedSubRuleDosFiles, PdgConstants.DOS_FILES, ruleId),]).subscribe(resp => {
        this.clearAllAddedFiles();
        if(!isSubmit){
          this.getPdgFiles();
        }
        resolve();
      }, err => {
        console.error(PdgConstants.ERROR_SAVING_REFS_ATTACHS + "-->", err)
        this.toastService.messageError('error', PdgConstants.ERROR_SAVING_REFS_ATTACHS, 3000, true);
        this.getPdgFiles();
        reject();
      });
    });
  }

  uploadFile(files: any[], fileCategory, ruleId) {
    if (files && files.length > 0) {
      return this.fileManagerService.uploadPdgFiles(files, fileCategory, ruleId);
    } else {
      return of([]);
    }
  }

  setReferenceListOrder(){
    this._selectedReferences.sort((a, b) => a.eclReferenceId < b.eclReferenceId ? -1 : a.eclReferenceId > b.eclReferenceId ? 1 : 0);
    this._selectedReferences = [ ...this._selectedReferences];
  }

  clearData() {
    if (this._ruleInfo.pdgTemplateDto.pdgType == 'NRO') {
      //clear all HPP fields
      this.clearHppData();
    }
  }

  clearAllAddedFiles() {
    this.addedItuFiles = [];
    this.addedCptFiles = [];
    this.addedClaimTypeFiles = [];
    this.addedCodeCovFiles = [];
    this.addedClientGridFiles = [];
    this.addedOtherInfoFiles = [];
    this.addedSubRuleDosFiles = [];
    this.templateData.addedItuFiles = [];
    this.templateData.addedCptFiles = [];
    this.templateData.addedClaimTypeFiles = [];
    this.templateData.addedCodeCovFiles = [];
    this.templateData.addedClientGridFiles = [];
    this.templateData.addedOtherInfoFiles = [];
    this.templateData.addedSubRuleDosFiles = [];

  }

  clearHppData() {
    this._ruleInfo.pdgTemplateDto.hppMr = null;
    this._ruleInfo.pdgTemplateDto.hppRuleDesc = null;
    this._ruleInfo.pdgTemplateDto.revisions = null;
  }

  getRuleStage() {
    if (this.fromMaintenanceProcess) {
      this.stage = Constants.ECL_LIBRARY_STAGE;
    } else {
      this.stage = Constants.ECL_PROVISIONAL_STAGE;
    }
  }

  addEmptyRefTab() {
    if (this._selectedReferences.length == 0) {
      let refDto = new EclReferenceDto();
      refDto.user = this.pdgTemplateService.getUserId();
      refDto.ruleId = this._ruleInfo.ruleId;
      refDto.eclStage = this.stage;

      let refInfo = new ReferenceInfoDto();
      refInfo.referenceTitle = '';
      refInfo.pdgRefDto = new PdgReferenceInfoDto();
      refInfo.refSource = { refSourceId: '' }
      refDto.refInfo = refInfo;

      this._selectedReferences.push(refDto);
    }
  }

  getPdgFiles() {
    this.fileManagerService.getAllPdgFiles(this._ruleInfo.ruleId).subscribe((filesData: any) => {
      let files = filesData.data;
      this.pdgTemplateDto.ituFiles = files.filter(attachment => attachment.fileType == PdgConstants.ITU_FILES);
      this.pdgTemplateDto.cptDistrFiles = files.filter(attachment => attachment.fileType == PdgConstants.CPT_FILES);
      this.pdgTemplateDto.claimTypeFiles = files.filter(attachment => attachment.fileType == PdgConstants.CLAIM_FILES);
      this.pdgTemplateDto.codeCoverageFiles = files.filter(attachment => attachment.fileType == PdgConstants.CODE_FILES);
      this.pdgTemplateDto.clientGridFiles = files.filter(attachment => attachment.fileType == PdgConstants.CLIENTGRID_FILES);
      this.pdgTemplateDto.otherInfoFiles = files.filter(attachment => attachment.fileType == PdgConstants.OTHER_FILES);
      this.pdgTemplateDto.subRuleDosFiles = files.filter(attachment => attachment.fileType == PdgConstants.DOS_FILES);
      this.assignToRuleInfo();
    });
  }

  loadNotesTabData() {
    this.ruleNoteTabData = new RuleNoteTabDto();
    this.ruleNoteTabData.ruleNotesDto = new RuleNotes();
    this.ruleNoteTabData.newCommentsDto = null;
    this.ruleNoteService.getRuleNotes(this._ruleInfo.ruleId).subscribe((resp: any) => {
      if (resp && resp.data) {
        this.ruleNoteTabData = resp.data;
        if (this.ruleNoteTabData.ruleNotesDto == null) {
          this.ruleNoteTabData.ruleNotesDto = new RuleNotes();
          this.ruleNoteTabData.ruleNotesDto.ruleId = this._ruleInfo.ruleId;
        }
        this._ruleInfo.pdgTemplateDto.notes = this.ruleNoteTabData;
      }

    });
  }

  assignToRuleInfo(){
    this._ruleInfo.pdgTemplateDto.ituFiles = this.pdgTemplateDto.ituFiles;
    this._ruleInfo.pdgTemplateDto.cptDistrFiles = this.pdgTemplateDto.cptDistrFiles;
    this._ruleInfo.pdgTemplateDto.claimTypeFiles = this.pdgTemplateDto.claimTypeFiles;
    this._ruleInfo.pdgTemplateDto.codeCoverageFiles = this.pdgTemplateDto.codeCoverageFiles;
    this._ruleInfo.pdgTemplateDto.clientGridFiles = this.pdgTemplateDto.clientGridFiles;
    this._ruleInfo.pdgTemplateDto.otherInfoFiles = this.pdgTemplateDto.otherInfoFiles;
    this._ruleInfo.pdgTemplateDto.subRuleDosFiles = this.pdgTemplateDto.subRuleDosFiles;

  }


  getSaveValidateMessagePdg(): string {
    let res: string = null;
    let pdgTemplateDto: PdgTemplateDto = this._ruleInfo.pdgTemplateDto;
    if (pdgTemplateDto) {
      let selReferences: any[] = this.templateData.getSelectedRefList();
      selReferences.forEach((referenceObj) => {
        if (this.pdgUtil.isValidRef(referenceObj)) {
          if (this.pdgUtil.isRefExists(referenceObj)) {
            if (!this.pdgUtil.validateReferenceUrl(referenceObj.refInfo.referenceURL)) {
              res = PdgConstants.VALID_REFURL;
            }
          } else {
            res = PdgConstants.FILL_STATEREF_FIELDS_MANDATORY;
          }
        } else {
          if (selReferences.length == 1 && selReferences[0].eclReferenceId) {
            res = PdgConstants.FILL_STATEREF_FIELDS_MANDATORY;
          }
        }
      });
    }
    return res;
  }

  getValidateMessagePdg(): string {
    let res: string = null;
    let pdgTemplateDto: any = this._ruleInfo.pdgTemplateDto;
    let selReferences: any[] = this.templateData.getSelectedRefList();
    if (pdgTemplateDto) { 
      let text = "";
      if (pdgTemplateDto.pdgType === 'HPP') {
        text = "MSSP ";
        if (!(pdgTemplateDto.hppMr)) {
          res = PdgConstants.HPP_MR_MANDATORY;
        } else if (!(pdgTemplateDto.hppRuleDesc)) {
          res = PdgConstants.HPP_DESCRIPTION_MANDATORY;
        } else if (!(pdgTemplateDto.revisions)) {
          res = PdgConstants.HPP_REVISIONS_MANDATORY;
        }
      }
      if (!res) {
        if (pdgTemplateDto.states && pdgTemplateDto.states.length <= 0) {
          res = PdgConstants.STATE_MANDATORY;
        } else if (!(pdgTemplateDto.codeDesc)) {
          res = PdgConstants.CODE_DESCRIPTION_MANDATORY;
        } else if (this.pdgTemplateObj.claimTypesSelection && this.pdgTemplateObj.claimTypesSelection.length <= 0) {
          res = PdgConstants.CLAIM_TYPE_MANDATORY(text);
        } else if (!pdgTemplateDto.dosFrom) {
          res = PdgConstants.DOS_FROM_MANDATORY;
        } else if (!pdgTemplateDto.dosTo) {
          res = PdgConstants.DOS_TO_MANDATORY;
        } else if (!(pdgTemplateDto.referenceDetails)) {
          res = PdgConstants.REF_DETAILS_MANDATORY(text);
        } else if (!(pdgTemplateDto.primaryReferenceTitle)) {
          res = PdgConstants.PRIM_REFTITLE_MANDATORY;
        } else if (!(pdgTemplateDto.reasonCodeAndDescription)) {
          res = PdgConstants.REASON_CODE_MANDATORY(text);
        } else if (!this._ruleInfo.cvCode) {
          res = PdgConstants.CV_CODE_MANDATORY;
        } else if (!(pdgTemplateDto.industryUpdateRequired)) {
          res = PdgConstants.INDUSTRY_UPD_MANDATORY;
        } else if (!(this._ruleInfo.scriptRationale)) {
          res = PdgConstants.SCRIPT_MANDATORY(text);
        } else if (!(this._ruleInfo.clientRationale)) {
          res = PdgConstants.RATIONALE_MANDATORY(text);
        } else if (selReferences.length <= 0 || (selReferences.length == 1 &&
          !this.pdgUtil.isRefExists(selReferences[0]))) {
          res = PdgConstants.FILL_STATEREF_FIELDS_MANDATORY;
        } else if (this.pdgUtil.validateMandatoryFile(pdgTemplateDto.clientGridFiles, this.templateData.addedClientGridFiles)) {
          res = PdgConstants.CGRID_FILES_MANDATORY;
        } else if (this.pdgUtil.validateMandatoryFile(pdgTemplateDto.cptDistrFiles, this.templateData.addedCptFiles)) {
          res = PdgConstants.CPT_FILES_MANDATORY;
        } else {
          res ? '' : res = this.getSaveValidateMessagePdg();
        }
      }
    } else {
      res = PdgConstants.PDG_FIELDS_MANDATORY;
    }
    return res;
  }

  saveAllReferences(ruleId: any): Promise<void> {
    this.isSavingReference = true;
    this._selectedReferences = this.templateData.getSelectedRefList();
    return new Promise(async (resolve) => {
      if (!this._selectedReferences || (this._selectedReferences && this._selectedReferences.length <= 0)) {
        resolve();
      }
      await this.saveReference(ruleId);
      resolve();
    });
  }
  
  saveReference(ruleId, index: number = 0): Promise<void> {
    return new Promise((resolve) => {
      let pdgTemplateDto: PdgTemplateDto = this._ruleInfo.pdgTemplateDto;
      let referenceObj = this._selectedReferences[index];
      console.log("savereferene=",referenceObj)
      if (this.pdgUtil.isRefExists(referenceObj)) {
        referenceObj.ruleId = ruleId;
        if (pdgTemplateDto.dosFrom) {
          referenceObj.refInfo.refEffectiveFromDt = new Date(pdgTemplateDto.dosFrom);
        }
        if (pdgTemplateDto.dosTo) {
          referenceObj.refInfo.refEffectiveToDt = new Date(pdgTemplateDto.dosTo);
        }
        let refDoc1Files: File[] = null;
        let refDoc2Files: File[] = null;
        let refComment1Files: File[] = null;
        let refComment2Files: File[] = null;
        let refParam: any = {
          referenceObj, refDoc1Files, refDoc2Files, refComment1Files, refComment2Files
        };
        this.pdgUtil.setReferenceObject(refParam);
        this.eclReferenceService.saveEclReference(refParam.referenceObj, null, refParam.refDoc1Files, refParam.refDoc2Files,
          refParam.refComment1Files, refParam.refComment2Files).subscribe(async response => {
            if (response !== null && response !== undefined && response.data !== null) {
              this._selectedReferences[index] = response.data;
              index++;
              if (this._selectedReferences.length > index) {
                await this.saveReference(ruleId, index);
              }
            } else {
              this.toastService.messageWarning('warn', PdgConstants.ERROR_SAVING_REFS, 3000, true);
            }
            resolve();
          }, async () => {
            console.error("Error saving reference =", refParam)
            index++;
            if (this._selectedReferences.length > index) {
              await this.saveReference(ruleId, index);
            }
            resolve();
          });
      } else {
        if (this._selectedReferences.length === (index + 1)) {
          resolve();
        }
      }
    });
  }

  setAttachedFiles(compData: any) {
    this.addedClaimTypeFiles = compData.addedClaimTypeFiles;
    this.addedClientGridFiles = compData.addedClientGridFiles;
    this.addedCodeCovFiles = compData.addedCodeCovFiles;
    this.addedCptFiles = compData.addedCptFiles;
    this.addedItuFiles = compData.addedItuFiles;
    this.addedOtherInfoFiles = compData.addedOtherInfoFiles;
    this.addedSubRuleDosFiles = compData.addedSubRuleDosFiles;
  }

  onStateChanged(event) {
    this.stateChanged.emit(event);
  }

  onClaimTypeChanged(event) {
    this.claimTypeChanged.emit(event);
  }

  pdgOptionChanged(event) {
    if (this.selectedPdgOption == 'preview') {      
      this.pdgTemplateService.getPdgPreviewInfo(this._ruleInfo.ruleId).subscribe((resp :any) => {
          this.previewRuleInfo = resp.data;
          this.isPreviewEnabled = true;
      });

    } else {
      this.isPreviewEnabled = false;
    }
  }

  messageRecieve(message) {
    this.messageSend.emit(message);
  }

  setIndustryUpdate(states) {
    this.templateData.setIndustryUpdate(states);
  }
}
