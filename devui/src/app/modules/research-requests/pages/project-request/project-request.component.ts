import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ResearchRequestDto } from 'src/app/shared/models/dto/research-request-dto';
import {Constants, Constants as con} from 'src/app/shared/models/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { ResearchRequestService } from 'src/app/services/research-request.service';
import { PeopleComponent } from '../../shared/people/people.component';
import { ProjectRequestDto } from '../../models/dto/project-request-dto';
import { DetailsComponent } from '../../shared/details/details.component';
import { DescriptionComponent } from '../../shared/description/description.component';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { AppUtils } from 'src/app/shared/services/utils';
import { RequestConstants } from '../../models/request.constants';

enum PR_CONST {
  MY_REQUEST = 1,
  RESEARCH_REQ = 2,
}

@Component({
  selector: 'app-project-request',
  templateUrl: './project-request.component.html',
  styleUrls: ['./project-request.component.css']
})
export class ProjectRequestComponent implements OnInit, AfterViewInit {

  @ViewChild(PeopleComponent,{static: true}) people: PeopleComponent;
  @ViewChild(DetailsComponent,{static: true}) detail: DetailsComponent;
  @ViewChild(DescriptionComponent,{static: true}) desc: DescriptionComponent;

  projectRequest: ProjectRequestDto;
  userId: number;
  rrId: number;
  prId: number;
  rrCode: string;
  pageSetup: number = RequestConstants.PROJECT_PAGE;

  // NAVIGATIONS
  baseTitle: string;
  secondaryTitle: string;
  basePath: string;
  secondaryPath: string;

  // BOOLEANS
  readOnly: boolean = true;
  searchDisable: boolean = false; //Please change to 'True' when search form is updated.
  rrButtonsDisable: boolean;
  formDirty: boolean = false;
  loading: boolean = false;
  backNavigation: number;
  issueTypeDesc: string;

  constructor(private route: ActivatedRoute, private router: Router,
              private rrService: ResearchRequestService,
              private toast: ToastMessageService,
              private utils: AppUtils) {
  }

  ngOnInit() {
    this.loading = true;
    this.projectRequest = new ProjectRequestDto;
    this.route.queryParams.subscribe(params => {
      if (params['rrPathParams']) {
        let requestObj = JSON.parse(atob(params['rrPathParams']));
        this.rrCode = requestObj['rrCode'];
        this.rrId = requestObj['rrId'];
        this.prId = requestObj['prId'];
        this.baseTitle = requestObj['baseTitle'];
        this.secondaryTitle = requestObj['secondaryTitle'];
        this.basePath = requestObj['basePath'];
        this.secondaryPath = requestObj['secondaryPath'];
        this.readOnly = requestObj['readOnly'];
        this.rrButtonsDisable = requestObj['rrButtonsDisable'];
        this.backNavigation = requestObj['backNavigation'];
        this.issueTypeDesc = requestObj['issueTypeDesc'];
      }
    });

  }

  ngAfterViewInit() {
    this.loadProjectRequest(this.prId);
  }

  /** Loading first by Research Request Detail if PROJECT ID doesn't exist.
   * If project id exist then load it by projectRequest.
   */
  loadProjectRequest(prId?: number) {
    const encryptUserData = JSON.parse(localStorage.getItem('ENCRYPT_USER_DATA'));
    if (!prId) {
      this.rrService.getResearchRequestDetails(this.rrId).subscribe(resp => {
        if (resp != null && resp.data != null) {
          this.projectRequest = this.stripExcessRRData(resp.data);
          this.projectRequest.userId = encryptUserData.username;
          this.projectRequest.encryptPass = encryptUserData.password;
          this.readOnly = !this.editableAllFields();
        }
        this.loading = false;
      }, error => {
        this.loading = false;
      });
    } else {
      this.rrService.getProjectRequest(prId).subscribe(resp => {
        if (resp && resp.data != null) {
          this.projectRequest = resp.data;
          this.projectRequest.userId = encryptUserData.username;
          this.projectRequest.encryptPass = encryptUserData.password;
          this.readOnly = !this.editableAllFields();
        }
        this.loading = false;
      }, error => {
        this.loading = false;
      })
    }
  }

  /** Stripping Research Request Object most of it's unneeded properties.
   * @param request Research Request Dto
   * @return ProjectRequestDto
   */
  stripExcessRRData(request: ResearchRequestDto): ProjectRequestDto {
    return new ProjectRequestDto(request);
  }

