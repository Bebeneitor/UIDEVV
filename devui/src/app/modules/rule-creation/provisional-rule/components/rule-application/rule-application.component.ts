import { Component, Input, Output, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { RuleApplicationService } from 'src/app/services/rule-application.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';``
import { Router } from '@angular/router';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { RuleApplication } from '../../models/rule-application.model';
import { EllSearchService } from 'src/app/modules/ell/ell-search/service/ell-search.service';
import { EllRuleDetailService } from 'src/app/services/ell-rule-detail-service';
import { Constants } from 'src/app/shared/models/constants';

@Component({
  selector: 'app-rule-application',
  templateUrl: './rule-application.component.html',
  styleUrls: ['./rule-application.component.css']
})

export class RuleApplicationComponent implements OnInit {
  @Input() showELLLink: boolean;
  @Input() ruleInfo: any;
  @Input() isIdea: boolean;
  @Output() loadingELLDetail = new EventEmitter<any>();
  @Output() ruleApplicationsEmitter = new EventEmitter<any>();

  @ViewChild('markpupEd',{static: true}) markupEd;

  constructor(
    private router: Router,
    private ruleApplicationService: RuleApplicationService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private ellSearchService: EllSearchService,
    private ellRuleDetailService :EllRuleDetailService
  ) { }

  icmsApplications: RuleApplication[] = [];
  rcaApplications: RuleApplication[] = [];
  rpeApplications: RuleApplication[] = [];
  ccvApplications: RuleApplication[] = [];
  cvpApplications: RuleApplication[] = [];

  ngOnInit() {
    if (!this.isIdea) {
      const ruleId = this.ruleInfo.ruleId;

      this.ruleApplicationService
        .getAllRuleApplicationUrl(ruleId)
        .subscribe((response: BaseResponse) => {
          this.icmsApplications = response.data.ICMS;
          this.rcaApplications = response.data.RCA;
          this.rpeApplications = response.data.RPE;
          this.ccvApplications = response.data.CCV;
          this.cvpApplications = response.data.CVP;

          this.ruleApplicationsEmitter.emit({
            icms: this.icmsApplications
          });
        });
    }
  }

  /**
 * Redirect to ELL rule detail screen
 */
  redirectToELLRuleLongDetail() {
    this.loadingELLDetail.emit({loading: true});
    let releaseLogKey: number;
    let midRule: number = this.icmsApplications[0].midRule;
    this.ellSearchService.loadReleaseLogKey().subscribe((releaseKeyResponse: any) => {
      releaseLogKey = releaseKeyResponse.data;
      this.router.navigate([`/rule-long-detail-ell/${releaseLogKey}/${midRule}`], 
      { queryParams: { source: Constants.RULE_CATALOG_SCREEN } });
    });
  }

}