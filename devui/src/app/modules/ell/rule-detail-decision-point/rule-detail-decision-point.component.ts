import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { EllRuleDetailService } from 'src/app/services/ell-rule-detail-service';
import { Constants } from 'src/app/shared/models/constants';
import { EllRuleDto } from 'src/app/shared/models/dto/ell-rule-dto';
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/api";
import { TableDetailDto } from 'src/app/shared/models/dto/table-detail-dto';
import { JsPdfService } from 'src/app/services/js-pdf.service';
import { AppUtils } from 'src/app/shared/services/utils';

@Component({
  selector: 'app-rule-detail-decision-point',
  templateUrl: './rule-detail-decision-point.component.html',
  styleUrls: ['./rule-detail-decision-point.component.css']
})
export class RuleDetailDecisionPointComponent implements OnInit {

  blockedDocument: boolean;
  tableDetailsDtoList: TableDetailDto[];
  midRule: string;
  localConstants = Constants;
  midRuleVersion: number;
  
  //Mandatory fields.
  private source: string;        //Origen screen, is mandatory only for App Route.
  private type: string;          //SMALL or LONG.
  private releaseLogKey: number; //Release log Key.
  private midRuleKey: number;    //Mid Rule Key.
  private ruleIdFromPreviousScreen: number;

  //Dependents fields.
  private decisionKey: number;   
  private ruleId: number;

  constructor(private ellRuleDetailService: EllRuleDetailService, private activatedRoute: ActivatedRoute, private router: Router,
    private toastService: ToastMessageService, public config: DynamicDialogConfig,
    public ref: DynamicDialogRef, private jsPdfService: JsPdfService, private util: AppUtils) {

    this.midRule = '';
    if (this.config.data) {
      //When is opened by Dialog Service.                          
      this.type = this.config.data.type;
      this.releaseLogKey = this.config.data.releaseLogKey;
      this.midRuleKey = this.config.data.midRuleKey;
      this.getRuleDetail(this.type, this.releaseLogKey, this.midRuleKey);
    } else {
      //When is opened by App Route.
      this.activatedRoute.queryParams.subscribe(params => {
        this.source = params['source'] as string;
        this.ruleIdFromPreviousScreen = params['RI'] as number;
        this.decisionKey = params['decisionKey'] as number;
        this.midRuleVersion = params['version'] as number;
      });
      this.activatedRoute.data.subscribe(params => {
        this.type = params['type'] as string;
        this.activatedRoute.params.subscribe(params => {
          this.releaseLogKey = params['releaseLogKey'] as number;
          this.midRuleKey = params['midRuleKey'] as number;
          this.getRuleDetail(this.type, this.releaseLogKey, this.midRuleKey);
        });
      });
    }
  }

  ngOnInit() {
  }

  /**
   * This method is used to get the rule details.
   *  @param type - Type.
   *  @param releaseLogKey - Release log Id.
   *  @param midRuleKey    - Mid rule Key.
   *  @returns TableDetailDto[]
  */
  private getRuleDetail(type: string, releaseLogKey: number, midRuleKey: number) {
    this.blockedDocument = true;
    this.ellRuleDetailService.getRuleDetail(releaseLogKey, midRuleKey).then(resolveData => {
      if (resolveData) {
        this.midRule = this.ellRuleDetailService.getMidRule(type, resolveData);
        this.tableDetailsDtoList = this.ellRuleDetailService.fillTableDetailDtoList(type, resolveData);
        this.ruleId = resolveData.eclRuleId;
      }
      this.blockedDocument = false;
    },error=>{      
      if(this.source === Constants.LIBRARY_RULE_SCREEN){                
        this.toastService.messageSuccess(Constants.TOAST_SEVERITY_INFO, "MidRule "+this.midRuleKey+"."+this.midRuleVersion+ " is not found.");
        this.returnPreviousScreen();        
      }                
      this.tableDetailsDtoList = this.ellRuleDetailService.fillTableDetailDtoList(type, new EllRuleDto());
      this.blockedDocument = false;      
    });
  }

  /**
  * This method is used by return button.
  */
  returnPreviousScreen() {
    //When is opened by App Route.
    switch(this.source) {
      case Constants.RULE_CATALOG_SCREEN:
        const RULE_APPLICATION_TAB = 6;
        this.router.navigate(['/item-detail', this.util.encodeString(this.ruleId.toString()), 'RULE', RULE_APPLICATION_TAB],
          { queryParams: { source: Constants.RULE_CATALOG_SCREEN } });
        break;
      case Constants.DECISION_POINT_SCREEN:
          this.router.navigate([`/decision-point/${this.releaseLogKey}/${this.decisionKey}`]);
        break;
      case Constants.LIBRARY_RULE_SCREEN:
        this.router.navigate(['/item-detail', this.util.encodeString(this.ruleIdFromPreviousScreen.toString()), 'RULE'],
        { queryParams: { source: Constants.RULE_CATALOG_SCREEN } });
        break;
      default:
      this.router.navigate([`/home`]);
    } 
  }

  /**
  * This method is used to Pdf export.
  */
  exportPdf() {
    this.jsPdfService.exportToPdf(`Mid Rule: ${this.midRule}`, 'Mid Rule Detail');
  }

}