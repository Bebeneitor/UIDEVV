import {Component, Input, OnInit} from '@angular/core';
import {RuleInfoService} from "../../../../services/rule-info.service";
import {Constants} from "../../../../shared/models/constants";

const LIBRARY_RULE= "Library Rule";
const PROVISIONAL_RULE= "Provisional Rule";
const IDEA= "Idea";

@Component({
  selector: 'app-rule-history',
  templateUrl: './rule-history.component.html',
  styleUrls: ['./rule-history.component.css']
})
export class RuleHistoryComponent implements OnInit {

  @Input() ruleId: number;
  @Input() ruleCreationStatus: boolean;



  cols: any[];

  loading: boolean = false;

  keywordSearch: string;

  selectedLR: boolean;
  selectedPR: boolean;
  selectedID: boolean;
  ruleStageId: number;

  workflowList: any[] = [];

  filteredWorkflowList: any[] = [];

  constructor(private ruleService: RuleInfoService) { }

  ngOnInit() {

    this.loading = true;

    this.keywordSearch = '';

    this.cols = [
      {field : 'dateTime', header: 'Created On', width: '15%'},
      {field : 'ruleCode', header: 'Rule ID', width: '10%'},
      {field : 'status', header: 'Status', width: '10%'},
      {field : 'user', header: 'User', width: '13%'},
      // {field : 'role', header: 'Role', width: '13%'},
      {field : 'action', header: 'Action', width: '20%'},
      {field : 'comments', header: 'Comments', width: '20%'}
    ]

    this.fetchAllWorkflows();

  }

  fetchAllWorkflows(){
    if(this.ruleCreationStatus){
      this.ruleStageId = Constants.ECL_IDEA_STAGE;
    }else{
      this.ruleStageId = Constants.ECL_PROVISIONAL_STAGE;
    }
    this.ruleService.getRuleHistory(this.ruleId, this.ruleStageId).subscribe((response: any) => {
      response.data.forEach(workflow => {
        if(!this.selectedLR && workflow.eclStage.eclStageDesc === LIBRARY_RULE)
          this.selectedLR = true;
        if(!this.selectedPR && workflow.eclStage.eclStageDesc === PROVISIONAL_RULE)
          this.selectedPR = true;
        if(!this.selectedID && workflow.eclStage.eclStageDesc === IDEA)
          this.selectedID = true;

        this.workflowList.push({
          "dateTime": workflow.assignedDt,
          "status": workflow.eclStage.eclStageDesc,
          "ruleCode": workflow.ruleCode,
          "user": workflow.assignedTo ? workflow.assignedTo.firstName + ' ' + workflow.assignedTo.lastName : '',
          // "role": this.getRolesDescription(workflow.assignedTo),
          "action": workflow.workflowStatus ? workflow.workflowStatus.lookupDesc : '',
          "comments": workflow.reviewComments
        });

        this.filerDataTable();
      });

      this.loading = false;
    });

    this.filteredWorkflowList = this.workflowList;


  }

  getRolesDescription(usr:any) {
    if (usr == null || usr.roles == null) {
      return "";
    }
    let res = "";
    usr.roles.forEach((usrRole:any) => {
      if (usrRole.role != null) {
        res += usrRole.role.roleDescription + ",";
      }
    });
    return res;
  }

  filerDataTable()
  {
    this.filteredWorkflowList = this.workflowList.filter( workflow =>
      (this.selectedLR && workflow.status === LIBRARY_RULE) ||
      (this.selectedPR && workflow.status === PROVISIONAL_RULE) ||
      (this.selectedID && workflow.status === IDEA)
    ).sort(workflow => workflow.assignedDt).reverse()

  }

}
