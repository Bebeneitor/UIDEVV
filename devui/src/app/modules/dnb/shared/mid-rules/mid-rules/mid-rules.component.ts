import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { ToastMessageService } from "src/app/services/toast-message.service";
import { MidRule, MidRuleSetUp } from "../../../models/interfaces/midRule";

@Component({
  selector: "app-mid-rules",
  templateUrl: "./mid-rules.component.html",
  styleUrls: ["./mid-rules.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MidRulesComponent {
  @Input() openDialog: boolean = false;
  @Input() midRule: MidRule = {
    midRuleTemplateId: 0,
    template: "",
    templateInformation: "",
    reasonCode: "",
  };

  @Input() midRuleSetUp: MidRuleSetUp = {
    headerDialog: "",
    midRuleTitle1: "",
    disableTitle1: false,
    requiredTitle1: true,
    midRuleText1: "",
    disableText1: true,
    requiredText1: false,
    midRuleText2: "",
    disableText2: true,
    requiredText2: false,
    showButton1: true,
    textButton1: "",
    showButton2: true,
    textButton2: "",
    showLockedBy: false,
    saveMessage: "",
  };
  @Output() midRuleData: EventEmitter<MidRule> = new EventEmitter();
  @Output() openDialogChange: EventEmitter<boolean> = new EventEmitter();
  @Output() backMidRuleList: EventEmitter<boolean> = new EventEmitter();

  constructor(private toastService: ToastMessageService) {}

  addMidRule() {
    if (!this.validateData()) {
      return;
    }
    this.returnMidRule();
  }

  returnMidRule() {
    this.midRule.template = this.midRule.template.slice(0, 200);
    this.midRule.templateInformation = this.midRule.templateInformation.slice(
      0,
      10000
    );
    this.midRule.reasonCode = this.midRule.reasonCode.slice(0, 4000);
    this.midRuleData.emit(this.midRule);
  }

  dialogHidden() {
    this.backMidRuleList.emit(true);
    this.openDialogChange.emit(false);
  }

  close() {
    this.openDialogChange.emit(false);
  }

  validateData() {
    let validated: boolean = true;
    if (this.midRuleSetUp.requiredTitle1) {
      if (!this.midRule.template || this.midRule.template.length === 0) {
        this.toastService.messageWarning(
          "Warning!",
          `${this.midRuleSetUp.midRuleTitle1} is required.`,
          6000,
          true
        );
        validated = false;
      }
    }
    if (this.midRuleSetUp.requiredText1) {
      if (
        !this.midRule.templateInformation ||
        this.midRule.templateInformation.length === 0
      ) {
        this.toastService.messageWarning(
          "Warning!",
          `${this.midRuleSetUp.midRuleText1} is required.`,
          6000,
          true
        );
        validated = false;
      }
    }
    if (this.midRuleSetUp.requiredText2) {
      if (!this.midRule.reasonCode || this.midRule.reasonCode.length === 0) {
        this.toastService.messageWarning(
          "Warning!",
          `${this.midRuleSetUp.midRuleText2} is required.`,
          6000,
          true
        );
        validated = false;
      }
    }
    return validated;
  }
}
