import { DatePipe } from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import { RuleInfo } from 'src/app/shared/models/rule-info';
import {RuleInfoService} from "../../../../services/rule-info.service";
import {Constants} from "../../../../shared/models/constants";

const LIBRARY_RULE= "Library Rule";
const PROVISIONAL_RULE= "Provisional Rule";
const IDEA= "Idea";
const CUSTOM_RULE= "Custom Rule";

@Component({
  selector: 'app-rule-history',
  templateUrl: './rule-history.component.html',
  styleUrls: ['./rule-history.component.css']
})
export class RuleHistoryComponent implements OnInit {

  ruleId: number = 0;
  ideaId: number = 0;
  parentRuleId: number = 0;
  @Input() ruleCreationStatus: boolean;

  @Input() set ruleInfo(value:RuleInfo) {
    if (value && (value.ruleId || value.ideaId)) {
      this.ruleId = value.ruleId;
      this.ideaId = value.ideaId;
      this.parentRuleId = value.parentRuleId;
      this.fetchAllWorkflows();
    }
  }

  cols: any[];

  loading: boolean = false;

  keywordSearch: string;

  selectedLR: boolean;
  selectedPR: boolean;
  selectedID: boolean;
  selectedCR: boolean;

  includeCR : boolean;
  ruleStageId: number = 0;

  workflowList: any[] = [];

  filteredWorkflowList: any[] = [];

  constructor(private ruleService: RuleInfoService, private datepipe: DatePipe) { }

  ngOnInit() {


    this.keywordSearch = '';

    this.cols = [
      {field : 'eclCode'    , header: 'Idea/Rule ID'    , width: '13%'},
      {field : 'status'     , header: 'Status'              , width: '10%'},
      {field : 'assignedTo' , header: 'Assigned To'         , width: '15%'},
      {field : 'assignedOn' , header: 'Assigned/Returned On', width: '27%'},
      {field : 'assignedBy' , header: 'Assigned/Returned By', width: '15%'},
      {field : 'action'     , header: 'Action'              , width: '15%'},
      {field : 'comments'   , header: 'Comments'            , width: '15%'}
    ]
  }

  fetchAllWorkflows(){
    this.loading = true;
    let eclId:number;
    if(this.ideaId){
      eclId = this.ideaId;
      this.ruleStageId = Constants.ECL_IDEA_STAGE;
    }
    if (this.ruleId) {
      eclId = this.ruleId;
      this.ruleStageId = Constants.ECL_PROVISIONAL_STAGE;
    }
    this.ruleService.getRuleHistory(eclId, this.ruleStageId).subscribe((response: any) => {
      this.workflowList = [];
      response.data.forEach(workflow => {
        if(!this.selectedLR && workflow.eclStage.eclStageDesc === LIBRARY_RULE)
          this.selectedLR = true;
        if(!this.selectedPR && workflow.eclStage.eclStageDesc === PROVISIONAL_RULE)
          this.selectedPR = true;
        if(!this.selectedID && workflow.eclStage.eclStageDesc === IDEA)
          this.selectedID = true;
        if(!this.selectedCR && workflow.eclStage.eclStageDesc === CUSTOM_RULE){
          this.includeCR = true;
          this.selectedCR = true;
        }

        this.workflowList.push({
          "eclCode": workflow.ruleCode,
          "status": workflow.eclStage.eclStageDesc,
          "assignedTo": workflow.assignedTo ? `${workflow.assignedTo.firstName} ${workflow.assignedTo.lastName}`  : Constants.EMPTY_STRING,
          "assignedOn": workflow.assignedDt ? this.datepipe.transform(workflow.assignedDt, 'medium')             : Constants.EMPTY_STRING,
          "assignedBy": workflow.assignedBy ? `${workflow.assignedBy.firstName} ${workflow.assignedBy.lastName}`  : Constants.EMPTY_STRING,
          "action": this.concatAction(workflow),
          "comments": workflow.reviewComments,
          "sourceRule": false,
          "eclId": workflow.eclId
        });

        this.filerDataTable();
      });
      this.findSourceRule(this.filteredWorkflowList);
      this.loading = false;
    });

    this.filteredWorkflowList = this.workflowList;
  }

  findSourceRule(filteredWorkflowList: any[]) {
    if (this.isTargetLibrayOrCustomRule(filteredWorkflowList)) {
      filteredWorkflowList.filter(r => r.eclId === this.parentRuleId)
      .forEach(w => w.sourceRule = true);
    }
  }

  private isTargetLibrayOrCustomRule(filteredWorkflowList: any[]):boolean {
    let targetEntry = filteredWorkflowList.filter(w => w.eclId === this.ruleId)
    .pop();
    return targetEntry && (targetEntry.status === LIBRARY_RULE ||
        targetEntry.status === CUSTOM_RULE);
  }

  private concatAction(workflow: any){
    let status: string;
    if(workflow.workflowStatus && workflow.workflowId){
      status = `${workflow.workflow.lookupDesc}/${workflow.workflowStatus.lookupDesc}`; 
    }else if(workflow.workflowStatus){
      status = workflow.workflowStatus.lookupDesc;
    }else if(workflow.workflow){
      status = workflow.workflow.lookupDesc;
    }else {
      status = Constants.EMPTY_STRING;
    }
    return status;
  }

  filerDataTable()
  {
    this.filteredWorkflowList = this.workflowList.filter( workflow =>
      (this.selectedLR && workflow.status === LIBRARY_RULE) ||
      (this.selectedPR && workflow.status === PROVISIONAL_RULE) ||
      (this.selectedID && workflow.status === IDEA) ||
      (this.selectedCR && workflow.status === CUSTOM_RULE)
    );


  }

}
