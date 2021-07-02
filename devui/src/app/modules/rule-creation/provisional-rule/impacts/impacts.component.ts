import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { RuleInfo } from 'src/app/shared/models/rule-info';
import { ProcedureCodeDto } from 'src/app/shared/models/dto/procedure-code-dto';
import { ImpactsService } from './impacts.service';
import { AppUtils } from 'src/app/shared/services/utils';
import { Constants as con } from 'src/app/shared/models/constants';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';
import { Subscription } from 'rxjs';
import { ECLConstantsService } from 'src/app/services/ecl-constants.service';
import { flatMap } from 'rxjs/operators';
import { Constants } from 'src/app/shared/models/constants';
import { ToastMessageService } from 'src/app/services/toast-message.service';

const ECL_RULE_ENGINE_SHORT_DESC = "ECL";

@Component({
  selector: 'app-impacts',
  templateUrl: './impacts.component.html',
  styleUrls: ['./impacts.component.css']
})
export class ImpactsComponent implements OnInit {
  @ViewChild('fileUpload',{static: true}) fileUpload: ElementRef;
  @ViewChild('markpupEd',{static: true}) markupEd;

  _ruleInfo: RuleInfo = new RuleInfo();
  parentRuleInfo: RuleInfo = new RuleInfo();
  textHeight: string = '100%';

  eclRule: boolean = true;
  otherExceptionsOriginal: string = '';

  @Output() messageSend = new EventEmitter<any>();
  @Input() set ruleInfo(value: RuleInfo) {
    if (value) {
      if (!value.procedureCodeDto) {
        value.procedureCodeDto = new ProcedureCodeDto();
      }
      if (value.ruleEngine && ECL_RULE_ENGINE_SHORT_DESC !== value.ruleEngine.shortDesc) {
        this.eclRule = false;
      }
      value.otherExceptions = this.transformOtherExceptions(value);
      this._ruleInfo = value;

      if (this.ruleInfo.cvCode) {
        this.ruleInfo.cvCode = this._ruleInfo.cvCode.lookupId;
      }
      if (this._ruleInfo.ruleId) {
        this.fileManagerService.getFilesByCategory(this._ruleInfo.ruleId, this.eclConstants.RULE_CODES_FILE, this.eclConstants.NEW_FILE).subscribe((response: any) => {
          this.assignFilesData(response);
        });
      }
    }
  }
  @Input() set ruleInfoOriginal(value: RuleInfo) {
    if (value && value.ruleId) {
      this.parentRuleInfo = value;
      this.otherExceptionsOriginal = this.transformOtherExceptions(value);
    }
  }

  transformOtherExceptions(value: RuleInfo): string {
    if (value.otherExceptions) {
      if (value.pdgTemplateDto) {
        return this.utils.getTextFromHtml(value.otherExceptions).split("|").join("\n");
      } 
      return value.otherExceptions.split('||').join('\n');
    }
    return '';
  }

  get ruleInfo(): RuleInfo {
    return this._ruleInfo;
  }
  @Input() provDialogDisable: boolean;

  @Input() fromMaintenanceProcess: boolean;

  cvCodes: any;
  maxLength: number = 4000;

  codesFiles = [];
  codesFilesOld = [];
  /***For displaying warning before attachment delete***/
  removeAttachmentDisplay: boolean = false;
  file: any;
  uploadFilesSubscrioption: Subscription;
  addedFiles = [];
  deletedFilesSelection: number[] = [];
  chooseLabel: string = "Attach Files";
  isSavedFileExist: boolean = false;
  isAddedFileExist: boolean = false;

  constructor(public impactsService: ImpactsService, private fileManagerService: FileManagerService,
    private utils: AppUtils, private toastService: ToastMessageService,
    private eclConstants: ECLConstantsService) { }

  ngOnInit() {
    this.impactsService.getCvCodes().subscribe(codes => this.cvCodes = codes);
    if (this.ruleInfo) {
      if (this.ruleInfo.claimImpactInd === undefined) {
        this.ruleInfo.claimImpactInd = 0;
      }
      if (this.ruleInfo.dosageImpactInd === undefined) {
        this.ruleInfo.dosageImpactInd = 0;
      }
      if (this.ruleInfo.genderInd === undefined) {
        this.ruleInfo.genderInd = null;
      }
      if (this.ruleInfo.ageLimitInd === undefined) {
        this.ruleInfo.ageLimitInd = 0;
      }
      if (this.ruleInfo.mileLimitInd === undefined) {
        this.ruleInfo.mileLimitInd = 0;
      }
      if (this.ruleInfo.dosageLimitInd === undefined) {
        this.ruleInfo.dosageLimitInd = 0;
      }
    }


    this.uploadFilesSubscrioption = this.fileManagerService.uploadFileObs().subscribe(() => {
      if (this.addedFiles.length > 0) {
        this.fileManagerService.uploadRuleFile(this.addedFiles, this.eclConstants.RULE_CODES_FILE, this._ruleInfo.ruleId, "*").pipe(flatMap((uploadFilesResponse) => {
          this.addedFiles = [];
          this.isAddedFileExist = false;
          return this.fileManagerService.getFilesByCategory(this._ruleInfo.ruleId, this.eclConstants.RULE_CODES_FILE, this.eclConstants.NEW_FILE);
        })).subscribe(filesResponse => {
          this.assignFilesData(filesResponse);
        });
      }
      if (this.deletedFilesSelection.length > 0) {
        this.fileManagerService.removeFiles(this.deletedFilesSelection).subscribe(response => {
          this.deletedFilesSelection = [];
        });
      }
    });
  }

