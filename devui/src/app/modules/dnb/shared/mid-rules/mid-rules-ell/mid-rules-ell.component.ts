import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { Dialog } from "primeng/dialog";
import { StorageService } from "src/app/services/storage.service";
import { ToastMessageService } from "src/app/services/toast-message.service";
import {
  HeaderDialog,
  IconDialog,
} from "../../../models/constants/dialogConfig.constants";
import { storageDrug } from "../../../models/constants/storage.constants";
import { ELLMidRule } from "../../../models/interfaces/midRule";
import { DnBMidrulesService } from "../../../services/dnb-midrules.service";

@Component({
  selector: "app-mid-rules-ell",
  templateUrl: "./mid-rules-ell.component.html",
  styleUrls: ["./mid-rules-ell.component.css"],
})
export class MidRulesEllComponent implements OnChanges {
  title = "";
  @Input() openDialog: boolean = false;
  @Input() readOnlyDialog: boolean = false;
  @Input() topicName: string = "";
  @Output() selectionSet: EventEmitter<ELLMidRule[]> = new EventEmitter();
  @Output() openDialogChange: EventEmitter<boolean> = new EventEmitter();
  @ViewChild("dialog",{static: false}) dialog: Dialog;
  midRules: ELLMidRule[];
  drugName: string = "";
  drugCode: string = "";
  constructor(
    private midRuleServide: DnBMidrulesService,
    private cd: ChangeDetectorRef,
    private storageService: StorageService,
    private confirmationService: ConfirmationService,
    private toastService: ToastMessageService
  ) {
    this.drugName = this.storageService.get(storageDrug.drugName, false);
    this.drugCode = this.storageService.get(storageDrug.drugCode, false);
  }

  ngOnChanges() {
    if (this.openDialog) {
      this.drugCode = this.storageService.get(storageDrug.drugCode, false);
      this.drugName = this.storageService.get(storageDrug.drugName, false);
      this.title = `${this.drugName} Mid Rules`;
      if (!this.readOnlyDialog) {
        this.loadData();
      } else {
        this.loadPreview();
      }
    }
  }

  loadData() {
    this.midRuleServide.getRulesDrugCode(this.drugCode).subscribe(
      (response) => {
        if (response.length === 0) {
          this.toastService.messageError("", `Not records found.`, 6000, true);
          this.dialogHidden();
          return;
        }

        this.midRules = response.map((item) => {
          return {
            midrule: `${item.midRuleKey}.${item.ruleVersion}`,
            description: `Description: \n ${
              item.unresolvedDesc === null ? "" : item.unresolvedDesc
            } \n \n Script: \n ${item.subRuleScript} \n \n Rationale: \n ${
              item.subRuleRationale === null ? "" : item.subRuleRationale
            } \n \n Reference: \n ${
              item.reference === null ? "" : item.reference
            } \n \n Sub Rule Notes: \n ${
              item.subRuleNotes === null ? "" : item.subRuleNotes
            }`,
          };
        });
        this.cd.detectChanges();
        this.dialog.center();
      },
      () => {
        this.dialogHidden();
      }
    );
  }

  loadPreview() {
    this.midRuleServide.getRulesTopicName(this.topicName).subscribe(
      (response) => {
        if (response.length === 0) {
          this.toastService.messageError(
            "",
            `The resource does not exist.`,
            6000,
            true
          );
          this.dialogHidden();
          return;
        }

        this.midRules = response.map((item) => {
          return {
            midrule: `${item.midRuleKey}.${item.ruleVersion}`,
            description: `Description: \n ${
              item.unresolvedDesc === null ? "" : item.unresolvedDesc
            } \n \n Script: \n ${item.subRuleScript} \n \n Rationale: \n ${
              item.subRuleRationale === null ? "" : item.subRuleRationale
            } \n \n Reference: \n ${
              item.reference === null ? "" : item.reference
            } \n \n Sub Rule Notes: \n ${
              item.subRuleNotes === null ? "" : item.subRuleNotes
            }`,
          };
        });
        this.cd.detectChanges();
        this.dialog.center();
      },
      () => {
        this.dialogHidden();
      }
    );
  }

  addRules() {
    this.confirmationService.confirm({
      message: "Would you like to overwrite the Rule content with new Midrules",
      header: HeaderDialog.confirm,
      icon: IconDialog.question,
      accept: () => {
        this.selectionSet.emit(this.midRules);
        this.dialogHidden();
      },
    });
  }

  dialogHidden() {
    this.openDialogChange.emit(false);
  }
}
