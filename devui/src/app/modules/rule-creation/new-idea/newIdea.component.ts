/*****
 *
 * @author'Prasanna Kumar'
 *
 *****/

import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { NewIdeaService } from 'src/app/services/new-idea.service';
import { IdeaInfo } from 'src/app/shared/models/idea-info';
import { ReferenceInfo } from 'src/app/shared/models/reference-info';
import { ReferenceSource } from 'src/app/shared/models/reference-source';
import { RuleReference } from 'src/app/shared/models/rule-reference';
import { RuleStatus } from 'src/app/shared/models/rule-status';
import { AppUtils } from 'src/app/shared/services/utils';
import { FileUpload } from 'primeng/primeng';
import { StorageService } from 'src/app/services/storage.service';
import { NewIdeaCreationDto } from 'src/app/shared/models/dto/new-idea-creation-dto';
import { ReferenceService } from "../../../services/reference.service";
import { environment } from "../../../../environments/environment";
import { Constants } from "../../../shared/models/constants";
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { Subscription } from 'rxjs';
import { ResearchRequestService } from 'src/app/services/research-request.service';
import { EclComments } from 'src/app/shared/models/ecl-comments';

const FIRST_REFERENCE_FIRST_FILE = 1;
const FIRST_REFERENCE_SECOND_FILE = 2;
const SECOND_REFERENCE_FIRST_FILE = 3;
const SECOND_REFERENCE_SECOND_FILE = 4;
const THIRD_REFERENCE_FIRST_FILE = 5;
const THIRD_REFERENCE_SECOND_FILE = 6;
const FILE_ONE = 1;
const FILE_TWO = 2;
const MAXIMUM_NUMBER_FILES_ALLOWED = 2;
const ONE_FILE_ALLOWED = 1;

@Component({
  selector: 'newidea',
  templateUrl: './newIdea.component.html',
  styleUrls: ['./newIdea.component.css'],
  providers: [ConfirmationService]
})

export class NewIdeaComponent implements OnInit, OnDestroy {

  @Input() ideaIdInp;
  @Input() readOnlyView;

  @ViewChild('uploadControl',{static: false}) uploadControl: FileUpload;
  @ViewChild('uploadControl1',{static: false}) uploadControl1: FileUpload;
  @ViewChild('uploadControl2',{static: false}) uploadControl2: FileUpload;
  // [x: string]: any;

  validationRes: boolean = false;
  msgs: string = "You have removed a file";
  message: string = '';
  saveDisplay: boolean = false;
  refSources: ReferenceSource[];
  ideaInfo: IdeaInfo;
  NewIdeaCreationdto: NewIdeaCreationDto;
  referenceDetails1: ReferenceInfo;
  referenceDetails2: ReferenceInfo;
  referenceDetails3: ReferenceInfo;
  newCommentsDto: EclComments = null;
  commentList: EclComments[] = [];

  ruleReference1: RuleReference;
  ruleReference2: RuleReference;
  ruleReference3: RuleReference;
  ruleStatus: RuleStatus;

  validateFiles1: File[] = [];
  validateFiles2: File[] = [];
  validateFiles3: File[] = [];

  /* Array variables to store the reference details objects */
  referenceArray: ReferenceInfo[] = [];
  ruleReferenceArray: RuleReference[] = [];

  /* Array variables to store the reference info by name search*/
  referenceDetailsArray: ReferenceInfo[] = [];
  ruleReferenceDetailsArray: ReferenceInfo[] = [];

  plusSign: boolean = true;
  negSign: boolean = false;
  showAdditionalRef: boolean = false;
  refresh: boolean = false;
  clear: boolean = true;
  idearequiredVal: boolean = true;
  IdeaSaveModal: boolean = false;
  modalSaveBtn: boolean = false;
  modalSubmitBtn: boolean = false;
  saveMessage = '';
  refuploadedFiles: File[] = [];
  refuploadedFiles1: File[] = [];
  refuploadedFiles2: File[] = [];
  userId: number;
  passingIdeaId: number;
  fromDialog: boolean = false;

  //policy packages
  policyPackageValues: any = [];
  policyPackageSelected: any[] = [];

  /*
  Idea references
  */
  //adding for reference source details 1
  referenceName1: string;
  referenceURL1: string;
  refUrlFile1: any[] = [];
  fileSize1: number = 0;

  //adding for reference source details 2
  referenceName2: string;
  referenceURL2: string;
  refUrlFile2: File[] = [];
  fileSize2: number = 0;

  //adding for reference source details 3
  referenceName3: string;
  referenceURL3: string;
  refUrlFile3: File[] = [];
  fileSize3: number = 0;
  ideaSubmitDisabled: boolean = false;

  //handle previously saved attachments
  previouslySavedFiles: File[] = [];
  previouslySavedFiles1: File[] = [];
  previouslySavedFiles2: File[] = [];
  isDownloadFileHidden: boolean = true;
  isDownloadFileHidden1: boolean = true;
  isDownloadFileHidden2: boolean = true;
  uploadControlFileLimit: number = MAXIMUM_NUMBER_FILES_ALLOWED;
  uploadControlDisabled: boolean = false;
  uploadControl1FileLimit: number = MAXIMUM_NUMBER_FILES_ALLOWED;
  uploadControl1Disabled: boolean = false;
  uploadControl2FileLimit: number = MAXIMUM_NUMBER_FILES_ALLOWED;
  uploadControl2Disabled: boolean = false;

  //For file deletion
  referenceFileNumber: number;
  removeAttachmentDisplay: boolean = false;
  referenceIdDeleting: number;

  //File loading wait
  loading: boolean = false;

  // Research Request
  rrId: number;
  rrCode: string;
  navPageTitle: string = 'My Requests';
  sub: Subscription;

