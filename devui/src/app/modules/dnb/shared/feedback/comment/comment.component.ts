import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { ToastMessageService } from "src/app/services/toast-message.service";
import { CommentData } from "../../../models/interfaces/uibase";

@Component({
  selector: "app-comment",
  templateUrl: "./comment.component.html",
  styleUrls: ["./comment.component.css"],
})
export class CommentComponent implements OnInit {
  @ViewChild("textarea",{static: true}) textarea;
  @Input() versionId: string = "";
  @Input() sectionName: string = "";
  @Input() comment: CommentData = {
    beginIndex: null,
    endIndex: null,
    comment: "",
    sectionRowUuid: null,
    uiColumnAttribute: null,
    uiSectionCode: null,
  };
  @Output() closed: EventEmitter<boolean> = new EventEmitter();
  @Output() changed: EventEmitter<CommentData> = new EventEmitter();
  @Output() saved: EventEmitter<CommentData> = new EventEmitter();
  @Output() deleted: EventEmitter<CommentData> = new EventEmitter();

  constructor(private toastService: ToastMessageService) {}

  ngOnInit() {
    setTimeout(() => {
      this.textarea.nativeElement.focus();
    });
  }

  close() {
    this.closed.emit(true);
  }

  saveComment() {
    this.saved.emit(this.comment);
  }

  commentChange(comment: string) {
    const oldComment = this.comment.comment;
    if (this.comment.elementId !== null && comment === "") {
      comment = oldComment;
      this.toastService.messageError(
        "Empty Query",
        `A Query on ${this.sectionName} does not have text and no Query can be added.`,
        6000,
        true
      );
      this.textarea.nativeElement.value = comment;
    }
    this.comment.comment = comment;
    this.changed.emit(this.comment);
  }

  removeComment() {
    this.deleted.emit(this.comment);
  }
}
