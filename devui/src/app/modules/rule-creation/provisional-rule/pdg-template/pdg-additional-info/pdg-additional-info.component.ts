import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EclFileDto } from 'src/app/shared/models/ecl-file';
import { PdgConstants } from '../pdg-constants';
import * as Quill from 'quill';
import { IndentStyle } from './indent.js'
import { MessageSend } from 'src/app/shared/models/messageSend';
import { ToastMessageService } from 'src/app/services/toast-message.service';

var Delta = Quill.import('delta');
@Component({
  selector: 'app-pdg-additional-info',
  templateUrl: './pdg-additional-info.component.html',
  styleUrls: ['./pdg-additional-info.component.css']
})
export class PdgAdditionalInfoComponent implements OnInit {


  _ruleInfo: any;
  @Input() set ruleInfo(data: any) {
    if (data) {
      this._ruleInfo = data;
      if (this._ruleInfo.pdgTemplateDto) {
        if (this._ruleInfo.pdgTemplateDto.ellTeamNote) {
          this._ruleInfo.pdgTemplateDto.ellTeamNote = this.replaceInvalidChars(this._ruleInfo.pdgTemplateDto.ellTeamNote);
          this.ellTeamNoteModel = this._ruleInfo.pdgTemplateDto.ellTeamNote;
        }
        if (this._ruleInfo.pdgTemplateDto.ituReviewInfo) {
          this._ruleInfo.pdgTemplateDto.ituReviewInfo = this.replaceInvalidChars(this._ruleInfo.pdgTemplateDto.ituReviewInfo);
          this.ituReviewInfoModel = this._ruleInfo.pdgTemplateDto.ituReviewInfo;
        }
        if (this._ruleInfo.pdgTemplateDto.ruleRelationships) {
          this._ruleInfo.pdgTemplateDto.ruleRelationships = this.replaceInvalidChars(this._ruleInfo.pdgTemplateDto.ruleRelationships);
          this.ruleRelationshipsModel = this._ruleInfo.pdgTemplateDto.ruleRelationships;
        }
        if (this._ruleInfo.pdgTemplateDto.codeCoverage) {
          this._ruleInfo.pdgTemplateDto.codeCoverage = this.replaceInvalidChars(this._ruleInfo.pdgTemplateDto.codeCoverage);
          this.codeCoverageModel = this._ruleInfo.pdgTemplateDto.codeCoverage;
        }
        if (this._ruleInfo.pdgTemplateDto.claimTypeInfo) {
          this._ruleInfo.pdgTemplateDto.claimTypeInfo = this.replaceInvalidChars(this._ruleInfo.pdgTemplateDto.claimTypeInfo);
          this.claimTypeInfoModel = this._ruleInfo.pdgTemplateDto.claimTypeInfo;
        }
        if (this._ruleInfo.pdgTemplateDto.dosFromInfo) {
          this._ruleInfo.pdgTemplateDto.dosFromInfo = this.replaceInvalidChars(this._ruleInfo.pdgTemplateDto.dosFromInfo);
          this.dosInfoModel = this._ruleInfo.pdgTemplateDto.dosFromInfo;
        } 
        if (this._ruleInfo.pdgTemplateDto.otherInfo) {
          this._ruleInfo.pdgTemplateDto.otherInfo = this.replaceInvalidChars(this._ruleInfo.pdgTemplateDto.otherInfo);
          this.otherInfoModel = this._ruleInfo.pdgTemplateDto.otherInfo;
        }
      }
    }
  }
  @Input() pdgOption: any;
  @Input() provDialogDisable: boolean;
  @Output() cgFilesChanged = new EventEmitter<any>();  
  @Output() codeFilesChanged = new EventEmitter<any>();  
  @Output() claimTypeFilesChanged = new EventEmitter<any>();
  @Output() dosFilesChanged = new EventEmitter<any>();
  @Output() otherInfoFilesChanged = new EventEmitter<any>();
  @Output() cptFilesChanged = new EventEmitter<any>();
  @Output() ituFilesChanged = new EventEmitter<any>();
  @Output() onCopyPaste = new EventEmitter<any>();
  
  addedClientGridFiles: EclFileDto[];  
  addedCodeCovFiles: EclFileDto[];
  addedClaimTypeFiles: EclFileDto[];
  addedSubRuleDosFiles: EclFileDto[];
  addedOtherInfoFiles: EclFileDto[];
  addedItuFiles: EclFileDto[];
  addedCptFiles: EclFileDto[];

  literals : any = PdgConstants;
  quillEllTeam: Quill;
  quillItu: Quill;
  quillOther: Quill;
  quillDos: Quill;
  quillClaimType: Quill;
  quillCodeCoverage: Quill;
  quillRuleRelation: Quill;
  ellTeamNoteModel: any;
  ituReviewInfoModel: any;
  ruleRelationshipsModel: any;
  codeCoverageModel: any;
  claimTypeInfoModel: any;
  dosInfoModel: any;
  otherInfoModel: any;

