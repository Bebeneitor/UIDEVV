import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from './navigation.service';
import { StorageService } from 'src/app/services/storage.service';
import { AppUtils } from 'src/app/shared/services/utils';
import { RuleInfoService } from 'src/app/services/rule-info.service';
import { GoodIdeasServiceService } from 'src/app/services/good-ideas-service.service';
import { Constants } from 'src/app/shared/models/constants';
import { RuleManagerService } from '../industry-update/rule-process/services/rule-manager.service';
import { constants } from 'os';

const WRITE_MODE="w";
const READ_MODE="r";
const NON_DIALOG_MODE= false;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {

  sub: any;

  id: string;
  type: string;
  mode:string = READ_MODE;
  status: string = "";
  stageId:number = 0;
  assignedUserId:number=0;
  libRuleId:number=0;
  impactedRuleId:number=0;
  flow: string = '';
  role: string = '';
  tabSelected: string ='';

  readyToDisplay: boolean = false;

  configRule: any;

  parent: string = '';
  // to hold either, the parent workflowstatus or the potentiallyImpactedRule id.
  parentParam: string = '';
  readOnlyView: boolean = true;
  templateActivate: boolean = false;

  constructor(private route: ActivatedRoute, private navigationService: NavigationService,
    private storageService: StorageService, private ruleService: RuleInfoService, private utils:AppUtils,
    private goodIdeaService: GoodIdeasServiceService, private ruleManagerService:RuleManagerService) {
      route.queryParams.subscribe(qparams => {
        if (qparams['flow']) {
          this.flow = this.utils.decodeString(qparams['flow']);
        }
        if (qparams['role']) {
          this.role = this.utils.decodeString(qparams['role']);
        }
      })
    this.sub = this.route.params.subscribe(params => {
      this.id = this.utils.decodeString(params['id']);
      this.type = params['type'];
      this.tabSelected=params['tabSelected'];
      if (params['parentParam']) {
        this.parentParam = this.utils.decodeString(params['parentParam']);
      }
      if (WRITE_MODE === params['mode']) {
        this.mode = WRITE_MODE;
      }      
    });
  }

  ngOnInit() {
    //Init data
    this.loadData();

    if (this.storageService.exists("PARENT_NAVIGATION")) {
      this.parent = this.storageService.get("PARENT_NAVIGATION", false);
    } else {
      this.parent = "";
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();

    this.storageService.remove("PARENT_NAVIGATION");
  }

  /**
   * Load status by ID for IDEAS, RULES and GOODIDEAS
   */
  loadData() {
    this.assignedUserId = 0;
    switch (this.type) {
      case "IDEA":
        //Verify idea status (Draft and Idea will show different screen)
        let ideaDto = null;
        this.navigationService.getIdeaStage(Number(this.id)).subscribe((response: any) => {
          if (response.code == 200) {
            ideaDto = response.data;
            switch (Number(ideaDto.statusId)) {
              case 0:
                this.status = "DRAFT";
                break;
              case 1:
                this.status = "IDEA";
                break;
            }
            if (ideaDto.workflow && ideaDto.workflow.assignedTo) {
              this.assignedUserId = ideaDto.workflow.assignedTo.userId;
            }
          } else {
            this.status = "";
          }
          
          this.validateReadOnly(ideaDto);

          this.readyToDisplay = true;
        });
        break;
      case "RULE":
        this.checkRuleCase();
        break;
      case "GOODIDEA":
        this.storageService.set("PARENT_NAVIGATION", "GOOD_IDEAS", false);
        this.goodIdeaService.updateStatusToReviewedInGoodIdeas(Number(this.id)).then((response: any) => {
          if (response.code == 200) {
            this.type = "RULE";
            this.checkRuleCase();
          }
        });
        break;
    }
  }
  
  /**
   * Check Rule Case. If ruleStatus is Privisiona Rule and we are navigating
   * from "My Tasks" widget, then go to New Idea Research Screen.
   * Otherwise go to Rule Details Screen.
   */
  checkRuleCase() {
    this.ruleService.getRuleInfo(Number(this.id)).subscribe(resp => {
      let ruleInfo = resp.data;
      if (ruleInfo == null || ruleInfo.ruleStatusId == null) {
        return;
      }
      if (Constants.PROVISIONAL_RULE_VALUE === ruleInfo.ruleStatusId.ruleStatusId ||
          ruleInfo.parentRuleId === ruleInfo.ideaId) {
        if (this.parent === "MY_TASKS"  || this.parent === "IDEAS_RESEARCH_RETURNED" || this.parentParam === Constants.NEED_MORE_INFO_CODE) {
          // Should navigate to Idea Resaerch Screen.
          this.type = "IDEA";
          this.id = ruleInfo.ideaId;
          this.status = "IDEA";
        } else {
          this.status = "PROVISIONAL_RULE";
        }
        this.stageId = Constants.ECL_PROVISIONAL_STAGE;
      } else {
        this.libRuleId = +this.id;
        this.templateActivate = true;
        if (this.mode === WRITE_MODE && !isNaN(+this.parentParam)) {
          this.id = this.parentParam;
          this.impactedRuleId = +this.parentParam;
          this.templateActivate = false;
        } 
        this.status = "RULE";
      }
      if (ruleInfo && ruleInfo.activeWorkflow && ruleInfo.activeWorkflow.assignedTo) {
        this.assignedUserId = ruleInfo.activeWorkflow.assignedTo.userId;
      }
      this.validateReadOnly();
      this.readyToDisplay = true;
    });
  }


  validateReadOnly(item:any={}) {
    if (this.mode === WRITE_MODE && this.assignedUserId > 0) {
      this.readOnlyView = (this.assignedUserId !== this.utils.getLoggedUserId());
    } else {
      switch (this.parent) {
        case "MY_CONTRIBUTIONS":
          if (this.status == "DRAFT") {
            this.readOnlyView = false;
          }
          break;
        case "MY_TASKS":
          this.readOnlyView = false;
          break;
        case "IDEAS_GENERATED":
          if (this.status == "DRAFT") {
            // From Draft Ideas Generated allow edition if
            // current user is idea creator.
            this.readOnlyView =
              this.utils.getLoggedUserId() !== item.createdBy
          }
          break;
        case "IDEAS_RESEARCH_RETURNED":
          this.readOnlyView = false;
          break;  
        case "IDEAS_RESEARCH_ASSIGNED":
            this.readOnlyView = false;
          break;
        default:
        this.readOnlyView = true;
        break;
      }
    }
    const isSameSim = (Constants.SAMESIM_IMPACT_TYPE === this.flow);
    if (isSameSim) {
      this.readOnlyView = true;
    }
    //If you need validate something else for enable components in detail screen
    //please put here

    this.configRule = {
      ruleId: this.id,
      header: "Provisional Details",
      ruleReview: true,
      templateActivate: this.templateActivate,
      readOnlyView: this.readOnlyView,
      stageId: this.stageId,
      impactedRuleId: this.impactedRuleId,
      libRuleId: this.libRuleId,
      isSameSim: isSameSim,
      readWrite:!this.readOnlyView,
      reviewStatus: this.getApprovalOptionsByRole(this.role),
      closeNavigateTo: this.getNavigateTo(this.role),
      tabSelected : this.tabSelected,
      dialogMode: false
    }
  }

  /**
   * Used by SameSim flow. get approval Options given a role name
   * @param role Role Name.
   */
  getApprovalOptionsByRole(role:string) {
    switch (role) {
      case Constants.CCA_ROLE:
        return this.ruleManagerService.getStatusForCCA();
      case Constants.PO_ROLE:
        return this.ruleManagerService.getStatusForPo();
      case Constants.MD_ROLE:
        return this.ruleManagerService.getStatusForMd();
      default:
        return [];
    }
  }

  getNavigateTo(role:string):string {
    switch (role) {
      case Constants.CCA_ROLE:
        return Constants.SAME_SIM_NAV_INITIATE_ANALYSIS;
      case Constants.PO_ROLE:
        return Constants.SAME_SIM_NAV_POLICY_OWNER_APPROVAL;
      case Constants.MD_ROLE:
        return Constants.SAME_SIM_NAV_MEDICAL_DIRECTOR_APPROVAL;
      default:
        return '';
    }
  }
}