  checkMultiValidation(setup: number, e?: ClipboardEvent, note?: string) {
    if (setup === con.INPUT) {
      this._ruleInfo.otherExceptions = this.utils.checkInputLengthTextArea(this._ruleInfo.otherExceptions, this.maxLength)
    } else if (setup === con.KEYPRESS) {
      this.utils.checkMultiLineMaxLength(e, this._ruleInfo.otherExceptions, document.getElementById('otherComments'), this.maxLength)
    } else {
      this.messageSend.emit(this.utils.checkPasteLength(e, 'Other Exception or Limitations', this.maxLength, note));
    }
  }

  /**
   * We recreate the codes file array using the assign method for change detection.
   * @param response that contains the data.
   */
  assignFilesData(response) {
    if (response.data) {
      this.codesFiles = Object.assign([], response.data);
      if (this.codesFiles.length > 0) {
        this.isSavedFileExist = true;
      }
    }
  }

  /**
  * It fires when we click on upload button and send the files to the service.
  * @param file to be uploaded to the rest api service.
  */
  onFileSelected(event) {
    let fileList: FileList = event.target.files;
    this.updateFilesList(fileList);
    if (this.addedFiles.length > 0) {
      this.isAddedFileExist = true;
    }
    this.fileUpload.nativeElement.value = '';
  }

  /* Method invoked when files are dragged and dropped */
  dropFileHandler(event) {
    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();
    if (!this.provDialogDisable) {
      this.updateFilesList(this.utils.dropFileHandler(event));
    }
    this.fileUpload.nativeElement.value = '';
  }

  /**
  * Removes the file from the list, but the deletion is until user clicks save or submit.
  * @param file to be removed.
  */
  removeFile(file) {
    this.file = file;
    this.removeAttachmentDisplay = true;
  }

  /***Activated when user clicks Cancel on File Deletion dialog***/
  removeAttachmentCancel() {
    this.removeAttachmentDisplay = false;
  }

  /***Activated when user clicks Delete on File Deletion dialog***/
  removeAttachmentDelete() {
    this.removeAttachmentDisplay = false;
    const file = this.file;
    this.deletedFilesSelection.push(file.fileId);
    this.codesFiles.splice(this.codesFiles.indexOf(file), 1);
    if (this.codesFiles.length <= 0) {
      this.isSavedFileExist = false;
    }
  }

  /**
   * Method to fetch parent rule files based on the rule id.
   * @param ruleId as an input.
   * @param response that contains the file data.
   */
  getRMProcedureCodeFiles(ruleId: number) {
    if (ruleId) {
      this.fileManagerService.getFilesByCategory(ruleId, this.eclConstants.RULE_CODES_FILE, this.eclConstants.EXISTING_FILE).subscribe((responseOne: any) => {
        if (responseOne.data !== null && responseOne.data !== undefined) {
          this.codesFilesOld = responseOne.data;
        }
      });
    }
  }


  /**
   * When the user clicks on cancel button we clear the file list.
   */
  onClearFiles() {
    this.addedFiles = [];
    this.isAddedFileExist = false;
  }

  /**
   * Removes the file from the list.
   * @param event which contains the file object.
   */
  onRemoveFile(fileEvent) {
    this.addedFiles = this.addedFiles.filter(file => file.name !== fileEvent.name);
    if (this.addedFiles.length < 1) {
      this.fileUpload.nativeElement.value = '';
    }
    if (this.addedFiles.length > 0) {
      this.isAddedFileExist = true;
    } else {
      this.isAddedFileExist = false;
  }
}

  /**
  * Shows an icon according to the extension.
  * @param fileName to get the extension,
  */
  getFileIcon(fileName: string) {
    return "attachment " + this.utils.getFileIcon(fileName);
  }

  clickFileUpload() {
    this.fileUpload.nativeElement.click();
  }

  /**
  * Gets the file from the service.
  * @param file that we want to download.
  */
  downloadFile(file) {
    this.fileManagerService.downloadFile(file.fileId).subscribe(response => {
      this.fileManagerService.createDownloadFileElement(response, file.fileName);
    });
  }

  /**
  * Gets the file from the service.
  * @param file that we want to download.
  */
  downloadAddedFile(file: any) {
    if (!this.provDialogDisable) {
      this.fileManagerService.createDownloadFileElement(file, file.name);
    }
  }

  /**
   * Update the File List while checking File Size and Naming duplicates
   * @param fileList Newly added files to be validated before adding
   */
  updateFilesList(fileList: any) {
    let { addedFiles, addedBool, warnMsg } = this.utils.updateFilesList(fileList, this.addedFiles, this.codesFiles)
    if (warnMsg) {
      this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, warnMsg, 4000, true);
    } else {
      this.addedFiles = addedFiles
      this.isAddedFileExist = addedBool
    }
  }

  /**
  * Ones the component is destroyed we remove the subscription to the subject.
  */
  ngOnDestroy(): void {
    this.uploadFilesSubscrioption.unsubscribe();
  }

}