  //From assignment screen
  fromAssignmentNewIdeaScreen: boolean;

  constructor(private storage: StorageService, private newIdeaService: NewIdeaService, private router: Router,
    private confirmationService: ConfirmationService, private utils: AppUtils, private messageService: MessageService,
    private config: DynamicDialogConfig, private ref: DynamicDialogRef, private eclReferenceService: ReferenceService,
    private route: ActivatedRoute, private rrService: ResearchRequestService) {

    this.referenceDetails1 = new ReferenceInfo();
    this.referenceDetails2 = new ReferenceInfo();
    this.referenceDetails3 = new ReferenceInfo();

    this.ruleStatus = new RuleStatus();
    this.ruleReference1 = new RuleReference();

    this.ruleReference2 = new RuleReference();

    this.ruleReference3 = new RuleReference();
    this.ideaInfo = new IdeaInfo();

    this.sub = this.route.params.subscribe(params => {
      if (this.utils.decodeString(params['id']) !== undefined && this.utils.decodeString(params['id']) !== "") {
        this.ideaIdInp = parseInt(this.utils.decodeString(params['id']));
      }
      this.rrId = parseInt(this.utils.decodeString(params['rrid']));
      this.rrCode = params['code'];
    });

    this.route.data.subscribe(params => {
      this.readOnlyView = params['readOnlyView'];
    });

    this.fromAssignmentNewIdeaScreen = this.route.snapshot.queryParams.fromAssignmentForNewIdeaScreen;

  }

