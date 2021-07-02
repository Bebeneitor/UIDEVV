import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { OverlayPanel } from "primeng/primeng";
import { interval, of, Subscription, zip } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { delay, flatMap, map, tap } from "rxjs/operators";
import { LoadingSpinnerService } from "src/app/services/spinner.service";
import { StorageService } from "src/app/services/storage.service";
import { ToastMessageService } from "src/app/services/toast-message.service";
import { DnBActions } from "../../models/constants/actions.constants";
import { arrowNavigation } from "../../models/constants/behaviors.constants";
import {
  HeaderDialog,
  IconDialog,
} from "../../models/constants/dialogConfig.constants";
import { DnBRoutes } from "../../models/constants/dnb-routes.constants";
import { drugVersionStatus } from "../../models/constants/drug.constants";
import { Messages } from "../../models/constants/messages.constants";
import {
  columnPopulate,
  SectionsAutopopulationIndication,
} from "../../models/constants/sectionAutopopulation.constants";
import {
  groupedSections,
  SectionCode,
} from "../../models/constants/sectioncode.constant";
import {
  storageDrug,
  storageGeneral,
} from "../../models/constants/storage.constants";
import { NavigationItem } from "../../models/interfaces/navigation";
import {
  GroupedSection,
  Section,
  UISection,
} from "../../models/interfaces/uibase";
import { apiPath } from "../../models/path/api-path.constant";
import { DnbRoleAuthService } from "../../services/dnb-role-auth.service";
import { DnbService } from "../../services/dnb.service";
import { DnbUndoRedoService } from "../../services/undo-redo.service";
import { FindReplaceComponent } from "../../shared/find-replace/find-replace.component";
import {
  clearNewSection,
  convertSectionNameToID,
  createCurrentPlaceholder,
  createNavigation,
  versionInformation,
} from "../../utils/convertAPIToUI.utils";
import { convertIUtoAPI } from "../../utils/convertUIToAPI.utils";
import { copyIngestedToNew } from "../../utils/copyrow.utils";
import {
  calculatePercentage,
  cleanData,
  clearAllSectionFeedback,
  cloneSection,
  formatTime,
  getAllFeedbacks,
  getAllUnresolvedFeedbacks,
  getDrugVersionId,
  getValuesColumn,
  getVersionColumnData,
  pasteClipboardGroups,
  pasteClipboardRows,
  processResponseAutopopulate,
  readFromClipboard,
  removeAllComments,
  saveVersionColumnData,
  validateDataForAutopopulation,
  validateVersionDrug,
} from "../../utils/tools.utils";
import { AutopopulateUtils, CopyToNew } from "../../utils/utils.index";
declare let $: any;
@Component({
  selector: "app-new-drug",
  templateUrl: "./new-drug.component.html",
  styleUrls: ["./new-drug.component.css"],
  providers: [CopyToNew, AutopopulateUtils, DnbUndoRedoService],
  encapsulation: ViewEncapsulation.None,
})
export class NewDrugComponent implements OnInit, OnDestroy {
  @ViewChild("mi", { static: false }) drdOverlay: OverlayPanel;
  @ViewChild("find", { static: false }) findComponent: FindReplaceComponent;
  navigationItems: NavigationItem[];
  sections$: Observable<UISection[]>;
  isNavigationOpen: boolean = true;
  observer: IntersectionObserver;
  showFindAndReplace: boolean = false;
  toggleLabel: string = Messages.showFullScreenLabel;
  stickySections: Section[] = [];
  startDragItemIndex: number = 0;
  navigationSections: UISection[] = [];
  drugCode: string = "";
  submitReviewDisable: boolean;
  saveDisabled: boolean;
  enableEditing: false;
  showButtons: boolean = false;
  enableButtons: any = {
    visible: true,
    buttons: { showReturn: true, showSubmit: true },
  };
  percentage: string = "0";
  shouldMarkSections: boolean = false;
  isApproverReviewing: boolean = false;
  isCompleteAutopopulate: boolean = false;
  feedbackComplete: boolean = false;
  shouldCheckFeedback: boolean = false;
  backupSections: UISection[] = null;
  validIcdCodeVersion: boolean = false;
  channel = new BroadcastChannel("PINNED_SECTIONS");
  pageLoadedChannel = new BroadcastChannel("PINNED_SECTION_LOADED");
  autosaveSubscribe: Subscription;
  switchAutosave: boolean = true;
  labelAutosave: string = "";
  autosaveActive: boolean = false;
  sectionsBackup: UISection[];
  version = this.storageService.get(storageDrug.drugVersion, true);
  stackInfo: Subscription;
  stack: string[] = [null];
  position: number = 0;
  constructor(
    private confirmationService: ConfirmationService,
    private loadingSpinnerService: LoadingSpinnerService,
    private cd: ChangeDetectorRef,
    private dnbService: DnbService,
    private toastService: ToastMessageService,
    private storageService: StorageService,
    private router: Router,
    private copyToNew: CopyToNew,
    private autopopulateUtils: AutopopulateUtils,
    private roleAuthService: DnbRoleAuthService,
    private undoRedo: DnbUndoRedoService
  ) {
    this.channel.addEventListener("message", (event) => {
      this.stickySections = event.data;
    });
    this.pageLoadedChannel.addEventListener("message", () => {
      this.channel.postMessage(this.stickySections);
    });
  }