  /** Update the Project Request sending dto to backend to persist.
   * @param action Determine if it's saving or loading.
   */
  updateProjectRequest(action) {
    this.loading = true;
    this.projectRequest.action = action;
    if (this.validationSubmitCheck()) {
      this.rrService.saveProjectRequest(this.projectRequest).subscribe(resp => {
        if (resp && resp.data && resp.data.projectRequestId) {
          this.loadProjectRequest(resp.data.projectRequestId);
          this.toast.messageSuccess("Success", `Project Request ${resp.data.projectRequestCode} has submit successfully!`, 4000);
        } else {
          this.toast.messageInfo('Info', resp.message, 4000);
        }
        this.loading = false;
      }, error => {
        this.loading = false;
      })
    } else {
      this.loading = false;
    }

  }
  /**
   * Verify if required fields are submitted and dated properly.
   * @returns true if passes, false if fails.
   */
  validationSubmitCheck() {
    try {
      if (this.projectRequest.clientSelected.length <= 0) {
        this.toast.messageWarning(con.TOAST_SUMMARY_WARN, 'Please select a Client', 4000);
        return false;
      } else if (this.projectRequest.selectedPayerList.length <= 0) {
        this.toast.messageWarning(con.TOAST_SUMMARY_WARN, 'Please select a Payer', 4000);
        return false;
      } else if (!this.projectRequest.issueType) {
        this.toast.messageWarning(con.TOAST_SUMMARY_WARN, 'Please select Request Type', 4000);
        return false;
      } else if (this.projectRequest.requestDescription.trim() == '') {
        this.toast.messageWarning(con.TOAST_SUMMARY_WARN, 'Please enter the Request Description', 4000);
        return false;
      } else if (!this.projectRequest.requestDueDate) {
        this.toast.messageWarning(con.TOAST_SUMMARY_WARN, 'Please enter the Desired Completed Date', 4000);
        return false;
      } else if (!this.projectRequest.projectCategoryId) {
        this.toast.messageWarning(con.TOAST_SUMMARY_WARN, 'Please select a Project Category', 4000);
        return false;
      } else if (!this.projectRequest.requestSource) {
        this.toast.messageWarning(con.TOAST_SUMMARY_WARN, 'Please enter the Source of the Request', 4000);
        return false;
      } else {
        return true;
      }
    } catch(e) {
      this.toast.messageError('Invalid Format Detected', 'Please try again with new values', 3000);
      this.loading = false;
    }
  }

  refreshProjectRequest() {
    this.loadProjectRequest();
  }

  /** Child will call this method to make the form dirty and prevent user from leaving
   * if unsaved form is found.
   */
  setFormDirty() {
    this.formDirty = true;
  }

  /** Two Path navigation route to check which route the user is heading back to.
   * @param route number to determine which route they are heading back.
   */
  navigateBack(route: number) {
    if (route === PR_CONST.MY_REQUEST) {
      this.router.navigateByUrl(this.basePath);
    } else if (route === PR_CONST.RESEARCH_REQ) {
      this.router.navigate([this.basePath], {queryParams: {view: true}});
    } else {
      const rrPathParams = btoa(JSON.stringify({
        'rrCode': this.rrCode,
        'navPageTitle': 'My Requests',
        'navPagePath': con.MY_RESEARCH_REQUEST_ROUTE,
        'rrReadOnly': true,
        'rrButtonsDisable': false
      }));

      this.router.navigate([con.RESEARCH_REQUEST_ROUTE], {
        queryParams: {rrPathParams: rrPathParams}
      });
    }
  }

  /** Check if Project Request is created by the same user and rrStatus
   * is not completed and nav titles are not from unassigned and search.
   */
  editableAllFields() {
    return (this.projectRequest.prCreatedBy === this.utils.getLoggedUserId()
      && this.projectRequest.prStatus !== con.RR_WORKFLOW_STATUS_RESEARCH_COMPLETED
      && this.baseTitle !== (con.RR_NAVIGATE_TITLE_UNASSIGNED)
      && this.baseTitle !== (con.RR_NAVIGATE_TITLE_SEARCH));
  }

  /**
   * CI-JIRA Project Request Sync-up
   */
  syncUpJiraPR() {
    this.loading = true;
    this.rrService.pushOrPullProjectRequestFromJira(this.projectRequest.jiraId).subscribe(response => {
      if (response.code !== Constants.HTTP_OK && response.message === Constants.SERVICE_FAILURE) {
        this.toast.message(Constants.TOAST_SEVERITY_INFO, Constants.RR_CUSTOM_SERVICE_ERROR_MSG, null, Constants.TOAST_DEFAULT_LIFE_TIME, Constants.TOAST_CLOSABLE);
      } else if (response.code === Constants.HTTP_OK) {
        this.loading = false;
        let successMessage = `Project Request '${this.projectRequest.projectRequestId}' Sync successfully.`;
        this.toast.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, successMessage, 3000, true);
        this.loadProjectRequest(this.projectRequest.projectRequestId);
      } else {
        this.loading = false;
        this.toast.message(Constants.TOAST_SEVERITY_INFO, Constants.RR_CUSTOM_SERVICE_ERROR_MSG, null,
          Constants.TOAST_DEFAULT_LIFE_TIME, Constants.TOAST_CLOSABLE);
      }
    });
  }

  private disabledCIJiraSyncByPRSearch(): boolean {
    return (this.issueTypeDesc && this.issueTypeDesc === RequestConstants.PROJECT_REQ) ? true : false;
  }

}
