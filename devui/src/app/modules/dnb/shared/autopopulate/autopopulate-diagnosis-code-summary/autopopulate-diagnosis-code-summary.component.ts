import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
import {
  AddIcd10Codes,
  ChildCurrentDataIcdCodes,
  ChildIndications,
  OverrideIcd10Codes,
  ProcessIcdCodesAdd,
  ProcessIcdCodesOverride,
  ProcessIndicationAdd,
  ProcessIndicationOverride,
} from "../../../models/interfaces/autopopulate";
import { Column } from "../../../models/interfaces/uibase";

@Component({
  selector: "app-autopopulate-diagnosis-code-summary",
  templateUrl: "./autopopulate-diagnosis-code-summary.component.html",
  styleUrls: ["./autopopulate-diagnosis-code-summary.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutopopulateDiagnosisCodeSummaryComponent
  implements OnInit, OnChanges
{
  @Input() openDialog: boolean = false;
  @Input() parentIcdCodes: Column[];
  @Input() childsIcdCodes: ChildCurrentDataIcdCodes;
  @Input() icdCodesNoActions = [];
  @Output() openDialogChange: EventEmitter<boolean> = new EventEmitter();
  @Output()
  overrideIcdCodes: EventEmitter<ProcessIcdCodesOverride> = new EventEmitter();
  @Output()
  addIcdCodes: EventEmitter<ProcessIcdCodesAdd> = new EventEmitter();
  dataIcd10CodesOverride: string[];
  dataIcd10CodesUsed: string[];
  addIcdCodeDirect: string[];
  overIcd10Codes: OverrideIcd10Codes = {
    oldIcd10Code: "",
    newIcd10Code: "",
  };
  addedIcd10Code: AddIcd10Codes = {
    newIcd10code: "",
  };
  childsGlobalReviewicd10Code: ChildIndications[];
  processAdd: boolean = false;
  processDelete: boolean = false;
  activeProccessAddOverride: boolean = false;
  icd10CodeEnabled: string = "";
  parentIcdCodesPivot: string[];

  constructor() {}

  ngOnInit() {
    this.clearData();
  }

  ngOnChanges() {
    this.childsGlobalReviewicd10Code = [];
    this.childsGlobalReviewicd10Code = [
      { label: "Select ", value: null, disabled: false },
    ];
    if (this.childsIcdCodes !== undefined) {
      if (this.childsIcdCodes.globalReviewIcd10Codes.length > 0) {
        this.childsIcdCodes.globalReviewIcd10Codes.forEach((item) => {
          this.childsGlobalReviewicd10Code.push({
            label: item.value,
            value: item.value,
            disabled: false,
          });
        });
      } else {
        if (this.parentIcdCodes) {
          this.parentIcdCodes.map((item) => {
            this.dataIcd10CodesUsed.push(item.value);
          });
        }
      }
    }
    if (this.overIcd10Codes.oldIcd10Code !== "")
      this.deleteIcdCode(this.overIcd10Codes.oldIcd10Code);
    if (this.parentIcdCodes !== undefined) {
      if (this.dataIcd10CodesUsed.length === 0) {
        this.parentIcdCodesPivot = this.parentIcdCodes.map((elm) => elm.value);
      }
    }
  }

  dialogHidden() {
    this.clearData();
    this.openDialogChange.emit(false);
  }

  clearData() {
    this.dataIcd10CodesOverride = [];
    this.dataIcd10CodesUsed = [];
    this.parentIcdCodes = undefined;
    this.processDelete = false;
    this.processAdd = false;
    this.overIcd10Codes = {
      oldIcd10Code: "",
      newIcd10Code: "",
    };
  }

  getValueUsed(icd10Code: string) {
    this.icd10CodeEnabled = icd10Code;
  }

  change(icd10Code: string) {
    if (this.icd10CodeEnabled !== undefined) {
      let icd10CodeEnabled = this.childsGlobalReviewicd10Code.find(
        (item) => item.value === this.icd10CodeEnabled
      );
      if (icd10CodeEnabled !== undefined) icd10CodeEnabled.disabled = false;
    }
    let icd10CodeEnabled = this.childsGlobalReviewicd10Code.find(
      (item) => item.value === icd10Code
    );
    if (icd10Code !== null && icd10CodeEnabled !== undefined)
      icd10CodeEnabled.disabled = true;
  }

  deleteIcdCode(icdCodeChild: string) {
    let i = null;
    this.childsGlobalReviewicd10Code.map((icdCode, index) => {
      if (icdCode.value == icdCodeChild) {
        i = index;
        return i;
      }
    });
    if (i !== null) {
      this.childsGlobalReviewicd10Code.splice(i, 1);
    }
  }

  deleteParentIcdCodePivot(icdCode10: string) {
    let i = null;
    this.parentIcdCodesPivot.map((icdCode, index) => {
      if (icdCode == icdCode10) {
        i = index;
        return index;
      }
    });
    if (i !== null) {
      this.parentIcdCodesPivot.splice(i, 1);
    }
  }

  checkFinishProcess(): boolean {
    if (
      (this.parentIcdCodesPivot.length > 0 &&
        this.childsGlobalReviewicd10Code.length === 1) ||
      (this.parentIcdCodesPivot.length === 0 &&
        this.childsGlobalReviewicd10Code.length > 1) ||
      (this.parentIcdCodesPivot.length === 0 &&
        this.childsGlobalReviewicd10Code.length === 1)
    ) {
      return true;
    }
    return false;
  }

  checkProcessAddDeleteIndication() {
    if (this.parentIcdCodesPivot.length > 0) {
      this.processAdd = true;
    }
    if (this.childsGlobalReviewicd10Code.length > 1) {
      this.processDelete = true;
    }
  }

  getIcdCodesToAdd() {
    return this.parentIcdCodes
      .map((elm) => elm.value)
      .filter((elm) => !this.dataIcd10CodesUsed.includes(elm));
  }

  override(icdCodeParent: string, icdCodeChild: string) {
    this.overIcd10Codes = {
      oldIcd10Code: icdCodeChild,
      newIcd10Code: icdCodeParent,
    };
    this.dataIcd10CodesOverride.push(icdCodeChild);
    this.dataIcd10CodesUsed.push(icdCodeChild);
    this.dataIcd10CodesUsed.push(icdCodeParent);
    this.deleteIcdCode(icdCodeChild);
    this.deleteParentIcdCodePivot(icdCodeParent);
    if (this.checkFinishProcess()) this.checkProcessAddDeleteIndication();
    this.overrideIcdCodes.emit({
      overrideIcdCode: this.overIcd10Codes,
      addIcdCodeParent: this.getIcdCodesToAdd(),
      deleteIcdCodeChild: this.childsGlobalReviewicd10Code,
      processAddIcdCode: this.processAdd,
      processDeleteIcdCode: this.processDelete,
    });
    this.checkCloseDialog();
  }

  add(icd10CodeNew: string) {
    this.addedIcd10Code = {
      newIcd10code: icd10CodeNew,
    };
    this.dataIcd10CodesUsed.push(icd10CodeNew);
    this.deleteParentIcdCodePivot(icd10CodeNew);
    if (this.checkFinishProcess()) this.checkProcessAddDeleteIndication();
    this.addIcdCodes.emit({
      addIcdCode: icd10CodeNew,
      addIcdCodeParent: this.getIcdCodesToAdd(),
      deleteIcdCodeChild: this.childsGlobalReviewicd10Code,
      processAddIcdCode: this.processAdd,
      processDeleteIcdCode: this.processDelete,
    });
    this.checkCloseDialog();
  }

  checkCloseDialog() {
    if (this.checkFinishProcess()) {
      setTimeout(() => {
        this.dialogHidden();
      });
    }
  }

  checkDisabledOverride(indicationChild: string, indication: string) {
    if (indicationChild === undefined) {
      return true;
    } else {
      return !(
        indicationChild &&
        !this.dataIcd10CodesOverride.includes(indicationChild) &&
        !this.dataIcd10CodesUsed.includes(indication)
      );
    }
  }
}