  ngOnInit() {
    const editingMode = this.storageService.get(
      storageDrug.newDrugEditingMode,
      true
    );
    this.stackInfo = this.undoRedo.stackInfo
      .asObservable()
      .subscribe(({ position, stack }) => {
        this.position = position;
        this.stack = stack;
      });
    this.enableEditing = editingMode.editingMode;
    this.showButtons = editingMode.showButtons;
    this.isApproverReviewing = editingMode.approvalMode || false;
    this.drugCode =
      this.storageService.get(storageDrug.drugCode, false) === "null"
        ? null
        : this.storageService.get(storageDrug.drugCode, false);

    this.submitReviewDisable = !this.version;
    this.sections$ = this.getDrugData(
      this.version ? this.version.versionId : null
    ).pipe(
      map((sections) => {
        const result = sections.map((section) => {
          let headersUIWidth = getVersionColumnData(
            this.version ? this.version.versionId : "",
            section,
            false,
            this.storageService
          );
          const grouped =
            groupedSections.findIndex(
              (searchSection) => section.section.code === searchSection
            ) > -1;
          return {
            id: convertSectionNameToID(section.section.name),
            current: {
              ...createCurrentPlaceholder(section, grouped),
              headersUIWidth,
            },
            new: {
              ...section,
              headersUIWidth,
            },
            hasRowHeading: false,
            grouped,
          };
        });
        this.undoRedo.sections = result;
        this.navigationSections = result;
        this.sectionsBackup = JSON.parse(
          JSON.stringify(this.undoRedo.sections)
        );
        this.feedbackComplete =
          getAllFeedbacks(result).length > 0 &&
          getAllUnresolvedFeedbacks(result) === 0;
        this.shouldCheckFeedback =
          !this.isApproverReviewing ||
          (this.isApproverReviewing && this.feedbackComplete);
        this.getPercentage();
        this.isAutosavingActive({ checked: true });
        this.navigationItems = createNavigation(
          this.navigationSections,
          "",
          !this.shouldCheckFeedback
        );
        return result;
      }),
      tap(() => {
        setTimeout(() => {
          this.startObserver();
          $(".sortable_list").sortable({
            axis: "y",
            handle: ".handle",
            placeholder: "dnb-drag-placeholder",
            forcePlaceholderSize: true,
            start: (_, ui) => {
              this.startDragItemIndex = ui.item.index();
            },
            stop: (event, ui) => this.sortNavigationItems(event, ui),
          });
        });
      })
    );
  }

  sortNavigationItems(_, ui): void {
    const index = ui.item.index();
    const sectionsSorted = this.undoRedo.sections;
    const draggedItem = sectionsSorted.splice(this.startDragItemIndex, 1)[0];
    sectionsSorted.splice(index, 0, draggedItem);
    this.undoRedo.sections = sectionsSorted;
    const approvedVersion = this.storageService.get(
      storageDrug.approvedDrugVersion,
      true
    );
    const approvedVersionStatus = approvedVersion.versionStatus;
    this.navigationItems = createNavigation(
      this.undoRedo.sections,
      approvedVersionStatus,
      !this.shouldCheckFeedback
    );
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.observer && this.observer.disconnect();
    if (this.autosaveSubscribe !== undefined) {
      this.autosaveSubscribe && this.autosaveSubscribe.unsubscribe();
    }
    if (this.stackInfo !== undefined) {
      this.stackInfo && this.stackInfo.unsubscribe();
    }
  }

