import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import { Column, FeedBackData } from "../../models/interfaces/uibase";

@Component({
  selector: "app-simple-cell",
  templateUrl: "./simple-cell.component.html",
  styleUrls: ["./simple-cell.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class SimpleCellComponent implements OnChanges {
  @Input() column: Column = null;
  @Input() feedbackData: FeedBackData[] = null;
  @Output() feedbackClick = new EventEmitter<FeedBackData>();
  @Output() selectionSet = new EventEmitter<any>();
  valueHTML: string = "";

  ngOnChanges(changes: SimpleChanges) {
    if (changes.feedbackData) {
      this.valueHTML = this.column.value;
      this.valueHTML = this.column.value
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      if (this.feedbackData) {
        this.feedbackData = this.feedbackData.map((feedback, index) => {
          return {
            ...feedback,
            elementId: "feed" + index,
          };
        });
        const sortedFeedbackData = this.feedbackData.sort(
          (itemA, itemB) => itemA.beginIndex - itemB.beginIndex
        );
        sortedFeedbackData.reverse().forEach((feedback) => {
          this.valueHTML = `${this.valueHTML.substring(
            0,
            feedback.beginIndex
          )}<span class='feedback ${
            feedback.elementId
          }'>${this.valueHTML.substring(
            feedback.beginIndex,
            feedback.endIndex
          )}</span>${this.valueHTML.substring(
            feedback.endIndex,
            this.valueHTML.length
          )}`;
        });
      }
    }
  }

  feedbackClicked(feedback) {
    this.feedbackClick.emit(feedback);
  }

  checkClick(event) {
    const target = event.target || event.srcElement || event.currentTarget;
    const className = target.className;
    if (className) {
      const id = className.replace("feedback ", "");
      const feedback = this.feedbackData.find((item) => item.elementId === id);
      if (feedback && event.which === 1) {
        this.feedbackClicked(feedback);
      }
    }
  }

  selectedText(event) {
    let s = window.getSelection();
    const range = s.getRangeAt(0);
    let text = window.getSelection ? window.getSelection().toString() : "";
    let extraOffset = 0;
    let extraEndOffset = 0;
    let prevSibling = range.startContainer
      ? range.startContainer.previousSibling
      : null;
    let prevEndSibling = range.endContainer
      ? range.endContainer.previousSibling
      : null;
    while (prevSibling) {
      extraOffset += prevSibling.textContent.length;
      prevSibling = prevSibling.previousSibling;
    }
    while (prevEndSibling) {
      extraEndOffset += prevEndSibling.textContent.length;
      prevEndSibling = prevEndSibling.previousSibling;
    }
    const beginIndex = range.startOffset + extraOffset;
    let endIndex = range.endOffset + extraEndOffset;
    if (endIndex - beginIndex < text.length) {
      endIndex = beginIndex + text.length;
    }
    const currentFeedback = {
      beginIndex,
      endIndex,
      text,
      type: event.which,
    };
    if (text === this.column.value) {
      currentFeedback.beginIndex = 0;
      currentFeedback.endIndex = this.column.value.length;
    }
    this.selectionSet.emit(currentFeedback);
  }
}
