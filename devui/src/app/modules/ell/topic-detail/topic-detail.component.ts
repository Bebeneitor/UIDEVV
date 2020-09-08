import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EllTopicDetailService } from 'src/app/services/ell-topic-detail-service';
import { EllTopicDto } from 'src/app/shared/models/dto/ell-topic-dto';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { Constants } from 'src/app/shared/models/constants';

@Component({
  selector: 'app-topic-detail',
  templateUrl: './topic-detail.component.html',
  styleUrls: ['./topic-detail.component.css']
})
export class TopicDetailComponent implements OnInit {

  blockedDocument: boolean;
  topicDto: EllTopicDto;

  constructor(private ellTopicDetailService: EllTopicDetailService, private activatedRoute: ActivatedRoute, private router: Router,
    private toastService: ToastMessageService) { }

  ngOnInit() {
    this.topicDto = new EllTopicDto();

    this.activatedRoute.params.subscribe(params => {
      let releaseLogKey  = params['releaseLogKey'] as number;
      let topicKey    = params['topicKey']   as number;
      this.getTopicDetail(releaseLogKey, topicKey);
    });
    
  }

  /**
   * This method is used to get the topic details.
   *  @param releaseLogKey - release log Id.
   *  @param topicKey      -  topic Id.
   *  @returns Promise<EllDecisionPointDto>
  */
  private getTopicDetail(releaseLogKey: number, topicKey: number) {
    this.blockedDocument = true;
    this.ellTopicDetailService.getTopicDetails(releaseLogKey, topicKey).then(resolveData => {
      if (resolveData) {
        this.topicDto = resolveData;
      }
      this.blockedDocument = false;
    }).catch(rejectData => {
      this.toastService.messageError(Constants.TOAST_SUMMARY_ERROR, rejectData);
      this.topicDto = new EllTopicDto();
      this.blockedDocument = false;
    });
  }

  /**
   * This method is used to get to list of ell screen
  */
  returnPreviousScreen() {
    this.router.navigate(['/ell-search']);
  }
}