  startObserver(): void {
    const pageContentEl = document.querySelector(".dnb-page");
    const stickytTriggerEl = document.querySelector(".sentinal");
    this.observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) {
        pageContentEl.classList.add("has-sticky-header");
      } else {
        pageContentEl.classList.remove("has-sticky-header");
      }
    });
    if (stickytTriggerEl) {
      this.observer.observe(stickytTriggerEl);
    }
  }

  onSwitchChange(event: { originalEvent: MouseEvent; checked: boolean }) {
    this.toggleLabel = !event.checked
      ? Messages.showFullScreenLabel
      : Messages.hideFullScreenLabel;
  }

  stickySection(section: Section): void {
    let exist: boolean = false;
    let index: number;
    this.stickySections.map((item, indexItem) => {
      if (item.section.code === section.section.code) {
        index = indexItem;
        exist = true;
      }
    });
    if (!exist) {
      this.stickySections.push(section);
    } else {
      this.stickySections.splice(index, 1);
    }

    const url = `${window.location.origin}/ecl/#${apiPath.pinnedSections}`;
    window.open(`${url}`, "pinned");
    this.channel.postMessage(this.stickySections);
  }

  undoStickSection(event) {
    this.stickySections.splice(event.index, 1);
  }

  confirmSaveData() {
    this.confirmationService.confirm({
      message: "Are you sure you want to save?",
      header: HeaderDialog.confirm,
      icon: IconDialog.question,
      accept: () => {
        this.saveNewDrug();
      },
    });
  }

  confirmClearAll() {
    this.confirmationService.confirm({
      message: "Are you sure you want to to clear all sections?",
      header: HeaderDialog.confirm,
      icon: IconDialog.question,
      accept: () => {
        this.clearAll();
        this.markUnmarkSections(false);
      },
    });
  }

  confirmReturnData() {
    let gettFeebacksCout = getAllFeedbacks(this.undoRedo.sections).length;
    if (gettFeebacksCout === 0) {
      this.toastService.messageError(
        "Error!",
        "Please add at least one Feedback for the Editor",
        6000,
        true
      );
      return;
    }
    this.confirmationService.confirm({
      message: "Are you sure you want to return it to the Editor?",
      header: HeaderDialog.confirm,
      icon: IconDialog.question,
      accept: () => {
        this.returnData();
      },
    });
  }

  clearAll(): void {
    let sectionsCode = [];
    const newData = this.undoRedo.sections.map((section) => {
      const code = section.new.section.code;
      const name = section.new.section.name;
      let data;
      sectionsCode.push(code);
      let backUpSectionRows = [];
      if (section.grouped) {
        backUpSectionRows = this.copyToNew.dataNewVersionGroup(
          section.new as GroupedSection
        );
        data = clearNewSection(code, name);
        this.copyToNew.checkGroupedSectionsFeedbacks(
          backUpSectionRows,
          data as GroupedSection
        );
      } else {
        backUpSectionRows = this.copyToNew.dataNewVersion(
          section.new as Section
        );
        data = clearNewSection(code, name);
        this.copyToNew.checkSectionsFeedbacks(
          backUpSectionRows,
          data as Section
        );
      }
      return section.grouped ? (data as GroupedSection) : (data as Section);
    });
    this.undoRedo.doCommand(
      DnBActions.BATCH_SECTIONS,
      {
        sectionsCode,
      },
      { sections: newData },
      null
    );
    this.undoRedo.sections.forEach((section) => {
      let backUpSectionRows = [];
      if (section.grouped) {
        backUpSectionRows = this.copyToNew.dataNewVersionGroup(
          section.new as GroupedSection
        );
        this.copyToNew.checkGroupedSectionsFeedbacks(
          backUpSectionRows,
          section.new as GroupedSection
        );
      } else {
        backUpSectionRows = this.copyToNew.dataNewVersion(
          section.new as Section
        );
        this.copyToNew.checkSectionsFeedbacks(
          backUpSectionRows,
          section.new as Section
        );
      }
    });
  }

  getDrugData(versionId: string): Observable<(Section | GroupedSection)[]> {
    const newDrugColumnDefault = {
      isReadOnly: false,
      placeholder: "New Drug Name",
      maxLength: 100,
      regExValidator: /[^-A-Z,()_\d\s]/,
      regExTitle: "New Drug Name",
      regExMessage:
        "Just numbers, letters, parentheses, commas, underscore and dash are allowed",
    };
    let sections: (Section | GroupedSection)[];
    if (versionId) {
      this.undoRedo.drugNameColumn = {
        ...newDrugColumnDefault,
        value: this.storageService.get(storageDrug.drugName, false),
        feedbackData: [],
        feedbackLeft: 0,
      };

      return this.dnbService
        .getAggregator(versionId)
        .pipe(
          map((section) =>
            section.map((sectionOne) => versionInformation(sectionOne))
          )
        );
    } else {
      this.undoRedo.drugNameColumn = {
        ...newDrugColumnDefault,
        value: "",
        feedbackData: [],
        feedbackLeft: 0,
      };
      sections = [
        clearNewSection(SectionCode.GeneralInformation, ""),
        clearNewSection(SectionCode.References, ""),
        clearNewSection(SectionCode.DailyMaxUnits, ""),
        clearNewSection(SectionCode.LCD, ""),
        clearNewSection(SectionCode.MedicalJournal, ""),
        clearNewSection(SectionCode.Notes, ""),
        clearNewSection(SectionCode.Indications, ""),
        clearNewSection(SectionCode.DiagnosisCodes, ""),
        clearNewSection(SectionCode.DiagnosticCodeSummary, ""),
        clearNewSection(SectionCode.ManifestationCodes, ""),
        clearNewSection(SectionCode.DosingPatterns, ""),
        clearNewSection(SectionCode.DailyMaximumDose, ""),
        clearNewSection(SectionCode.MaximumFrequency, ""),
        clearNewSection(SectionCode.Age, ""),
        clearNewSection(SectionCode.Gender, ""),
        clearNewSection(SectionCode.UnitsOverTime, ""),
        clearNewSection(SectionCode.VisitOverTime, ""),
        clearNewSection(SectionCode.DiagnosisCodeOverlaps, ""),
        clearNewSection(SectionCode.SecondaryMalignancy, ""),
        clearNewSection(SectionCode.CombinationTherapy, ""),
        clearNewSection(SectionCode.GlobalReviewIndications, ""),
        clearNewSection(SectionCode.GlobalReviewCodes, ""),
        clearNewSection(SectionCode.Rules, "Rules"),
      ];
      return of(sections).pipe(
        tap(() => this.loadingSpinnerService.isLoading.next(true)),
        delay(100),
        tap(() => this.loadingSpinnerService.isLoading.next(false))
      );
    }
  }

  saveNewDrug(): void {
    if (this.drugCode) {
      this.saveData();
    } else {
      this.dnbService
        .createNewDrug(cleanData(this.undoRedo.drugNameColumn.value))
        .subscribe((newDrug) => {
          this.drugCode = newDrug.code;
          this.saveData();
        });
    }
  }

  saveData(editType: string = "", majorVersion: boolean = false) {
    const calls$: any[] = [];
    let sectionConvert: Section | GroupedSection;
    this.labelAutosave = "Saving";
    this.dnbService
      .getNewDrugVersion(this.drugCode, editType, majorVersion)
      .subscribe((drugV: any) => {
        for (const section of this.undoRedo.sections) {
          sectionConvert = convertIUtoAPI(
            section.new as Section | GroupedSection,
            this.drugCode
          );
          if (sectionConvert) {
            sectionConvert.drugVersionCode = drugV.drugVersionCode;
            calls$.push(this.dnbService.postAggregatorSection(sectionConvert));
          }
        }
        zip(...calls$)
          .pipe(flatMap(() => this.dnbService.postSaveSection(drugV)))
          .subscribe(
            (result) => {
              this.submitReviewDisable = false;
              this.saveDisabled = false;
              if (
                !this.storageService.exists(storageGeneral.isAutosaveActive)
              ) {
                this.toastService.messageSuccess(
                  "Success!",
                  `Version saved successfully.`,
                  6000,
                  true
                );
                this.isAutosavingActive({ checked: true });
              } else {
                this.autosaveActive = false;
                this.storageService.remove(storageGeneral.isAutosaveActive);
              }

              if (
                this.undoRedo.drugNameColumn.value &&
                this.undoRedo.drugNameColumn.value.length > 1
              ) {
                this.dnbService
                  .updateDrugName({
                    code: this.drugCode,
                    name: this.undoRedo.drugNameColumn.value,
                  })
                  .subscribe(() => {
                    this.storageService.set(
                      storageDrug.drugName,
                      this.undoRedo.drugNameColumn.value,
                      false
                    );
                  });
              } else {
                this.drugNameChange(
                  this.storageService.get(storageDrug.drugName, false)
                );
              }

              this.storageService.set(
                storageDrug.drugCode,
                this.drugCode,
                false
              );
              this.storageService.set(
                storageDrug.drugLatestVersion,
                "0.0",
                false
              );
              const versionId = result.drugVersionCode;
              const versionStatus = drugVersionStatus.InProgress.code;
              const versionStatusDescription =
                drugVersionStatus.InProgress.description;
              this.storageService.set(
                storageDrug.drugVersion,
                { versionId, versionStatus, versionStatusDescription },
                true
              );

              if (majorVersion) {
                this.router.navigate([DnBRoutes.drugVersions]);
              }

              this.labelAutosave =
                "Last Time Saved " + formatTime(new Date()).timeAmPm;
              this.sectionsBackup = JSON.parse(
                JSON.stringify(this.undoRedo.sections)
              );
              saveVersionColumnData(
                this.undoRedo.sections,
                versionId,
                this.version ? this.version.versionId : "",
                true,
                this.storageService
              );
              if (this.version) {
                this.version.versionId = versionId;
              } else {
                this.version = { versionId: versionId };
              }
            },
            () => {
              this.toastService.messageError("Error!", "Rollback.", 6000, true);
            }
          );
      });
  }

  submitData(editType: string = "", majorVersion: boolean = false) {
    const calls$: any[] = [];
    let sectionConvert: Section | GroupedSection;
    this.dnbService
      .getNewDrugVersion(this.drugCode, editType, majorVersion)
      .subscribe((drugV: any) => {
        this.undoRedo.sections = removeAllComments(this.undoRedo.sections);
        for (const section of this.undoRedo.sections) {
          sectionConvert = convertIUtoAPI(
            section.new as Section | GroupedSection,
            this.drugCode
          );
          if (sectionConvert) {
            sectionConvert.drugVersionCode = drugV.drugVersionCode;
            calls$.push(this.dnbService.postAggregatorSection(sectionConvert));
          }
        }
        zip(...calls$)
          .pipe(flatMap(() => this.dnbService.postSaveSection(drugV)))
          .subscribe(
            () => {
              this.dnbService
                .postSubmitForReview(this.drugCode)
                .subscribe((result) => {
                  this.toastService.messageSuccess(
                    "Success!",
                    `Drug submited successfully.`,
                    6000,
                    true
                  );

                  if (result.details && result.details.length > 0) {
                    this.toastService.messageWarning(
                      "Warning!",
                      result.details,
                      6000,
                      true
                    );
                  }

                  if (
                    this.undoRedo.drugNameColumn.value &&
                    this.undoRedo.drugNameColumn.value.length > 1
                  ) {
                    this.dnbService
                      .updateDrugName({
                        code: this.drugCode,
                        name: this.undoRedo.drugNameColumn.value,
                      })
                      .subscribe(() => {
                        this.storageService.set(
                          storageDrug.drugName,
                          this.undoRedo.drugNameColumn.value,
                          false
                        );
                      });
                  }
                  this.storageService.set(
                    storageDrug.drugCode,
                    this.drugCode,
                    false
                  );
                  this.storageService.set(
                    storageDrug.drugLatestVersion,
                    "0.0",
                    false
                  );
                  this.sectionsBackup = JSON.parse(
                    JSON.stringify(this.undoRedo.sections)
                  );
                  this.router.navigate([DnBRoutes.drugsInApprovalProcess]);
                });
            },
            () => {
              this.toastService.messageError("Error!", "Rollback.", 6000, true);
            }
          );
      });
  }

  returnData() {
    this.dnbService.postReturnSection(this.drugCode).subscribe(
      (result) => {
        this.toastService.messageSuccess(
          "Success!",
          `The action was successful.`,
          6000,
          true
        );

        if (result.details && result.details.length > 0) {
          this.toastService.messageWarning(
            "Warning!",
            result.details,
            6000,
            true
          );
        }

        this.router.navigate([DnBRoutes.drugsInApprovalProcess]);
      },
      (error) => {
        this.toastService.messageError("Error!", "Rollback.", 6000, true);
      }
    );
  }

  approveForApprover(feedbacksCount: number) {
    const versionDrug = this.storageService.get(storageDrug.drugVersion, true);
    const obs =
      feedbacksCount > 0
        ? this.dnbService.verifyFeedback(versionDrug.versionId)
        : of({});
    obs
      .pipe(flatMap(() => this.dnbService.postApproveForApprover(versionDrug)))
      .subscribe(
        (result: any) => {
          this.toastService.messageSuccess(
            "Success!",
            `The action was successful.`,
            6000,
            true
          );

          if (result.details && result.details.length > 0) {
            this.toastService.messageWarning(
              "Warning!",
              result.details,
              6000,
              true
            );
          }
          this.router.navigate([DnBRoutes.drugVersions]);
        },
        (error) => {
          this.toastService.messageError("Error!", "Rollback.", 6000, true);
        }
      );
  }

  validateAllSectionCompleted() {
    if (
      this.undoRedo.sections.filter(
        (val) => val.new.completed === false && val.new.enabled === true
      ).length > 0
    ) {
      this.confirmationService.confirm({
        message:
          "There are some uncompleted sections, do you want to mark those as completed?",
        header: HeaderDialog.confirm,
        icon: IconDialog.question,
        accept: () => {
          this.markUnmarkSections(true);
          this.submitNewDrug();
        },
      });
    } else {
      this.submitNewDrug();
    }
  }

  validateFeedback() {
    let getFeebacksCount = getAllFeedbacks(this.undoRedo.sections).length;
    let getUnresolvedFeedbackCount = getAllUnresolvedFeedbacks(
      this.undoRedo.sections
    );
    if (this.isApproverReviewing && getFeebacksCount > 0) {
      this.confirmationService.confirm({
        message:
          "If you want to continue with Approval, the Feedback will be lost",
        header: HeaderDialog.confirm,
        icon: IconDialog.question,
        accept: () => {
          setTimeout(() => {
            this.validRolesForSubmit(getFeebacksCount);
          });
        },
      });
    } else if (!this.isApproverReviewing && getUnresolvedFeedbackCount > 0) {
      this.toastService.messageError(
        "Error!",
        "Please Resolve all the Feedback to proceed",
        6000,
        true
      );
    } else {
      this.validRolesForSubmit(getFeebacksCount);
    }
  }

  validRolesForSubmit(feedbacksCount: number) {
    if (
      !this.isApproverReviewing &&
      this.roleAuthService.isAuthorizedRole("ROLE_DNBE")
    ) {
      this.validateAllSectionCompleted();
    } else if (this.roleAuthService.isAuthorizedRole("ROLE_DNBA")) {
      this.confirmationService.confirm({
        message: "Do you want to continue with the Approval?",
        header: HeaderDialog.confirm,
        icon: IconDialog.question,
        accept: () => {
          this.approveForApprover(feedbacksCount);
        },
      });
    }
  }

  submitNewDrug(): void {
    this.confirmationService.confirm({
      message: "Do you want to continue with the Approval?",
      header: HeaderDialog.confirm,
      icon: IconDialog.question,
      key: "approve",
      accept: () => {
        this.submitData("L", true);
      },
    });
  }

  @HostListener("window:beforeunload", ["$event"])
  preventRefresh($event) {
    $event.returnValue = true;
    if (this.autosaveSubscribe !== undefined) {
      this.autosaveSubscribe && this.autosaveSubscribe.unsubscribe();
    }
    this.isAutosavingActive({ checked: true });
  }

  toggleCompleted(isCompleted, sectionIndex): void {
    this.undoRedo.doCommand(
      DnBActions.SECTION_HEADER_DATA,
      {
        sectionIndex: sectionIndex,
      },
      { completed: isCompleted },
      null
    );
    this.navigationItems = createNavigation(
      this.undoRedo.sections,
      "",
      !this.shouldCheckFeedback
    );
    this.getPercentage();
  }

  getPercentage() {
    this.percentage = calculatePercentage(this.undoRedo.sections);
    this.checkPercentage();
  }

  toggleSectionCopy({
    section,
    status,
  }: {
    section: Section | GroupedSection;
    status: boolean;
  }): void {
    this.checkPercentage();
  }

  checkPercentage() {
    this.shouldMarkSections =
      this.undoRedo.sections.filter(
        (val) => !val.new.completed && val.new.enabled
      ).length === 0;
  }

  markUnmarkSections(valueMark: boolean) {
    this.shouldMarkSections = valueMark;
    const sectionsCode = this.undoRedo.sections.map(
      (section) => section.new.section.code
    );
    this.undoRedo.doCommand(
      DnBActions.BATCH_SECTIONS_HEADER,
      {
        sectionsCode,
      },
      { newValue: valueMark },
      null
    );
    setTimeout(() => {
      this.navigationItems = createNavigation(
        this.undoRedo.sections,
        "",
        !this.shouldCheckFeedback
      );
      this.getPercentage();
    });
  }

  allMarkSections(isMark: boolean) {
    let markUnmarkLabel: string = isMark ? "mark" : "unmark";
    this.confirmationService.confirm({
      message:
        "Do you want to " + markUnmarkLabel + " all sections as completed",
      header: HeaderDialog.confirm,
      icon: IconDialog.question,
      accept: () => {
        this.markUnmarkSections(isMark);
      },
      reject: () => {
        this.shouldMarkSections = !isMark;
      },
    });
  }

  cellNavigate(focusType: { type: string; isTabAction: boolean }): void {
    if (focusType.type == arrowNavigation.right && focusType.isTabAction) {
      this.undoRedo.sections[0].new.focusType = {
        type: arrowNavigation.down,
        isTabAction: true,
      };
    }
  }

  sectionNavigateEvt(
    focusType: { type: string; isTabAction: boolean },
    index: number
  ): void {
    this.undoRedo.sections[index].new.focusType = null;
    if (index === 0 && focusType.type == arrowNavigation.up) {
      this.undoRedo.drugNameColumn.focus = {
        hasFocus: true,
        isTabAction: focusType.isTabAction,
      };
    }
    if (focusType.type === arrowNavigation.up && index > 0) {
      this.undoRedo.sections[index - 1].new.focusType = focusType;
    }
    if (
      focusType.type === arrowNavigation.down &&
      index < this.undoRedo.sections.length - 1
    ) {
      this.undoRedo.sections[index + 1].new.focusType = focusType;
    }
    this.cd.detectChanges();
  }

  dataPopulateSections(event) {
    this.loadingSpinnerService.setDisplayMessage("Processing");
    if (event.activeSection === SectionCode.DiagnosisCodeOverlaps) {
      this.autopopulateForOverlaps();
      return;
    }
    if (
      getValuesColumn(event.dataCopy, 0).length > 0 ||
      getValuesColumn(event.dataCopyGlobal, 0).length > 0
    ) {
      let orderArray: Section;
      this.loadingSpinnerService.isLoading.next(true);
      setTimeout(() => {
        this.undoRedo.sections.forEach((section) => {
          if (section.new.section.code === SectionCode.DiagnosisCodes) {
            orderArray = section.new as Section;
          }
          if (event.activeSection === SectionCode.DiagnosisCodes) {
            this.autopopulateForDiagnosisCode(section, event, orderArray);
            this.isCompleteAutopopulate = !this.isCompleteAutopopulate;
          }
          if (
            event.activeSection === SectionCode.DiagnosticCodeSummary &&
            section.new.section.code === SectionCode.GlobalReviewCodes
          ) {
            this.autopopulateForDiagnosisCodeSummary(section, event);
          }
          section.new = {
            ...section.new,
          };
        });
        if (this.isCompleteAutopopulate) {
          this.toastService.messageSuccess(
            "Success!",
            `The action was successful.`,
            6000,
            true
          );
          this.isCompleteAutopopulate = !this.isCompleteAutopopulate;
        }
        this.loadingSpinnerService.isLoading.next(false);
      });
    } else {
      if (event.duplicateDataParentSection.length > 0) {
        this.toastService.messageError(
          "Error!",
          `Please remove duplicates in Diagnosis Codes to continue the process: ` +
            event.duplicateDataParentSection.join(", "),
          6000,
          true
        );
      }
      if (event.duplicateDataGlobalSection.length > 0) {
        this.toastService.messageError(
          "Error!",
          `Please remove duplicates in Global Review - Indications to continue the process: ` +
            event.duplicateDataGlobalSection.join(", "),
          6000,
          true
        );
      }
      if (event.duplicateDataGRICSection.length > 0) {
        this.toastService.messageError(
          "Error!",
          `Please remove duplicates in Global Review - ICD-10 Codes to continue the process: ` +
            event.duplicateDataGRICSection.join(", "),
          6000,
          true
        );
      }
      if (
        event.duplicateDataParentSection.length === 0 ||
        event.duplicateDataGlobalSection.length === 0
      ) {
        this.toastService.messageWarning(
          "Warning!",
          `No information was found to Autopopulate.`,
          6000,
          true
        );
      }
    }
  }

  autopopulateForOverlaps() {
    let dataCopy = this.copyToNew.copyColumnsMultiSource(
      this.undoRedo.sections
    );
    if (getValuesColumn(dataCopy.dataCopy, 0).length > 0) {
      if (!validateDataForAutopopulation(dataCopy.dataCopy)) {
        this.toastService.messageError(
          "Error!",
          Messages.validDataForAutopopulate,
          6000,
          true
        );
      } else {
        this.undoRedo.sections.forEach((section) => {
          if (section.new.section.code === SectionCode.DiagnosisCodeOverlaps) {
            let data: string[] = getValuesColumn(dataCopy.dataCopy, 0);
            data = data.filter((c, index) => {
              return data.indexOf(c) !== index;
            });
            this.dnbService
              .listAutopopulateIcd10Code(data)
              .subscribe((response) => {
                const rowsData = this.autopopulateUtils.fillInRows(
                  response,
                  this.undoRedo.sections
                );
                this.autopopulateUtils.populateOverlapsGroupedSection(
                  section.new as GroupedSection,
                  rowsData
                );
                section.new = {
                  ...section.new,
                };
                if (response.data.lstInvalidIcd10Codes.length > 0) {
                  this.toastService.messageWarning(
                    "Warning!",
                    `The next Code(s) were not found to sort it: ` +
                      response.data.lstInvalidIcd10Codes.join(", "),
                    6000,
                    true
                  );
                }
              });
          }
        });
      }
    } else {
      this.toastService.messageWarning(
        "Warning!",
        `No overlapping ICD-10 codes found to Auto-populate from Diagnosis Code Summary.`,
        6000,
        true
      );
      this.undoRedo.sections.forEach((section) => {
        if (section.new.section.code === SectionCode.DiagnosisCodeOverlaps) {
          let dataSection = (section.new as Section).rows;
          if (getValuesColumn(dataSection, 0).length > 0) {
            this.autopopulateUtils.clearDataAutopopulation(
              section.new as Section
            );
            section.new = {
              ...section.new,
            };
          }
        }
      });
    }
  }

  autopopulateForDiagnosisCode(
    section: UISection,
    event: any,
    sectionOrder: Section
  ) {
    if (section.grouped) {
      if (
        SectionsAutopopulationIndication.indexOf(section.id) !== -1 &&
        (!event.autopopulateGlobalReviewSection ||
          event.autopupulateAllChildSections)
      ) {
        this.autopopulateUtils.populateSectionGrouped(
          section.new as GroupedSection,
          event,
          sectionOrder,
          columnPopulate.Indication
        );
      }
    } else {
      if (
        SectionsAutopopulationIndication.indexOf(section.id) !== -1 &&
        (!event.autopopulateGlobalReviewSection ||
          event.autopupulateAllChildSections)
      ) {
        this.autopopulateUtils.populateFixedSections(
          section.new as Section,
          event,
          sectionOrder,
          columnPopulate.Indication
        );
      }
    }
    if (
      section.new.section.code === SectionCode.GlobalReviewIndications &&
      (event.autopopulateGlobalReviewSection ||
        event.autopupulateAllChildSections)
    ) {
      this.autopopulateUtils.populateGlobalReview(
        section.new as Section,
        event,
        sectionOrder,
        columnPopulate.GlobalReviewIndication
      );
    }
  }

  autopopulateForDiagnosisCodeSummary(section: UISection, event) {
    if (!validateDataForAutopopulation(event.dataCopy)) {
      this.toastService.messageError(
        "Error!",
        Messages.validDataForAutopopulate,
        6000,
        true
      );
    } else {
      if (
        !event.processAddIndication &&
        !event.processDeleteIndication &&
        (event.indicationAdd.length > 0 || event.indicationOverride.length > 0)
      ) {
        this.autopopulateUtils.populateCodeSummarySection(
          section.new as Section,
          null,
          columnPopulate.GlobalReviewIndication,
          event
        );
      } else {
        let data: string[] = getValuesColumn(event.dataCopy, 0);
        data = this.autopopulateUtils.checkIfDataIsComplete(event, data);
        this.dnbService
          .listAutopopulateIcd10Code(data)
          .subscribe((response) => {
            this.autopopulateUtils.populateCodeSummarySection(
              section.new as Section,
              processResponseAutopopulate(response),
              columnPopulate.GlobalReviewIndication,
              event
            );
            if (response.data.lstInvalidIcd10Codes.length > 0) {
              this.toastService.messageWarning(
                "Warning!",
                `The next Code(s) were not found to sort it: ` +
                  response.data.lstInvalidIcd10Codes.join(", "),
                6000,
                true
              );
            }
            if (response.hasOwnProperty("uiDecorator")) {
              if (response.uiDecorator.warningMessagesList.length > 0) {
                this.toastService.messageWarning(
                  "Warning!",
                  response.uiDecorator.warningMessagesList.join(", "),
                  6000,
                  true
                );
              }
            }
            section.new = {
              ...section.new,
            };
          });
      }
      this.isCompleteAutopopulate = !this.isCompleteAutopopulate;
    }
  }

  feedbackUpdate(feedbackLeft: number, sectionIndex: number) {
    this.navigationItems[sectionIndex].feedbackLeft = feedbackLeft;
    this.navigationItems = [...this.navigationItems];
  }

  addMoreFeedback() {
    const version = this.storageService.get(storageDrug.drugVersion, true);
    this.dnbService.verifyFeedback(version.versionId).subscribe(() => {
      const clearSections = clearAllSectionFeedback(this.undoRedo.sections);
      this.navigationSections = clearSections;
      this.feedbackComplete = false;
      this.shouldCheckFeedback = false;
      this.navigationItems = createNavigation(
        this.navigationSections,
        "",
        !this.shouldCheckFeedback
      );
      this.undoRedo.sections.forEach((section, idx) => {
        section.new = clearSections[idx].new;
      });
    });
  }

  drugNameChange(value) {
    this.undoRedo.drugNameColumn = {
      ...this.undoRedo.drugNameColumn,
      value,
    };
  }

  getIngestedContent(versionId: string) {
    this.dnbService.getAggregator(versionId).subscribe((sections) => {
      let sectionsCode = [];
      const data = sections.map((sectionOne) => {
        const hasInfo =
          (sectionOne as any).data && (sectionOne as any).data.length > 0;
        return hasInfo
          ? versionInformation(sectionOne)
          : clearNewSection(
              sectionOne.section.code,
              this.undoRedo.drugNameColumn.value
            );
      });
      const newData = this.undoRedo.sections.map((section) => {
        const ingestedSection = data.find(
          (ingested) => ingested.section.code === section.new.section.code
        );
        let newSection;
        sectionsCode.push(ingestedSection.section.code);
        let backUpSectionRows = [];
        if (section.grouped) {
          backUpSectionRows = this.copyToNew.dataNewVersionGroup(
            section.new as GroupedSection
          );
          const cloned = cloneSection(section.new, true) as GroupedSection;
          newSection = copyIngestedToNew(
            cloned,
            ingestedSection,
            section.grouped
          );
          this.copyToNew.checkGroupedSectionsFeedbacks(
            backUpSectionRows,
            newSection as GroupedSection
          );
        } else {
          backUpSectionRows = this.copyToNew.dataNewVersion(
            section.new as Section
          );
          const cloned = cloneSection(section.new, false) as Section;
          newSection = copyIngestedToNew(
            cloned,
            ingestedSection,
            section.grouped
          );
          this.copyToNew.checkSectionsFeedbacks(
            backUpSectionRows,
            newSection as Section
          );
        }
        return section.grouped
          ? (newSection as GroupedSection)
          : (newSection as Section);
      });
      this.undoRedo.doCommand(
        DnBActions.BATCH_SECTIONS,
        {
          sectionsCode,
        },
        { sections: newData },
        null
      );
      this.drdOverlay.hide();
    });
  }

  drugCreated(drugCode: string) {
    this.drugCode = drugCode;
  }

  trackBySections(index, section) {
    return section.id;
  }

  validIcdCodes(event) {
    if (this.validIcdCodeVersion) return;
    const version = this.storageService.get(storageDrug.drugVersion, true);
    if (version === null) return;
    let dataVersion = {
      versionStatus: {
        code: version.versionStatus,
        description: version.versionStatusDescription,
      },
    };
    if (validateVersionDrug(this.undoRedo.sections).length > 0) {
      this.toastService.messageWarning(
        "Warning!",
        `The Version for ${
          getDrugVersionId(dataVersion) === undefined
            ? version.versionStatusDescription
            : getDrugVersionId(dataVersion)
        } ${this.storageService.get(
          storageDrug.drugDate,
          false
        )} Drug is not compatible with the ICD-10 Manual sorting. `,
        6000,
        true
      );
      this.validIcdCodeVersion = !this.validIcdCodeVersion;
    } else {
      if (event.codesInvalid.length > 0) {
        this.toastService.messageWarning(
          "Warning!",
          `The next Code(s) in the ICD-10 Manual for ${getDrugVersionId(
            dataVersion
          )} ${this.storageService
            .get(storageDrug.drugDate, false)
            .substr(6, 4)} were not found to sort it: ` +
            event.codesInvalid.join(", ") +
            ` in the ` +
            event.sectionCode +
            ".",
          6000,
          true
        );
      }
    }
  }

  isAutosavingActive(event: { checked: true }) {
    if (
      this.drugCode !== null &&
      this.undoRedo.drugNameColumn.value &&
      this.enableEditing
    ) {
      this.switchAutosave = event.checked;

      if (this.switchAutosave) {
        this.labelAutosave =
          this.labelAutosave === "" ? "Start Saving" : this.labelAutosave;
      } else {
        this.labelAutosave =
          this.labelAutosave === "Start Saving" ? "" : this.labelAutosave;
      }

      if (
        (this.autosaveSubscribe === undefined ||
          this.autosaveSubscribe.closed) &&
        event.checked
      ) {
        if (!this.sectionsBackup) {
          this.sectionsBackup = JSON.parse(
            JSON.stringify(this.undoRedo.sections)
          );
        }
        this.autosaveSubscribe = interval(120000).subscribe(() => {
          if (!this.comparigDataToAutosave()) {
            this.saveDisabled = true;
            this.submitReviewDisable = true;
            this.storageService.set(
              storageGeneral.isAutosaveActive,
              true,
              false
            );
            this.saveData();
          }
        });
      } else if (!event.checked) {
        this.autosaveSubscribe && this.autosaveSubscribe.unsubscribe();
      }
    } else {
      this.switchAutosave = false;
    }
  }

  comparigDataToAutosave(): boolean {
    let sectionConvert: any[] = [];
    for (const section of this.undoRedo.sections) {
      sectionConvert.push(
        convertIUtoAPI(section.new as Section | GroupedSection, this.drugCode)
      );
    }

    let sectionConvertBackUp: any[] = [];
    for (const section of this.sectionsBackup) {
      sectionConvertBackUp.push(
        convertIUtoAPI(section.new as Section | GroupedSection, this.drugCode)
      );
    }
    return (
      JSON.stringify(sectionConvert) === JSON.stringify(sectionConvertBackUp)
    );
  }

  @HostListener("window:paste", ["$event"]) interceptPaste = (
    event: ClipboardEvent
  ) => {
    const sourceData = this.storageService.get(
      storageDrug.copySectionSource,
      true
    );
    const section = this.undoRedo.sections[sourceData.sectionIndex];
    if (
      !this.undoRedo.sections[sourceData.sectionIndex].new.enabled ||
      !this.enableEditing
    ) {
      return;
    }
    const isGrouped = this.undoRedo.sections[sourceData.sectionIndex].grouped;
    const rows = readFromClipboard(event);
    if (rows && rows.length > 0) {
      const isAutopopulate =
        SectionsAutopopulationIndication.indexOf(section.new.id) === -1 &&
        section.new.section.code !== SectionCode.DiagnosisCodeOverlaps;
      const oldata = cloneSection(section.new as GroupedSection, isGrouped);
      const newData = isGrouped
        ? pasteClipboardGroups(
            rows,
            sourceData,
            (oldata as GroupedSection).groups
          )
        : pasteClipboardRows(
            rows,
            sourceData,
            (oldata as Section).rows,
            isAutopopulate
          );
      const newSectionData = isGrouped
        ? {
            ...oldata,
            groups: newData,
          }
        : {
            ...oldata,
            rows: newData,
          };
      this.undoRedo.doCommand(
        isGrouped
          ? DnBActions.GROUPED_SECTION_CHANGE
          : DnBActions.SECTION_CHANGE,
        {
          sectionIndex: sourceData.sectionIndex,
        },
        newSectionData,
        null
      );
      event.preventDefault();
      event.stopPropagation();
    }
  };

  undo() {
    if (this.position < 1) {
      return;
    }
    const data = this.undoRedo.undo();
    this.validatePostUndoRedo(data);
  }

  redo() {
    if (this.stack.length === this.position + 1) {
      return;
    }
    const data = this.undoRedo.redo();
    this.validatePostUndoRedo(data);
  }

  validatePostUndoRedo(data) {
    if (
      data.command &&
      [
        DnBActions.SECTION_HEADER_DATA,
        DnBActions.BATCH_SECTIONS_HEADER,
      ].indexOf(data.command) > -1
    ) {
      setTimeout(() => {
        this.navigationItems = createNavigation(
          this.undoRedo.sections,
          "",
          !this.shouldCheckFeedback
        );
        this.getPercentage();
      });
    }
    if (
      data.command &&
      [
        DnBActions.GROUPED_COLUMN_SEARCH_CHANGE,
        DnBActions.COLUMN_SEARCH_CHANGE,
        DnBActions.SECTION_HEADER_CODES_SEARCH_DATA,
      ].indexOf(data.command) > -1
    ) {
      setTimeout(() => {
        this.findComponent.startSearch();
      });
    }
    if (
      data.command &&
      data.command === DnBActions.BATCH_SECTIONS &&
      this.showFindAndReplace
    ) {
      setTimeout(() => {
        this.findComponent.startSearch();
      });
    }
  }

  canDeactivate(): Promise<boolean> {
    if (
      (this.drugCode === null && this.position === 0) ||
      !this.enableEditing
    ) {
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    } else if (this.drugCode === null && this.position > 0) {
      return this.confirmationNavigation();
    } else if (!this.comparigDataToAutosave()) {
      return this.confirmationNavigation();
    } else {
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    }
  }

  confirmationNavigation(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.confirmationService.confirm({
        message:
          "Are you sure you want to leave this page?, Changes you made may not be saved.",
        header: HeaderDialog.confirm,
        icon: IconDialog.warning,
        accept: () => {
          resolve(true);
        },
        reject: () => {
          reject();
        },
      });
    });
  }

  @HostListener("document:keydown.control.z", ["$event"]) undoKeyboard = (
    e
  ) => {
    this.undo();
    e.preventDefault();
  };

  @HostListener("document:keydown.control.y", ["$event"]) redoKeyboard = (
    e
  ) => {
    this.redo();
    e.preventDefault();
  };

  createDrugPosition() {
    return {
      isDrugName: true,
    };
  }
}
