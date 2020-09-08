import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { RuleInfo } from 'src/app/shared/models/rule-info';
import { ProvisionalRuleService } from 'src/app/services/provisional-rule.service';
import { BaseResponse } from 'src/app/shared/models/base-response';

@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.css']
})
export class AuditLogComponent implements OnInit, AfterViewInit {

  //Rule info data loaded from provisional rule component
  @Input('ruleInfo') ruleInfo: RuleInfo;

  //Default values
  idType: number = 0;
  type: string = 'CCA_PO';
  auditLogs: any[] = [];
  loading: boolean = true;

  deltas: any = [];

  constructor(private provisionalRuleService: ProvisionalRuleService) { }

  ngOnInit() {

    //Internal radio buttons
    this.deltas = [
      {
        id: 1,
        type: 'CCA_PO',
        name: 'CCA / PO',
        longNameOld: 'Clinical Content Analyst',
        longNameNew: 'Policy Owner'
      },
      {
        id: 2,
        type: 'CCA_PR',
        name: 'CCA / PR',
        longNameOld: 'Clinical Content Analyst',
        longNameNew: 'Peer Reviewer'
      },
      {
        id: 3,
        type: 'PO_PR',
        name: 'PO / PR',
        longNameOld: 'Policy Owner',
        longNameNew: 'Peer Reviewer'
      }
    ];    
  }

  ngAfterViewInit() {
    this.getDetails();
  }

  /**
   * Get details for specific delta and rule
   */
  getDetails() {
    this.loading = true;
    this.provisionalRuleService.getAuditLogDetails(this.ruleInfo.ruleId, this.type).subscribe((response: BaseResponse) => {
      
      if(response.data == undefined || response.data.auditDetails == undefined) {
        this.auditLogs = [];
      } else {
        this.auditLogs = response.data.auditDetails;
      }

      this.loading = false;
    })
  }

  /**
   * Parse text to span class format
   * @param text 
   */
  parse(text: string) {
    if(text == '') {
      return '&nbsp;';
    }
    let html = text.split('<added>').join('<span class="added">').split('<deleted>').join('<span class="deleted">').split('</added>').join('</span>').split('</deleted>').join('</span>');
    return html;
  }

  /**
   * Event fired when user change delta in the screen
   * @param type 
   * @param index 
   */
  onChangeDelta(type: string, index: number) {
    this.type = type;
    this.idType = index;
    this.getDetails();
  }

}
