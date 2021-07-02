import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FileUpload } from 'primeng/primeng';
import { Subscription } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { ECLConstantsService } from 'src/app/services/ecl-constants.service';
import { ProcedureCodesService } from 'src/app/services/procedure-codes.service';
import { RuleInfoService } from "src/app/services/rule-info.service";
import { ProcedureCodeDto } from 'src/app/shared/models/dto/procedure-code-dto';
import { RuleInfo } from 'src/app/shared/models/rule-info';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';
import { ProcedureCodeBoxComponent } from '../components/procedure-code-box/procedure-code-box.component';
import { Constants } from 'src/app/shared/models/constants';


@Component({
  selector: 'app-provisional-rule-codes',
  templateUrl: './provisional-rule-codes.component.html',
  styleUrls: ['./provisional-rule-codes.component.css']
})
export class ProvisionalRuleCodesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('uploadControl',{static: true}) uploadControl: FileUpload;
  @ViewChildren(ProcedureCodeBoxComponent) procCodeBoxes: QueryList<ProcedureCodeBoxComponent>;

  _ruleInfo: RuleInfo = new RuleInfo();
  parentRuleInfo: RuleInfo = new RuleInfo();
  @Input() set ruleInfo(value: RuleInfo) {
    if (value) {
      if (!value.procedureCodeDto) {
        value.procedureCodeDto = new ProcedureCodeDto();
      }
      this._ruleInfo = value;
      if (value.ruleId) {
        this.procedureCodeService.setActiveRuleInfo(value);
        this.getProcedureCodesData(this._ruleInfo);
      } else {
        this.showMarkups = false;
      }
    }
  } 
  @Input() set ruleInfoOriginal(value: RuleInfo) {
    if (value && value.ruleId) {
      if (!value.procedureCodeDto) {
        value.procedureCodeDto = new ProcedureCodeDto();
      }
      this.parentRuleInfo = value;
      this.getProcedureCodesData(this.parentRuleInfo);
    }
  }
  @Input() userId: number;
  @Input() provDialogDisable: boolean;
  @Input() readOnlyView: boolean;
  @Input() fromMaintenanceProcess: boolean;
  @Output() canContinueAction = new EventEmitter<any>();

  codesFiles = [];
  codesFilesOld = [];
  uploadFilesSubscrioption: Subscription;
  deletedFilesSelection: number[] = [];
  addedFiles = [];
  showMarkups: boolean = true;
  procCodeType = 'CPT';
 
  /***For displaying warning before attachment delete***/
  removeAttachmentDisplay: boolean = false;
  file: any;
  chooseLabel: string = "Attach Files";

  constructor(private ruleService: RuleInfoService, private fileManagerService: FileManagerService, 
    private eclConstants: ECLConstantsService, private procedureCodeService: ProcedureCodesService) {
  }

  /**
   * When the component is created we subscribe to the upload file observable,
   * If we have delete files selection then we call the service to delete the files.
   */
  ngOnInit() {
    this.uploadFilesSubscrioption = this.fileManagerService.uploadFileObs().subscribe(() => {
      if (this.addedFiles.length > 0) {
        this.fileManagerService.uploadRuleFile(this.addedFiles, this.eclConstants.RULE_CODES_FILE, this._ruleInfo.ruleId).pipe(flatMap((uploadFilesResponse) => {
          this.addedFiles = [];
          this.uploadControl.clear();
          this.uploadControl.uploadedFileCount = 0;
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

  /**
   * Ones the view is already rendered we get the list of files.
   */
  ngAfterViewInit(): void {
    if (this._ruleInfo.ruleId) {
      this.fileManagerService.getFilesByCategory(this._ruleInfo.ruleId, this.eclConstants.RULE_CODES_FILE, this.eclConstants.NEW_FILE).subscribe((response: any) => {
        this.assignFilesData(response);
      });
    }
  }
  /**
   * Fetch all procedures codes grouped by category.
   * In case of Rule Maintenance Flow, fetch all parent rule procedure codes.
   */
  getProcedureCodesData(ruleInfo: RuleInfo) {
    if (this._ruleInfo && this._ruleInfo.ruleStatusId && 
      this._ruleInfo.ruleStatusId.ruleStatusId !== Constants.RULE_IMPACTED_VALUE) {
        this.showMarkups = false;
    } else {
      this.showMarkups = true;
    }
    if (ruleInfo && ruleInfo.ruleId) {
      this.ruleService.getAllRuleProcedureCodes(ruleInfo.ruleId).subscribe(response => {
        if (response.data !== null && response.data !== undefined) {
          ruleInfo.procedureCodeDto = response.data;
        }
      });
      if (ruleInfo === this._ruleInfo) {
        this.getRCProcedureCodeFiles(this._ruleInfo.ruleId);
      }
      if (ruleInfo === this.parentRuleInfo) {
        this.getRMProcedureCodeFiles(this._ruleInfo.ruleId);
      }
    }
  }

  /**
   * Method to fetch files based on the rule id.
   * @param ruleId as an input.
   * @param response that contains the file data.
   */
  getRCProcedureCodeFiles(ruleId: number) {
    if (ruleId) {
      this.fileManagerService.getFilesByCategory(ruleId, this.eclConstants.RULE_CODES_FILE, this.eclConstants.NEW_FILE).subscribe((response: any) => {
        if (response.data !== null && response.data !== undefined) {
          this.assignFilesData(response);
        }
      });
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
   * Validata all code boxes. 
   */
  validateAllCodeBoxes() {
    this.procedureCodeService.validateAllCodeBoxes();
  }
  /**
   * We recreate the codes file array using the assign method for change detection.
   * @param response that contains the data.
   */
  assignFilesData(response) {
    if (response.data) {
      this.codesFiles = Object.assign([], response.data);
    }
  }

  /**
    * It fires when we click on upload button and send the files to the service.
    * @param file to be uploaded to the rest api service.
    */
  onFileSelected(fileEvent: { originalEvent: Event, files: FileList }) {
    const files = [];
    for (let index = 0; index < fileEvent.files.length; index++) {
      const element = fileEvent.files.item(index);
      files.push(element);
    }
    this.addedFiles = files;
  }

  /**
   * Gets the file from the service.
   * @param file that we want to download.
   */
  downloadFile(file) {
     if(!this.provDialogDisable)
    {
    this.fileManagerService.downloadFile(file.fileId).subscribe(response => {
      this.fileManagerService.createDownloadFileElement(response, file.fileName);
    });
  }
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
  }

  /**
   * Shows an icon according to the extension.
   * @param file to get the extension,
   */
  getFileIcon(file) {
    const fileExtension = file.fileName.split('.')[1];
    switch (fileExtension) {
      case "xls":
      case "xlsx":
        return "fa fa-file-excel-o purple";
      case "doc":
      case "docx":
        return "fa fa-file-word-o purple";
      default:
        return "fa fa-file-text-o purple";
    }
  }

  /**
   * When the user clicks on cancel button we clear the file list.
   */
  onClearFiles() {
    this.addedFiles = [];
  }

  /**
   * Removes the file from the list.
   * @param event which contains the file object.
   */
  onRemoveFile(event) {
    this.addedFiles.splice(this.addedFiles.indexOf(event.file), 1);
  }

  /**
   * Ones the component is destroyed we remove the subscription to the subject.
   */
  ngOnDestroy(): void {
    this.uploadFilesSubscrioption.unsubscribe();
    this.procedureCodeService.removeAllRuleInfoData();
  }

}
