import { Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { IdeaService } from 'src/app/services/idea.service';
import { NewIdeaService } from 'src/app/services/new-idea.service';
import { ReferenceInfo } from 'src/app/shared/models/reference-info';
import { FileUpload, SelectItem, DynamicDialogConfig, DialogService, MessageService } from 'primeng/primeng';
import { sqlDateConversion, AppUtils, KeyLimitService } from 'src/app/shared/services/utils';
import { ProvisionalRuleService } from 'src/app/services/provisional-rule.service';
import { EclReference } from 'src/app/shared/models/ecl-reference';
import { ReferenceService } from 'src/app/services/reference.service';
import { EclReferenceDto } from 'src/app/shared/models/dto/ecl-reference-dto';
import { ReferenceInfoDto } from 'src/app/shared/models/dto/reference-info-dto';
import { environment } from 'src/environments/environment';
import { EclAttachments } from 'src/app/shared/models/ecl-attachments';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { Constants } from 'src/app/shared/models/constants';


const IDEA_STAGE = 1;
const PROV_STAGE = 2;
const SUCCESS = "Success";
const REF_URL_FILE = 1;
const REF_DOC_FILE1 = 2;
const REF_DOC_FILE2 = 3;
const REF_COMMENTS_FILE1 = 1;
const REF_COMMENTS_FILE2 = 2;


@Component({
  selector: 'nirReferenceDetail',
  templateUrl: './nir-reference-detail.component.html',
  styleUrls: ['./nir-reference-detail.component.css']
})
export class NirReferenceDetailComponent implements OnInit, AfterViewInit {

  @ViewChild('uploadControl') uploadControl: FileUpload;
  @ViewChild('uploadControl1') uploadControl1: FileUpload;
  @ViewChild('uploadControl2') uploadControl2: FileUpload;
  @ViewChild('uploadControl3') uploadControl3: FileUpload;
  @ViewChild('uploadControl4') uploadControl4: FileUpload;
  @Input() readOnlyView;
  @Input() ideaId: number;

  /*  Boolean value to check if the it is at idea or provisional rule level 
  @True: idea level
  @False: provisional rule
  */
  @Input() ruleCreationStatus: boolean;

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
  newRefSource: SelectItem[] = [{ label: 'Choose', value: { id: 0, name: ''} }];
  userId: number;

  eclRef: EclReferenceDto;
  reference: ReferenceInfoDto;

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
  refcommentsFileDownload1: string;
  refcommentsFileDownload2: string;

  /* Reference Objects to store Reference Details and Rule Reference */
  display = 'none';
  selectedSource: any;
  selectedReferenceValue: any;
  refValuesEditable: boolean = false;
  refSource: number;
  refSourceText: string;
  selectedRefObj: ReferenceInfo;
  selectedEclRefObj: EclReference;

  /***Delete attached file warning***/
  removeAttachmentDisplay: boolean = false;
  isDeletingReferenceFile: boolean = false;
  referenceFileNumberDeleting: number;
  isDeletingCommentsFile: boolean = false;
  commentsFileNumberDeleting: number;

  yearValidRangeEft = `${Constants.EFT_MIN_VALID_YEAR}:${Constants.EFT_MAX_VALID_YEAR}`;
  
  constructor(public config: DynamicDialogConfig, public dialogService: DialogService, private appUtils: AppUtils,
    private keylimit: KeyLimitService, private messageService: MessageService, private eclReferenceService: ReferenceService) {
    this.reference = new ReferenceInfoDto();
    this.eclReference = [];
    this.eclRef = new EclReferenceDto();
  };

  ngOnInit() {
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
      this.ruleStage = IDEA_STAGE;
    } else {
      this.ruleStage = PROV_STAGE;
    }


  }
  ngAfterViewInit() {
    if (this.ideaId) {
      this.getAllReferences(this.ideaId, this.ruleStage);
    }
  }

  /***Method to delete a reference file attachment related to url in New Idea Research***/
  deleteReferenceFile(fileNumber: number) {
    this.isDeletingCommentsFile = false;
    this.isDeletingReferenceFile = true;
    this.referenceFileNumberDeleting = fileNumber;
    this.removeAttachmentDisplay = true;
  }

  /***Method to delete an attached file related to Comments in New Idea Research***/
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
      let eclAttachmentId = this.eclRef.eclAttachmentList[fileNumber - 1].eclAttachmentId;
      this.eclReferenceService.deleteCommentsAttachment(eclAttachmentId).subscribe(response => {
        if (response.code === 200) {
          if (fileNumber === 1) {
            this.eclRef.commentsFile1 = false;
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

  /* Function to download the comment attachment first file selected */

  referenceFileDownload4(fileUrl: any, fileName: any, fileType: any) {
    if (fileUrl !== null && fileUrl !== undefined) {
      this.eclReferenceService.refcommentsFileDownload1(fileUrl).subscribe(response => {
        if (response !== null && response !== undefined) {
          this.downloadReferenceFileData4(response, fileName, fileType);
        }
      });
    }
  }

  /* Call back function to download the comment attachment first file*/

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

  /* Function to download the comment attachment Second file selected */

  referenceFileDownload5(fileUrl: any, fileName: any, fileType: any) {
    if (fileUrl !== null && fileUrl !== undefined) {
      this.eclReferenceService.refcommentsFileDownload2(fileUrl).subscribe(response => {
        if (response !== null && response !== undefined) {
          this.downloadReferenceFileData3(response, fileName, fileType);
        }
      });
    }
  }

  /* Call back function to download the comment attachment second file*/

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

  getAllReferences(ideaId: number, stage: any) {
    this.eclReferenceService.getAllEclReferences(ideaId, stage).subscribe((response: any) => {
      if (response && response.data) {
        let eclReferenceArray = response.data;
        this.referenceArray = [];
        eclReferenceArray.forEach(reference => {
          this.referenceArray.push(reference);
        });
      }
    
    });
    return this.referenceArray;
  }

  /* 
  Call back Function to refresh and fetch all the available references 
  based on the rule or idea id and stage.
*/

  refreshReference() {
    if (this.ideaId) {
      this.getAllReferences(this.ideaId, IDEA_STAGE);
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
          this.messageService.add({ severity: 'success', summary: 'Delete', detail: 'Reference Detail Successfully Deleted', life: 3000, closable: true });
        }
      });
    }
  }

  /* 
   Function to fetch the selected EclReference details based on the Eclreference Id .
  */
  selectReference(eclReferenceId: number) {
    if (!this.readOnlyView) {
      this.eclReferenceService.getEclReference(eclReferenceId).subscribe(response => {
        if (response.message === SUCCESS) {
          this.selectedReferenceDetails(response.data);
          this.display = "block";
        }
      });
    }
  }

  /* 
 Call back Function to show the selected EclReference details based on the Eclreference Id .
*/
  selectedReferenceDetails(referenceData: any) {
    this.reference = new ReferenceInfoDto();
    this.eclRef = new EclReferenceDto();
    if (referenceData !== null || referenceData !== undefined) {
      this.eclRef = referenceData;
      this.reference = referenceData.refInfo;
      if(this.reference.refSource.sourceDesc.toUpperCase() == Constants.MANUAL_REF_SOURCE) {
        this.reference.referenceName = '';
        this.selectedReferenceValue = { label: 'Choose', value: { id: 0, name: ''}};
      } else {
        this.selectedReferenceValue =  { id: this.reference.refSource.refSourceId, name: this.reference.refSource.sourceDesc};
      }
      let referenceId = this.reference.referenceId;
      let eclRefId = referenceData.eclReferenceId;
      if (this.reference.refUrlPublicationDt) {
        this.reference.refUrlPublicationDt = new Date(this.reference.refUrlPublicationDt);
      }

      if (this.reference.refEffectiveFromDt ) {
        this.reference.refEffectiveFromDt = new Date(this.reference.refEffectiveFromDt);
      }
      if (this.reference.refEffectiveToDt ) {
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
      if (this.eclRef.commentsFile1){
        let fileNumber = REF_COMMENTS_FILE1;
        this.refcommentsFileDownload1 = environment.restServiceUrl + RoutingConstants.ECL_REFERENCES_URL + "/" + RoutingConstants.ATTACHMENT_DOWNLOAD + "/" + eclRefId + "/" + fileNumber;
      }
      if (this.eclRef.commentsFile2){
        if(this.eclRef.commentsFile1 === false){
          this.eclRef.eclAttachmentList[1]= this.eclRef.eclAttachmentList[0];
          }
        let fileNumber = REF_COMMENTS_FILE2;
        this.refcommentsFileDownload2 = environment.restServiceUrl + RoutingConstants.ECL_REFERENCES_URL + "/" + RoutingConstants.ATTACHMENT_DOWNLOAD + "/" + eclRefId + "/" + fileNumber;
      }
      this.clearFileUploadSelection(this.uploadControl, 1);
      this.clearFileUploadSelection(this.uploadControl1, 2);
      this.clearFileUploadSelection(this.uploadControl2, 3);
      this.clearFileUploadSelection(this.uploadControl3, 4);
      this.clearFileUploadSelection(this.uploadControl4, 5);
    }
  }

  /* 
  Function to save the selected EclReference details based on the Eclreference Id or create a new reference for the rule or idea .
*/
  saveEclReferenceDetails() {

    this.eclRef.eclAttachmentNameList = [];

    if(this.selectedReferenceValue !== null && this.selectedReferenceValue !== undefined) {
      this.eclRef.referenceSource = this.selectedReferenceValue.id;
      this.reference.referenceName = this.selectedReferenceValue.name;
      if (this.reference.refSource) {
        this.reference.refSource.refSourceId = this.selectedReferenceValue.id;
        this.reference.refSource.sourceShortDesc = "";
        this.reference.refSource.sourceDesc = this.selectedReferenceValue.name;
      } else {
        this.reference.refSource = {refSourceId: this.selectedReferenceValue.id, sourceShortDesc: '', sourceDesc: this.selectedReferenceValue.name};
      }
    }
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

    if (this.uploadControl3 !== undefined) {
      this.uploadControl3.files.forEach(file => {
        this.eclRef.eclAttachmentNameList[0] = file.name;
        })
    }

    if (this.uploadControl4 !== undefined) {
      this.uploadControl4.files.forEach(file => {
          this.eclRef.eclAttachmentNameList[1] = file.name;   
        })
    }

    if (this.validateForm()) {
      if (JSON.stringify(this.reference.refUrlPublicationDt) !== null && JSON.stringify(this.reference.refUrlPublicationDt) !== undefined) {
        // this.reference.refUrlPublicationDt = this.sqldateConvert.JSDateToSQLDate(this.reference.refUrlPublicationDt);
        this.reference.refUrlPublicationDt = new Date(this.reference.refUrlPublicationDt);
      }
      if (JSON.stringify(this.reference.refEffectiveFromDt) !== null && JSON.stringify(this.reference.refEffectiveFromDt) !== undefined) {

        this.reference.refEffectiveFromDt = new Date(this.reference.refEffectiveFromDt);
      }
      if (JSON.stringify(this.reference.refEffectiveToDt) !== null && JSON.stringify(this.reference.refEffectiveToDt) !== undefined) {

        this.reference.refEffectiveToDt = new Date(this.reference.refEffectiveToDt);
      }
      this.eclRef.refInfo = this.reference;
      this.eclRef.user = this.userId;
      this.eclRef.ruleId = this.ideaId;
      this.eclRef.eclStage = this.ruleStage;
      this.eclReferenceService.saveEclReference(this.eclRef, this.uploadControl.files, this.uploadControl1.files, this.uploadControl2.files, this.uploadControl3.files, this.uploadControl4.files).subscribe(response => {
        if (response && response.data) {
          this.refreshReference();
          this.closEcleRefDetailsDialog();
          this.messageService.add({ severity: 'success', summary: 'Save', detail: 'Reference Details Successfully Saved', life: 3000, closable: true });
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Warn Message', detail: 'please edit and save the Reference Details!' });
        }
      });
    }
  }

  /**
   * Method showRefDetailsPage
   * @param event Change detction for the event.
   */
  showRefDetailsPage(event) {
    if (event.value.id !== 0) {
      if (this.uploadControl) {
        this.clearFileUploadSelection(this.uploadControl, 1);
      }
      if (this.uploadControl1) {
        this.clearFileUploadSelection(this.uploadControl1, 2);
      }
      if (this.uploadControl2) {
        this.clearFileUploadSelection(this.uploadControl2, 3);
      }
      if (this.uploadControl3) {
        this.clearFileUploadSelection(this.uploadControl3, 4);
      }
      if (this.uploadControl4) {
        this.clearFileUploadSelection(this.uploadControl4, 5);
      }
      this.reference = new ReferenceInfoDto();
      this.eclRef = new EclReferenceDto();
      this.eclRef.referenceSource = this.selectedSource.id;
      this.reference.referenceName = this.selectedSource.name;
      this.selectedReferenceValue =  { id: this.selectedSource.id, name: this.selectedSource.name};
      this.refValuesEditable = false;
      this.display = 'block';
    }
  }

/**
 * Function to close the Reference details popup page.
 */
  closEcleRefDetailsDialog() {
    this.refValuesEditable = false;
    this.display = "none";
    this.selectedSource = { label: 'Choose', value: { id: 0, name: ''}}
  };


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
      this.messageService.add({ severity: 'warn', summary: 'Input', detail: 'Please enter a Title to save', life: 2000, closable: false });
      res = false;
    }
    if (!this.reference.referenceName) {
      this.messageService.add({ severity: 'warn', summary: 'Input', detail: 'Please select a Reference Source Name to save', life: 2000, closable: false });
      res = false;
    }
    if (!this.validateReferenceUrl()) {
      this.messageService.add({ severity: 'warn', summary: 'Input', detail: 'Please enter valid URL to save', life: 2000, closable: false });
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
    } else if (num === 3){
      this.Validatefiles3 = [];
    } else if (num === 4){
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
    } else if (num === 4){
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
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'You have removed a file', life: 3000, closable: false });
        }
      });
    } else if (num === 2) {
      this.Validatefiles2 = this.Validatefiles2.filter((value) => {
        if (value.name !== event.file.name) {
          return value;
        } else {
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'You have removed a file', life: 3000, closable: false });
        }
      });
    } else if (num === 3) {
      this.Validatefiles3 = this.Validatefiles3.filter((value) => {
        if (value.name !== event.file.name) {
          return value;
        } else {
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'You have removed a file', life: 3000, closable: false });
        }
      });
    } else if (num === 4) {
      this.Validatefiles4 = this.Validatefiles4.filter((value) => {
        if (value.name !== event.file.name) {
          return value;
        } else {
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'You have removed a file', life: 3000, closable: false });
        }
      });
    } else {
      this.Validatefiles5 = this.Validatefiles5.filter((value) => {
        if (value.name !== event.file.name) {
          return value;
        } else {
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'You have removed a file', life: 3000, closable: false });
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
            this.messageService.add({ severity: 'warn', summary: 'File Upload', detail: `Reference Detail 1 and Reference Detail 2 must not contain same file names.`, life: 5000, closable: false });
          }
        }).filter(file1 => {
          if (!this.Validatefiles3.find(file3 => file3.name === file1.name)) {
            return file1;
          } else {
            this.messageService.add({ severity: 'warn', summary: 'File Upload', detail: `Reference Detail 1 and Reference Detail 3 must not contain same file names.`, life: 5000, closable: false });
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
            this.messageService.add({ severity: 'warn', summary: 'File Upload', detail: `Reference Document 1 and Reference URL File must not contain same file names.`, life: 5000, closable: false });
          }
        }).filter(file2 => {
          if (!this.Validatefiles3.find(file3 => file3.name === file2.name)) {
            return file2;
          } else {
            this.messageService.add({ severity: 'warn', summary: 'File Upload', detail: `Reference Document 1 and Reference Document 2 must not contain same file names.`, life: 5000, closable: false });
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
            this.messageService.add({ severity: 'warn', summary: 'File Upload', detail: `Reference Document 2 and Reference URL File must not contain same file names.`, life: 5000, closable: false });
          }
        }).filter(file3 => {
          if (!this.Validatefiles2.find(file2 => file2.name === file3.name)) {
            return file3;
          } else {
            this.messageService.add({ severity: 'warn', summary: 'File Upload', detail: `Reference Document 2 and Reference Document 1 must not contain same file names.`, life: 5000, closable: false });
          }
        });
      }
      this.Validatefiles3.push(...this.uploadControl2.files);
    } else if (num === 4) {
      if (this.Validatefiles5 && this.Validatefiles5.length > 0 || (this.Validatefiles1 && this.Validatefiles1.length > 0) || 
          (this.Validatefiles2 && this.Validatefiles2.length > 0) || (this.Validatefiles3 && this.Validatefiles3.length > 0) ||
          (this.eclRef.eclAttachmentList && this.eclRef.eclAttachmentList.length > 1 )) {
        this.uploadControl3.files = this.uploadControl3.files.filter(file4 => {
          if(this.eclRef.eclAttachmentList && this.eclRef.eclAttachmentList.length > 1 && this.eclRef.eclAttachmentList[1].attachmentFileName === file4.name) {
            this.messageService.add({ severity: 'warn', summary: 'File Upload', detail: `Comment Reference 1 and Attached Comment Reference 2 File must not contain same file names.`, life: 5000, closable: false });
          } else if (!this.Validatefiles5.find(file5 => file5.name === file4.name)) {
            return file4;
          } else {
            this.messageService.add({ severity: 'warn', summary: 'File Upload', detail: `Comment Reference 1 and Comment Reference 2 File must not contain same file names.`, life: 5000, closable: false });
          }
        }).filter(file4 => {
          if (!this.Validatefiles1.find(file1 => file1.name === file4.name)) {
            return file4;
          } else {
            this.messageService.add({ severity: 'warn', summary: 'File Upload', detail: `Comment Reference 1 and Reference URL must not contain same file names.`, life: 5000, closable: false });
          }
        }).filter(file4 => {
          if (!this.Validatefiles2.find(file2 => file2.name === file4.name)) {
            return file4;
          } else {
            this.messageService.add({ severity: 'warn', summary: 'File Upload', detail: `Comment Reference 1 and Reference Document 1 must not contain same file names.`, life: 5000, closable: false });
          }
        }).filter(file4 => {
          if (!this.Validatefiles3.find(file3 => file3.name === file4.name)) {
            return file4;
          } else {
            this.messageService.add({ severity: 'warn', summary: 'File Upload', detail: `Comment Reference 1 and Reference Document 2 must not contain same file names.`, life: 5000, closable: false });
          }
        });
      }
      this.Validatefiles4.push(...this.uploadControl3.files);
  } else if (num === 5) {
    if (this.Validatefiles4 && this.Validatefiles4.length > 0 || (this.Validatefiles1 && this.Validatefiles1.length > 0) || 
        (this.Validatefiles2 && this.Validatefiles2.length > 0) || (this.Validatefiles3 && this.Validatefiles3.length > 0) ||
        (this.eclRef.eclAttachmentList && this.eclRef.eclAttachmentList.length > 0 )) {
      this.uploadControl4.files = this.uploadControl4.files.filter(file5 => {
        if(this.eclRef.eclAttachmentList && this.eclRef.eclAttachmentList.length > 0 && this.eclRef.eclAttachmentList[0].attachmentFileName === file5.name) {
          this.messageService.add({ severity: 'warn', summary: 'File Upload', detail: `Comment Reference 2 and Attached Comment Reference 1 File must not contain same file names.`, life: 5000, closable: false });
        } else if (!this.Validatefiles4.find(file4 => file4.name === file5.name)) {
          return file5;
        } else {
          this.messageService.add({ severity: 'warn', summary: 'File Upload', detail: `Comment Reference 2 and Comment Reference 1 File must not contain same file names.`, life: 5000, closable: false });
        }
      }).filter(file5 => {
        if (!this.Validatefiles1.find(file1 => file1.name === file5.name)) {
          return file5;
        } else {
          this.messageService.add({ severity: 'warn', summary: 'File Upload', detail: `Comment Reference 2 and Reference URL must not contain same file names.`, life: 5000, closable: false });
        }
      }).filter(file5 => {
        if (!this.Validatefiles2.find(file2 => file2.name === file5.name)) {
          return file5;
        } else {
          this.messageService.add({ severity: 'warn', summary: 'File Upload', detail: `Comment Reference 2 and Reference Document 1 must not contain same file names.`, life: 5000, closable: false });
        }
      }).filter(file5 => {
        if (!this.Validatefiles3.find(file3 => file3.name === file5.name)) {
          return file5;
        } else {
          this.messageService.add({ severity: 'warn', summary: 'File Upload', detail: `Comment Reference 2 and Reference Document 2 and Reference Document 1 must not contain same file names.`, life: 5000, closable: false });
        }
      });
    }
    this.Validatefiles5.push(...this.uploadControl4.files);
}
}
}