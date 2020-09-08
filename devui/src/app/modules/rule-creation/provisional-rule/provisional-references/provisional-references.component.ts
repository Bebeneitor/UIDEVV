import { RuleInfo } from 'src/app/shared/models/rule-info';
import { Component, Input, OnInit, ViewChild, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ReferenceInfo } from 'src/app/shared/models/reference-info';
import { FileUpload, SelectItem, DynamicDialogConfig, DialogService, ConfirmationService } from 'primeng/primeng';
import { AppUtils, KeyLimitService } from 'src/app/shared/services/utils';
import { EclReference } from 'src/app/shared/models/ecl-reference';
import { ReferenceService } from 'src/app/services/reference.service';
import { EclReferenceDto } from 'src/app/shared/models/dto/ecl-reference-dto';
import { ReferenceInfoDto } from 'src/app/shared/models/dto/reference-info-dto';
import { ECLConstantsService } from "../../../../services/ecl-constants.service";
import { environment } from 'src/environments/environment';
import { EventEmitter } from '@angular/core';
import { Constants } from 'src/app/shared/models/constants';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { RuleImpactAnalysisRun } from "../../../../shared/models/rule-impact-analysis-run";

//Local constants
const SUCCESS = "Success";
const REF_URL_FILE = 1;
const REF_DOC_FILE1 = 2;
const REF_DOC_FILE2 = 3;
const REF_COMMENTS_FILE1 = 1;
const REF_COMMENTS_FILE2 = 2;

@Component({
  selector: 'app-provisional-references',
  templateUrl: './provisional-references.component.html',
  styleUrls: ['./provisional-references.component.css']
})
export class ProvisionalReferencesComponent implements OnInit, OnChanges {

  @ViewChild('uploadControl') uploadControl: FileUpload;
  @ViewChild('uploadControl1') uploadControl1: FileUpload;
  @ViewChild('uploadControl2') uploadControl2: FileUpload;
  @ViewChild('commentUpload1') commentUpload1: FileUpload;
  @ViewChild('commentUpload2') commentUpload2: FileUpload;
  @Input() readOnlyView: boolean;
  @Input() ruleId: number;
  @Input() ruleInfo: RuleInfo;
  @Input() provDialogDisable: boolean;
  @Input() reassignmentFlag: boolean;
  @Input() isSameSim: boolean;
  @Input() ruleReferences: any[];
  @Input() addButtonDisable: boolean;
  @Input() selectedReference: any;
  @Input() isReferenceDisableObject: any;
  @Input() isRemovableObject: any;
  @Input() fromMaintenanceProcess: any;
  @Input() isSavableObject: any;
  @Input() isAddingObject: any;
  @Input() ruleReferencesArray: any[];
  @Input() ruleImpactAnalysisRun: RuleImpactAnalysisRun;
  @Output() approvalDropdownRefresh = new EventEmitter();
  @Output() clearApprovalValues = new EventEmitter();
  @Output() enableApprovalStatus = new EventEmitter();
  @Output() retireStatusValue = new EventEmitter<boolean>();
  @Output() populateApprovalStatus = new EventEmitter();
  @Output() setDefaultValueForApprovalDropdown = new EventEmitter();
  @Output() retireRuleTabStatus = new EventEmitter();

  /*  Boolean value to check if the it is at idea or provisional rule level
  @True: idea level
  @False: provisional rule
  */
  @Input() ruleCreationStatus: boolean;
  @Input() reference: ReferenceInfoDto;
  @Input() eclRef: EclReferenceDto;
  @Input() isProvisionalRuleCreation: boolean;
  @Input() provRuleNeedsMoreInfo: boolean;
  refObj: any;
  loading: boolean;
  chooseLabel: string = 'Attach File';
  /* File Download links */
  refFileDownloadUrl: string;
  refFileDownloadUrl1: string;
  refFileDownloadUrl2: string;
  refCommentFileDownloadUrl1: string;
  refCommentFileDownloadUrl2: string;
  cols: any[];
  maintenanceProcessCols: any[];
  readOnlyViewCols: any[];
  isNotSelected: boolean = true;
  reInstateFlag: boolean = false;
  ruleStage: number;

  minDate: Date;
  maxDate: Date;
  publishDate: Date = new Date();

  Validatefiles1: File[] = [];
  Validatefiles2: File[] = [];
  Validatefiles3: File[] = [];
  Validatefiles4: File[] = [];
  Validatefiles5: File[] = [];

  //Key Limiter
  selectedInfo: String = '';
  limitCount: number = 500;
  showCount: number = this.limitCount;

  /* Array of Reference Object to store at each level */
  eclReference: EclReference[] = [];
  referenceArray: any[] = [];
  refInfoArray: any[] = [];
  newRefSource: SelectItem[] = [{ label: 'Choose', value: { id: 0, name: '' } }];

  docChangedStatusFlag: boolean;

  impactInd: any[] = [
    { label: 'Select', value: null },
    { label: 'No', value: 0 },
    { label: 'Yes', value: 1 }
  ];

  impactType: any[] = [
    { label: 'Select', value: null },
    { label: 'Editorial', value: this.eclConstants.RULE_IMPACT_TYPE_EDITORIAL },
    { label: 'Logical', value: this.eclConstants.RULE_IMPACT_TYPE_LOGICAL }
  ];
  userId: number;

  decode: boolean = false;
  firstCheck: boolean = false;

  /* Boolean values to check the reference has the files*/
  refFile: boolean = false;
  refFile1: boolean = false;
  refFile2: boolean = false;

  /* File Download links */
  refFileDownload: string;
  refFileDownload1: string;
  refFileDownload2: string;
  refCommentsFileDownload1: string;
  refCommentsFileDownload2: string;

  /* Reference Objects to store Reference Details and Rule Reference */
  display = 'none';
  selectedSource: any;
  refValuesEditable: boolean = false;
  refSource: number;
  refSourceText: string;
  selectedRefObj: ReferenceInfo;
  selectedEclRefObj: EclReference;
  Message: string;
  removeDisplay: boolean = false;
  cancelDisplay: boolean = false;


