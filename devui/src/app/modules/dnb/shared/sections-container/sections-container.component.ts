import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { Subscription } from "rxjs";
import { filter } from "rxjs/internal/operators/filter";
import { StorageService } from "src/app/services/storage.service";
import { dnbCodes } from "../../models/constants/actionCodes.constants";
import {
  arrowNavigation,
  behaviors,
} from "../../models/constants/behaviors.constants";
import {
  HeaderDialog,
  IconDialog,
} from "../../models/constants/dialogConfig.constants";
import {
  columnPopulate,
  ParentSections,
  SectionAutopopulationGlobal,
  SectionAutopopulationReview,
  SectionsAutopopulationIndication,
} from "../../models/constants/sectionAutopopulation.constants";
import { SectionCode } from "../../models/constants/sectioncode.constant";
import { storageDrug } from "../../models/constants/storage.constants";
import {
  ChildCurrentDataIcdCodes,
  ChildCurrentDataIndications,
  ChildIndications,
  OverrideIndication,
} from "../../models/interfaces/autopopulate";
import {
  ELLMidRule,
  ELLMidRuleChange,
  MidRule,
  MidRuleSetUp,
} from "../../models/interfaces/midRule";
import { Column, Row, Section } from "../../models/interfaces/uibase";
import { DnbStoreService } from "../../services/dnb-store.service";
import {
  addNewRowUtil,
  copyRowUtil,
  replaceRowUtil,
  undoCopyRowUtil,
} from "../../utils/copyrow.utils";
import {
  cleanData,
  createNewRow,
  getSectionFeedbacks,
  getSectionUnresolvedFeedbacksCount,
  getValuesColumn,
  guidGenerator,
  prepareData,
} from "../../utils/tools.utils";
import { AutopopulateUtils, CopyToNew } from "../../utils/utils.index";
import { SectionComponent } from "../section/section.component";
@Component({
  selector: "app-dnb-sections-container",
  templateUrl: "./sections-container.component.html",
  styleUrls: ["./sections-container.component.css"],
  providers: [CopyToNew, AutopopulateUtils],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionsContainerComponent
  implements OnChanges, OnInit, OnDestroy, AfterViewInit
{
  @ViewChild("editSection",{static: false}) editSection: SectionComponent;
  @ViewChild("section",{static: false}) section: ElementRef;
  @Input() currentVersion: Section;
  @Input() sectionIndex: number;
  @Input() newVersion: Section;
  @Input() isApproverReviewing: boolean = false;
  @Input() feedbackComplete: boolean = false;
  @Input() isComparing: boolean = false;
  @Input() showCurrent: boolean = false;
  @Input() hasRowHeading: boolean = false;
  @Input() enableEditing: boolean = true;
  @Input() focusType: { type: string; isTabAction?: boolean } = null;
  @Input() showEllOpts: boolean = false;

  @Output() newVersionChanged: EventEmitter<Section> = new EventEmitter();
  @Output() stickySection: EventEmitter<Section> = new EventEmitter();
  @Output() toggleSectionCopy: EventEmitter<{
    section: Section;
    status: boolean;
  }> = new EventEmitter();
  @Output() toggleCompleted: EventEmitter<boolean> = new EventEmitter();
  @Output() sectionNavigate: EventEmitter<{
    type: string;
    isTabAction?: boolean;
  }> = new EventEmitter();
  @Output() focusTypeChange = new EventEmitter<{
    type: string;
    isTabAction?: boolean;
  }>();
  @Output() dataPopulateSections: EventEmitter<{
    dataCopy?: Row[];
    dataCopyGlobal?: Row[];
    activeSection?: string;
    indicationOverride?: OverrideIndication[];
    indicationAdd?: string[];
    dataAdd?: string[];
    dataAddGlobal?: string[];
    dataDelete?: ChildIndications[];
    dataDeleteGlobalReview?: ChildIndications[];
    processAddIndication?: boolean;
    processDeleteIndication?: boolean;
    autopopulateGlobalReviewSection?: boolean;
    duplicateDataParentSection?: string[];
    duplicateDataGlobalSection?: string[];
    duplicateDataGRICSection?: string[];
    autopupulateAllChildSections?: boolean;
    considerSpaceInGlobalReviewSection?: boolean;
  }> = new EventEmitter();
  @Output() feedbackUpdate = new EventEmitter<number>();
  @Output() validIcdCodes = new EventEmitter<{
    codesInvalid: string[];
    sectionCode: string;
  }>();
  dnbCodes = dnbCodes;
  hideDisableToggle: boolean = this.enableEditing;
  undoCopySectionFlag: boolean = false;
  undoCopyRowFlag: boolean = false;
  backUpSectionRows: Row[] = [];
  backUpCopyRow: Row = null;
  backUpSection: Section;
  lastCopyWasAdded: boolean = false;
  lastCopyIndex: number = 0;
  expandSection: boolean = true;
  isRules: boolean = false;
  isDiagnosisCode: boolean = false;
  currentCodes: string = "";
  drugCode: string = "";
  cellChangeSubscribe: Subscription;
  sectionChangeSubscribe: Subscription;
  shouldEnableSection: boolean = true;
  _enableEditing: boolean = this.enableEditing;
  shouldShowUndo: boolean = true;
  openMidRuleList: boolean = false;
  openMidRuleEdit: boolean = false;
  rowIndexSelected: number;
  midRuleSelected: MidRule = {
    midRuleTemplateId: 0,
    template: "",
    templateInformation: "",
    reasonCode: "",
    lockDetail: { locked: false, lockedBy: "" },
  };
  sectionsAutopopulate = ParentSections;
  midRuleSetUp: MidRuleSetUp = {
    headerDialog: "Edit Mid Rule",
    midRuleTitle1: "Mid Rule",
    disableTitle1: true,
    requiredTitle1: false,
    midRuleText1: "Description",
    disableText1: false,
    requiredText1: false,
    midRuleText2: "Comments",
    disableText2: false,
    requiredText2: false,
    showButton1: true,
    textButton1: "Add",
    showButton2: true,
    textButton2: "Back",
    showLockedBy: false,
    saveMessage: "",
  };
  openMidRuleExisting: boolean = false;
  newSectionUnsolvedFeedbackCount: number = 0;
  newSectionFeedbackCount: number = 0;
  sectionsChildsAutopopulate = [];
  openELLRules: boolean = false;
  autopopulateTooltipLabel: string = "";
  ellRulesToCompare: ELLMidRule[] = [];
  rulesCompare: boolean = false;
  openELLSummary: boolean = false;

  openAutopopulate: boolean = false;
  dataChildAutopopulate: ChildCurrentDataIndications = {
    diagnosisCodeSummary: [],
    globalReviewIndication: [],
  };
  dataParentAutopopulate: string[] | Column[];
  dataParentAutopopulateGlobal: string[] | Column[];
  dataDuplicateParentSection: string[];
  dataDuplicateGlobalSection: string[];
  dataDuplicateGRICSection: string[];
  activeFixedIndication = [];
  activeGlobalIndication = [];
  validatePopulate: boolean = true;
  dataParentAutopopulateGlobalReviewIcd10Code: string[] | Column[];
  openAutopopulateDiagnosisCodeSummary: boolean = false;
  dataChildAutopopulateGlobalIcd10Code: ChildCurrentDataIcdCodes = {
    globalReviewIcd10Codes: [],
  };
  icd10CodesForNotActions = [];
  constructor(
    private copyToNew: CopyToNew,
    private autopopulateUtils: AutopopulateUtils,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef,
    private dnbStore: DnbStoreService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.sectionsChildsAutopopulate = SectionAutopopulationGlobal.concat(
      SectionsAutopopulationIndication,
      SectionAutopopulationReview
    );
    this.drugCode = this.storageService.get(storageDrug.drugCode, true);
    this.cellChangeSubscribe = this.dnbStore.updateCurrentColumn
      .pipe(filter((val) => val !== null))
      .subscribe(({ sectionId, compareColumn, diff }) => {
        if (this.currentVersion.section.code === sectionId) {
          if (compareColumn) {
            compareColumn.diff = diff;
          }
          this.currentVersion = {
            ...this.currentVersion,
          };
          this.cd.detectChanges();
        }
      });
    this.sectionChangeSubscribe = this.dnbStore.updateCurrentSection
      .pipe(filter((val) => val !== null))
      .subscribe((sectionId) => {
        if (this.currentVersion.section.code === sectionId) {
          this.currentVersion.rows.forEach((row) => {
            row.columns.forEach((col) => {
              if (col.compareColumn === null) {
                col.diff = [[-1, col.value]];
              }
            });
          });

          this.currentVersion = {
            ...this.currentVersion,
            rows: this.currentVersion.rows.map((row) => {
              return {
                ...row,
              };
            }),
          };
        }
      });
  }

  ngAfterViewInit() {
    if (this.showEllOpts && this.isRules && this.newVersion.rows.length > 0) {
      this.rulesCompare = true;
      this.rulesCompareChange();
    }
  }

  ngOnDestroy() {
    this.cellChangeSubscribe && this.cellChangeSubscribe.unsubscribe();
    this.sectionChangeSubscribe && this.sectionChangeSubscribe.unsubscribe();
  }

  getDataPreviousAutopopulate() {
    if (this.newVersion.section.code === SectionCode.DiagnosticCodeSummary) {
      this.storageService.set(
        storageDrug.childSectionAutopopulate,
        this.newVersion,
        true
      );
    }
    if (this.newVersion.section.code === SectionCode.GlobalReviewIndications) {
      this.storageService.remove(
        storageDrug.childGlobalReviewSectionAutopopulate
      );
      this.storageService.set(
        storageDrug.childGlobalReviewSectionAutopopulate,
        this.newVersion,
        true
      );
    }
    if (this.newVersion.section.code === SectionCode.DiagnosisCodes) {
      if (
        (this.storageService.get(storageDrug.childSectionAutopopulate, true) !==
          undefined &&
          this.storageService.get(
            storageDrug.childSectionAutopopulate,
            true
          ) !== null) ||
        (this.storageService.get(
          storageDrug.childGlobalReviewSectionAutopopulate,
          true
        ) !== undefined &&
          this.storageService.get(
            storageDrug.childGlobalReviewSectionAutopopulate,
            true
          ) !== null)
      ) {
        this.dataChildAutopopulate = {
          diagnosisCodeSummary: this.copyToNew.getParentChildIndications(
            this.newVersion,
            this.storageService.get(storageDrug.childSectionAutopopulate, true),
            true,
            0
          ),
          globalReviewIndication: this.copyToNew.getParentChildIndications(
            this.newVersion,
            this.storageService.get(
              storageDrug.childGlobalReviewSectionAutopopulate,
              true
            ),
            true,
            1
          ),
        };
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getDataPreviousAutopopulate();
    this.getDataPreviousGRIAutopopulate();
    if (changes.newVersion) {
      this.isDiagnosisCode =
        this.newVersion.section.code === SectionCode.DiagnosisCodes;
      this.isRules = this.newVersion.section.code === SectionCode.Rules;
      if (
        !this.isApproverReviewing ||
        (this.isApproverReviewing && this.feedbackComplete)
      ) {
        this.getNewVersionFeedbackLeft();
      }
      this.autopopulateTooltipLabel = this.getLabelTooltipAutopopulate(
        this.newVersion.section.code
      );
      const isNewDrug = window.location.href.includes("new-drug");
      this.validatePopulate =
        this.sectionsAutopopulate.includes(
          this.newVersion.section.code as SectionCode
        ) &&
        !(
          isNewDrug &&
          (this.newVersion.section.code === SectionCode.GlobalReviewCodes ||
            this.newVersion.section.code ===
              SectionCode.GlobalReviewIndications)
        );
    }
    if (changes.isComparing) {
      this.resetCompare();
    }
    if (changes.currentVersion) this.validIcdCodesSection();
  }

  getLabelTooltipAutopopulate(code: string): string {
    if (code === SectionCode.DiagnosisCodes) {
      return "Auto-populate Indications";
    } else if (code === SectionCode.DiagnosticCodeSummary) {
      return "Auto-populate ICD-10 Codes";
    } else if (code === SectionCode.GlobalReviewCodes) {
      return "Auto-populate current ICD-10 Codes";
    } else if (code === SectionCode.GlobalReviewIndications) {
      return "Auto-populate Current Indication";
    } else {
      return "Auto-populate Overlaps";
    }
  }

  validIcdCodesSection() {
    if (
      this.newVersion.section.code === SectionCode.DiagnosisCodes ||
      this.newVersion.section.code === SectionCode.DiagnosticCodeSummary
    ) {
      let dataSection = {
        codesInvalid: this.newVersion.rows
          .map((item) => item.invalidCodes)
          .filter(function (item) {
            return item !== "";
          }),
        sectionCode:
          this.newVersion.section.code === SectionCode.DiagnosisCodes
            ? "Diagnosis Code"
            : "Diagnosis Code Summary",
      };
      this.validIcdCodes.emit(dataSection);
    }
  }

  autopopulate() {
    if (
      this.newVersion.section.code === SectionCode.DiagnosisCodes ||
      this.newVersion.section.code === SectionCode.DiagnosticCodeSummary
    ) {
      this.autopopulateDiagnosisSections();
    } else if (
      this.newVersion.section.code === SectionCode.GlobalReviewCodes ||
      this.newVersion.section.code === SectionCode.GlobalReviewIndications
    ) {
      this.dataPopulateSections.emit({
        activeSection: this.newVersion.section.code,
      });
    }
  }

  openDialogFixAutopopulate(): boolean {
    let openDialog = false;
    this.getDataPreviousAutopopulate();
    if (
      (this.newVersion.section.code === SectionCode.DiagnosisCodes &&
        this.dataChildAutopopulate.diagnosisCodeSummary.length > 0 &&
        this.dataChildAutopopulate.diagnosisCodeSummary[0].value.trim() !==
          "") ||
      (this.newVersion.section.code === SectionCode.DiagnosisCodes &&
        this.dataChildAutopopulate.globalReviewIndication.length > 0 &&
        this.dataChildAutopopulate.globalReviewIndication[0].value.trim() !==
          "")
    ) {
      this.dataParentAutopopulate = this.copyToNew.getParentChildIndications(
        this.newVersion,
        this.storageService.get(storageDrug.childSectionAutopopulate, true),
        false,
        0
      );
      this.dataParentAutopopulateGlobal =
        this.copyToNew.getParentChildIndications(
          this.newVersion,
          this.storageService.get(
            storageDrug.childGlobalReviewSectionAutopopulate,
            true
          ),
          false,
          1
        );
      if (this.dataParentAutopopulate.length === 0) {
        if (this.dataParentAutopopulateGlobal.length > 0) {
          this.dataParentAutopopulate = this.dataParentAutopopulateGlobal;
          if (
            this.dataParentAutopopulate.length > 0 &&
            this.dataChildAutopopulate.globalReviewIndication.length > 0
          )
            openDialog = true;
        }
      } else {
        if (this.dataParentAutopopulateGlobal.length > 0) {
          var ids = new Set(
            (this.dataParentAutopopulate as Column[]).map((d) => d.value)
          );
          this.dataParentAutopopulate = [
            ...(this.dataParentAutopopulate as Column[]),
            ...(this.dataParentAutopopulateGlobal as Column[]).filter(
              (d) => !ids.has(d.value)
            ),
          ];
        }
        openDialog = true;
      }
      this.activeFixedIndication = this.isActiveFixedIndication();
      this.activeGlobalIndication = this.isActiveGlobalIndication();
      return openDialog;
    } else {
      return openDialog;
    }
  }

  isActiveFixedIndication() {
    let dataFixIndication = [];
    let dataChild = this.storageService.get(
      storageDrug.childSectionAutopopulate,
      true
    );
    dataChild = dataChild.rows;
    let valuesColumn = getValuesColumn(dataChild, 0);
    for (var i = 0; i < this.dataParentAutopopulate.length; i++) {
      if (
        valuesColumn.includes(
          (this.dataParentAutopopulate[i] as Column).value.replace(/\s/g, "")
        )
      ) {
        let dataFixedIndication = {
          valueIndication: (
            this.dataParentAutopopulate[i] as Column
          ).value.trim(),
          active: false,
        };
        dataFixIndication.push(dataFixedIndication);
      }
    }
    return dataFixIndication;
  }

  isActiveGlobalIndication() {
    let dataGlobalIndications = [];
    let dataChild = this.storageService.get(
      storageDrug.childGlobalReviewSectionAutopopulate,
      true
    );
    dataChild = dataChild.rows;
    let valuesColumn = getValuesColumn(dataChild, 1);
    for (var i = 0; i < this.dataParentAutopopulate.length; i++) {
      if (
        valuesColumn.includes(
          (this.dataParentAutopopulate[i] as Column).value.replace(/\s/g, "")
        )
      ) {
        let dataGlobalIndication = {
          valueIndication: (
            this.dataParentAutopopulate[i] as Column
          ).value.trim(),
          active: false,
        };
        dataGlobalIndications.push(dataGlobalIndication);
      }
    }
    return dataGlobalIndications;
  }

  autopopulateDiagnosisSections() {
    this.confirmationService.confirm({
      message:
        this.newVersion.section.code === SectionCode.DiagnosisCodes
          ? "This action will feed the Indications in the dependent Sections. Do you want to continue?"
          : "This action will feed the ICD-10 Codes in the dependent Section Global-Review ICD-10 Codes. Do you want to continue?",
      header: HeaderDialog.confirm,
      icon: IconDialog.question,
      accept: () => {
        this.newVersion.section.code === SectionCode.DiagnosisCodes
          ? this.autopopulateIndications()
          : this.autopopulateDiagnosisCodeSummary();
      },
    });
  }

  autopopulateDiagnosisCodeSummary() {
    if (this.existDuplicateGRICSection()) {
      this.autopopulateForDuplicateData();
    } else {
      if (!this.openDialogDiagnosisCodeFixAutopopulate()) {
        if (!this.existDuplicateGRICSection()) {
          this.dataPopulateSections.emit({
            dataCopy: this.copyToNew.copyColumnSection(
              this.newVersion,
              this.newVersion.section.code === SectionCode.DiagnosisCodes
                ? columnPopulate.Indication
                : columnPopulate.GlobalReviewIndication
            ),
            dataCopyGlobal: this.copyToNew.copyColumnSection(
              this.newVersion,
              this.newVersion.section.code === SectionCode.DiagnosisCodes
                ? columnPopulate.Indication
                : columnPopulate.GlobalReviewIndication
            ),
            activeSection: this.newVersion.section.code,
            indicationOverride: [],
            indicationAdd: [],
            dataAdd: [],
            dataDelete: [],
            dataDeleteGlobalReview: [],
            processAddIndication: false,
            processDeleteIndication: false,
            duplicateDataParentSection: [],
            duplicateDataGlobalSection: [],
            duplicateDataGRICSection: [],
            autopopulateGlobalReviewSection: false,
            autopupulateAllChildSections: true,
            considerSpaceInGlobalReviewSection: true,
          });
        }
      } else {
        setTimeout(() => {
          this.openAutopopulateDiagnosisCodeSummaryDialog();
          this.cd.detectChanges();
        });
      }
    }
  }

  autopopulateIndications() {
    if (!this.openDialogFixAutopopulate()) {
      if (
        !this.existDuplicateParentSection() &&
        !this.existDuplicateGlobalSection()
      ) {
        let dataGlobal = getValuesColumn(
          this.storageService.get(
            storageDrug.childGlobalReviewSectionAutopopulate,
            true
          ).rows,
          1
        );
        this.dataPopulateSections.emit({
          dataCopy: this.copyToNew.copyColumnSection(
            this.newVersion,
            this.newVersion.section.code === SectionCode.DiagnosisCodes
              ? columnPopulate.Indication
              : columnPopulate.GlobalReviewIndication
          ),
          dataCopyGlobal: this.copyToNew
            .copyColumnSection(
              this.newVersion,
              this.newVersion.section.code === SectionCode.DiagnosisCodes
                ? columnPopulate.Indication
                : columnPopulate.GlobalReviewIndication
            )
            .filter((item) => item.columns[0].value.trim() !== ""),
          activeSection: this.newVersion.section.code,
          indicationOverride: [],
          indicationAdd: [],
          dataAdd: [],
          dataAddGlobal: [],
          dataDelete: [],
          dataDeleteGlobalReview: [],
          processAddIndication: false,
          processDeleteIndication: false,
          autopopulateGlobalReviewSection: false,
          autopupulateAllChildSections: true,
          duplicateDataParentSection: [],
          duplicateDataGlobalSection: [],
          duplicateDataGRICSection: [],
          considerSpaceInGlobalReviewSection:
            dataGlobal.length > 0 ? true : false,
        });
      } else {
        this.autopopulateForDuplicateData();
      }
    } else {
      if (
        !this.existDuplicateParentSection() &&
        !this.existDuplicateGlobalSection()
      ) {
        setTimeout(() => {
          this.openAutopopulateDialog();
          this.cd.detectChanges();
        });
      } else {
        this.autopopulateForDuplicateData();
      }
    }
  }

  autopopulateForDuplicateData() {
    this.dataPopulateSections.emit({
      dataCopy: null,
      dataCopyGlobal: [],
      activeSection: this.newVersion.section.code,
      indicationOverride: [],
      indicationAdd: [],
      dataAdd: [],
      dataAddGlobal: [],
      dataDelete: [],
      dataDeleteGlobalReview: [],
      processAddIndication: false,
      processDeleteIndication: false,
      autopopulateGlobalReviewSection: true,
      autopupulateAllChildSections: false,
      duplicateDataParentSection:
        this.dataDuplicateParentSection === undefined
          ? []
          : this.dataDuplicateParentSection,
      duplicateDataGlobalSection:
        this.dataDuplicateGlobalSection === undefined
          ? []
          : this.dataDuplicateGlobalSection,
      duplicateDataGRICSection:
        this.dataDuplicateGRICSection === undefined
          ? []
          : this.dataDuplicateGRICSection,
      considerSpaceInGlobalReviewSection: false,
    });
  }

  existDuplicateParentSection(): boolean {
    let valuesParent: string[] = [];
    if (this.newVersion.section.code === SectionCode.DiagnosisCodes) {
      this.newVersion.rows.map((item) => {
        if (item.columns[0].value.trim() !== "") {
          valuesParent.push(item.columns[0].value.trim());
        }
      });
      this.dataDuplicateParentSection =
        this.copyToNew.findDuplicates(valuesParent);
      if (this.dataDuplicateParentSection.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  existDuplicateGlobalSection(): boolean {
    let valuesParent: string[] = [];
    let valuesSectionGlobal;
    valuesSectionGlobal = this.storageService.get(
      storageDrug.childGlobalReviewSectionAutopopulate,
      true
    );

    if (valuesSectionGlobal !== undefined || valuesSectionGlobal !== null) {
      valuesSectionGlobal.rows.map((item) => {
        if (item.columns[1].value.trim() !== "") {
          valuesParent.push(item.columns[1].value.trim());
        }
      });
      this.dataDuplicateGlobalSection =
        this.copyToNew.findDuplicates(valuesParent);
      if (this.dataDuplicateGlobalSection.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  overrideIndication(event) {
    let dataOver: any = [];
    dataOver.push(event.overrideIndications);
    this.dataPopulateSections.emit({
      dataCopy: this.copyToNew.copyColumnSection(
        this.storageService.get(storageDrug.childSectionAutopopulate, true),
        this.newVersion.section.code === SectionCode.DiagnosisCodes
          ? columnPopulate.Indication
          : columnPopulate.GlobalReviewIndication
      ),
      dataCopyGlobal: this.copyToNew.copyColumnSection(
        this.storageService.get(
          storageDrug.childGlobalReviewSectionAutopopulate,
          true
        ),
        columnPopulate.GlobalReviewIndication
      ),
      activeSection: this.newVersion.section.code,
      indicationOverride: dataOver,
      indicationAdd: [],
      dataAdd: event.addIndicationsParent,
      dataAddGlobal: event.addIndicationsGlobal,
      dataDelete: event.deleteIndicationsChild,
      dataDeleteGlobalReview: event.deleteIndicationGlobalReview,
      processAddIndication: event.processAddIndication,
      processDeleteIndication: event.processDeleteIndication,
      autopopulateGlobalReviewSection: event.autopopulateGlobalReviewSection,
      autopupulateAllChildSections: event.autopupulateAllChildSections,
      duplicateDataParentSection: [],
      duplicateDataGlobalSection: [],
      duplicateDataGRICSection: [],
      considerSpaceInGlobalReviewSection: false,
    });
  }

  addIndications(event) {
    let data: any = [];
    data.push(event.addIndications);
    this.dataPopulateSections.emit({
      dataCopy: this.copyToNew.copyColumnSection(
        this.storageService.get(storageDrug.childSectionAutopopulate, true),
        this.newVersion.section.code === SectionCode.DiagnosisCodes
          ? columnPopulate.Indication
          : columnPopulate.GlobalReviewIndication
      ),
      dataCopyGlobal: this.copyToNew.copyColumnSection(
        this.storageService.get(
          storageDrug.childGlobalReviewSectionAutopopulate,
          true
        ),
        columnPopulate.GlobalReviewIndication
      ),
      activeSection: this.newVersion.section.code,
      indicationOverride: [],
      indicationAdd: data,
      dataAdd: event.addIndicationsParent,
      dataAddGlobal: event.addIndicationsGlobal,
      dataDelete: event.deleteIndicationsChild,
      dataDeleteGlobalReview: event.deleteIndicationGlobalReview,
      processAddIndication: event.processAddIndication,
      processDeleteIndication: event.processDeleteIndication,
      autopopulateGlobalReviewSection: event.autopopulateGlobalReviewSection,
      autopupulateAllChildSections: event.autopupulateAllChildSections,
      duplicateDataParentSection: [],
      duplicateDataGlobalSection: [],
      duplicateDataGRICSection: [],
      considerSpaceInGlobalReviewSection: false,
    });
  }

  openDialogDiagnosisCodeFixAutopopulate(): boolean {
    let openDialog = false;
    this.getDataPreviousGRIAutopopulate();
    if (
      (this.newVersion.section.code === SectionCode.DiagnosticCodeSummary &&
        this.dataChildAutopopulateGlobalIcd10Code.globalReviewIcd10Codes
          .length > 0 &&
        this.dataChildAutopopulateGlobalIcd10Code.globalReviewIcd10Codes[0].value.trim() !==
          "") ||
      (this.newVersion.section.code === SectionCode.DiagnosticCodeSummary &&
        this.dataChildAutopopulateGlobalIcd10Code.globalReviewIcd10Codes
          .length > 0 &&
        this.dataChildAutopopulateGlobalIcd10Code.globalReviewIcd10Codes[0].value.trim() !==
          "")
    ) {
      this.dataParentAutopopulateGlobalReviewIcd10Code =
        this.autopopulateUtils.getParentChildIndications(
          this.newVersion,
          this.storageService.get(
            storageDrug.childGlobalReviewIcd10CodesSectionAutopopulate,
            true
          ),
          false,
          1,
          true
        );
      if (this.dataParentAutopopulateGlobalReviewIcd10Code.length > 0) {
        const tempArray = new Set();
        let dataParent = (
          this.dataParentAutopopulateGlobalReviewIcd10Code as Column[]
        ).filter((el) => {
          const duplicate = tempArray.has(el.value);
          tempArray.add(el.value);
          return !duplicate;
        });
        this.dataParentAutopopulateGlobalReviewIcd10Code = dataParent;
        openDialog = true;
      }
      return openDialog;
    }
    return openDialog;
  }

  getDataPreviousGRIAutopopulate() {
    if (this.newVersion.section.code === SectionCode.GlobalReviewCodes) {
      this.storageService.remove(
        storageDrug.childGlobalReviewIcd10CodesSectionAutopopulate
      );
      this.storageService.set(
        storageDrug.childGlobalReviewIcd10CodesSectionAutopopulate,
        this.newVersion,
        true
      );
    }

    if (this.newVersion.section.code === SectionCode.DiagnosticCodeSummary) {
      if (
        this.storageService.get(
          storageDrug.childGlobalReviewIcd10CodesSectionAutopopulate,
          true
        ) !== undefined &&
        this.storageService.get(
          storageDrug.childGlobalReviewIcd10CodesSectionAutopopulate,
          true
        ) !== null
      ) {
        this.dataChildAutopopulateGlobalIcd10Code = {
          globalReviewIcd10Codes:
            this.autopopulateUtils.getParentChildIndications(
              this.newVersion,
              this.storageService.get(
                storageDrug.childGlobalReviewIcd10CodesSectionAutopopulate,
                true
              ),
              true,
              1,
              true
            ),
        };
      }
    }
  }

  openAutopopulateDiagnosisCodeSummaryDialog() {
    this.openAutopopulateDiagnosisCodeSummary = true;
  }

  addIcdCodes(event) {
    let data: any = [];
    data.push(event.addIcdCode);
    this.dataPopulateSections.emit({
      dataCopy: this.copyToNew.copyColumnSection(
        this.storageService.get(
          storageDrug.childGlobalReviewIcd10CodesSectionAutopopulate,
          true
        ),
        this.newVersion.section.code === SectionCode.DiagnosisCodes
          ? columnPopulate.Indication
          : columnPopulate.GlobalReviewIndication
      ),
      dataCopyGlobal: [],
      activeSection: this.newVersion.section.code,
      indicationOverride: [],
      indicationAdd: data,
      dataAdd: event.addIcdCodeParent,
      dataDelete: event.deleteIcdCodeChild,
      processAddIndication: event.processAddIcdCode,
      processDeleteIndication: event.processDeleteIcdCode,
      autopupulateAllChildSections: false,
      considerSpaceInGlobalReviewSection: false,
    });
  }

  overrideIcdCodes(event) {
    let data: any = [];
    data.push(event.overrideIcdCode);
    this.dataPopulateSections.emit({
      dataCopy: this.copyToNew.copyColumnSection(
        this.storageService.get(
          storageDrug.childGlobalReviewIcd10CodesSectionAutopopulate,
          true
        ),
        this.newVersion.section.code === SectionCode.DiagnosisCodes
          ? columnPopulate.Indication
          : columnPopulate.GlobalReviewIndication
      ),
      dataCopyGlobal: [],
      activeSection: this.newVersion.section.code,
      indicationOverride: data,
      indicationAdd: [],
      dataAdd: event.addIcdCodeParent,
      dataDelete: event.deleteIcdCodeChild,
      processAddIndication: event.processAddIcdCode,
      processDeleteIndication: event.processDeleteIcdCode,
      autopupulateAllChildSections: false,
      considerSpaceInGlobalReviewSection: false,
    });
  }

  existDuplicateGRICSection(): boolean {
    let valuesParent: string[] = [];
    let valuesSectionGlobal;
    valuesSectionGlobal = this.storageService.get(
      storageDrug.childGlobalReviewIcd10CodesSectionAutopopulate,
      true
    );

    if (valuesSectionGlobal !== undefined || valuesSectionGlobal !== null) {
      valuesSectionGlobal.rows.map((item) => {
        if (item.columns[1].value.trim() !== "") {
          let itemValue = item.columns[1].value.toUpperCase();
          valuesParent.push(itemValue.trim());
        }
      });
      this.dataDuplicateGRICSection =
        this.copyToNew.findDuplicates(valuesParent);
      if (this.dataDuplicateGRICSection.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  behavior(event): void {
    switch (event.behavior) {
      case behaviors.copyRow:
        this.copyRow(event.row, event.rowIndex);
        this.checkSectionsDifference();
        break;
      case behaviors.undoCopyRow:
        this.undoCopyRow();
        this.checkSectionsDifference();
        break;
      case behaviors.addMidRule:
        this.midRuleSetUp.mode = "addNew";
        this.openMidRuleListDialog();
        this.checkSectionsDifference();
        break;
      case behaviors.detailEdit:
        this.midRuleSetUp.mode = "editDetail";
        this.detailEditDialog(event);
        this.checkSectionsDifference();
        break;
      case behaviors.addExistingMidRule:
        this.openExistingMidRuleDialog(event);
        this.checkSectionsDifference();
        break;
      default:
        this.getNewVersionFeedbackLeft();
        this.feedbackUpdate.emit(this.newSectionUnsolvedFeedbackCount);
        this.checkSectionsDifference();
        break;
    }
  }

  checkSectionsDifference(): void {
    if (this.isComparing) {
      this.resetCompare();
      this.updateCompareSection();
    }
  }

  copyRow(row: Row, rowIndex: number): void {
    this.undoCopyRowFlag = true;
    const values = copyRowUtil(row, this.newVersion.rows);
    this.lastCopyIndex = values.lastCopyIndex;
    this.lastCopyWasAdded = values.lastCopyWasAdded;
    this.backUpCopyRow = values.backUpCopyRow;

    this.newVersion = {
      ...this.newVersion,
    };
  }

  undoCopyRow(): void {
    undoCopyRowUtil(
      this.newVersion.rows,
      this.lastCopyIndex,
      this.lastCopyWasAdded,
      this.backUpCopyRow
    );
    this.undoCopyRowFlag = false;
    this.backUpCopyRow = null;

    this.newVersion = {
      ...this.newVersion,
    };
  }

  stickSection(): void {
    this.stickySection.emit(this.newVersion);
  }

  collapseSection() {
    this.expandSection = !this.expandSection;
    const removeSectionFromCopy =
      this.shouldEnableSection && this.expandSection;
    this.toggleSectionCopy.emit({
      section: this.newVersion,
      status: removeSectionFromCopy,
    });
  }

  resetCompare(): void {
    if (this.showEllOpts && this.isRules) {
      return;
    }
    if (this.isComparing) {
      this.currentVersion.rows.forEach((row) => {
        (row as any).compared = false;
      });
      this.newVersion.rows.forEach((row, rowIndex) => {
        row.columns.forEach((column, columnIndex) => {
          this.checkColumnChange(column, columnIndex, rowIndex);
        });
      });
      this.currentVersion.rows.forEach((row) => {
        row.columns.forEach((column) => {
          column.compareColumn = null;
          if ((row as any).compared === false) {
            column.diff = [[-1, column.value]];
          }
        });
      });
    } else {
      this.newVersion.rows.forEach((row) => {
        row.columns.forEach((column) => {
          column.compareColumn = null;
          column.diff = [[0, column.value]];
        });
      });
      this.currentVersion.rows.forEach((row) => {
        row.columns.forEach((column) => {
          column.compareColumn = null;
          column.diff = [[0, column.value]];
        });
      });
    }
  }

  checkColumnChange(
    column: Column,
    columnIndex: number,
    rowIndex: number
  ): void {
    if (this.isComparing) {
      const originalCell = this.getOrignalCell(rowIndex, columnIndex);
      if (originalCell == null) {
        column.compareColumn = null;
      } else {
        column.compareColumn = originalCell;
        column.compareColumn.compareColumn = column;
      }
    }
  }

  getOrignalCell(rowIndex: number, columnIndex: number): Column {
    if (this.hasRowHeading) {
      const columnHeader = this.newVersion.rows[rowIndex].columns[0];
      const foundRow = this.currentVersion.rows.find(
        (row) => row.columns[0].value === columnHeader.value
      );
      if (foundRow) {
        (foundRow as any).compared = true;
      }
      return foundRow ? foundRow.columns[columnIndex] : null;
    } else {
      if (
        this.currentVersion.rows.length === 0 ||
        this.currentVersion.rows[rowIndex] === undefined
      ) {
        return null;
      }
      (this.currentVersion.rows[rowIndex] as any).compared = true;
      return this.currentVersion.rows[rowIndex].columns[columnIndex];
    }
  }

  updateCompareSection(): void {
    this.editSection.updateCompareColumns();
  }

  confirmCopySection(): void {
    this.confirmationService.confirm({
      message: "Are you sure you want to copy",
      header: HeaderDialog.confirm,
      icon: IconDialog.question,
      accept: () => {
        this.copySection();
      },
    });
  }

  copySection(): void {
    this.copyToNew.copySection(this.newVersion, this.currentVersion);
    this.newVersion = {
      ...this.newVersion,
    };
    this.checkSectionsDifference();
    this.cd.detectChanges();
  }

  confirmUndoCopySection(): void {
    let redoUndoLabel: string = this.shouldShowUndo ? "undo" : "redo";
    this.confirmationService.confirm({
      message:
        "Are you sure you want to " +
        redoUndoLabel +
        " copy to new? You will lose all changes",
      header: HeaderDialog.confirm,
      icon: IconDialog.question,
      accept: () => {
        this.undoCopyAll();
      },
    });
  }

  undoCopyAll(): void {
    this.shouldShowUndo = !this.shouldShowUndo;
    this.shouldShowUndo
      ? this.copyToNew.redoCopySection(
          this.newVersion,
          this.currentVersion,
          this.shouldShowUndo
        )
      : this.copyToNew.undoCopySection(
          this.newVersion,
          this.currentVersion,
          this.shouldShowUndo
        );

    this.newVersion = {
      ...this.newVersion,
    };
    this.checkSectionsDifference();
    this.cd.detectChanges();
  }

  disableChange() {
    this.shouldEnableSection = !this.newVersion.enabled;
    this._enableEditing = this.shouldEnableSection;
    const removeSectionFromCopy =
      this.shouldEnableSection && this.expandSection;
    this.toggleSectionCopy.emit({
      section: this.newVersion,
      status: removeSectionFromCopy,
    });
  }

  @HostListener("window:keyup", ["$event"]) sectionAutopopulate() {
    if (this.newVersion.section.code === SectionCode.GlobalReviewIndications) {
      this.storageService.remove(
        storageDrug.childGlobalReviewSectionAutopopulate
      );
      this.storageService.set(
        storageDrug.childGlobalReviewSectionAutopopulate,
        this.newVersion,
        true
      );
    }
    if (this.newVersion.section.code === SectionCode.GlobalReviewCodes) {
      this.storageService.remove(
        storageDrug.childGlobalReviewIcd10CodesSectionAutopopulate
      );
      this.storageService.set(
        storageDrug.childGlobalReviewIcd10CodesSectionAutopopulate,
        this.newVersion,
        true
      );
    }
  }

  openMidRuleListDialog() {
    this.openMidRuleList = true;
  }

  openAutopopulateDialog() {
    this.openAutopopulate = true;
  }

  openMidRuleEditDialog(event) {
    this.midRuleSelected = { ...event, comments: "", midRule: "New" };

    this.midRuleSetUp.showButton2 = true;
    this.midRuleSetUp.textButton1 = "add";
    this.midRuleSetUp.disableTitle1 = true;

    if (this.midRuleSelected.lockDetail.locked) {
      this.midRuleSetUp.disableTitle1 = true;
      this.midRuleSetUp.disableText1 = true;
      this.midRuleSetUp.disableText2 = true;
      this.midRuleSetUp.showLockedBy = true;
    } else {
      this.midRuleSetUp.disableTitle1 = true;
      this.midRuleSetUp.disableText1 = false;
      this.midRuleSetUp.disableText2 = false;
      this.midRuleSetUp.showLockedBy = false;
    }
    this.openMidRuleEdit = true;
  }

  backMidRule(event) {
    this.openMidRuleEdit = false;
    this.openMidRuleList = true;
  }

  midRuleDialog(event) {
    if (this.midRuleSetUp.mode === "editDetail") {
      this.detailEditMidRule();
    } else if (this.midRuleSetUp.mode === "addNew") {
      this.addMidRuleTemplate();
    }
  }

  addMidRuleTemplate() {
    let newMidRule: Row;
    newMidRule = {
      hasBorder: false,
      codeUI: guidGenerator(),
      columns: [
        {
          isReadOnly: false,
          value: "New\n",
          feedbackData: [],
          feedbackLeft: 0,
        },
        {
          isReadOnly: false,
          value: cleanData(this.midRuleSelected.templateInformation),
          feedbackData: [],
          feedbackLeft: 0,
        },
        {
          isReadOnly: false,
          value: this.midRuleSelected.reasonCode,
          feedbackData: [],
          feedbackLeft: 0,
        },
      ],
    };

    addNewRowUtil(newMidRule, this.newVersion.rows);
    this.newVersion = { ...this.newVersion };
    this.openMidRuleEdit = false;
    this.cd.detectChanges();
  }

  detailEditMidRule() {
    let newMidRule: Row;
    newMidRule = {
      hasBorder: false,
      codeUI: guidGenerator(),
      columns: [
        {
          isReadOnly: false,
          value: this.midRuleSelected.template,
          feedbackData: [],
          feedbackLeft: 0,
        },
        {
          isReadOnly: false,
          value: this.midRuleSelected.templateInformation,
          feedbackData: [],
          feedbackLeft: 0,
        },
        {
          isReadOnly: false,
          value: this.midRuleSelected.reasonCode,
          feedbackData: [],
          feedbackLeft: 0,
        },
      ],
    };

    replaceRowUtil(newMidRule, this.newVersion.rows, this.rowIndexSelected);
    this.newVersion = { ...this.newVersion };
    this.openMidRuleEdit = false;
    this.cd.detectChanges();
  }

  detailEditDialog(event) {
    this.rowIndexSelected = event.rowIndex;
    this.midRuleSetUp.textButton1 = "Update";
    this.midRuleSetUp.showButton2 = false;
    this.midRuleSetUp.disableTitle1 = false;
    this.midRuleSetUp.mode = "editDetail";
    this.midRuleSelected = {
      midRuleTemplateId: 0,
      template: this.newVersion.rows[this.rowIndexSelected].columns[0].value,
      templateInformation:
        this.newVersion.rows[
          this.rowIndexSelected
        ].columns[1].value.trimRight(),
      reasonCode:
        this.newVersion.rows[
          this.rowIndexSelected
        ].columns[2].value.trimRight(),
    };

    this.openMidRuleEdit = true;
  }

  openExistingMidRuleDialog(event) {
    this.openMidRuleExisting = true;
  }

  addMidRuleExisting(event) {
    let newMidRule: Row;
    newMidRule = {
      hasBorder: false,
      codeUI: guidGenerator(),
      columns: [
        {
          isReadOnly: false,
          value: event.midRule,
          feedbackData: [],
          feedbackLeft: 0,
        },
        {
          isReadOnly: false,
          value: event.eclRuleLogicOriginal,
          feedbackData: [],
          feedbackLeft: 0,
        },
        {
          isReadOnly: false,
          value: "",
          feedbackData: [],
          feedbackLeft: 0,
        },
      ],
    };

    addNewRowUtil(newMidRule, (this.newVersion as Section).rows);
    this.newVersion = { ...this.newVersion };
    this.openMidRuleEdit = false;
    this.cd.detectChanges();
  }

  completeToggle(isComplete: boolean): void {
    this.toggleCompleted.emit(isComplete);
  }

  focusTypeChanged(focusType: { type: string; isTabAction: boolean }): void {
    this.focusType = focusType;
    this.focusTypeChange.emit(this.focusType);
  }

  sectionNavigateEvt({
    type,
    isTabAction,
  }: {
    type: string;
    isTabAction: boolean;
  }): void {
    this.sectionNavigate.emit({ type, isTabAction });
  }

  cellNavigate(focusType: { type: string; isTabAction: boolean }): void {
    if (
      focusType.type === arrowNavigation.up ||
      focusType.type === arrowNavigation.left
    ) {
      this.sectionNavigate.emit({
        type: arrowNavigation.up,
        isTabAction: focusType.isTabAction,
      });
    }
    if (
      focusType.type === arrowNavigation.down ||
      focusType.type === arrowNavigation.right
    ) {
      this.focusType = {
        isTabAction: focusType.isTabAction,
        type: arrowNavigation.down,
      };
    }
  }

  feedbackUpdateEvt(feedbackLeft: number) {
    this.newSectionUnsolvedFeedbackCount += feedbackLeft;
    this.feedbackUpdate.emit(this.newSectionUnsolvedFeedbackCount);
  }

  openSectionFeedback(section: SectionComponent) {
    section.openSectionFeedbacks();
  }

  getNewVersionFeedbackLeft() {
    this.newSectionUnsolvedFeedbackCount = getSectionUnresolvedFeedbacksCount(
      this.newVersion,
      false
    );
    this.newSectionFeedbackCount = getSectionFeedbacks(
      this.newVersion,
      false
    ).length;
    if (this.newSectionFeedbackCount === 0) {
      this.newSectionUnsolvedFeedbackCount = null;
    }
  }

  getMidrules() {
    this.openELLRules = true;
  }

  displayELLRules(rules: ELLMidRule[]) {
    this.ellRulesToCompare = rules;
    const backUpSectionRows = this.copyToNew.dataNewVersion(this.newVersion);
    this.copyToNew.setELLRules(this.newVersion, rules);
    this.copyToNew.checkSectionsFeedbacks(backUpSectionRows, this.newVersion);
    this.newVersion = {
      ...this.newVersion,
    };
    this.checkSectionsDifference();
  }

  updateRulesEll(midR) {
    const midRule = midR.midR as ELLMidRuleChange;
    if (midRule.type === "New") {
      const newRow = createNewRow(this.newVersion.rows);
      newRow.columns[0].value = midRule.midrule;
      newRow.columns[1].value = midRule.description;
      newRow.columns[1].compareColumn = {
        value: prepareData(midRule.description),
        isReadOnly: true,
        feedbackLeft: 0,
        feedbackData: [],
      };
      let index = 0;
      for (let i = 0; i < this.newVersion.rows.length; i++) {
        index = i;
        const row = this.newVersion.rows[i];
        const rowMidRule = +cleanData(row.columns[0].value)
          .split(".")[0]
          .trim();
        if (isNaN(rowMidRule)) {
          continue;
        }
        const midRuleNumber = +midRule.midrule.split(".")[0];
        const rowIndex = midR.orderList.indexOf(rowMidRule);
        const midRIndex = midR.orderList.indexOf(midRuleNumber);
        if (midRIndex < rowIndex) {
          break;
        }
      }
      this.newVersion.rows.splice(index, 0, newRow);
    } else if (midRule.type === "New Version") {
      const foundRowIdx = this.newVersion.rows.findIndex(
        (row) => row.codeUI === midRule.foundRowUUID
      );
      const row = this.newVersion.rows[foundRowIdx];
      row.columns[0] = {
        ...row.columns[0],
        value: midRule.midrule,
      };
      row.columns[1] = {
        ...row.columns[1],
        compareColumn: {
          value: prepareData(midRule.description),
          isReadOnly: true,
          feedbackLeft: 0,
          feedbackData: [],
        },
        value: prepareData(midRule.description),
      };
      row.columns[1];
      row.columns[2] = {
        ...row.columns[2],
        value: "",
      };
    } else if (midRule.type === "Deprecated") {
      const newRow = createNewRow(this.newVersion.rows);
      const foundRow = this.newVersion.rows.findIndex(
        (row) => row.codeUI === midRule.foundRowUUID
      );
      this.newVersion.rows.splice(foundRow, 1);
      if (this.newVersion.rows.length === 0) {
        this.newVersion.rows.push(newRow);
      }
    }
    this.newVersion = {
      ...this.newVersion,
    };
  }

  rulesCompareChange() {
    if (this.rulesCompare) {
      this.openELLSummary = true;
    }
  }

  showDialog() {
    this.section.nativeElement.scrollIntoView();
  }

  resetRulesCompare(value): void {
    this.openELLSummary = value;
    this.cd.detectChanges();
  }
}