  evt: any;

  constructor(private toastService: ToastMessageService) {}

  ngOnInit() { 
    Quill.register(IndentStyle, true);
    Quill.register(Quill.import('attributors/style/direction'), true);
    Quill.register(Quill.import('attributors/style/align'), true);
  }

  setClientGridFiles(fileList) {
    this.addedClientGridFiles = fileList;
    this.cgFilesChanged.emit(this.addedClientGridFiles);
  }

  setCodeCovFiles(fileList) {
    this.addedCodeCovFiles = fileList;   
    this.codeFilesChanged.emit(this.addedCodeCovFiles);
  }

  setClaimTypeFiles(fileList) {
    this.addedClaimTypeFiles = fileList;   
    this.claimTypeFilesChanged.emit(this.addedClaimTypeFiles);
  }

  setSubRuleDosFiles(fileList) {
    this.addedSubRuleDosFiles = fileList; 
    this.dosFilesChanged.emit(this.addedSubRuleDosFiles);
  }

  setOtherInfoFiles(fileList) {
    this.addedOtherInfoFiles = fileList;  
    this.otherInfoFilesChanged.emit(this.addedOtherInfoFiles);
  }

  setItuFiles(fileList) {
    this.addedItuFiles = fileList;  
    this.ituFilesChanged.emit(this.addedItuFiles); 
  }

  setCptFiles(fileList) {
    this.addedCptFiles = fileList;  
    this.cptFilesChanged.emit(this.addedCptFiles);
  }

  validateCharacterLimit(e: ClipboardEvent, textAreaId: string, value: string){
    if(value && textAreaId && e){
      let obj = {event: e, textId: textAreaId, value: value};
      this.onCopyPaste.emit(obj);
    }
  }

  replaceInvalidChars(htmlValue){
    let html = '';
    if(htmlValue){
      html = htmlValue.replace(/(q )|Ø|¿|(¿ )|•|·/g,'');
    }
    return html;
  }

   /**
  * initialization of quill instance -> assign current p-editor instance to the given quill object
  * @param event p-editor event
  * @param quillType a constant indicating quill type
  */
  initializeQuill(event, quillType) {
    if (quillType == PdgConstants.ITU_FILES) {
      this.quillItu = event.editor;
    } else if (quillType == PdgConstants.ELL_TEAM) {
      this.quillEllTeam = event.editor;
    } else if (quillType == PdgConstants.RULE_REL) {
      this.quillRuleRelation = event.editor;
    } else if (quillType == PdgConstants.DOS_FILES) {
      this.quillDos = event.editor;
    } else if (quillType == PdgConstants.CLAIM_FILES) {
      this.quillClaimType = event.editor;
    } else if (quillType == PdgConstants.CODE_FILES) {
      this.quillCodeCoverage = event.editor;
    } else if (quillType == PdgConstants.OTHER_FILES) {
      this.quillOther = event.editor;
    }
  }

  
  /**
   * on change of p-editor, clear unknown symbols
   * @param e p-editor event
   * @return p-editor event.
   */
  replaceText(e) {
    let htmlValue = e.htmlValue;
    if (htmlValue && htmlValue != '') {
      htmlValue = this.replaceInvalidChars(htmlValue);
      e.htmlValue = htmlValue;
    }
    return e;
  }

  /**
   * on change of p-editor, if character limit reached -> delete added extra characters from editor
   *  @param e modified p-editor event after replaceText method
   *  @param quill current quill instance
   *  @param quillType (Default null) a constant indicating quill type
   *  @return htmlValue value sent back
   */
  modifyText(e, quill, quillType = null) {
    let htmlValue = null;
    if (e && e.textValue) {
      htmlValue = e.htmlValue;
      let textLength = e.textValue.length;
      if (this.isMaxLimitReached(textLength)) {
        quill.deleteText(PdgConstants.MAXLEN_5000, textLength);
        htmlValue = quill.root.innerHTML;
        if (quillType == PdgConstants.OTHER_FILES) {
          const msg: MessageSend = {
            'type': 'warn',
            'summary': 'Other Info maximum limit reached!',
            'detail': `Maximum allowed characters ${PdgConstants.MAXLEN_5000} already exists.`,
            'time': 5000
          };
          this.toastService.messageWarning(msg.summary, msg.detail, msg.time, false);
        }
      }
    }
    return htmlValue;
  }

  /**
   * check whether text maxlengh exceeded 5000 characters
   * @param textLength text length
   * @return boolean.
   */
  isMaxLimitReached(textLength): boolean {
    return (textLength && textLength > PdgConstants.MAXLEN_5000);
  }
}
