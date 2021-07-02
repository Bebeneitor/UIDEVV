import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, Input, EventEmitter, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { PdgTemplateService } from 'src/app/services/pdg-template.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { EclReferenceDto } from 'src/app/shared/models/dto/ecl-reference-dto';
import { PdgReferenceInfoDto } from 'src/app/shared/models/dto/pdg-reference-dto';
import { ReferenceInfoDto } from 'src/app/shared/models/dto/reference-info-dto';
import { ReferenceInfo } from 'src/app/shared/models/reference-info';
import { ReferenceSource } from 'src/app/shared/models/reference-source';
import { RuleInfo } from 'src/app/shared/models/rule-info';
import { AppUtils } from 'src/app/shared/services/utils';

@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.css']
})
export class ReferenceComponent implements OnInit, AfterViewChecked {
  @ViewChild('fileUpload',{static: true}) fileUpload: ElementRef;
  @Input() pdgOption: any;

  _provDialogDisable: boolean = false;

  @Input() set provDialogDisable(flag: boolean) {
    this._provDialogDisable = flag;
    if (flag != null) {
      this.disabledView = this._provDialogDisable;
    }
  }

  _ruleInfo: RuleInfo = null;
  @Input()
  get ruleInfo(): RuleInfo { return this._ruleInfo; }
  set ruleInfo(data: RuleInfo) {
    if (data) {
      this._ruleInfo = data;
      this.disabledView = this._provDialogDisable;
    }
  }

  @Input() set refSourceOpts(opts: any[]) {
    if (opts) {
      this.refSources = opts;
      this.referenceList = JSON.parse(JSON.stringify(this.referenceList));
    }
  }

  @Input() set selectedReferences(refData: any[]) {
    if (refData) {
      this.referenceList = refData;
      this.activeIndex = 0;
    }
  }

  @Input() stage: number;
  disabledView: boolean = false;
  refSources: SelectItem[] = [];
  referenceList: any[] = [];
  indexVal: number = 0;
  refIndex: number = 1;
  validationFilesComment1: string[] = [];
  validationFilesComment2: string[] = [];
  validationFilesRefDoc1: string[] = [];
  validationFilesRefDoc2: string[] = [];
  currentReference: EclReferenceDto = null;
  initialLoad: boolean = true;
  userId: number;
  activeIndex: number = 0;
  addedNewPanel: boolean = false;
  showReferenceDisplay: boolean = false;
  indexToRemove: number = -1;
  origRef: any;
  refTabCloseable: boolean = true;

  constructor(private pdgTemplateService: PdgTemplateService, private cdr: ChangeDetectorRef,
    private toastService: ToastMessageService, private appUtils: AppUtils) {
  }

  ngOnInit() {
    this.activeIndex = 0;
    this.userId = this.appUtils.getLoggedUserId();

    if (this.disabledView) {
      this.refTabCloseable = true;
    }
  }

  ngAfterViewChecked() {
    if (this.referenceList.length > 0) {
      if (this.initialLoad) {
        this.currentReference = Object.assign({}, this.referenceList[0]);
        if (this.currentReference.eclReferenceId > 0) {
          this.clearValidationFiles();
          this.setValidationFiles();
          this.initialLoad = false;
        }

      } else {
        if (this.addedNewPanel) {
          this.addedNewPanel = false;
          this.activeIndex = this.referenceList.length - 1;
        }
      }
    }
    this.cdr.detectChanges();
  }

  onCommentFile1Add(newValue) {
    this.validationFilesComment2.push(newValue);
    this.validationFilesRefDoc1.push(newValue);
    this.validationFilesRefDoc2.push(newValue);
  }

  onCommentFile2Add(newValue) {
    this.validationFilesComment1.push(newValue);
    this.validationFilesRefDoc1.push(newValue);
    this.validationFilesRefDoc2.push(newValue);
  }

  onRefDocFile1Add(newValue) {
    this.validationFilesComment1.push(newValue);
    this.validationFilesComment2.push(newValue);
    this.validationFilesRefDoc2.push(newValue);
  }

  onRefDocFile2Add(newValue) {
    this.validationFilesComment1.push(newValue);
    this.validationFilesComment2.push(newValue);
    this.validationFilesRefDoc1.push(newValue);
  }

  onCommentFile1Remove(newValue) {
    this.validationFilesComment2 = this.validationFilesComment2.filter(fname => fname != newValue);
    this.validationFilesRefDoc1 = this.validationFilesRefDoc1.filter(fname => fname != newValue);
    this.validationFilesRefDoc2 = this.validationFilesRefDoc2.filter(fname => fname != newValue);
  }

  onCommentFile2Remove(newValue) {
    this.validationFilesComment1 = this.validationFilesComment1.filter(fname => fname != newValue);
    this.validationFilesRefDoc1 = this.validationFilesRefDoc1.filter(fname => fname != newValue);
    this.validationFilesRefDoc2 = this.validationFilesRefDoc2.filter(fname => fname != newValue);
  }

  onRefDocFile1Remove(newValue) {
    this.validationFilesComment1 = this.validationFilesComment1.filter(fname => fname != newValue);
    this.validationFilesComment2 = this.validationFilesComment2.filter(fname => fname != newValue);
    this.validationFilesRefDoc2 = this.validationFilesRefDoc2.filter(fname => fname != newValue);
  }

  onRefDocFile2Remove(newValue) {
    this.validationFilesComment1 = this.validationFilesComment1.filter(fname => fname != newValue);
    this.validationFilesComment2 = this.validationFilesComment2.filter(fname => fname != newValue);
    this.validationFilesRefDoc1 = this.validationFilesRefDoc1.filter(fname => fname != newValue);
  }

