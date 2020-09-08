import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { NewIdeaService } from 'src/app/services/new-idea.service';
import { SameSimService } from 'src/app/services/same-sim.service';
import { Constants } from 'src/app/shared/models/constants';
import { ReturnRules } from 'src/app/shared/models/dto/return-rules';
import { RuleInfoService } from "../../../../../services/rule-info.service";
import { KeyLimitService } from '../../../../../shared/services/utils';
import { AuthService } from 'src/app/services/auth.service';


const REASSIGNMENT_RETURN = "Reassignment Peer Reviewer Return";
const REASSIGNMENT_RETURN_POLICY_OWNER = "Reassignment Policy Owner Return";
const REASSIGNMENT_RM_RETURN_POLICY_OWNER = "Reassignment RM Policy Owner Return";
const ECL_INDUSTRY_UPDATES_REASSIGNMENT_POLICY_OWNER = "ECL Industry Updates Reassignment for Policy Owner Analysis";
const ECL_INDUSTRY_UPDATES_ASSIGNED_PEER_REVIEWER_APPROVAL = "ECL Industry Updates Assign for Peer Reviewer Approval";
const ECL_INDUSTRY_UPDATES_REASSIGNMENT_FOR_CCA = 'ECL Industry Updates Reassignment for CCA Analysis';
const ECL_PROVISIONAL_STAGE = Constants.ECL_PROVISIONAL_STAGE;

@Component({
  selector: 'app-return-dialog',
  templateUrl: './return-dialog.component.html',
  styleUrls: ['./return-dialog.component.css']
})
export class ReturnDialogComponent implements OnInit {

  constructor(public ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private router: Router,
    private key: KeyLimitService,
    private newIdeaService: NewIdeaService,
    private ruleInfoService: RuleInfoService,
    private sameSimService: SameSimService,
    private authService: AuthService) {
  }

  ngOnInit() {
    if (this.config.header === REASSIGNMENT_RETURN || this.config.header === REASSIGNMENT_RETURN_POLICY_OWNER
      || this.config.header === ECL_INDUSTRY_UPDATES_REASSIGNMENT_POLICY_OWNER || this.config.header === REASSIGNMENT_RM_RETURN_POLICY_OWNER
      || this.config.header === ECL_INDUSTRY_UPDATES_ASSIGNED_PEER_REVIEWER_APPROVAL || this.config.header === ECL_INDUSTRY_UPDATES_REASSIGNMENT_FOR_CCA) {

      this.header = this.config.header;
      this.selectedRuleIds = this.config.data.selectedRulesIds;
      this.stageId = this.config.data.stageId;
    }
    else
      this.ideaId = this.config.data.ideaId
  }



  selectedInfo: String = '';
  limitCount: number = 256;            // Only value that needs to be changed when increasing or decreasing the limitCount. (Also the HTML attribute needs to change with it as well)
  showCount: number = this.limitCount;
  returnComments: String;
  ideaId: number;
  selectedRuleIds: any[] = [];
  header: any;
  stageId: number;
  returnRules: ReturnRules = {
    ruleId: [],
    stageId: 0,
    comments: '',
    action: ''
  }


  returnMessage(event) {
    this.showCount = this.key.keyCheck(event, this.limitCount);
    this.selectedInfo = event;


    // Something something about number 10 to pass?
    // Need to unsubscribe soon.
  }

  cancelReturnDialog() {
    this.ref.close();
  }

  async routeToReassign() {
    //Send Comment data of this.selectedInfo to Reassignment for Rule Approval
    this.returnComments = this.selectedInfo;
    if (this.header === REASSIGNMENT_RETURN || this.header === ECL_INDUSTRY_UPDATES_ASSIGNED_PEER_REVIEWER_APPROVAL) {

      this.selectedRuleIds.forEach((rule: any) => {
        if (rule !== undefined) {
          this.returnRules.ruleId.push(rule.ruleId);
        }
      });
      this.returnRules.comments = this.returnComments;
      this.returnRules.action = "return";
      this.returnRules.stageId = this.stageId;

      this.ruleInfoService.mdReturnedRules(this.returnRules).subscribe(result => {
        if (result) {
          this.ref.close();
          if (this.stageId > ECL_PROVISIONAL_STAGE) {
            if (this.header === ECL_INDUSTRY_UPDATES_ASSIGNED_PEER_REVIEWER_APPROVAL) {
              this.router.navigateByUrl("industry-updates/rule-process/for-medical-director-approval?tab=" + Constants.RETURNED_TAB);
            } else {
              this.router.navigateByUrl("assignForMDApprovalRM");
            }
          } else {
            this.router.navigateByUrl("assignForMDApprovalNR");
          }

        }
      });

    }
    else if (this.header === REASSIGNMENT_RETURN_POLICY_OWNER || this.header === REASSIGNMENT_RM_RETURN_POLICY_OWNER
      || this.config.header === ECL_INDUSTRY_UPDATES_REASSIGNMENT_POLICY_OWNER || this.config.header === ECL_INDUSTRY_UPDATES_REASSIGNMENT_FOR_CCA) {

      this.selectedRuleIds.forEach((rule: any) => {
        if (rule !== undefined) {
          this.returnRules.ruleId.push(rule.ruleId);
        }
      });
      this.returnRules.comments = this.returnComments;
      this.returnRules.action = "return";
      this.returnRules.stageId = this.stageId;

      const userId = this.authService.getLoggedUser().userId;
      let endPoint$ = this.config.data.isImpactAnalysis ? this.sameSimService.reassignRulesComments(userId, this.returnRules.ruleId, "CCA", { lookupDesc: this.returnComments }, true)
        : this.ruleInfoService.policyReturnedRules(this.returnRules);

      endPoint$.subscribe(result => {
        if (result) {
          this.ref.close();
          if (this.header === REASSIGNMENT_RETURN_POLICY_OWNER) {
            this.router.navigateByUrl("reAssignForRuleApprovalReturned");
          } else if (this.header === REASSIGNMENT_RM_RETURN_POLICY_OWNER) {
            this.router.navigateByUrl("reAssignForRuleUpdateApproval?tab=" + Constants.QUERY_PARAM_RETURNED);
          } else if (this.config.header === ECL_INDUSTRY_UPDATES_REASSIGNMENT_POLICY_OWNER || this.config.header === ECL_INDUSTRY_UPDATES_REASSIGNMENT_FOR_CCA) {
            if (this.config.data.isImpactAnalysis) {
              this.router.navigateByUrl("industry-updates/rule-process/reassignment-cca?tab=" + Constants.RETURNED_TAB);
            } else {
              this.router.navigateByUrl("industry-updates/rule-process/reassignment-po?tab=" + Constants.RETURNED_TAB);
            }
          }
        }
      });

    } else {

      this.newIdeaService.returnIdea(this.ideaId, this.returnComments).subscribe(result => {
        JSON.stringify(result);
        if (result) {
          this.ref.close();
          this.router.navigateByUrl("assignmentNewIdea");
        }
      });
    }

  }

}
