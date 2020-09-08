import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EllDecisionPointService } from 'src/app/services/ell-decision-point.service';
import { EllDecisionPointDto } from 'src/app/shared/models/dto/ell-decision-point-dto';
import { EllRuleDto } from 'src/app/shared/models/dto/ell-rule-dto';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { Constants } from 'src/app/shared/models/constants';

@Component({
  selector: 'app-decision-point',
  templateUrl: './decision-point.component.html',
  styleUrls: ['./decision-point.component.css']
})
export class DecisionPointComponent implements OnInit {

  blockedDocument  : boolean;
  decisionPointDto : EllDecisionPointDto;
  selectedRule     : EllRuleDto = null;
  
  private  releaseLogKey : number;
  private  decisionKey   : number;

  constructor(private ellDecisionPointService : EllDecisionPointService, private activatedRoute: ActivatedRoute, private router: Router,
    private toastService: ToastMessageService) { }

  ngOnInit() {
    this.decisionPointDto = new EllDecisionPointDto();
    this.activatedRoute.params.subscribe(params => {
      this.releaseLogKey  = params['releaseLogKey'] as number;
      this.decisionKey    = params['decisionKey']   as number;
      this.getDecisionDetail(this.releaseLogKey, this.decisionKey);
    });
  }

  /**
   * This method is used to get the decision details.
   *  @param releaseLogKey - release log Id.
   *  @param decisionKey - decision Id.
   *  @returns Promise<EllDecisionPointDto>
  */
  private getDecisionDetail(releaseLogKey: number, decisionKey: number){
    this.blockedDocument = true;
    this.ellDecisionPointService.getDecisionDetails(releaseLogKey, decisionKey).then(resolveData => {
      if(resolveData){
        this.decisionPointDto = resolveData;
      }
      this.blockedDocument = false;
    }).catch(rejectData => {
      this.toastService.messageError(Constants.TOAST_SUMMARY_ERROR, rejectData);
      this.decisionPointDto = new EllDecisionPointDto();
      this.blockedDocument = false;
    });
  }

  /**
   * This method is used to get to list of ell screen
  */
  returnPreviousScreen() {
    this.router.navigate(['/ell-search']);
  }

  /**
   * This method is used to go to rule detail decision screen
  */
  openRule({midRuleKey}) {
    this.router.navigate([`/rule-long-detail-ell/${this.releaseLogKey}/${midRuleKey}`],
     { queryParams: { source: Constants.DECISION_POINT_SCREEN, decisionKey: this.decisionKey } });
  }
}