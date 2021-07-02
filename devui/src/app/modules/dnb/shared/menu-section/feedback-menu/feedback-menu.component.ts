import { Component, EventEmitter, Input, Output } from "@angular/core";
import { behaviors } from "../../../models/constants/behaviors.constants";
import { approverRowMenuPermissions } from "../../../models/constants/feedbackMenuPermissions.constats";

@Component({
  selector: "app-feedback-menu",
  templateUrl: "./feedback-menu.component.html",
  styleUrls: ["./feedback-menu.component.css"],
})
export class FeedbackMenuComponent {
  @Input() visible: boolean = true;
  @Input() menuPermissions = approverRowMenuPermissions;
  @Output() behaviorEvent: EventEmitter<any> = new EventEmitter();

  shouldMoveDown: boolean = false;

  addFeedback(event) {
    event.preventDefault
    this.behaviorEvent.emit({ behavior: behaviors.addFeedback });
  }
}