  /***Warning before attachment delete***/
  removeAttachmentDisplay: boolean = false;
  isDeletingReferenceFile: boolean = false;
  referenceFileNumberDeleting: number;
  isDeletingCommentsFile: boolean = false;
  commentsFileNumberDeleting: number;

  saveDisplay: boolean = false;

  showConfirmationMsg: boolean = false;
  confirmationHeaderMsg: string = "";
  saveMessage: any = "";

  changeDetailsDisplayView: boolean = true;
  showDialog: boolean = false;
  showDialogRetire: boolean = false;
  ruleRefRetire: boolean = false;
  retireStatus: boolean = false;

  docChangedStatus = [
    { label: 'Select', value: null },
    { label: Constants.CHANGE_STATUS_NO_CHANGE, value: Constants.CHANGE_STATUS_NO_CHANGE_VALUE },
    { label: Constants.CHANGE_STATUS_CHANGE, value: Constants.CHANGE_STATUS_CHANGE_VALUE },
    { label: Constants.CHANGE_STATUS_RETIRE, value: Constants.CHANGE_STATUS_RETIRE_VALUE, disabled: true }
  ];

  yearValidRangeEft = `${Constants.EFT_MIN_VALID_YEAR}:${Constants.EFT_MAX_VALID_YEAR}`;
  
  constructor(private referenceService: ReferenceService, public config: DynamicDialogConfig,
    public dialogService: DialogService, private appUtils: AppUtils, private keylimit: KeyLimitService,
    private eclReferenceService: ReferenceService, private toastService: ToastMessageService, private eclConstants: ECLConstantsService, private confirmationService: ConfirmationService) {
    this.reference = new ReferenceInfoDto();
    this.eclReference = [];
    this.eclRef = new EclReferenceDto();
  };

