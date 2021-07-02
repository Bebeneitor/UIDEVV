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
  AddIndication,
  ChildCurrentDataIndications,
  ChildIndications,
  OverrideIndication,
  ProcessIndicationAdd,
  ProcessIndicationOverride,
} from "../../../models/interfaces/autopopulate";
import { Column } from "../../../models/interfaces/uibase";

@Component({
  selector: "app-autopopulate-indications",
  templateUrl: "./autopopulate-indications.component.html",
  styleUrls: ["./autopopulate-indications.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutopopulateIndicationsComponent implements OnInit, OnChanges {
  @Input() openDialog: boolean = false;
  @Input() newIndications: Column[];
  @Input() childsIndications: ChildCurrentDataIndications;
  @Input() activeFixedIndication = [];
  @Input() activeGlobalIndication = [];
  @Output() openDialogChange: EventEmitter<boolean> = new EventEmitter();
  @Output()
  overrideIndication: EventEmitter<ProcessIndicationOverride> = new EventEmitter();
  @Output()
  addIndications: EventEmitter<ProcessIndicationAdd> = new EventEmitter();
  dataIndicationOverride: string[] = [];
  dataIndicationUsed: string[] = [];
  addIndicationDirectFixed: string[];
  addIndicationDirectGlobal: string[];
  indicationFixedNoActives: string[] = [];
  indicationGlobalNoActives: string[] = [];
  dataIndicationOverrideGlobalReview: string[];
  dataIndicationUsedGlobalReview: string[] = [];
  overIndication: OverrideIndication = {
    oldIndication: "",
    newIndication: "",
  };
  addedIndication: AddIndication = {
    newIndication: "",
  };
  overIndicationGlobalReview: OverrideIndication = {
    oldIndication: "",
    newIndication: "",
  };
  addedIndicationGlobalReview: AddIndication = {
    newIndication: "",
  };
  indicationCodeSummary: ChildIndications[] = [];
  indicationGlobalReview: ChildIndications[] = [];
  processAddIndication: boolean = false;
  processDeleteIndication: boolean = false;
  activeProccessAddOverride: boolean = false;
  autopopulateGlobalReviewSection: boolean = false;
  autopupulateAllChildSections: boolean = false;
  indicationEnabled: string = "";
  indicationGlobalReviewEnabled: string = "";
  parentIndicationFixed: string[];
  parentIndicationGlobal: string[];

  ngOnInit() {
    this.clearData();
  }

  ngOnChanges() {
    this.indicationCodeSummary = [];
    this.indicationGlobalReview = [];
    this.indicationCodeSummary = [
      { label: "Select ", value: null, disabled: false },
    ];
    if (this.childsIndications !== undefined) {
      if (this.childsIndications.diagnosisCodeSummary.length > 0) {
        this.childsIndications.diagnosisCodeSummary.forEach((item) => {
          this.indicationCodeSummary.push({
            label: item.value,
            value: item.value,
            disabled: false,
          });
        });
      } else {
        if (this.newIndications) {
          this.newIndications.map((item) => {
            this.addIndicationDirectFixed.push(item.value);
          });
        }
      }
    }
    this.indicationGlobalReview = [
      { label: "Select ", value: null, disabled: false },
    ];
    if (this.childsIndications !== undefined) {
      if (this.childsIndications.globalReviewIndication.length > 0) {
        this.childsIndications.globalReviewIndication.forEach((item) => {
          if (item.value.trim() !== "") {
            this.indicationGlobalReview.push({
              label: item.value,
              value: item.value,
              disabled: false,
            });
          }
        });
      } else {
        if (this.newIndications) {
          this.newIndications.map((item) => {
            this.addIndicationDirectGlobal.push(item.value);
          });
        }
      }
    }

    if (this.overIndication.oldIndication !== "")
      this.deleteIndication(this.overIndication.oldIndication);

    if (this.overIndicationGlobalReview.oldIndication !== "")
      this.deleteIndicationGlobalReview(
        this.overIndicationGlobalReview.oldIndication
      );

    this.getFixedIndicationForNotAction();

    if (this.newIndications !== undefined) {
      this.newIndications.map((item) => item.value.trim());
      if (this.dataIndicationUsed.length === 0 && this.shouldHideColumn(true)) {
        this.parentIndicationFixed = this.newIndications.map(
          (elm) => elm.value
        );
      }
      if (
        this.dataIndicationUsedGlobalReview.length === 0 &&
        this.shouldHideColumn(false)
      ) {
        this.parentIndicationGlobal = this.newIndications.map(
          (elm) => elm.value
        );
      }
    }
  }

  checkNewIndicationUsed() {
    if (
      this.newIndications !== undefined &&
      this.dataIndicationUsed !== undefined &&
      this.dataIndicationUsedGlobalReview !== undefined
    ) {
      if (this.finishFixedIndication() && this.finishGlobalIndication()) {
        setTimeout(() => {
          this.dialogHidden();
        });
      }
    }
  }

  getValueUsed(indication: string) {
    this.indicationEnabled = indication;
  }

  getValueUsedGlobal(indication: string) {
    this.indicationGlobalReviewEnabled = indication;
  }

  changeIndication(indication: string) {
    if (this.indicationEnabled !== undefined) {
      let indicationEnabled = this.indicationCodeSummary.find(
        (item) => item.value === this.indicationEnabled
      );
      if (indicationEnabled !== undefined) indicationEnabled.disabled = false;
    }
    let indicationDisabled = this.indicationCodeSummary.find(
      (item) => item.value === indication
    );
    if (indication !== null && indicationDisabled !== undefined) {
      indicationDisabled.disabled = true;
    }
  }

  changeIndicationGlobal(indication: string) {
    if (this.indicationGlobalReviewEnabled !== undefined) {
      let indicationGlobalEnabled = this.indicationGlobalReview.find(
        (item) => item.value === this.indicationGlobalReviewEnabled
      );
      if (indicationGlobalEnabled !== undefined)
        indicationGlobalEnabled.disabled = false;
    }
    let indicationGlobalReviewEnabled = this.indicationGlobalReview.find(
      (item) => item.value === indication
    );
    if (indication !== null && indicationGlobalReviewEnabled !== undefined) {
      indicationGlobalReviewEnabled.disabled = true;
    }
  }

  getIndicationsToDelete() {
    return this.childsIndications.diagnosisCodeSummary.filter(
      (elm) => !this.dataIndicationUsed.map((elm) => elm).includes(elm)
    );
  }

  getIndicationsToDeleteGlobalReview() {
    return this.childsIndications.globalReviewIndication.filter(
      (elm) =>
        !this.dataIndicationUsedGlobalReview.map((elm) => elm).includes(elm)
    );
  }

  getIndicationsToAdd() {
    return this.newIndications
      .map((elm) => elm.value)
      .filter((elm) => !this.dataIndicationUsed.includes(elm));
  }

  getIndicationsToAddGlobalReview() {
    return this.newIndications
      .map((elm) => elm.value)
      .filter((elm) => !this.dataIndicationUsedGlobalReview.includes(elm));
  }

  dialogHidden() {
    this.clearData();
    this.openDialogChange.emit(false);
  }

  override(indicationParent: string, indicationChild: string) {
    this.activeProccessAddOverride = true;
    this.overIndication = {
      oldIndication: indicationChild,
      newIndication: indicationParent,
    };
    this.dataIndicationOverride.push(indicationChild);
    this.dataIndicationUsed.push(indicationChild);
    this.dataIndicationUsed.push(indicationParent);
    this.deleteIndication(indicationChild);
    this.deleteParentFixedIndication(indicationParent);
    if (this.finishFixedIndication() && this.finishGlobalIndication())
      this.checkProcessAddDeleteIndication();
    this.overrideIndication.emit({
      overrideIndications: this.overIndication,
      addIndicationsParent: this.getIndicationsToAdd(),
      addIndicationsGlobal: this.getIndicationsToAddGlobalReview(),
      deleteIndicationsChild: this.indicationCodeSummary,
      deleteIndicationGlobalReview: this.indicationGlobalReview,
      processAddIndication: this.processAddIndication,
      processDeleteIndication: this.processDeleteIndication,
      autopopulateGlobalReviewSection: false,
      autopupulateAllChildSections: this.autopupulateAllChildSections,
    });
    this.checkNewIndicationUsed();
    this.activeProccessAddOverride = false;
  }

  overrideGlobalReview(indicationParent: string, indicationChild: string) {
    this.activeProccessAddOverride = true;
    this.overIndicationGlobalReview = {
      oldIndication: indicationChild,
      newIndication: indicationParent,
    };
    this.dataIndicationOverrideGlobalReview.push(indicationChild);
    this.dataIndicationUsedGlobalReview.push(indicationChild);
    this.dataIndicationUsedGlobalReview.push(indicationParent);
    this.deleteIndicationGlobalReview(indicationChild);
    this.deleteParentGlobalIndication(indicationParent);
    if (this.finishFixedIndication() && this.finishGlobalIndication())
      this.checkProcessAddDeleteIndication();
    this.overrideIndication.emit({
      overrideIndications: this.overIndicationGlobalReview,
      addIndicationsParent: this.getIndicationsToAdd(),
      addIndicationsGlobal: this.getIndicationsToAddGlobalReview(),
      deleteIndicationsChild: this.indicationCodeSummary,
      deleteIndicationGlobalReview: this.indicationGlobalReview,
      processAddIndication: this.processAddIndication,
      processDeleteIndication: this.processDeleteIndication,
      autopopulateGlobalReviewSection: true,
      autopupulateAllChildSections: this.autopupulateAllChildSections,
    });
    this.checkNewIndicationUsed();
    this.activeProccessAddOverride = false;
  }

  checkProcessAddDeleteIndication() {
    if (
      this.parentIndicationFixed.length > 0 ||
      this.getIndicationsToAdd().length > 0 ||
      this.parentIndicationGlobal.length > 0
    ) {
      this.processAddIndication = true;
      this.autopupulateAllChildSections = true;
    }
    if (
      this.indicationGlobalReview.length > 0 ||
      this.indicationCodeSummary.length > 0
    ) {
      this.processDeleteIndication = true;
      this.autopupulateAllChildSections = true;
    }
  }

  deleteIndication(indicationChild: string) {
    let i = null;
    this.indicationCodeSummary.map((indication, index) => {
      if (indication.value == indicationChild) {
        i = index;
        return index;
      }
    });
    if (i !== null) {
      this.indicationCodeSummary.splice(i, 1);
    }
  }

  deleteIndicationGlobalReview(indicationChild: string) {
    let i = null;
    this.indicationGlobalReview.map((indication, index) => {
      if (indication.value == indicationChild) {
        i = index;
        return index;
      }
    });
    if (i !== null) {
      this.indicationGlobalReview.splice(i, 1);
    }
  }

  addIndication(indicationNew: string) {
    this.activeProccessAddOverride = true;
    this.addedIndication = {
      newIndication: indicationNew,
    };
    this.dataIndicationUsed.push(indicationNew);
    this.deleteParentFixedIndication(indicationNew);
    if (this.finishFixedIndication() && this.finishGlobalIndication())
      this.checkProcessAddDeleteIndication();
    this.addIndications.emit({
      addIndications: indicationNew,
      addIndicationsParent: this.getIndicationsToAdd(),
      addIndicationsGlobal: this.getIndicationsToAddGlobalReview(),
      deleteIndicationsChild: this.indicationCodeSummary,
      deleteIndicationGlobalReview: this.indicationGlobalReview,
      processAddIndication: this.processAddIndication,
      processDeleteIndication: this.processDeleteIndication,
      autopopulateGlobalReviewSection: false,
      autopupulateAllChildSections: this.autopupulateAllChildSections,
    });
    this.checkNewIndicationUsed();
    this.activeProccessAddOverride = false;
  }

  addIndicationGlobalReview(indicationNew: string) {
    this.activeProccessAddOverride = true;
    this.addedIndicationGlobalReview = {
      newIndication: indicationNew,
    };
    this.dataIndicationUsedGlobalReview.push(indicationNew);
    this.deleteParentGlobalIndication(indicationNew);
    if (this.finishFixedIndication() && this.finishGlobalIndication())
      this.checkProcessAddDeleteIndication();
    this.addIndications.emit({
      addIndications: indicationNew,
      addIndicationsParent: this.getIndicationsToAdd(),
      addIndicationsGlobal: this.getIndicationsToAddGlobalReview(),
      deleteIndicationsChild: this.indicationCodeSummary,
      deleteIndicationGlobalReview: this.indicationGlobalReview,
      processAddIndication: this.processAddIndication,
      processDeleteIndication: this.processDeleteIndication,
      autopopulateGlobalReviewSection: true,
      autopupulateAllChildSections: this.autopupulateAllChildSections,
    });
    this.checkNewIndicationUsed();
    this.activeProccessAddOverride = false;
  }

  checkIndicationFixedNoAction() {
    if (this.indicationFixedNoActives.length > 0) {
      for (let indication of this.indicationFixedNoActives) {
        this.deleteParentFixedIndication(indication);
      }
    }
  }

  checkIndicationGlobalNoAction() {
    if (this.indicationGlobalNoActives.length > 0) {
      for (let indication of this.indicationGlobalNoActives) {
        this.deleteParentGlobalIndication(indication);
      }
    }
  }

  clearData() {
    this.dataIndicationOverride = [];
    this.dataIndicationUsed = [];
    this.dataIndicationOverrideGlobalReview = [];
    this.dataIndicationUsedGlobalReview = [];
    this.addIndicationDirectFixed = [];
    this.addIndicationDirectGlobal = [];
    this.parentIndicationFixed = [];
    this.parentIndicationGlobal = [];
    this.processAddIndication = false;
    this.processDeleteIndication = false;
    this.autopopulateGlobalReviewSection = false;
    this.autopupulateAllChildSections = false;
    this.newIndications = undefined;
    this.overIndication = {
      oldIndication: "",
      newIndication: "",
    };
    this.overIndicationGlobalReview = {
      oldIndication: "",
      newIndication: "",
    };
  }

  getFixedIndicationForNotAction() {
    this.indicationFixedNoActives = [];
    this.indicationGlobalNoActives = [];
    if (this.activeFixedIndication.length > 0) {
      for (let i = 0; i < this.activeFixedIndication.length; i++) {
        this.indicationFixedNoActives.push(
          this.activeFixedIndication[i].valueIndication.trim()
        );
      }
    }
    if (this.activeGlobalIndication.length > 0) {
      for (let i = 0; i < this.activeGlobalIndication.length; i++) {
        this.indicationGlobalNoActives.push(
          this.activeGlobalIndication[i].valueIndication.trim()
        );
      }
    }

    this.checkIndicationGlobalNoAction();
    this.checkIndicationFixedNoAction();
  }

  deleteParentGlobalIndication(indicationParent: string) {
    let i = null;
    this.parentIndicationGlobal.map((indication, index) => {
      if (indication == indicationParent) {
        i = index;
        return index;
      }
    });
    if (i !== null) {
      this.parentIndicationGlobal.splice(i, 1);
    }
  }

  deleteParentFixedIndication(indicationParent: string) {
    let i = null;
    this.parentIndicationFixed.map((indication, index) => {
      if (indication == indicationParent) {
        i = index;
        return index;
      }
    });
    if (i !== null) {
      this.parentIndicationFixed.splice(i, 1);
    }
  }

  finishFixedIndication(): boolean {
    if (
      (this.parentIndicationFixed.length > 0 &&
        this.indicationCodeSummary.length === 1) ||
      (this.parentIndicationFixed.length === 0 &&
        this.indicationCodeSummary.length > 1) ||
      (this.parentIndicationFixed.length === 0 &&
        this.indicationCodeSummary.length === 1)
    ) {
      return true;
    }
    return false;
  }

  finishGlobalIndication(): boolean {
    if (
      (this.parentIndicationGlobal.length > 0 &&
        this.indicationGlobalReview.length === 1) ||
      (this.parentIndicationGlobal.length === 0 &&
        this.indicationGlobalReview.length > 1) ||
      (this.parentIndicationGlobal.length === 0 &&
        this.indicationGlobalReview.length === 1)
    ) {
      return true;
    }
    return false;
  }

  enableDisableOverride(indicationChild: string, indication: string) {
    if (indicationChild === undefined) {
      return true;
    } else {
      return !(
        indicationChild &&
        !this.dataIndicationOverride.includes(indicationChild) &&
        !this.dataIndicationUsed.includes(indication)
      );
    }
  }

  enableDisableOverrideGlobal(
    indicationChildGlobalReview: string,
    indication: string
  ) {
    if (indicationChildGlobalReview === undefined) {
      return true;
    } else {
      return !(
        indicationChildGlobalReview &&
        !this.dataIndicationOverrideGlobalReview.includes(
          indicationChildGlobalReview
        ) &&
        !this.dataIndicationUsedGlobalReview.includes(indication)
      );
    }
  }

  shouldHideColumn(isFixed: boolean): boolean {
    if (!this.newIndications) return false
    const indications = this.newIndications.map((x) => x.value.trim());
    const indicationsUsed = isFixed
      ? this.dataIndicationUsed.map((x) => x.trim())
      : this.dataIndicationUsedGlobalReview.map((x) => x.trim());
    return !indications.every((item) => indicationsUsed.indexOf(item) > -1);
  }
}
