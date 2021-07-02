import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ConfirmationService, DialogService, DynamicDialogConfig, DynamicDialogRef, MessageService } from 'primeng/api';
import { ResearchRequestSearchedRuleDto } from 'src/app/shared/models/dto/research-request-searched-rule-dto';
import { ResearchRequestService } from 'src/app/services/research-request.service';
import { Constants } from 'src/app/shared/models/constants';
import { ToastMessageService } from 'src/app/services/toast-message.service';

@Component({
  selector: 'app-research-request-comments-dialog',
  templateUrl: './research-request-comments-dialog.component.html',
  styleUrls: ['./research-request-comments-dialog.component.css']
})
export class ResearchRequestCommentsDialogComponent implements OnInit, AfterViewInit {
  addButtonEnable:boolean =false;
  commentsDto :ResearchRequestSearchedRuleDto;
  comments: string;
  originalComments:string;
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig ,
    private researchRequestService: ResearchRequestService,
    private toastService: ToastMessageService,
     )

  {
    this.commentsDto = new ResearchRequestSearchedRuleDto();
  }

  ngOnInit() {
    this.commentsDto.reviewComments= this.config.data.comments;
    this.originalComments = this.config.data.comments;
    this.commentsDto.rrId=this.config.data.researchRequestId;
    this.commentsDto.userId= this.config.data.user;
    this.commentsDto.ruleId =this.config.data.typeId;
    this.commentsDto.eclStageId = this.config.data.stageId;
  }

  ngAfterViewInit() {
    document.getElementById('commentBox').focus();
  }

  addButtonEnabled(){
    this.addButtonEnable =true;
  }

  onAdd() {
    const modifiedComments = this.commentsDto.reviewComments;
    this.researchRequestService.saveComments(this.commentsDto).subscribe(resp => {
        if (resp.code === Constants.HTTP_OK) {
          const msg = 'Comments saved successfully.';
          this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, msg, 3000, true);
        }
      }, error => console.log(error),
      () => {
        this.ref.close(modifiedComments);
      });

  }

  onCancel() {

    this.ref.close(this.originalComments);
  }

  onRefresh() {
    this.commentsDto.reviewComments =  '';
  }
}
