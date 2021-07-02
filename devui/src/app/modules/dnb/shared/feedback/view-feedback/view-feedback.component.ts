import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { FeedBackData } from "../../../models/interfaces/uibase";

@Component({
  selector: "app-view-feedback",
  templateUrl: "./view-feedback.component.html",
  styleUrls: ["./view-feedback.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class ViewFeedbackComponent implements OnChanges {
  @Input() feedbacks: FeedBackData[] = [];
  @Input() viewOnly: boolean = false;
  @Output() closed: EventEmitter<boolean> = new EventEmitter();
  @Output() resolved: EventEmitter<FeedBackData> = new EventEmitter();
  ngOnChanges() {
    if (this.feedbacks) {
      this.feedbacks = this.feedbacks.map((feedback) => {
        let newHTML = feedback.sourceText;
        const data = feedback;
        newHTML = `${newHTML.substring(
          0,
          data.beginIndex
        )}<span class='feedback-highlight'>${newHTML.substring(
          data.beginIndex,
          data.endIndex
        )}</span>${newHTML.substring(data.endIndex, newHTML.length)}`;
        return {
          ...feedback,
          hidden: false,
          htmlSourceText: newHTML,
        };
      });
    }
  }

  close() {
    this.closed.emit(true);
  }

  toggleResolved(feedback: FeedBackData) {
    feedback.resolved = !feedback.resolved;
    this.resolved.emit(feedback);
  }
}