  clearValidationFiles() {
    this.validationFilesComment1 = [];
    this.validationFilesComment2 = [];
    this.validationFilesRefDoc1 = [];
    this.validationFilesRefDoc2 = [];
  }



  onTabChange(event) {
    this.activeIndex = event.index;
    this.initialLoad = false;
    let index: number = event.index;
    this.currentReference = this.referenceList[index];
    this.clearValidationFiles();
    this.setValidationFiles();
  }

  setValidationFiles() {
    let fileAttached: string = null;
    if (this.currentReference) {

      if (this.currentReference.commentsFile1) {
        fileAttached = this.currentReference.eclAttachmentList[0].attachmentFileName;
      } else if (this.currentReference.addedCommentFile1) {
        fileAttached = this.currentReference.addedCommentFile1.name;
      }
      if (fileAttached)
        this.onCommentFile1Add(fileAttached);

      fileAttached = null;
      if (this.currentReference.commentsFile2) {
        if (this.currentReference.eclAttachmentList.length > 1) {
          fileAttached = this.currentReference.eclAttachmentList[1].attachmentFileName;
        } else if (this.currentReference.eclAttachmentList.length > 0) {
          fileAttached = this.currentReference.eclAttachmentList[0].attachmentFileName;
        }
      } else if (this.currentReference.addedCommentFile2) {
        fileAttached = this.currentReference.addedCommentFile2.name;
      }
      if (fileAttached)
        this.onCommentFile2Add(fileAttached);


      fileAttached = null;
      if (this.currentReference.refFile1) {
        fileAttached = this.currentReference.refInfo.refDocFileName1;
      } else if (this.currentReference.addedRefDoc1) {
        fileAttached = this.currentReference.addedRefDoc1.name;
      }
      if (fileAttached)
        this.onRefDocFile1Add(fileAttached);

      fileAttached = null;
      if (this.currentReference.refFile2) {
        fileAttached = this.currentReference.refInfo.refDocFileName2;
      } else if (this.currentReference.addedRefDoc2) {
        fileAttached = this.currentReference.addedRefDoc2.name;
      }
      if (fileAttached)
        this.onRefDocFile2Add(fileAttached);
    }
  }

  addPanel() {
    if (this.referenceList.length > 0) {
      let lastItem = this.referenceList[this.referenceList.length - 1];
      if (lastItem.refInfo && lastItem.refInfo.referenceTitle != '' && lastItem.refInfo.refSource
        && lastItem.refInfo.refSource.refSourceId) {
        this.addToList();
      }
      else {
        this.toastService.messageWarning('Warn', 'Please fill the current Reference mandatory fields before adding a new tab!', 3000, true);
      }
    } else {
      this.addToList()
    }


  }

  addToList() {
    if (this._ruleInfo.ruleId) {
      this.addEmptyRefTab();
      let lastIndex = this.referenceList.length - 1;
      this.currentReference = this.referenceList[lastIndex];
      this.clearValidationFiles();
      this.addedNewPanel = true;
    }
  }

  addEmptyRefTab() {
    let refDto = new EclReferenceDto();
    refDto.user = this.pdgTemplateService.getUserId();
    refDto.ruleId = this._ruleInfo.ruleId;
    refDto.eclStage = this.stage;

    let refInfo = new ReferenceInfoDto();
    refInfo.referenceTitle = '';
    refInfo.refSource = { refSourceId: '' }
    refInfo.pdgRefDto = new PdgReferenceInfoDto();
    refDto.refInfo = refInfo;
    this.referenceList.push(refDto);
  }

  removeFromList(evt) {
    if (this.disabledView) {
      this.toastService.messageWarning('Warn', 'Please save the rule to modify State Reference Information!', 3000, true);
    } else {
      if (evt.index > -1) {
        this.showReferenceDisplay = true;
        this.indexToRemove = evt.index;
      }
    }
  }

  removeReference() {
    this.showReferenceDisplay = false;
    let index = this.indexToRemove;
    let deleteitem = this.referenceList[index];
    if (deleteitem.eclReferenceId) {
      this.deleteReference(deleteitem.eclReferenceId, index)
    }
    else {
      this.toastService.messageSuccess('Delete', 'Reference Detail Successfully Deleted', 3000, true);
      this.referenceList.splice(index, 1);
      if (this.referenceList.length <= 0) {
        this.addPanel();
      }
      this.activeIndex = 0;
    }    
  }

  /*
 Function to delete the selected EclReference based on the reference Id .
*/
  deleteReference(eclReferenceId: number, index: number) {
    this.pdgTemplateService.deleteReference(eclReferenceId).then(() => {
      this.toastService.messageSuccess('Delete', 'Reference Detail Successfully Deleted', 3000, true);
      this.referenceList.splice(index, 1);
      if (this.referenceList.length <= 0) {
        this.addPanel();
      }
      this.activeIndex = 0;
    });
  }

  assignRefSource(event, index) {
    if (typeof this.referenceList[index].refInfo !== undefined
      && this.referenceList[index].refInfo) {
      if (this.referenceList[index].refInfo.refSource == undefined) {
        this.referenceList[index].refInfo.refSource = new ReferenceSource();
      }
      this.referenceList[index].refInfo.refSource.refSourceId = event.value.id;
      this.referenceList[index].refInfo.refSource.sourceDesc = event.value.name;
    } else {
      this.referenceList[index].refInfo = new ReferenceInfo();
      this.referenceList[index].refInfo.refSource = new ReferenceSource();
      this.referenceList[index].refInfo.refSource.refSourceId = event.value.id;
      this.referenceList[index].refInfo.refSource.sourceDesc = event.value.name;

    }
    this.referenceList[index].referenceSource = event.value.id;
    this.referenceList[index].refInfo.referenceName = event.value.name;
    this.referenceList[index].ruleId = this._ruleInfo.ruleId;
  }
}


