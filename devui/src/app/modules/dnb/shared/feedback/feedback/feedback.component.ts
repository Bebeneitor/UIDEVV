import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  AddFeedBack,
  DeleteFeedBack,
} from "../../../models/interfaces/drugversion";
import { FeedBackData } from "../../../models/interfaces/uibase";
import { DnbService } from "../../../services/dnb.service";
import { cleanData } from "../../../utils/tools.utils";

@Component({
  selector: "app-feedback",
  templateUrl: "./feedback.component.html",
  styleUrls: ["./feedback.component.css"],
})
export class FeedbackComponent implements OnInit {
  @ViewChild("textarea",{static: true}) textarea;
  @Input() selectedFeedback: string = "";
  @Input() versionId: string = "";
  @Input() feedback: FeedBackData = {
    beginIndex: null,
    endIndex: null,
    feedback: "",
    itemId: null,
    instanceId: null,
    sectionRowUuid: null,
    sourceText: null,
    uiColumnAttribute: null,
    uiSectionCode: null,
    createdBy: null,
    createdById: null,
    createdOn: null,
  };
  @Output() closed: EventEmitter<boolean> = new EventEmitter();
  @Output() saved: EventEmitter<FeedBackData> = new EventEmitter();
  @Output() deleted: EventEmitter<FeedBackData> = new EventEmitter();

  constructor(private dnbService: DnbService) {}

  ngOnInit() {
    setTimeout(() => {
      this.textarea.nativeElement.focus();
    });
  }

  close() {
    this.closed.emit(true);
  }

  saveFeedback() {
    const payload: AddFeedBack = {
      beginIndex: this.feedback.beginIndex,
      endIndex: this.feedback.endIndex,
      feedback: this.feedback.feedback,
      drugVersionUuid: this.versionId,
      sectionRowUuid: this.feedback.sectionRowUuid,
      sourceText: cleanData(this.feedback.sourceText),
      uiColumnAttribute: this.feedback.uiColumnAttribute,
      uiSectionCode: this.feedback.uiSectionCode,
    };
    this.dnbService.addFeedback(payload).subscribe((response) => {
      this.feedback.itemId = response.getFeedbackInstanceItemId;
      this.feedback.instanceId = response.feedbackInstanceId;
      this.saved.emit(this.feedback);
    });
  }

  removeFeedback() {
    const payload: DeleteFeedBack = {
      feedbackInstanceId: this.feedback.instanceId,
      getFeedbackInstanceItemId: this.feedback.itemId,
    };
    this.dnbService.deleteFeedback(payload).subscribe(() => {
      this.deleted.emit(this.feedback);
    });
  }
}