  ngOnInit() {
    if (this.readOnlyView == undefined) {
      this.readOnlyView = false;
    }

    this.ideaInfo.createdDt = new Date();
    this.userId = this.utils.getLoggedUserId();

    this.utils.getAllPolicyPackageValue(this.policyPackageValues);

    this.fileSize1 = 0;
    this.fileSize2 = 0;
    this.fileSize3 = 0;
    if (this.config && this.config.data && this.config.data.ideaId) {
      this.ideaIdInp = this.config.data.ideaId;
      this.readOnlyView = (this.config.data.readOnly === false ? false : true);
      this.fromDialog = true;
    }
    if (this.ideaIdInp !== undefined && this.ideaIdInp !== null) {
      this.ideaInfo.ideaId = this.ideaIdInp;
      this.refreshIdeaAndReferences();
    }

    this.ideaSubmitDisabled = false;
    this.newCommentsDto = new EclComments();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  hideRef() {
    this.showAdditionalRef = false;
    this.plusSign = true;
    this.negSign = false;
  }

  showRef() {
    if (this.referenceDetails1.referenceName || this.referenceDetails1.referenceURL) {
      this.showAdditionalRef = true;
      this.plusSign = false;
      this.negSign = true;
    }

  }

  /* Function to navigate to home page after idea submit */

  navigateHome() {
    this.router.navigate(['/home']);
  }
  /* function to navigate to assign idea screen afetr submit*/
  navigateAssign() {
    this.router.navigate(['/assignmentNewIdea']);
  }
  /* Function to clear the new Idea page table */
  onClear() {
    this.confirmationService.confirm({
      message: 'All unsaved changes will be lost. Are you sure you want to Clear?',
      header: 'Clear',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ideaInfo = new IdeaInfo();
        this.referenceDetails1 = new ReferenceInfo();
        this.referenceDetails2 = new ReferenceInfo();
        this.referenceDetails3 = new ReferenceInfo();
        this.newCommentsDto = new EclComments();
        this.clearFileUploadSelection(this.uploadControl, 1);
        this.clearFileUploadSelection(this.uploadControl1, 2);
        this.clearFileUploadSelection(this.uploadControl2, 3);
        this.ideaSubmitDisabled = false;
      }
    });
  }
  /* function to refresh New Idea */
  onRefresh() {
    this.confirmationService.confirm({
      message: 'All unsaved changes will be lost. Are you sure you want to Refresh?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.referenceDetails1 = new ReferenceInfo();
        this.referenceDetails2 = new ReferenceInfo();
        this.referenceDetails3 = new ReferenceInfo();
        this.refreshIdeaAndReferences();
      }
    });
  }

  refreshIdeaAndReferences() {
    this.ideaRefresh().then((response) => {
      if (this.referenceArray.length > 1) {
        this.showRef();
      }
    });
  }

  /* function to confirm message for exit button*/
  exit() {
    this.confirmationService.confirm({
      message: 'All unsaved changes will be lost. Are you sure you want to Exit?',
      header: 'Exit',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.fromDialog) {
          this.ref.close();
        } else {
          this.navigateHome();
        }
        //Actual logic to perform a confirmation
      }
    });
  }

  exitReadOnly() {
    if (this.fromDialog) {
      this.ref.close();
    } else if (this.fromAssignmentNewIdeaScreen) {
      this.navigateAssign();
    } else {
      this.navigateHome();
    }
  }

  ideaRefresh() {
    this.loading = true;
    return new Promise<void>((resolve, reject) => {
      let i = 0;
      this.newIdeaService.onRefresh(this.ideaInfo.ideaId).subscribe(response => {
        let responseObj = response.data;
        this.referenceArray = [];
        this.ruleReferenceArray = [];
        this.ideaInfo.ideaId = responseObj.ideaId;
        this.ideaInfo.ideaName = responseObj.ideaName;
        this.ideaInfo.ideaDescription = responseObj.ideaDescription;

        this.policyPackageSelected = responseObj.eclPolicyPackages
          .map(eclPolicyPackage => eclPolicyPackage.policyPackage)
          .map(policyPackage => policyPackage.policyPackageTypeId);

        let ruleRefArrayObj = [];
        ruleRefArrayObj = responseObj.eclReferences;
        ruleRefArrayObj.sort((a, b) => a.eclReferenceId - b.eclReferenceId);
        let rulerefArray = ruleRefArrayObj;
        if (rulerefArray.length < 1) {
          this.loading = false;
        } else {
          for (let obj in rulerefArray) {
            i++;
            this.ruleReferenceArray.push(rulerefArray[obj]);
            this.referenceArray.push(rulerefArray[obj].refInfo);
            if (i == 1) {
              this.referenceDetails1.refUrlFile = this.referenceArray[0].refUrlFile;
              this.referenceDetails1.referenceName = this.referenceArray[0].referenceName;
              this.referenceDetails1.referenceURL = this.referenceArray[0].referenceURL;
              this.referenceDetails1.refDocFile1 = this.referenceArray[0].refDocFile1;
              this.referenceDetails1.referenceId = this.referenceArray[0].referenceId;
              this.referenceDetails1.refDocFileName1 = this.referenceArray[0].refDocFileName1;
              this.referenceDetails1.refDocFileType1 = this.referenceArray[0].refDocFileType1;
              this.referenceDetails1.refUrlFileName = this.referenceArray[0].refUrlFileName;
              this.referenceDetails1.refUrlFileType = this.referenceArray[0].refUrlFileType;

              this.ruleReference1.eclReferenceId = rulerefArray[obj].eclReferenceId;

              this.previousAttachmentDownload();
            }
            if (i == 2) {
              this.referenceDetails2.refUrlFile = this.referenceArray[1].refUrlFile;
              this.referenceDetails2.referenceName = this.referenceArray[1].referenceName;
              this.referenceDetails2.referenceURL = this.referenceArray[1].referenceURL;
              this.referenceDetails2.refDocFile1 = this.referenceArray[1].refDocFile1;
              this.referenceDetails2.referenceId = this.referenceArray[1].referenceId;
              this.ruleReference2.eclReferenceId = rulerefArray[obj].eclReferenceId;
              this.referenceDetails2.refDocFileName1 = this.referenceArray[1].refDocFileName1;
              this.referenceDetails2.refDocFileType1 = this.referenceArray[1].refDocFileType1;
              this.referenceDetails2.refUrlFileName = this.referenceArray[1].refUrlFileName;
              this.referenceDetails2.refDocFileType1 = this.referenceArray[1].refDocFileType1;
            }
            if (i == 3) {
              this.referenceDetails3.refUrlFile = this.referenceArray[2].refUrlFile;
              this.referenceDetails3.referenceName = this.referenceArray[2].referenceName;
              this.referenceDetails3.referenceURL = this.referenceArray[2].referenceURL;
              this.referenceDetails3.refDocFile1 = this.referenceArray[2].refDocFile1;
              this.referenceDetails3.referenceId = this.referenceArray[2].referenceId;
              this.ruleReference3.eclReferenceId = rulerefArray[obj].eclReferenceId;
              this.referenceDetails3.refDocFileName1 = this.referenceArray[2].refDocFileName1;
              this.referenceDetails3.refDocFileType1 = this.referenceArray[2].refDocFileType1;
              this.referenceDetails3.refUrlFileName = this.referenceArray[2].refUrlFileName;
              this.referenceDetails3.refDocFileType2 = this.referenceArray[2].refDocFileType2;
            }
          }
        }
        this.changeFileUploadLimits();
        resolve();
      });
      this.loadIdeaComments(this.ideaInfo.ideaId);
    })
  }

  loadIdeaComments(ideaId: number) {
    this.newCommentsDto = new EclComments();
    this.newIdeaService.getIdeaComments(ideaId).subscribe(resp => {
      if (resp && resp.data && resp.data.length > 0) {
        this.commentList = resp.data;
        this.newCommentsDto.comments = this.commentList[0].comments;
      }
    });
  }

  changeFileUploadLimits() {
    if (this.referenceDetails1) {
      this.changeUploadLimit(this.referenceDetails1);
    }
    if (this.referenceDetails2) {
      this.changeUploadLimit(this.referenceDetails2);
    }
    if (this.referenceDetails3) {
      this.changeUploadLimit(this.referenceDetails3);
    }
  }

  changeUploadLimit(referenceDetail: ReferenceInfo) {
    const { refUrlFileName, refDocFileName1 } = referenceDetail;
    if ((refUrlFileName && !refDocFileName1) || (refDocFileName1 && !refUrlFileName)) {
      this.setUploadLimitToOne(referenceDetail);
    } else if (refUrlFileName && refDocFileName1) {
      this.disableUpload(referenceDetail);
    } else {
      this.resetUpload(referenceDetail);
    }
  }

  setUploadLimitToOne(referenceDetail: ReferenceInfo) {
    if (referenceDetail === this.referenceDetails1) {
      this.uploadControlDisabled = false;
      this.uploadControlFileLimit = ONE_FILE_ALLOWED;
    } else if (referenceDetail === this.referenceDetails2) {
      this.uploadControl1Disabled = false;
      this.uploadControl1FileLimit = ONE_FILE_ALLOWED;
    } else {
      this.uploadControl2Disabled = false;
      this.uploadControl2FileLimit = ONE_FILE_ALLOWED;
    }
  }

  disableUpload(referenceDetail: ReferenceInfo) {
    if (referenceDetail === this.referenceDetails1) {
      this.uploadControlDisabled = true;
    } else if (referenceDetail === this.referenceDetails2) {
      this.uploadControl1Disabled = true;
    } else {
      this.uploadControl2Disabled = true;
    }
  }

  resetUpload(referenceDetail: ReferenceInfo) {
    if (referenceDetail === this.referenceDetails1) {
      this.uploadControlDisabled = false;
      this.uploadControlFileLimit = MAXIMUM_NUMBER_FILES_ALLOWED;
    } else if (referenceDetail === this.referenceDetails2) {
      this.uploadControl1Disabled = false;
      this.uploadControl1FileLimit = MAXIMUM_NUMBER_FILES_ALLOWED;
    } else {
      this.uploadControl2Disabled = false;
      this.uploadControl2FileLimit = MAXIMUM_NUMBER_FILES_ALLOWED;
    }
  }

  /* Function to save the New Idea*/

  ideaSave() {
    if (!this.validateForm()) {
      // If it fails it fails here.
      this.ideaSubmitDisabled = false; // enable save button if the validation fails
    } else {
      this.ideaSubmitDisabled = true; // disable save button onclick of save 
      this.referenceArray = [];

      this.ruleReferenceArray = [];
      if ((this.referenceDetails1.referenceName) || (this.referenceDetails1.referenceURL) || (this.referenceDetails1.refUrlFile)) {
        this.referenceArray.push(this.referenceDetails1);
        this.ruleReferenceArray.push(this.ruleReference1);
      }
      if ((this.referenceDetails2.referenceName) || (this.referenceDetails2.referenceURL) || (this.referenceDetails2.refUrlFile)) {
        this.referenceArray.push(this.referenceDetails2);
        this.ruleReferenceArray.push(this.ruleReference2);
      }
      if ((this.referenceDetails3.referenceName) || (this.referenceDetails3.referenceURL) || (this.referenceDetails3.refUrlFile)) {
        this.referenceArray.push(this.referenceDetails3);
        this.ruleReferenceArray.push(this.ruleReference3);
      }

      let uploadingFiles: File[] = [];
      if (this.previouslySavedFiles.length > 0) {
        uploadingFiles = this.previouslySavedFiles;
      }
      if (this.uploadControl) {
        if (this.uploadControl.files.length > 0) {
          uploadingFiles = [...uploadingFiles, ...this.uploadControl.files];
        }
      }

      let uploadingFiles1: File[] = [];
      if (this.previouslySavedFiles1.length > 0) {
        uploadingFiles1 = this.previouslySavedFiles1;
      }
      if (this.uploadControl1) {
        if (this.uploadControl1.files.length > 0) {
          uploadingFiles1 = [...uploadingFiles1, ...this.uploadControl1.files];
        }
      }

      let uploadingFiles2: File[] = [];
      if (this.previouslySavedFiles2.length > 0) {
        uploadingFiles2 = this.previouslySavedFiles2;
      }
      if (this.uploadControl2) {
        if (this.uploadControl2.files.length > 0) {
          uploadingFiles2 = [...uploadingFiles2, ...this.uploadControl2.files];
        }
      }

      if (!this.rrCode) { this.rrId = null }
      this.newIdeaService.saveNewIdea(this.ideaInfo, this.policyPackageSelected, this.referenceArray, this.ruleReferenceArray, this.userId,
        uploadingFiles, uploadingFiles1, uploadingFiles2, this.rrId, this.newCommentsDto).subscribe(response => {

          if (this.uploadControl) {
            this.uploadControl.files = [];
          }
          if (this.uploadControl1) {
            this.uploadControl1.files = [];
          }
          if (this.uploadControl2) {
            this.uploadControl2.files = [];
          }
          this.ideaInfo.ideaId = response.data.ideaId;
          this.ideaInfo.ideaName = response.data.ideaName;
          this.ideaInfo.ideaDescription = response.data.ideaDescription;
          this.ideaInfo.ideaCode = response.data.ideaCode;

          // Moving new Idea Id to localstorage to persist.
          this.storage.remove('NewIdeaId');
          this.storage.set('NEW_IDEA_ID', this.ideaInfo.ideaId, true);

          this.validateButtons();
          if (this.ideaInfo.ideaId != null) {
            this.messageService.add({ severity: 'success', summary: 'Save', detail: 'New idea ' + this.ideaInfo.ideaCode + ' successfully saved', life: 3000, closable: true });
          }
          this.ideaSubmitDisabled = false;  //enable save button after saving the idea
          if (this.rrId !== null && this.ideaInfo.ideaId !== null) {
          }
          this.rrService.saveRrMapping({ rrId: this.rrId, ideaId: this.ideaInfo.ideaId, actionMapping: "SV" }).subscribe();
        }, error => console.log(error),
          () => this.ideaRefresh()
        );
    }
  }
  /* Function to submit the New Idea */

  ideaSubmit() {
    if (!this.validateForm()) {
      // If it fails it fails here.
      this.ideaSubmitDisabled = false;
    } else {
      this.referenceArray = [];

      this.ruleReferenceArray = [];
      if ((this.referenceDetails1.referenceName) || (this.referenceDetails1.referenceURL) || (this.referenceDetails1.refUrlFile)) {
        this.referenceArray.push(this.referenceDetails1);
        this.ruleReferenceArray.push(this.ruleReference1);

      }
      if ((this.referenceDetails2.referenceName) || (this.referenceDetails2.referenceURL) || (this.referenceDetails2.refUrlFile)) {
        this.referenceArray.push(this.referenceDetails2);
        this.ruleReferenceArray.push(this.ruleReference2);
      }
      if ((this.referenceDetails3.referenceName) || (this.referenceDetails3.referenceURL) || (this.referenceDetails3.refUrlFile)) {
        this.referenceArray.push(this.referenceDetails3);
        this.ruleReferenceArray.push(this.ruleReference3);
      }
      let uploadingFiles: File[] = [];
      if (this.previouslySavedFiles.length > 0) {
        uploadingFiles = this.previouslySavedFiles;
      }
      if (this.uploadControl) {
        if (this.uploadControl.files.length > 0) {
          uploadingFiles = [...uploadingFiles, ...this.uploadControl.files];
        }
      }

      let uploadingFiles1: File[] = [];
      if (this.previouslySavedFiles1.length > 0) {
        uploadingFiles1 = this.previouslySavedFiles1;
      }
      if (this.uploadControl1) {
        if (this.uploadControl1.files.length > 0) {
          uploadingFiles1 = [...uploadingFiles1, ...this.uploadControl1.files];
        }
      }

      let uploadingFiles2: File[] = [];
      if (this.previouslySavedFiles2.length > 0) {
        uploadingFiles2 = this.previouslySavedFiles2;
      }
      if (this.uploadControl2) {
        if (this.uploadControl2.files.length > 0) {
          uploadingFiles2 = [...uploadingFiles2, ...this.uploadControl2.files];
        }
      }

      if (!this.rrCode) { this.rrId = null }
      this.newIdeaService.submitNewIdea(this.ideaInfo, this.policyPackageSelected, this.referenceArray, this.ruleReferenceArray, this.userId, uploadingFiles, uploadingFiles1, uploadingFiles2, this.rrId, this.newCommentsDto).subscribe(response => {
        this.ideaInfo.ideaId = response.data.ideaId;
        this.ideaInfo.ideaCode = response.data.ideaCode;
        this.storage.set('NEW_IDEA_ID', this.ideaInfo.ideaId, true);

        if ((this.ideaInfo.ideaId != null)) {


          this.messageService.add({ severity: 'success', summary: 'Submit', detail: 'New idea ' + this.ideaInfo.ideaCode + ' successfully submitted', life: 3000, closable: true });
          setTimeout(() => {
            this.rrId ? this.navigateBackResearchId() : this.navigateHome();
            this.rrService.saveRrMapping({ rrId: this.rrId, ideaId: this.ideaInfo.ideaId, actionMapping: "SB" }).subscribe();
          }, 1250);
        }
      });
      this.ideaSubmitDisabled = true;
    }

  }
  validateForm() {
    let res: boolean = true;

    if (!this.referenceDetails1.referenceURL && this.referenceDetails2.referenceURL) {
      this.referenceDetails1.referenceURL = "";
      res = true;
    } else if ((!this.referenceDetails1.referenceURL || !this.referenceDetails2.referenceURL) && this.referenceDetails3.referenceURL) {
      this.referenceDetails1.referenceURL = "";
      this.referenceDetails2.referenceURL = "";
      res = true;
    }

    if (!this.ideaInfo.ideaName || this.utils.validateStringContaintOnlyWhiteSpaces(this.ideaInfo.ideaName)) {
      this.messageService.add({ severity: 'warn', summary: 'Info', detail: 'Please enter idea name', life: 3000, closable: true });
      res = false;
    } else if (!this.ideaInfo.ideaDescription || this.utils.validateStringContaintOnlyWhiteSpaces(this.ideaInfo.ideaDescription)) {
      this.messageService.add({ severity: 'warn', summary: 'Info', detail: 'Please enter idea description', life: 3000, closable: true });
      res = false;
    } else if (!this.referenceDetails1.referenceName && (this.referenceDetails1.referenceURL || this.validateFiles1.length > 0)) {
      this.messageService.add({ severity: 'warn', summary: 'Info', detail: 'Please enter reference source name 1', life: 3000, closable: true });
      res = false;
    } else if (!this.referenceDetails2.referenceName && (this.referenceDetails2.referenceURL || this.validateFiles2.length > 0)) {
      this.messageService.add({ severity: 'warn', summary: 'Info', detail: 'Please enter reference source name 2', life: 3000, closable: true });
      res = false;
    } else if (!this.referenceDetails3.referenceName && (this.referenceDetails3.referenceURL || this.validateFiles3.length > 0)) {
      this.messageService.add({ severity: 'warn', summary: 'Info', detail: 'Please enter reference source name 3', life: 3000, closable: true });
      res = false;
    }
    if (this.uploadControl) {
      if (this.uploadControl.files.length > 2) {
        this.messageService.add({ severity: 'warn', summary: 'Info', detail: 'First reference detail must not exceed number of files by 2', life: 5000, closable: true });
        res = false;
      }
    }
    if (this.uploadControl1) {
      if (this.uploadControl1.files.length > 2) {
        this.messageService.add({ severity: 'warn', summary: 'Info', detail: 'Second reference detail must not exceed number of files by 2', life: 5000, closable: true });
        res = false;
      }
    }
    if (this.uploadControl2) {
      if (this.uploadControl2.files.length > 2) {
        this.messageService.add({ severity: 'warn', summary: 'Info', detail: 'Third reference detail must not exceed number of files by 2', life: 5000, closable: true });

        res = false;
      }
    }

    if (this.validateReferenceUrl(this.referenceDetails1.referenceURL)) {
      this.messageService.add({ severity: 'warn', summary: 'Info', detail: `Reference details 1 URL must start with 'http://' or 'https://`, life: 5000, closable: true });
      res = false;
    } else if (this.validateReferenceUrl(this.referenceDetails2.referenceURL)) {
      this.messageService.add({ severity: 'warn', summary: 'Info', detail: `Reference details 2 URL must start with 'http://' or 'https://`, life: 5000, closable: true });
      res = false;
    } else if (this.validateReferenceUrl(this.referenceDetails3.referenceURL)) {
      this.messageService.add({ severity: 'warn', summary: 'Info', detail: `Reference details 3 URL must start with 'http://' or 'https://'`, life: 5000, closable: true });
      res = false;
    }
    this.ideaInfo.ideaName = this.ideaInfo.ideaName.trim();
    this.ideaInfo.ideaDescription = this.ideaInfo.ideaDescription.trim();
    return res;
  }

  validateReferenceUrl(url) {
    return url && (url.substring(0, 7) !== 'http://' && url.substring(0, 8) !== 'https://');
  }

  validateButtons() {
    if ((this.ideaInfo.ideaId != null)) {
      this.clear = false;
      this.refresh = true;
    } else {
      this.clear = true;
      this.refresh = false;
    }
  }
  /**
     * The upload control clear method does not clear the file count if the
     * file count is not set to 0 then the choose button is not enabled again.
     * @param fileUploader FileUploader we want to clear
     */
  clearFileUploadSelection(fileUploader: FileUpload, num: number) {
    if (num === 1) {
      this.validateFiles1 = [];
    } else if (num === 2) {
      this.validateFiles2 = [];
    } else {
      this.validateFiles3 = [];
    }
    fileUploader.uploadedFileCount = 0;
    fileUploader.clear();
  }
  startUpload() {
    this.uploadControl.upload();
  }

  //clear the files from upload object
  onClearFile(num: number) {
    if (num === 1) {
      this.validateFiles1 = [];
    } else if (num === 2) {
      this.validateFiles2 = [];
    } else {
      this.validateFiles3 = [];
    }
  }

  /**
   * Selection of File Upload
   * @param event Files
   * @author Jeffrey King
   * File name validation *Over file limit needs rework*
   */
  onSelect(event: FileUpload, num: number) {
    if (num === 1) {
      if (this.uploadControl.files.length > 2) {
        this.uploadControl.files.length = 0;
        this.validateFiles1.length = 0;
        this.messageService.add({ severity: 'warn', summary: 'File Upload', detail: 'May only attach up to two files', life: 3000, closable: false });
      } else {
        if (this.selfFileNameValidation(event, 1)) {
          this.fileNameValidation(event, 1);
        }
      }

    } else if (num === 2) {
      if (this.uploadControl1.files.length > 2) {
        this.uploadControl1.files.length = 0;
        this.validateFiles2.length = 0;
        this.messageService.add({ severity: 'warn', summary: 'File Upload', detail: 'May only attach up to two files', life: 3000, closable: false });
      } else {
        if (this.selfFileNameValidation(event, 2)) {
          this.fileNameValidation(event, 2);
        }
      }

    } else {
      if (this.uploadControl2.files.length > 2) {
        this.uploadControl2.files.length = 0;
        this.validateFiles3.length = 0;
        this.messageService.add({ severity: 'warn', summary: 'File Upload', detail: 'May only attach up to two files', life: 3000, closable: false });
      } else {
        if (this.selfFileNameValidation(event, 3)) {
          this.fileNameValidation(event, 3);
        }
      }
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
      this.validateFiles1 = this.validateFiles1.filter((value) => {
        if (value.name !== event.file.name) {
          return value;
        } else {
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'You have removed a file', life: 3000, closable: false });
        }
      });
    } else if (num === 2) {
      this.validateFiles2 = this.validateFiles2.filter((value) => {
        if (value.name !== event.file.name) {
          return value;
        } else {
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'You have removed a file', life: 3000, closable: false });
        }
      });
    } else {
      this.validateFiles3 = this.validateFiles3.filter((value) => {
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
      if ((this.validateFiles2 && this.validateFiles2.length > 0) || (this.validateFiles3 && this.validateFiles3.length > 0)) {
        this.uploadControl.files = this.uploadControl.files.filter(file1 => {
          if (!this.validateFiles2.find(file2 => file2.name === file1.name)) {
            return file1;
          } else {
            this.messageService.add({ severity: 'warn', summary: 'File Upload', detail: `Reference detail 1 and reference detail 2 must not contain same file names.`, life: 5000, closable: false });
          }
        }).filter(file1 => {
          if (!this.validateFiles3.find(file3 => file3.name === file1.name)) {
            return file1;
          } else {
            this.messageService.add({ severity: 'warn', summary: 'File Upload', detail: `Reference detail 1 and reference detail 3 must not contain same file names.`, life: 5000, closable: false });
          }
        });
      }
      this.validateFiles1.push(...this.uploadControl.files);
    } else if (num === 2) {
      if ((this.validateFiles1 && this.validateFiles1.length > 0) || (this.validateFiles3 && this.validateFiles3.length > 0)) {
        this.uploadControl1.files = this.uploadControl1.files.filter(file2 => {
          if (!this.validateFiles1.find(file1 => file1.name === file2.name)) {
            return file2;
          } else {
            this.messageService.add({ severity: 'warn', summary: 'File Upload', detail: `Reference detail 2 and reference detail 1 must not contain same  file names.`, life: 5000, closable: false });
          }
        }).filter(file2 => {
          if (!this.validateFiles3.find(file3 => file3.name === file2.name)) {
            return file2;
          } else {
            this.messageService.add({ severity: 'warn', summary: 'File Upload', detail: `Reference detail 2 and reference detail 3 must not contain same  file names.`, life: 5000, closable: false });
          }
        });
      }
      this.validateFiles2.push(...this.uploadControl1.files);
    } else {
      if (this.validateFiles1 && this.validateFiles1.length > 0 || (this.validateFiles2 && this.validateFiles2.length > 0)) {
        this.uploadControl2.files = this.uploadControl2.files.filter(file3 => {
          if (!this.validateFiles1.find(file1 => file1.name === file3.name)) {
            return file3;
          } else {
            this.messageService.add({ severity: 'warn', summary: 'File Upload', detail: `Reference detail 3 and reference detail 1 must not contain same  file names.`, life: 5000, closable: false });
          }
        }).filter(file3 => {
          if (!this.validateFiles2.find(file2 => file2.name === file3.name)) {
            return file3;
          } else {
            this.messageService.add({ severity: 'warn', summary: 'File Upload', detail: `Reference detail 3 and reference detail 2 must not contain same  file names.`, life: 5000, closable: false });
          }
        });
      }
      this.validateFiles3.push(...this.uploadControl2.files);
    }
  }

  /**
   * Self File Validation
   * @param event File associate to the validation is working with.
   * @param num This number determines which reference detail is it currently check with.
   * @author Jeffrey King
   */
  selfFileNameValidation(event: FileUpload, num: number) {
    let response = true;
    if (num === 1) {
      if (this.validateFiles1.length > 0) {
        this.validateFiles1 = this.validateFiles1.filter((files) => {
          if (event.files[0].name !== files.name) {
            return files;
          } else {
            this.uploadControl.files.filter(file => { file })
            this.messageService.add({ severity: 'warn', summary: 'File Upload', detail: `Cannot select the same file`, life: 2000, closable: false });
            response = false;
          }
        });
      }
    } else if (num === 2) {
      if (this.validateFiles2.length > 0) {
        this.validateFiles2 = this.validateFiles2.filter((files) => {
          if (event.files[0].name !== files.name) {
            return files;
          } else {
            this.messageService.add({ severity: 'warn', summary: 'File Upload', detail: `Cannot select the same file`, life: 2000, closable: false });
            response = false;
          }
        });
      }
    } else {
      if (this.validateFiles3.length > 0) {
        this.validateFiles3 = this.validateFiles3.filter((files) => {
          if (event.files[0].name !== files.name) {
            return files;
          } else {
            this.messageService.add({ severity: 'warn', summary: 'File Upload', detail: `Cannot select the same file`, life: 2000, closable: false });
            response = false;
          }
        });
      }

    }
    return response;
  }

  /* Function to download the reference first file selected */

  referenceFileDownload(referenceId: any, fileName: any, fileType: any) {
    const fileUrl = environment.restServiceUrl + RoutingConstants.ECL_REFERENCES_URL + "/" + RoutingConstants.REF_FILE_DOWNLOAD_FIRST_URL + "/" + referenceId + "/" + Constants.REF_URL_FILE;
    if (fileUrl !== null && fileUrl !== undefined) {
      this.eclReferenceService.refFileDownload1(fileUrl).subscribe(response => {
        if (response !== null && response !== undefined) {
          this.downloadReferenceFileData(response, fileName, fileType);
        }
      });
    }
  }

  /* Call back function to download the first selected reference file*/

  downloadReferenceFileData(data, fileName, fileType) {
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

  referenceFileDownload2(referenceId: any, fileName: any, fileType: any) {
    const fileUrl = environment.restServiceUrl + RoutingConstants.ECL_REFERENCES_URL + "/" + RoutingConstants.REF_FILE_DOWNLOAD_SECOND_URL + "/" + referenceId + "/" + Constants.REF_DOC_FILE1;
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

  /***Method to retrieve previously saved url file attachment for first reference */
  previousAttachmentDownload() {
    this.loading = true;
    this.previouslySavedFiles = [];
    const fileUrl = environment.restServiceUrl + RoutingConstants.ECL_REFERENCES_URL + "/" + RoutingConstants.REF_FILE_DOWNLOAD_FIRST_URL + "/" + this.referenceDetails1.referenceId + "/" + Constants.REF_URL_FILE;
    if (this.referenceDetails1.referenceId) {
      this.eclReferenceService.refFileDownload1(fileUrl).subscribe(response => {
        if (response) {
          if (response.size > 0) {
            const attachedFile = new File([response], this.referenceDetails1.refUrlFileName, { type: this.referenceDetails1.refUrlFileType });
            this.previouslySavedFiles = [...this.previouslySavedFiles, attachedFile];
            this.isDownloadFileHidden = false;
          }
        }
      }, error => console.log(error),
        () => this.previousDocFile1Download()
      );
    } else {
      this.previousDocFile1Download();
    }
  }

  /***Method to retrieve previously saved doc file1 attachment for first reference */
  previousDocFile1Download() {
    const fileUrl = environment.restServiceUrl + RoutingConstants.ECL_REFERENCES_URL + "/" + RoutingConstants.REF_FILE_DOWNLOAD_SECOND_URL + "/" + this.referenceDetails1.referenceId + "/" + Constants.REF_DOC_FILE1;
    if (this.referenceDetails1.referenceId) {
      this.eclReferenceService.refFileDownload2(fileUrl).subscribe(response => {
        if (response) {
          if (response.size > 0) {
            const attachedFile = new File([response], this.referenceDetails1.refDocFileName1, { type: this.referenceDetails1.refDocFileType1 });
            this.previouslySavedFiles = [...this.previouslySavedFiles, attachedFile];
          }
        }
      }, error => console.log(error),
        () => this.previousAttachmentDownload1()
      );
    } else {
      this.previousAttachmentDownload1()
    }
  }

  /***Method to retrieve previously saved url file attachment for second reference */
  previousAttachmentDownload1() {
    this.previouslySavedFiles1 = [];
    const fileUrl = environment.restServiceUrl + RoutingConstants.ECL_REFERENCES_URL + "/" + RoutingConstants.REF_FILE_DOWNLOAD_FIRST_URL + "/" + this.referenceDetails2.referenceId + "/" + Constants.REF_URL_FILE;
    if (this.referenceDetails2.referenceId) {
      this.eclReferenceService.refFileDownload1(fileUrl).subscribe(response => {
        if (response) {
          if (response.size > 0) {
            const attachedFile = new File([response], this.referenceDetails2.refUrlFileName, { type: this.referenceDetails2.refUrlFileType });
            this.previouslySavedFiles1 = [...this.previouslySavedFiles1, attachedFile];
            this.isDownloadFileHidden1 = false;
          }
        }
      }, error => console.log(error),
        () => this.previousDocFile1Download1()
      );
    } else {
      this.previousDocFile1Download1();
    }
  }

  /***Method to retrieve previously saved doc file1 attachment for second reference */
  previousDocFile1Download1() {
    const fileUrl = environment.restServiceUrl + RoutingConstants.ECL_REFERENCES_URL + "/" + RoutingConstants.REF_FILE_DOWNLOAD_SECOND_URL + "/" + this.referenceDetails2.referenceId + "/" + Constants.REF_DOC_FILE1;
    if (this.referenceDetails2.referenceId) {
      this.eclReferenceService.refFileDownload2(fileUrl).subscribe(response => {
        if (response) {
          if (response.size > 0) {
            const attachedFile = new File([response], this.referenceDetails2.refDocFileName1, { type: this.referenceDetails2.refDocFileType1 });
            this.previouslySavedFiles1 = [...this.previouslySavedFiles1, attachedFile];
          }
        }
      }, error => console.log(error),
        () => this.previousAttachmentDownload2()
      );
    } else {
      this.previousAttachmentDownload2();
    }
  }

  /***Method to retrieve previously saved url file attachment for third reference */
  previousAttachmentDownload2() {
    this.previouslySavedFiles2 = [];
    const fileUrl = environment.restServiceUrl + RoutingConstants.ECL_REFERENCES_URL + "/" + RoutingConstants.REF_FILE_DOWNLOAD_FIRST_URL + "/" + this.referenceDetails3.referenceId + "/" + Constants.REF_URL_FILE;
    if (this.referenceDetails3.referenceId) {
      this.eclReferenceService.refFileDownload1(fileUrl).subscribe(response => {
        if (response) {
          if (response.size > 0) {
            const attachedFile = new File([response], this.referenceDetails3.refUrlFileName, { type: this.referenceDetails3.refUrlFileType });
            this.previouslySavedFiles2 = [...this.previouslySavedFiles2, attachedFile];
            this.isDownloadFileHidden2 = false;
          }
        }
      }, error => console.log(error),
        () => this.previousDocFile1Download2()
      );
    } else {
      this.previousDocFile1Download2();
    }
  }

  /***Method to retrieve previously saved doc file1 attachment for third reference */
  previousDocFile1Download2() {
    const fileUrl = environment.restServiceUrl + RoutingConstants.ECL_REFERENCES_URL + "/" + RoutingConstants.REF_FILE_DOWNLOAD_SECOND_URL + "/" + this.referenceDetails3.referenceId + "/" + Constants.REF_DOC_FILE1;
    if (this.referenceDetails3.referenceId) {
      this.eclReferenceService.refFileDownload2(fileUrl).subscribe(response => {
        if (response) {
          if (response.size > 0) {
            const attachedFile = new File([response], this.referenceDetails3.refDocFileName1, { type: this.referenceDetails3.refDocFileType1 });
            this.previouslySavedFiles2 = [...this.previouslySavedFiles2, attachedFile];
          }
        }
      }, error => console.log(error),
        () => this.loading = false)
    } else {
      this.loading = false;
    }
  }

  /***Method to set parameters for deleting a reference file attachment***/
  deleteReferenceFile(fileNumber: number) {
    if (fileNumber === FIRST_REFERENCE_FIRST_FILE) {
      this.setReferenceParameters(FILE_ONE, this.referenceDetails1.referenceId);
    } else if (fileNumber === FIRST_REFERENCE_SECOND_FILE) {
      this.setReferenceParameters(FILE_TWO, this.referenceDetails1.referenceId);
    } else if (fileNumber === SECOND_REFERENCE_FIRST_FILE) {
      this.setReferenceParameters(FILE_ONE, this.referenceDetails2.referenceId);
    } else if (fileNumber === SECOND_REFERENCE_SECOND_FILE) {
      this.setReferenceParameters(FILE_TWO, this.referenceDetails2.referenceId);
    } else if (fileNumber === THIRD_REFERENCE_FIRST_FILE) {
      this.setReferenceParameters(FILE_ONE, this.referenceDetails3.referenceId);
    } else if (fileNumber === THIRD_REFERENCE_SECOND_FILE) {
      this.setReferenceParameters(FILE_TWO, this.referenceDetails3.referenceId);
    }
    this.removeAttachmentDisplay = true;
  }

  setReferenceParameters(referenceFileNumber: number, referenceId: number) {
    this.referenceFileNumber = referenceFileNumber;
    this.referenceIdDeleting = referenceId;
  }

  /***Activated when user clicks Cancel on File Deletion dialog***/
  removeAttachmentCancel() {
    this.removeAttachmentDisplay = false;
  }

  /***Activated when user clicks Delete on File Deletion dialog***/
  removeAttachmentDelete() {
    this.removeAttachmentDisplay = false;
    this.eclReferenceService.deleteReferenceAttachment(this.referenceIdDeleting, this.referenceFileNumber).subscribe(response => {
      if (response.code === Constants.HTTP_OK) {
        this.refreshIdeaAndReferences();
      }
    });
  }

  navigateBackResearch() {
    this.router.navigate(['my-research-request']);
  }

  navigateBackResearchId() {
    let rrPathParams = btoa(JSON.stringify({
      'rrCode': this.rrCode,
      'navPageTitle': this.navPageTitle,
      'navPagePath': Constants.MY_RESEARCH_REQUEST_ROUTE,
      'rrReadOnly': true,
      'rrButtonsDisable': false
    }));
    let navigationPath = Constants.RESEARCH_REQUEST_ROUTE;

    this.router.navigate([navigationPath], {
      queryParams: { rrPathParams: rrPathParams }
    });
  }
}

/**
 * @override FileUpload.prototype.formatSize
 * Do not always do this. Meaning this piece will have to be
 * micro-managed. :(
 */
FileUpload.prototype.formatSize = function (bytes) {
  if (bytes === 0) {
    return '0 B';
  }
  let k = 1000, dm = 0, sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
