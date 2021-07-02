import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from "@angular/core";
import { Dialog } from "primeng/dialog";
import { StorageService } from "src/app/services/storage.service";
import { storageDrug } from "../../../models/constants/storage.constants";
import { ELLMidRuleChange } from "../../../models/interfaces/midRule";
import { ELLRow, Section } from "../../../models/interfaces/uibase";
import { DnBMidrulesService } from "../../../services/dnb-midrules.service";
import { cleanData } from "../../../utils/tools.utils";

@Component({
  selector: "app-mid-rules-ell-summary",
  templateUrl: "./mid-rules-ell-summary.component.html",
  styleUrls: ["./mid-rules-ell-summary.component.css"],
})
export class MidRulesEllSummaryComponent implements OnChanges {
  @Input() openDialog: boolean = false;
  @Input() draftVersion: Section = null;
  @Output() updateRules: EventEmitter<{
    midR: ELLMidRuleChange;
    orderList: number[];
  }> = new EventEmitter();
  @Output() openDialogChange: EventEmitter<boolean> = new EventEmitter();
  @Output() showDialog: EventEmitter<boolean> = new EventEmitter();
  @ViewChild("dialog",{static: false}) dialog: Dialog;
  midRules: ELLMidRuleChange[];
  drugName: string = "";
  drugCode: string = "";
  orderList: number[] = [];
  constructor(
    private midRuleServide: DnBMidrulesService,
    private cd: ChangeDetectorRef,
    private storageService: StorageService
  ) {
    this.drugName = this.storageService.get(storageDrug.drugName, false);
    this.drugCode = this.storageService.get(storageDrug.drugCode, false);
  }

  ngOnChanges() {
    if (this.openDialog) {
      this.drugCode = this.storageService.get(storageDrug.drugCode, false);
      this.loadData();
    }
  }

  loadData() {
    let rows = this.draftVersion.rows;
    rows = rows
      .map((item) => {
        return {
          ...item,
          found: false,
        };
      })
      .filter(
        (row) => cleanData(row.columns[0].value).trim().toLowerCase() !== "new"
      );
    this.midRuleServide.getRulesDrugCode(this.drugCode).subscribe(
      (response) => {
        this.orderList = response.map((item) => item.midRuleKey);
        this.midRules = response
          .filter((item) => {
            const found = rows.find(
              (row) =>
                cleanData(row.columns[0].value) ===
                `${item.midRuleKey}.${item.ruleVersion}`
            ) as ELLRow;
            if (found !== undefined) {
              found.found = true;
              const column = found.columns[1];
              column.compareColumn = {
                value: this.buildDescription(item),
                isReadOnly: true,
                feedbackLeft: 0,
                feedbackData: [],
              };
              found.columns[1] = { ...found.columns[1] };
              this.cd.detectChanges();
            }
            return found === undefined;
          })
          .map((item) => {
            const found = rows.find(
              (row) =>
                this.removeVersion(row.columns[0].value) ===
                `${item.midRuleKey}`
            ) as ELLRow;
            if (found !== undefined) {
              found.found = true;
              const column = found.columns[1];
              column.compareColumn = {
                value: this.buildDescription(item),
                isReadOnly: true,
                feedbackLeft: 0,
                feedbackData: [],
              };
              found.columns[1] = { ...found.columns[1] };
              this.cd.detectChanges();
            }
            const ruleDoesntExist = found === undefined;
            return {
              midrule: `${item.midRuleKey}.${item.ruleVersion}`,
              description: this.buildDescription(item),
              type: ruleDoesntExist ? "New" : "New Version",
              foundRowUUID: ruleDoesntExist ? "" : found.codeUI,
            };
          });
        const missingRows = rows
          .filter((row: ELLRow) => !row.found)
          .map((item) => {
            return {
              midrule: item.columns[0].value,
              description: item.columns[1].value,
              type: "Deprecated",
              foundRowUUID: item.codeUI,
            };
          });
        this.midRules = this.midRules.concat(missingRows);
        if (this.midRules.length === 0) {
          this.cd.detectChanges();
          this.dialogHidden();
        } else {
          this.showDialog.emit(true);
          setTimeout(() => {
            this.dialog.center();
            this.cd.detectChanges();
          });
        }
      },
      () => {
        this.dialogHidden();
      }
    );
  }

  dialogHidden() {
    this.openDialogChange.emit(false);
  }

  removeVersion(midRule: string): string {
    const value = cleanData(midRule);
    return value.indexOf(".") > -1 ? value.split(".")[0] : value;
  }

  updateRulesAction(midR: ELLMidRuleChange, index: number) {
    this.updateRules.emit({ midR, orderList: this.orderList });
    this.midRules.splice(index, 1);
    if (this.midRules.length === 0) {
      this.dialogHidden();
    }
  }

  buildDescription(item) {
    return `Description: \n ${
      item.unresolvedDesc === null ? "" : item.unresolvedDesc
    } \n \n Script: \n ${item.subRuleScript} \n \n Rationale: \n ${
      item.subRuleRationale === null ? "" : item.subRuleRationale
    } \n \n Reference: \n ${
      item.reference === null ? "" : item.reference
    } \n \n Sub Rule Notes: \n ${
      item.subRuleNotes === null ? "" : item.subRuleNotes
    }`;
  }
}