  ngOnInit() {
    this.refObj = true;
    this.reference = new ReferenceInfoDto();
    this.eclRef = new EclReferenceDto();

    // use angular pipe
    this.minDate = new Date();
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    this.minDate.setDate(1);
    this.minDate.setMonth(0);
    this.minDate.setFullYear(1990);
    this.maxDate = new Date();
    this.maxDate.setMonth(month);
    this.maxDate.setFullYear(year);
    this.userId = this.appUtils.getLoggedUserId();

    this.appUtils.getAllReferencesValue(this.newRefSource, true);
    if (this.ruleCreationStatus) {
      this.ruleStage = Constants.ECL_IDEA_STAGE;
    } else if (this.fromMaintenanceProcess) {
      this.ruleStage = Constants.ECL_LIBRARY_STAGE;
    } else {
      this.ruleStage = Constants.ECL_PROVISIONAL_STAGE;
    }

    this.maintenanceProcessCols = [
      { field: 'source', header: 'Reference Source', width: '25%' },
      { field: 'title', header: 'Title', width: '25%' },
      { field: 'changedDetails', header: 'Change Details', width: '25%' },
      { field: 'changedStatus', header: 'Change Status', width: '25%' }
    ];

    this.readOnlyViewCols = [
      { field: 'source', header: 'Reference Source', width: '50%' },
      { field: 'title', header: 'Title', width: '50%' }
    ];

    if (this.fromMaintenanceProcess) {
      //references table column headings for rule maintenance
      this.cols = this.maintenanceProcessCols;
    } else {
      //references table column headings for rule creation
      this.cols = this.readOnlyViewCols;
    }

    if (this.readOnlyView) {
      //references table column headings for home page read only view
      this.cols = this.readOnlyViewCols;
    }

    if (this.reassignmentFlag) {
      this.cols = this.maintenanceProcessCols;
    }

    this.checkIfAllReferencesRetired();
  }


  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      let change = changes[propName];
      let currentValue = change.currentValue;
      if (propName === 'ruleImpactAnalysisRun' && currentValue != null) {
        this.ruleImpactAnalysisRun = currentValue;
        this.refreshReference();
      } else if (propName === 'provDialogDisable' && currentValue === true) {
        if (this.fromMaintenanceProcess) {
          this.provDialogDisable = false;
        }
      }
    }
    this.checkIfAllReferencesRetired();
  }

  ngAfterViewInit() {
    if (this.ruleCreationStatus) {
      this.ruleStage = Constants.ECL_IDEA_STAGE;
    } else if (this.fromMaintenanceProcess) {
      this.ruleStage = Constants.ECL_LIBRARY_STAGE;
    } else {
      this.ruleStage = Constants.ECL_PROVISIONAL_STAGE;
    }
  }

  refreshApprovalValues() {
    this.approvalDropdownRefresh.emit();
    this.setDefaultValueForApprovalDropdown.emit();
  }

  disableImpactType(event: any) {
    if (event.value < 1) {
      this.ruleImpactAnalysisRun.ruleImpactTypeId = null;
      this.clearApprovalValues.emit();
    } else if (event.value === 1) {
      this.enableApprovalStatus.emit();
    }
  }

  /***Method to delete a reference file attachment related to url in Provisional Rule Creation***/
  deleteReferenceFile(fileNumber: number) {
    this.isDeletingCommentsFile = false;
    this.isDeletingReferenceFile = true;
    this.referenceFileNumberDeleting = fileNumber;
    this.removeAttachmentDisplay = true;
  }

  /***Method to delete an attached file related to Comments in Provisional Rule Creation***/
  deleteCommentsFile(fileNumber: number) {
    this.isDeletingReferenceFile = false;
    this.isDeletingCommentsFile = true;
    this.commentsFileNumberDeleting = fileNumber;
    this.removeAttachmentDisplay = true;
  }

  /***Activated when user clicks Cancel on File Deletion dialog***/
  removeAttachmentCancel() {
    this.removeAttachmentDisplay = false;
  }

  /***Activated when user clicks Delete on File Deletion dialog***/
  removeAttachmentDelete() {
    this.removeAttachmentDisplay = false;
    let fileNumber: number;
    if (this.isDeletingReferenceFile) {
      this.isDeletingReferenceFile = false;
      fileNumber = this.referenceFileNumberDeleting;
      this.eclReferenceService.deleteReferenceAttachment(this.eclRef.refInfo.referenceId, fileNumber).subscribe(response => {
        if (response.code === 200) {
          if (fileNumber === 1) {
            this.eclRef.refFile = false;
          } else if (fileNumber === 2) {
            this.eclRef.refFile1 = false;
          } else if (fileNumber === 3) {
            this.eclRef.refFile2 = false;
          }
        }
      });
    } else if (this.isDeletingCommentsFile) {
      this.isDeletingCommentsFile = false;
      fileNumber = this.commentsFileNumberDeleting;
      let file1Exist = this.eclRef.commentsFile1;
      let file2Exist = this.eclRef.commentsFile2;


      const eclAttachmentId = this.eclRef.eclAttachmentList[fileNumber - 1].eclAttachmentId;
      this.eclReferenceService.deleteCommentsAttachment(eclAttachmentId).subscribe(response => {
        if (response.code === 200) {
          if (fileNumber === 1) {
            this.eclRef.commentsFile1 = false;
            if (!file1Exist && file2Exist) {
              this.eclRef.commentsFile2 = false;
            }
          } else if (fileNumber === 2) {
            this.eclRef.commentsFile2 = false;
          }
        }
      });
    }
  }

  removeFile(file: File, uploader: FileUpload) {
    const index = uploader.files.indexOf(file);
    uploader.remove(null, index);
  }

  /*
    Function to search available references
    based on the reference name.
  */
  searchReferenceName() {
    let referenceName = this.reference.referenceName;
    let refSource = this.selectedSource.id;
    this.eclReferenceService.searchRefByName(referenceName, refSource).subscribe(response => {
      if (response.data != null && (response.data != undefined) && (response.data != [])) {
        this.referenceArray = response;
        if (this.referenceArray.length >= 1) {
          for (let obj in this.referenceArray) {
            let refObj = this.referenceArray[obj];
            if (referenceName == refObj.referenceName) {
              this.reference = refObj;
              this.refValuesEditable = true;
            }
          }
        }
      }
    });
  }

  /* Function to download the reference first file selected */

  referenceFileDownload1(fileUrl: any, fileName: any, fileType: any) {
    if (fileUrl !== null && fileUrl !== undefined) {
      this.eclReferenceService.refFileDownload1(fileUrl).subscribe(response => {
        if (response !== null && response !== undefined) {
          this.downloadReferenceFileData1(response, fileName, fileType);
        }
      });
    }
  }

  /* Call back function to download the first selected reference file*/

  downloadReferenceFileData1(data, fileName, fileType) {
    let a = document.createElement("a");
    document.body.appendChild(a);
    let blob = new Blob([data], { type: fileType }),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  /* Function to download the reference second file selected */

  referenceFileDownload2(fileUrl: any, fileName: any, fileType: any) {
    if (fileUrl !== null && fileUrl !== undefined) {
      this.eclReferenceService.refFileDownload2(fileUrl).subscribe(response => {
        if (response !== null && response !== undefined) {
          this.downloadReferenceFileData2(response, fileName, fileType);
        }
      });
    }
  }

  /* Call back function to download the second selected reference file*/

  downloadReferenceFileData2(data, fileName, fileType) {
    let a = document.createElement("a");
    document.body.appendChild(a);
    let blob = new Blob([data], { type: fileType }),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  /* Function to download the reference third file selected */

  referenceFileDownload3(fileUrl: any, fileName: any, fileType: any) {
    if (fileUrl !== null && fileUrl !== undefined) {
      this.eclReferenceService.refFileDownload3(fileUrl).subscribe(response => {
        if (response !== null && response !== undefined) {
          this.downloadReferenceFileData3(response, fileName, fileType);
        }
      });
    }
  }

  /* Call back function to download the third selected reference file*/

  downloadReferenceFileData3(data, fileName, fileType) {
    let a = document.createElement("a");
    document.body.appendChild(a);
    let blob = new Blob([data], { type: fileType }),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  /* Function to download the comment reference 1 file selected */

  referenceFileDownload4(fileUrl: any, fileName: any, fileType: any) {
    if (fileUrl !== null && fileUrl !== undefined) {
      this.eclReferenceService.refcommentsFileDownload1(fileUrl).subscribe(response => {
        if (response !== null && response !== undefined) {
          this.downloadReferenceFileData4(response, fileName, fileType);
        }
      });
    }
  }

  /* Call back function to download the selected first comment reference file*/

  downloadReferenceFileData4(data, fileName, fileType) {
    let a = document.createElement("a");
    document.body.appendChild(a);
    let blob = new Blob([data], { type: fileType }),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  /* Function to download the comment reference 1 file selected */

  referenceFileDownload5(fileUrl: any, fileName: any, fileType: any) {
    if (fileUrl !== null && fileUrl !== undefined) {
      this.eclReferenceService.refcommentsFileDownload2(fileUrl).subscribe(response => {
        if (response !== null && response !== undefined) {
          this.downloadReferenceFileData5(response, fileName, fileType);
        }
      });
    }
  }

  /* Call back function to download the selected first comment reference file*/

  downloadReferenceFileData5(data, fileName, fileType) {
    let a = document.createElement("a");
    document.body.appendChild(a);
    let blob = new Blob([data], { type: fileType }),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  /*
   Function to fetch all the available references
   based on the rule or idea id and stage.
 */

  getAllReferences(ruleId: number, stage: any) {
    return new Promise((resolve, reject) => {
      this.eclReferenceService.getAllEclReferences(ruleId, stage).subscribe((response: any) => {
        if (response !== null) {
          if (response.data != null) {
            let eclReferenceArray = response.data;
            this.ruleReferencesArray = [];
            this.ruleReferencesArray =
              eclReferenceArray.map(ele => {
                return {
                  "source": ele.refInfo.refSource.sourceDesc,
                  "name": ele.refInfo.referenceName,
                  "title": ele.refInfo.referenceTitle,
                  "refId": ele.refInfo.referenceId,
                  "eclReferenceId": ele.eclReferenceId,
                  "refSourceId": ele.refInfo.refSource.refSourceId,
                  "changedStatus": this.getChangedStatus(ele.refInfo, this.ruleImpactAnalysisRun ? this.ruleImpactAnalysisRun.ruleImpactAnalysisRunId : null, ele.refInfo.referenceId),
                  "changedDetail": this.getChangedDetail(ele.refInfo, this.ruleImpactAnalysisRun ? this.ruleImpactAnalysisRun.ruleImpactAnalysisRunId : null, ele.refInfo.referenceId),
                  "changeDetailsDisplayFlag": ele.changeDetailsDisplayFlag,
                  "refEffectiveToDt": ele.refInfo.refEffectiveToDt
                };
              });
          }
        }
        this.checkIfAllReferencesRetired();
        resolve();
      }), error => console.log('error = ' + error),
        () => this.clearScreenReference();
    })
  }

  public getChangedDetail(refInfo: any, runId: number, refId: number) {
    let changeDetails: any = "";
    var now = new Date();
    if (refInfo !== null && refInfo.ruleRefUpdates !== undefined) {
      refInfo.ruleRefUpdates.forEach(ruleRefUpd => {
        if (ruleRefUpd.ruleImpactAnalysisRunId === runId && ruleRefUpd.referenceId === refId) {
          changeDetails = ruleRefUpd.refChangeDetails;
        }
      });
      if (refInfo !== null && refInfo.refEffectiveToDt !== undefined) {
        refInfo.refEffectiveToDt = new Date(refInfo.refEffectiveToDt);
        now.setHours(0, 0, 0, 0);
        if (refInfo.refEffectiveToDt < now) {
          return "";
        }
      }
    }
    return changeDetails;
  }

  public getChangedStatus(refInfo: any, runId: number, refId: number) {
    let changeDetails: any = "";
    var now = new Date();
    if (refInfo !== null && refInfo.ruleRefUpdates !== undefined) {
      refInfo.ruleRefUpdates.forEach(ruleRefUpd => {
        if (ruleRefUpd.ruleImpactAnalysisRunId === runId && ruleRefUpd.referenceId === refId) {
          changeDetails = ruleRefUpd.refChangeStatusId;
        }
      });
    }
    if (refInfo !== null && refInfo.refEffectiveToDt !== undefined) {
      refInfo.refEffectiveToDt = new Date(refInfo.refEffectiveToDt);
      now.setHours(0, 0, 0, 0);
      if (refInfo.refEffectiveToDt < now) {
        return Constants.STATUS_CODE_RETIRE;
      }
      if (refInfo.refEffectiveToDt >= now && changeDetails == Constants.STATUS_CODE_RETIRE) {
        return Constants.CHANGE_STATUS_NO_CHANGE_VALUE;
      }
    }
    return changeDetails;
  }

  /*
  Call back Function to refresh and fetch all the available references
  based on the rule or idea id and stage.
*/

  refreshReference() {
    if (this.ruleCreationStatus) {
      this.ruleStage = Constants.ECL_IDEA_STAGE;
    } else if (this.fromMaintenanceProcess) {
      this.ruleStage = Constants.ECL_LIBRARY_STAGE;
    } else {
      this.ruleStage = Constants.ECL_PROVISIONAL_STAGE;
    }
    if (this.ruleId) {
      this.getAllReferences(this.ruleId, this.ruleStage);
    }
  }

  /*
   Call back Function to save references at different stages.
 */
  changeToProvisionalStatus(ruleId: any) {
    this.ruleId = ruleId;
    if (this.ruleId) {
      this.ruleCreationStatus = false;
      this.ruleStage = Constants.ECL_PROVISIONAL_STAGE;
    }
  }

  /*
 Function to delete the selected EclReference based on the reference Id .
*/
  deleteReference(eclReferenceId: number) {
    if (!this.readOnlyView) {
      this.eclReferenceService.deleteEclReference(eclReferenceId).subscribe(response => {
        if (response.data !== null) {
          this.refreshReference();
          this.toastService.messageSuccess('Delete', 'Reference Detail Successfully Deleted', 3000, true);
        }
      });
    }
  }

  /*
   Function to fetch the selected EclReference details based on the Eclreference Id .
  */
  selectReference(eclReferenceId: number, selectedRefRow: any) {
    this.eclReferenceService.getEclReference(eclReferenceId).subscribe(response => {
      if (response.message === SUCCESS) {
        this.selectedReferenceDetails(response.data, selectedRefRow);
        this.display = "block";
      }
    });
  }

  /*
 Call back Function to show the selected EclReference details based on the Eclreference Id .
*/
  selectedReferenceDetails(referenceData: any, selectedRefRow: any) {
    this.reference = new ReferenceInfoDto();
    this.eclRef = new EclReferenceDto();
    if (referenceData !== null || referenceData !== undefined) {
      this.eclRef = referenceData;
      this.reference = referenceData.refInfo;
      const referenceId = this.reference.referenceId;
      const eclRefId = referenceData.eclReferenceId;
      if (this.reference.refUrlPublicationDt) {
        this.reference.refUrlPublicationDt = new Date(this.reference.refUrlPublicationDt);
      }

      if (this.reference.refEffectiveFromDt) {
        this.reference.refEffectiveFromDt = new Date(this.reference.refEffectiveFromDt);
      }
      if (this.reference.refEffectiveToDt) {
        this.reference.refEffectiveToDt = new Date(this.reference.refEffectiveToDt);
      }
      if (this.eclRef.refFile) {
        let fileNumber = REF_URL_FILE;
        this.refFileDownload = environment.restServiceUrl + RoutingConstants.ECL_REFERENCES_URL + "/" + RoutingConstants.REF_FILE_DOWNLOAD_FIRST_URL + "/" + referenceId + "/" + fileNumber;
      }
      if (this.eclRef.refFile1) {
        let fileNumber = REF_DOC_FILE1;
        this.refFileDownload1 = environment.restServiceUrl + RoutingConstants.ECL_REFERENCES_URL + "/" + RoutingConstants.REF_FILE_DOWNLOAD_SECOND_URL + "/" + referenceId + "/" + fileNumber;
      }
      if (this.eclRef.refFile2) {
        let fileNumber = REF_DOC_FILE2;
        this.refFileDownload2 = environment.restServiceUrl + RoutingConstants.ECL_REFERENCES_URL + "/" + RoutingConstants.REF_FILE_DOWNLOAD_THIRD_URL + "/" + referenceId + "/" + fileNumber;
      }
      if (this.eclRef.commentsFile1) {
        let fileNumber = REF_COMMENTS_FILE1;
        this.refCommentsFileDownload1 = environment.restServiceUrl + RoutingConstants.ECL_REFERENCES_URL + "/" + RoutingConstants.ATTACHMENT_DOWNLOAD + "/" + eclRefId + "/" + fileNumber;
      }
      if (this.eclRef.commentsFile2) {
        let fileNumber = REF_COMMENTS_FILE2;
        this.refCommentsFileDownload2 = environment.restServiceUrl + RoutingConstants.ECL_REFERENCES_URL + "/" + RoutingConstants.ATTACHMENT_DOWNLOAD + "/" + eclRefId + "/" + fileNumber;
      }
      if (this.eclRef.removeReferencesFlag) {
        this.isRemovableObject = null;
      } else {
        this.isRemovableObject = {};
      }
      this.clearFileUploadSelection(this.uploadControl, 1);
      this.clearFileUploadSelection(this.uploadControl1, 2);
      this.clearFileUploadSelection(this.uploadControl2, 3);
      this.clearFileUploadSelection(this.commentUpload1, 4);
      this.clearFileUploadSelection(this.commentUpload2, 5);
    }
  }

  /*
  Function to save the selected EclReference details based on the Eclreference Id or create a new reference for the rule or idea .
*/
  saveEclReferenceDetails(saveMessageView: boolean) {

    this.eclRef.eclAttachmentNameList = [];

    if (this.uploadControl !== undefined) {
      this.uploadControl.files.forEach(file => {
        this.reference.refUrlFileName = file.name;
        this.reference.refUrlFileType = file.type;
      })
    }

    if (this.uploadControl1 !== undefined) {
      this.uploadControl1.files.forEach(file => {
        this.reference.refDocFileName1 = file.name;
        this.reference.refDocFileType1 = file.type;
      })
    }

    if (this.uploadControl2 !== undefined) {
      this.uploadControl2.files.forEach(file => {
        this.reference.refDocFileName2 = file.name;
        this.reference.refDocFileType2 = file.type;
      })
    }

    if (this.commentUpload1 !== undefined) {
      this.commentUpload1.files.forEach(file => {
        this.eclRef.eclAttachmentNameList.push(file.name);
      })
    }

    if (this.commentUpload2 !== undefined) {
      this.commentUpload2.files.forEach(file => {
        this.eclRef.eclAttachmentNameList.push(file.name);
      })
    }

    if (this.validateForm()) {
      if (JSON.stringify(this.reference.refUrlPublicationDt) !== null && JSON.stringify(this.reference.refUrlPublicationDt) !== undefined) {
        this.reference.refUrlPublicationDt = new Date(this.reference.refUrlPublicationDt);
      }
      if (JSON.stringify(this.reference.refEffectiveFromDt) !== null && JSON.stringify(this.reference.refEffectiveFromDt) !== undefined) {

        this.reference.refEffectiveFromDt = new Date(this.reference.refEffectiveFromDt);
      }
      if (JSON.stringify(this.reference.refEffectiveToDt) !== null && JSON.stringify(this.reference.refEffectiveToDt) !== undefined) {

        this.reference.refEffectiveToDt = new Date(this.reference.refEffectiveToDt);
      }
      this.eclRef.refInfo = this.reference;
      if (this.eclRef.refInfo.refSource && this.eclRef.referenceSource) {
        this.eclRef.refInfo.refSource.refSourceId = this.eclRef.referenceSource;
        this.eclRef.refInfo.refSource.sourceDesc = this.eclRef.refInfo.referenceName;
      }
      this.eclRef.user = this.userId;
      this.eclRef.ruleId = this.ruleId;
      this.eclRef.eclStage = this.ruleStage;
      this.eclReferenceService.saveEclReference(this.eclRef, this.uploadControl.files, this.uploadControl1.files, this.uploadControl2.files, this.commentUpload1.files, this.commentUpload2.files).subscribe(response => {
        if (saveMessageView) {
          if (response !== null && response !== undefined) {
            if (response.data !== null) {
              this.refreshReference();
              this.populateApprovalStatus.emit();
              this.toastService.messageSuccess('Save', 'Reference Details Successfully Saved', 3000, true);
            } else {
              this.toastService.messageWarning('warn', 'Please edit and save the Reference Details!', 3000, true);
            }
          } else {
            this.toastService.messageWarning('warn', 'Issue saving the Reference Details!', 3000, true);
          }
        }
      });
      this.clearScreenReference();
      this.isReferenceDisableObject = {};
      this.isAddingObject = {};
      this.isSavableObject = {};
      this.isRemovableObject = {};
      this.selectedReference = null;
      this.refreshReference();
    } else {
      // nothing happens right?
    }
  }

  showRefSourceName(event) {
    if (event.value.id !== 0) {
      this.setReferenceSourceAndName();
    }
  }

  setReferenceSourceAndName() {
    this.eclRef.referenceSource = this.selectedSource.id;
    this.reference.referenceName = this.selectedSource.name;
  }

  /**
   * Method showRefDetailsPage
   * @param event Change detction for the event.
   */
  addReference() {
    this.clearScreenReference();
    this.isReferenceDisableObject = null;
    this.isAddingObject = null;
    this.isSavableObject = null;
    this.isRemovableObject = {};
    this.selectedReference = null;
  }

  /**
   * Form Validation
   * File Name Validation
   * File Title Validation
   * URL validation
   */
  validateReferenceUrl() {
    let url = this.reference.referenceURL;
    let res = true;
    if (url) {
      if (url.substring(0, 7) === 'http://' || url.substring(0, 8) === 'https://') {
        res = true;
      } else {
        res = false;
      }
    }
    return res;
  }

  validateForm() {
    let res: boolean = true;
    if (!this.reference.referenceTitle) {
      this.toastService.messageWarning('Input', 'Please enter a Title to save', 2000);
      res = false;
    }
    if (!this.reference.referenceName) {
      this.toastService.messageWarning('Input', 'Please enter a Name to save', 2000);
      res = false;
    }
    if (!this.validateReferenceUrl()) {
      this.toastService.messageWarning('Input', 'Please enter valid URL to save', 2000);
      res = false;
    }
    return res;
  }

  keylimitset(event) {
    this.showCount = this.keylimit.keyCheck(event, this.limitCount);
    this.selectedInfo = event;
  }

  /**
     * The upload control clear method does not clear the file count if the
     * file count is not set to 0 then the choose button is not enabled again.
     * @param fileUploader FileUploader we want to clear
     */
  clearFileUploadSelection(fileUploader: FileUpload, num: number) {
    if (num === 1) {
      this.Validatefiles1 = [];
    } else if (num === 2) {
      this.Validatefiles2 = [];
    } else if (num === 3) {
      this.Validatefiles3 = [];
    } else if (num === 4) {
      this.Validatefiles4 = [];
    } else {
      this.Validatefiles5 = [];
    }
    fileUploader.uploadedFileCount = 0;
    fileUploader.clear();
  }
  //clear the files from upload object
  onClearFile(num: number) {
    if (num === 1) {
      this.Validatefiles1 = [];
    } else if (num === 2) {
      this.Validatefiles2 = [];
    } else if (num === 3) {
      this.Validatefiles3 = [];
    } else if (num === 4) {
      this.Validatefiles4 = [];
    } else {
      this.Validatefiles5 = [];
    }
  }
  /**
   * Selection of File Upload
   * @param event Files
   * @author Jeffrey King
   * File name validation
   */
  onSelect(event: FileUpload, num: number) {
    if (num === 1) {
      this.fileNameValidation(event, 1);
    } else if (num === 2) {
      this.fileNameValidation(event, 2);
    } else if (num === 3) {
      this.fileNameValidation(event, 3);
    } else if (num === 4) {
      this.fileNameValidation(event, 4);
    } else {
      this.fileNameValidation(event, 5);
    }
  }

  /**
   * Removal
   * @param event File associate to the validation is working with.
   * @param num This number determines which reference detail is it currently check with.
   * @author Jeffrey King
   */
  onRemove(event, num: number) {
    if (num === 1) {
      this.Validatefiles1 = this.Validatefiles1.filter((value) => {
        if (value.name !== event.file.name) {
          return value;
        } else {
          this.toastService.messageInfo('Info', 'You have removed a file', 3000, false);
        }
      });
    } else if (num === 2) {
      this.Validatefiles2 = this.Validatefiles2.filter((value) => {
        if (value.name !== event.file.name) {
          return value;
        } else {
          this.toastService.messageInfo('Info', 'You have removed a file', 3000, false);
        }
      });
    } else if (num === 3) {
      this.Validatefiles3 = this.Validatefiles3.filter((value) => {
        if (value.name !== event.file.name) {
          return value;
        } else {
          this.toastService.messageInfo('Info', 'You have removed a file', 3000, false);
        }
      });
    } else if (num === 4) {
      this.Validatefiles4 = this.Validatefiles4.filter((value) => {
        if (value.name !== event.file.name) {
          return value;
        } else {
          this.toastService.messageInfo('Info', 'You have removed a file', 3000, false);
        }
      });
    } else {
      this.Validatefiles5 = this.Validatefiles5.filter((value) => {
        if (value.name !== event.file.name) {
          return value;
        } else {
          this.toastService.messageInfo('Info', 'You have removed a file', 3000, false);
        }
      });
    }
  }

  /**
   * Main File validation
   * @param event File associate to the validation is working with.
   * @param num This number determines which reference detail is it currently check with.
   * @author Jeffrey King
   */
  fileNameValidation(event, num: number) {
    if (num === 1) {
      if ((this.Validatefiles2 && this.Validatefiles2.length > 0) || (this.Validatefiles3 && this.Validatefiles3.length > 0)) {
        this.uploadControl.files = this.uploadControl.files.filter(file1 => {
          if (!this.Validatefiles2.find(file2 => file2.name === file1.name)) {
            return file1;
          } else {
            this.toastService.messageWarning('File Upload', `Reference Detail 1 and Reference Detail 2 must not contain same file names.`, 5000, false);
          }
        }).filter(file1 => {
          if (!this.Validatefiles3.find(file3 => file3.name === file1.name)) {
            return file1;
          } else {
            this.toastService.messageWarning('File Upload', `Reference Detail 1 and Reference Detail 3 must not contain same file names.`, 5000, false);
          }
        });
      }
      this.Validatefiles1.push(...this.uploadControl.files);
    } else if (num === 2) {
      if ((this.Validatefiles1 && this.Validatefiles1.length > 0) || (this.Validatefiles3 && this.Validatefiles3.length > 0)) {
        this.uploadControl1.files = this.uploadControl1.files.filter(file2 => {
          if (!this.Validatefiles1.find(file1 => file1.name === file2.name)) {
            return file2;
          } else {
            this.toastService.messageWarning('File Upload', `Reference Document 1 and Reference URL File must not contain same file names.`, 5000, false);
          }
        }).filter(file2 => {
          if (!this.Validatefiles3.find(file3 => file3.name === file2.name)) {
            return file2;
          } else {
            this.toastService.messageWarning('File Upload', `Reference Document 1 and Reference Document 2 must not contain same file names.`, 5000, false);
          }
        });
      }
      this.Validatefiles2.push(...this.uploadControl1.files);
    } else if (num === 3) {
      if (this.Validatefiles1 && this.Validatefiles1.length > 0 || (this.Validatefiles2 && this.Validatefiles2.length > 0)) {
        this.uploadControl2.files = this.uploadControl2.files.filter(file3 => {
          if (!this.Validatefiles1.find(file1 => file1.name === file3.name)) {
            return file3;
          } else {
            this.toastService.messageWarning('File Upload', `Reference Document 2 and Reference URL File must not contain same file names.`, 5000, false);
          }
        }).filter(file3 => {
          if (!this.Validatefiles2.find(file2 => file2.name === file3.name)) {
            return file3;
          } else {
            this.toastService.messageWarning('File Upload', `Reference Document 2 and Reference Document 1 must not contain same file names.`, 5000, false);
          }
        });
      }
      this.Validatefiles3.push(...this.uploadControl2.files);
    } else if (num === 4) {
      if (this.Validatefiles5 && this.Validatefiles5.length > 0 || (this.Validatefiles1 && this.Validatefiles1.length > 0) ||
        (this.Validatefiles2 && this.Validatefiles2.length > 0) || (this.Validatefiles3 && this.Validatefiles3.length > 0)) {
        this.commentUpload1.files = this.commentUpload1.files.filter(file4 => {
          if (!this.Validatefiles5.find(file5 => file5.name === file4.name)) {
            return file4;
          } else {
            this.toastService.messageWarning('File Upload', `Reference Document 2 and Reference URL File must not contain same file names.`, 5000, false);
          }
        }).filter(file4 => {
          if (!this.Validatefiles1.find(file1 => file1.name === file4.name)) {
            return file4;
          } else {
            this.toastService.messageWarning('File Upload', `Comment Reference 1 and Reference URL must not contain same file names.`, 5000, false);
          }
        }).filter(file4 => {
          if (!this.Validatefiles2.find(file2 => file2.name === file4.name)) {
            return file4;
          } else {
            this.toastService.messageWarning('File Upload', `Comment Reference 1 and Reference Document 1 must not contain same file names.`, 5000, false);
          }
        }).filter(file4 => {
          if (!this.Validatefiles3.find(file3 => file3.name === file4.name)) {
            return file4;
          } else {
            this.toastService.messageWarning('File Upload', `Comment Reference 1 and Reference Document 2 must not contain same file names.`, 5000, false);
          }
        });
      }
      this.Validatefiles4.push(...this.commentUpload1.files);
    } else if (num === 5) {
      if (this.Validatefiles4 && this.Validatefiles4.length > 0 || (this.Validatefiles1 && this.Validatefiles1.length > 0) ||
        (this.Validatefiles2 && this.Validatefiles2.length > 0) || (this.Validatefiles3 && this.Validatefiles3.length > 0)) {
        this.commentUpload2.files = this.commentUpload2.files.filter(file5 => {
          if (!this.Validatefiles4.find(file4 => file4.name === file5.name)) {
            return file5;
          } else {
            this.toastService.messageWarning('File Upload', `Comment Reference 2 and Comment Reference 1 File must not contain same file names.`, 5000, false);
          }
        }).filter(file5 => {
          if (!this.Validatefiles1.find(file1 => file1.name === file5.name)) {
            return file5;
          } else {
            this.toastService.messageWarning('File Upload', `Comment Reference 2 and Reference URL must not contain same file names.`, 5000, false);
          }
        }).filter(file5 => {
          if (!this.Validatefiles2.find(file2 => file2.name === file5.name)) {
            return file5;
          } else {
            this.toastService.messageWarning('File Upload', `Comment Reference 2 and Reference Document 1 must not contain same file names.`, 5000, false);
          }
        }).filter(file5 => {
          if (!this.Validatefiles3.find(file3 => file3.name === file5.name)) {
            return file5;
          } else {
            this.toastService.messageWarning('File Upload', `Comment Reference 2 and Reference Document 2 and Reference Document 1 must not contain same file names.`, 5000, false);
          }
        });
      }
    }

    this.Validatefiles5.push(...this.commentUpload2.files);
  }


  /* Function to show the reference selected from the references tab*/

  showReferenceInfo(refId: any) {
    for (let obj in this.ruleReferences) {
      let reference = this.ruleReferences[obj];
      if (refId == reference.refInfo.referenceId) {
        this.refObj = reference;
        let referenceId = this.refObj.refInfo.referenceId;
        if (this.refObj.refInfo.refUrlFileName !== null && this.refObj.refInfo.refUrlFileName !== undefined) {
          let fileNumber = REF_URL_FILE;
          this.refFileDownloadUrl = environment.restServiceUrl + RoutingConstants.ECL_REFERENCES_URL + "/" + RoutingConstants.REF_FILE_DOWNLOAD_FIRST_URL + "/" + referenceId + "/" + fileNumber;
        }
        if (this.refObj.refInfo.refDocFileName1 !== null && this.refObj.refInfo.refDocFileName1 !== undefined) {
          let fileNumber = REF_DOC_FILE1;
          this.refFileDownloadUrl1 = environment.restServiceUrl + RoutingConstants.ECL_REFERENCES_URL + "/" + RoutingConstants.REF_FILE_DOWNLOAD_SECOND_URL + "/" + referenceId + "/" + fileNumber;
        }
        if (this.refObj.refInfo.refDocFileName2 !== null && this.refObj.refInfo.refDocFileName2 !== undefined) {
          let fileNumber = REF_DOC_FILE2;
          this.refFileDownloadUrl2 = environment.restServiceUrl + RoutingConstants.ECL_REFERENCES_URL + "/" + RoutingConstants.REF_FILE_DOWNLOAD_THIRD_URL + "/" + referenceId + "/" + fileNumber;
        }
      }
    }
  }

  /* Function to hide the selected reference data*/

  exit() {
    this.refObj = null;
  }

  /* Function to download the first file selected */

  provRefDocFileDownload1(fileUrl: any, fileName: any, fileType: any) {
    if (fileUrl !== undefined && fileUrl !== null) {
      this.referenceService.refFileDownload1(fileUrl).subscribe(response => {
        if (response !== null && response !== undefined) {
          this.downloadReferenceFileData1(response, fileName, fileType);
        }
      });
    }
  }

  /* Function to download the second file selected */

  provRefDocFileDownload2(fileUrl: any, fileName: any, fileType: any) {
    if (fileUrl !== undefined && fileUrl !== null) {
      this.referenceService.refFileDownload2(fileUrl).subscribe(response => {
        if (response !== null && response !== undefined) {
          this.downloadReferenceFileData2(response, fileName, fileType);
        }
      });
    }
  }

  /* Function to download the third file selected */

  provRefDocFileDownload3(fileUrl: any, fileName: any, fileType: any) {
    if (fileUrl !== undefined && fileUrl !== null) {
      this.referenceService.refFileDownload3(fileUrl).subscribe(response => {
        if (response !== null && response !== undefined) {
          this.downloadReferenceFileData3(response, fileName, fileType);
        }
      });
    }
  }

  removeReference() {
    this.Message = 'Are you sure you want to remove this reference?';
    this.removeDisplay = true;
  }

  removeDialogYes() {
    this.deleteReference(this.selectedReference.eclReferenceId);
    this.clearScreenReference();
    this.isReferenceDisableObject = {};
    this.isAddingObject = {};
    this.isSavableObject = {};
    this.isRemovableObject = {};
    this.removeDisplay = false;
  }

  removeDialogNo() {
    this.removeDisplay = false;
  }

  onRowSelect(event) {
    this.selectedSource = { id: this.selectedReference.refSourceId, name: this.selectedReference.source };
    this.setReferenceSourceAndName();
    this.selectReference(this.selectedReference.eclReferenceId, this.selectedReference);
    this.isAddingObject = {};
    this.isSavableObject = null;
    this.isRemovableObject = null;
    this.isReferenceDisableObject = null;
  }

  onRowUnselect(event) {
    this.clearScreenReference();
    this.isReferenceDisableObject = {};
    this.isAddingObject = {};
    this.isSavableObject = {};
    this.isRemovableObject = {};
  }

  cancelAddingReference() {
    this.Message = 'You will lose edited data if you cancel.';
    this.cancelDisplay = true;
  }

  cancelDialogYes() {
    this.clearScreenReference();
    this.isReferenceDisableObject = {};
    this.isAddingObject = {};
    this.isSavableObject = {};
    this.isRemovableObject = {};
    this.selectedReference = null;
    this.cancelDisplay = false;
  }

  cancelDialogNo() {
    this.cancelDisplay = true;
  }

  clearScreenReference() {

    if (this.uploadControl) {
      this.clearFileUploadSelection(this.uploadControl, 1);
    }
    if (this.uploadControl1) {
      this.clearFileUploadSelection(this.uploadControl1, 2);
    }
    if (this.uploadControl2) {
      this.clearFileUploadSelection(this.uploadControl2, 3);
    }
    if (this.commentUpload1) {
      this.clearFileUploadSelection(this.commentUpload1, 4);
    }
    if (this.commentUpload2) {
      this.clearFileUploadSelection(this.commentUpload2, 5);
    }
    this.resetReferenceSource();
    this.reference = new ReferenceInfoDto();
    this.eclRef = new EclReferenceDto();

    this.eclRef.referenceSource = this.selectedSource.id;
    this.reference.referenceName = this.selectedSource.name;
    this.refValuesEditable = false;
    this.display = 'block';
  }

  resetReferenceSource() {
    this.selectedSource = 0;
  }

  /* function to confirm message for exit button*/
  onEffectiveToDtSelected(event: any) {
    var now = new Date();
    now.setHours(0, 0, 0, 0);
    if (this.fromMaintenanceProcess) {
      if (this.reference.refEffectiveToDt >= now && this.selectedReference.refEffectiveToDt < now) {
        if (this.selectedReference.changeDetailsDisplayFlag) {
          this.showDialog = true;
          this.showDialogRetire = false;
        } else {
          this.setDefaultValueForApprovalDropdown.emit();
        }
      } else if (this.reference.refEffectiveToDt < now) {
        this.showDialog = true;
        this.showDialogRetire = true;
      }
    }
  }

  checkEffectiveToDtisRetired(refEffToDate: Date) {
    var now = new Date();
    now.setHours(0, 0, 0, 0);
    if (refEffToDate === undefined || refEffToDate >= now) {
      return false;
    } else {
      return true;
    }
  }

  reInstateRef() {

    this.saveEclReferenceDetails(false);
    this.refreshReference();
    this.showDialog = false;
    this.setDefaultValueForApprovalDropdown.emit();
    this.reInstateFlag = true;
  }

  checkIfAllReferencesRetired() {
    if (this.ruleId) {
      for (let entry of this.ruleReferencesArray) {
        if (!this.checkEffectiveToDtisRetired(entry.refEffectiveToDt)) {
          this.retireStatus = false;
          if (this.reInstateFlag) {
            this.retireStatusValue.emit(this.retireStatus);
            this.retireRuleTabStatus.emit();
          }
          break;
        } else {
          this.retireStatus = true;
        }
      }

      if (this.ruleImpactAnalysisRun != undefined && this.retireStatus) {

        if (this.ruleImpactAnalysisRun != undefined && this.retireStatus) {
          this.ruleImpactAnalysisRun.ruleImpactTypeId = null;
          this.ruleImpactAnalysisRun.ruleImpactedInd = null;
          this.ruleImpactAnalysisRun.ruleImpactAnalysis = "";
        }

        this.retireStatusValue.emit(this.retireStatus);
        this.approvalDropdownRefresh.emit();

      }
    }
  }
  
  closeDialog() {
    if ((this.reference && this.reference) && (this.selectedReference && this.selectedReference.refEffectiveToDt)) {
      this.reference.refEffectiveToDt = this.selectedReference.refEffectiveToDt;
    }
    this.showDialog = false;
  }
}
