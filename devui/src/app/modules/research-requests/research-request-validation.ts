import { Injectable } from '@angular/core';
import { Constants } from '../../shared/models/constants';
import { ResearchRequestDto } from 'src/app/shared/models/dto/research-request-dto';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { ResearchRequestSearchedRuleDto } from 'src/app/shared/models/dto/research-request-searched-rule-dto';
import { SelectItem } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})

export class ResearchRequestValidation {
  constructor(private toastService: ToastMessageService) {
  }

  /* Method to validate and show warning message for the form required fields */
  validateFields(researchRequestObj: ResearchRequestDto, enableComment?: boolean, enableReason?: boolean,
    routeToObj?: any, ruleResponses?: ResearchRequestSearchedRuleDto[], ruleResponseStatus?: SelectItem[],
    enableTeamAssignee?: boolean): boolean {
    let res = true;
    const clientWithNoPayer = { clientName: '' };
    if (!researchRequestObj.project) {
      res = false;
      this.showWarningMessage(`Please select the Project`);
    } else if (!researchRequestObj.issueType) {
      res = false;
      this.showWarningMessage(`Please select the Issue Type`);
    } else if (!(researchRequestObj.clientSelected.length > 0)) {
      res = false;
      this.showWarningMessage(`Please select Client(s)`);
    } else if (researchRequestObj.clientSelected.length > 0 &&
      researchRequestObj.selectedPayerList.length == 0) {
      res = false;
      this.showWarningMessage(`Please select Payer(s) for corresponding Client(s)`);
    } else if (!researchRequestObj.requestSummary) {
      res = false;
      this.showWarningMessage(`Please enter the request summary`);
    } else if (!researchRequestObj.requestDescription) {
      res = false;
      this.showWarningMessage(`Please enter the request description`);
    } else if (!researchRequestObj.team) {
      res = false;
      this.showWarningMessage(`Please select the team`);
    } else if (!researchRequestObj.policyType) {
      res = false;
      this.showWarningMessage(`Please select the research request policy type`);
    } else if (!this.validateDueDate(researchRequestObj)) {
      res = false;
    } else if (enableReason && !researchRequestObj.sendBackReasonId) {
      res = false;
      this.showWarningMessage(`Please select the research send back reason`);
    } else if (enableComment && !researchRequestObj.rrComments) {
      res = false;
      this.showWarningMessage(`Please enter the request comments`);
    } else if (routeToObj && routeToObj.label === Constants.RR_WORKFLOW_STATUS_REQUESTOR_REVIEW && (
      !researchRequestObj.rrResolutionComments || !researchRequestObj.rrReqClassificationId)) {
      res = false;
      this.showWarningMessage('Please fill out required resolution information');
    } else if (this.validateRuleResponseComments(ruleResponses, ruleResponseStatus)) {
      res = false;
      this.showWarningMessage(`A 'Reject' rule response requires comment input`);
    } else if (enableTeamAssignee && !researchRequestObj.teamAssignee){
      this.showWarningMessage(`Please select the team assignee`);
    }
    return res;
  }

  validateRuleResponseComments(ruleResponses: ResearchRequestSearchedRuleDto[], ruleResponseStatus) {
    let res = false;
    if (ruleResponses && ruleResponses.length > 0) {
      const { value: rejValue } = ruleResponseStatus.find(v => v.label === "Reject");
      for (let i = 0; i < ruleResponses.length; i++) {
        if (!ruleResponses[i].reviewComments && ruleResponses[i].rrRuleStatus === rejValue) {
          res = true;
          break;
        }
      }
    }
    return res;
  }

  /* Method to validate and show warning message for the due date field */
  validateDueDate(researchRequestObj: ResearchRequestDto) {
    let res = true;
    if (researchRequestObj.requestDueDate) {
      const date = new Date(researchRequestObj.requestDueDate);
      const currenDate = new Date();
      if (date < currenDate) {
        res = false;
        this.showWarningMessage(`please enter valid due date as a future date`);
      }
    } else {
      res = false;
      this.showWarningMessage(`please enter the request due date`);
    }
    return res;
  }

  showWarningMessage(message: string) {
    this.toastService.messageWarning('No Data', message, 4000, true);
  }
}
