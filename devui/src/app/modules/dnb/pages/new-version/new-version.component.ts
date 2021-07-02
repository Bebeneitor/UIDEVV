import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
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
import { dnbCodes } from "../../models/constants/actionCodes.constants";
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
  SectionAutopopulationGlobal,
  SectionAutopopulationReview,
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
  Coincidence,
  Column,
  GroupedSection,
  GroupRow,
  Row,
  Section,
  SelectedSections,
  UISection,
} from "../../models/interfaces/uibase";
import { apiPath } from "../../models/path/api-path.constant";
import { DnbRoleAuthService } from "../../services/dnb-role-auth.service";
import { DnbService } from "../../services/dnb.service";
import { DnbUndoRedoService } from "../../services/undo-redo.service";
import { FindReplaceComponent } from "../../shared/find-replace/find-replace.component";
import { GroupedSectionsContainerComponent } from "../../shared/grouped-sections-container/grouped-sections-container.component";
import { SectionsContainerComponent } from "../../shared/sections-container/sections-container.component";
import {
  clearNewSection,
  convertSectionNameToID,
  createCurrentPlaceholder,
  createNavigation,
  versionInformation,
} from "../../utils/convertAPIToUI.utils";
import { convertIUtoAPI } from "../../utils/convertUIToAPI.utils";
import {
  copyCurrentToNewSection,
  copyIngestedToNew,
} from "../../utils/copyrow.utils";
import {
  clearSectionCurrentData,
  getSectionColumnData,
} from "../../utils/populate.utils";
import {
  calculatePercentage,
  cleanData,
  clearAllSectionFeedback,
  cloneSection,
  createNewRow,
  formatTime,
  getAllFeedbacks,
  getAllUnresolvedFeedbacks,
  getDrugVersionId,
  getInvalidCurrent,
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
  selector: "app-dnb-new-version",
  templateUrl: "./new-version.component.html",
  styleUrls: ["./new-version.component.css"],
  providers: [CopyToNew, AutopopulateUtils, DnbUndoRedoService],
  encapsulation: ViewEncapsulation.None,
})
export class NewVersionComponent implements OnInit, OnDestroy {
  @ViewChild("sectionsOverlay", { static: false })
  sectionsOverlay: OverlayPanel;
  @ViewChild("mi", { static: false }) drdOverlay: OverlayPanel;
  @ViewChild("find", { static: false }) findComponent: FindReplaceComponent;
  @ViewChildren(SectionsContainerComponent)
  sectionsComponent: QueryList<SectionsContainerComponent>;
  @ViewChildren(GroupedSectionsContainerComponent)
  groupedSectionsComponent: QueryList<GroupedSectionsContainerComponent>;
  dnbCodes = dnbCodes;
  navigationItems: NavigationItem[];
  sections$: Observable<UISection[]>;
  backupSections: UISection[] = null;
  stickySections: Section[] = [];
  notToCopySections: any[] = [];
  isNavigationOpen: boolean = true;
  startDragItemIndex: number = 0;
  navigationSections: UISection[] = [];
  shouldShowCurrent: boolean = false;
  selectedSectionsOptions: SelectedSections[] = [];
  selectedSections: string[] = [];
  showFindAndReplace: boolean = false;
  coincidences: Coincidence[] = [];
  highlightIndex: number = 0;
  submitReviewDisable: boolean = true;
  saveDisabled: boolean = false;
  observer: IntersectionObserver;
  versionA: string = "";
  versionB: string = drugVersionStatus.Draft.description;
  drugCode: string;
  toggleLabel: string = "Show Compare";
  toggleFullLabel: string = "Show Full Screen";
  openDialog: boolean = false;
  setUpDialog = {
    header: "Submit as:",
    container: [
      { value: "E", label: "Editorial" },
      {
        value: "L",
        label: "Logical",
      },
    ],
    buttonCancel: true,
    valueButton: "Ok",
    valueDefault: "L",
  };
  canNavigate: boolean = false;
  enableEditing: boolean = false;
  showButtons: boolean = false;
  idSectionExtalPaste: string = "";
  percentage: string = "0";
  shouldMarkSections: boolean = false;
  isApproverReviewing: boolean = false;
  isCompleteAutopopulate: boolean = false;
  feedbackComplete: boolean = false;
  shouldCheckFeedback: boolean = false;
  sectionsChildsAutopopulate = [];
  approvedVersionId: string = "";
  approvedDataFetched: boolean = false;
  validIcdCodeVersion: boolean = false;
  channel = new BroadcastChannel("PINNED_SECTIONS");
  pageLoadedChannel = new BroadcastChannel("PINNED_SECTION_LOADED");
  autosaveSubscribe: Subscription;
  rulesCode = SectionCode.Rules;
  shouldCompare: boolean = false;
  switchAutosave: boolean = true;
  labelAutosave: string = "";
  autosaveActive: boolean = false;
  sectionsBackup: UISection[];
  version = this.storageService.get(storageDrug.drugVersion, true);
  stackInfo: Subscription;
  stack: string[] = [];
  position: number = 0;
  constructor(
    private dnbService: DnbService,
    private storageService: StorageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private toastService: ToastMessageService,
    private loadingSpinnerService: LoadingSpinnerService,
    private copyToNew: CopyToNew,
    private autopopulateUtils: AutopopulateUtils,
    private cd: ChangeDetectorRef,
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
    this.sectionsChildsAutopopulate = SectionAutopopulationGlobal.concat(
      SectionsAutopopulationIndication,
      SectionAutopopulationReview
    );
    const editingMode = this.storageService.get(
      storageDrug.newVersionEditingMode,
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

    this.drugCode = this.storageService.get(storageDrug.drugCode, false);
    const approvedVersion = this.storageService.get(
      storageDrug.approvedDrugVersion,
      true
    );
    this.approvedVersionId = approvedVersion.versionId;
    const approvedVersionStatus = approvedVersion.versionStatus;

    if (this.version.versionStatus === drugVersionStatus.Draft.code) {
      this.submitReviewDisable = true;
    } else {
      this.submitReviewDisable = false;
    }

    this.versionA = this.storageService.get(storageDrug.majorVersion, false);

    this.undoRedo.drugNameColumn = {
      value: this.storageService.get(storageDrug.drugName, false),
      isReadOnly: false,
      feedbackData: [],
      feedbackLeft: 0,
    };
    this.sections$ = this.getDrugData(
      this.version.versionId === "empty" ? null : this.version.versionId
    ).pipe(
      map((sections) => {
        const result = sections.map((section) => {
          let headersUIWidth = getVersionColumnData(
            this.version.versionId === "empty" ? "" : this.version.versionId,
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
            current: createCurrentPlaceholder(section, grouped),
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
          approvedVersionStatus,
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
            start: (event, ui) => {
              this.startDragItemIndex = ui.item.index();
            },
            stop: (event, ui) => this.sortNavigationItems(event, ui),
          });
        });
      })
    );
  }

  sortNavigationItems(event, ui): void {
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
    this.createSelectSections();
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

  trackBySections(index, section) {
    return section.id;
  }

  onSwitchChange(event: { originalEvent: MouseEvent; checked: boolean }) {
    this.toggleLabel = !event.checked ? "Show Compare" : "Hide Compare";
  }

  onCurrentChange(
    checkCurrent: boolean = false,
    sectionCode: SectionCode = null
  ) {
    if (this.approvedDataFetched) {
      this.loadingSpinnerService.isLoading.next(true);
      setTimeout(() => {
        this.shouldShowCurrent = !this.shouldShowCurrent;
        this.loadingSpinnerService.isLoading.next(false);
      });
    } else {
      this.dnbService
        .getAggregator(this.approvedVersionId)
        .pipe(
          map((response) => {
            const result = response.map((section) =>
              versionInformation(section)
            );
            this.undoRedo.sections = this.undoRedo.sections.map((section) => {
              const current = result.find(
                (item) => item.section.code === section.new.section.code
              );
              const currentHeadersUIWidth = getVersionColumnData(
                this.version.versionId,
                current,
                true,
                this.storageService
              );
              return {
                ...section,
                current: {
                  ...current,
                  headersUIWidth: currentHeadersUIWidth,
                },
              };
            });
            let versionCode = drugVersionStatus.Approved.code;
            let versionStatusDescription =
              drugVersionStatus.Approved.description;
            this.storageService.set(
              storageDrug.drugVersion,
              { versionCode, versionStatusDescription },
              true
            );
            this.validIcdCodes(null);
            if (checkCurrent && sectionCode !== null) {
              this.checkCurrentCodes(sectionCode);
            }
          })
        )
        .subscribe(() => {
          this.approvedDataFetched = true;
          this.shouldShowCurrent = !this.shouldShowCurrent;
        });
    }
  }

  onSwitchFullChange(event: { originalEvent: MouseEvent; checked: boolean }) {
    this.toggleFullLabel = !event.checked
      ? "Show Full Screen"
      : "Hide Full Screen";
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
    const existsInArray =
      this.notToCopySections.find((o) => o.id == section.id) != undefined;
    if (status && existsInArray) {
      this.deleteItemNotToCopySections(section);
    }
    if (!status && !existsInArray) {
      this.addItemNotToCopySections(section);
    }
  }

  deleteItemNotToCopySections(section: Section | GroupedSection) {
    var index = this.notToCopySections.indexOf(
      this.notToCopySections.find((o) => o.id == section.id)
    );
    this.notToCopySections.splice(index, 1);
  }

  addItemNotToCopySections(section: Section | GroupedSection) {
    var Hiddedsection = {
      id: section.id,
      hidden: true,
    };
    this.notToCopySections.push(Hiddedsection);
  }

  undoStickSection(event) {
    this.stickySections.splice(event.index, 1);
  }

  copyAll(): void {
    let sectionsCode = [];
    const newData = this.undoRedo.sections
      .filter((section) => this.selectedSections.indexOf(section.id) > -1)
      .map((section) => {
        let newSection;
        sectionsCode.push(section.new.section.code);
        let backUpSectionRows = [];
        if (section.grouped) {
          backUpSectionRows = this.copyToNew.dataNewVersionGroup(
            section.current as GroupedSection
          );
          newSection = cloneSection(section.new, true) as GroupedSection;
          this.copyToNew.popBackupNewToCurrentGroup(
            backUpSectionRows,
            newSection as GroupedSection,
            section.current as GroupedSection,
            false
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
          newSection = copyCurrentToNewSection(
            section,
            cloned,
            section.grouped
          );
          this.copyToNew.popBackupNewToCurrent(
            backUpSectionRows,
            newSection as Section,
            section.current as Section,
            false
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

  openSectionSelect(event): void {
    this.sectionsOverlay.show(event);
    this.createSelectSections();
  }

  createSelectSections(): void {
    var dataShow = [];
    this.selectedSections = [];
    this.undoRedo.sections
      .filter((item) => {
        if (this.notToCopySections.length > 0) {
          if (this.notToCopySections.find((o) => o.id === item.id)) {
            return false;
          }
        }
        if (item.new.section.code === SectionCode.Rules) {
          return false;
        }
        if (item.grouped) {
          return (item.current as GroupedSection).groups.length > 0;
        }
        return (item.current as Section).rows.length > 0;
      })
      .map((item) => {
        var info = {
          label: item.current.section.name,
          value: item.id,
        };
        dataShow.push(info);
      });
    this.selectedSectionsOptions = dataShow;
    this.selectedSectionsOptions = this.selectedSectionsOptions.filter(
      (item) => !this.sectionsChildsAutopopulate.includes(item.value)
    );
  }

  confirmSaveData() {
    this.confirmationService.confirm({
      message: "Are you sure you want to save?",
      header: HeaderDialog.confirm,
      icon: IconDialog.question,
      accept: () => {
        this.saveData();
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

  submitReviewButton(selection: string): void {
    this.openDialog = false;
    this.confirmationService.confirm({
      message: "Do you want to continue with the Approval?",
      header: HeaderDialog.confirm,
      icon: IconDialog.question,
      accept: () => {
        if (
          this.roleAuthService.isAuthorizedRole("ROLE_DNBE") &&
          selection === "E"
        ) {
          this.undoRedo.sections = removeAllComments(this.undoRedo.sections);
          this.approveData(selection, true);
        } else if (
          this.roleAuthService.isAuthorizedRole("ROLE_DNBE") &&
          selection === "L"
        ) {
          this.submitData(selection, true);
        }
      },
    });
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

  ngOnDestroy() {
    this.observer && this.observer.disconnect();
    if (this.autosaveSubscribe !== undefined) {
      this.autosaveSubscribe && this.autosaveSubscribe.unsubscribe();
    }
    if (this.stackInfo !== undefined) {
      this.stackInfo && this.stackInfo.unsubscribe();
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
              if (
                !this.storageService.exists(storageGeneral.isAutosaveActive)
              ) {
                this.toastService.messageSuccess(
                  "Success!",
                  `Version saved successfully.`,
                  6000,
                  true
                );
              } else {
                this.storageService.remove(storageGeneral.isAutosaveActive);
              }
              this.submitReviewDisable = false;
              this.saveDisabled = false;
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
                this.canNavigate = true;
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
                !this.shouldShowCurrent,
                this.storageService
              );
              this.version.versionId = versionId;
              this.undoRedo.sections = this.undoRedo.sections;
            },
            () => {
              this.toastService.messageError("Error!", "Rollback.", 6000, true);
            }
          );
      });
  }

  approveData(editType: string = "", majorVersion: boolean = false) {
    const calls$: any[] = [];
    let sectionConvert: Section | GroupedSection;
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
              this.dnbService
                .postApproveSection({ drugVersionCode: result.drugVersionCode })
                .subscribe((resultApprove) => {
                  this.toastService.messageSuccess(
                    "Success!",
                    `Version approved successfully.`,
                    6000,
                    true
                  );

                  if (
                    resultApprove.details &&
                    resultApprove.details.length > 0
                  ) {
                    this.toastService.messageWarning(
                      "Warning!",
                      resultApprove.details,
                      6000,
                      true
                    );
                  }

                  this.submitReviewDisable = false;
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
                    this.canNavigate = true;
                    this.router.navigate([DnBRoutes.drugVersions]);
                  }
                });
            },
            (error) => {
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
            (result) => {
              this.dnbService
                .postSubmitForReview(this.drugCode)
                .subscribe((result) => {
                  this.toastService.messageSuccess(
                    "Success!",
                    `Version submitted successfully.`,
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

                  this.undoRedo.sections = this.undoRedo.sections;
                  if (majorVersion) {
                    this.canNavigate = true;
                    this.router.navigate([DnBRoutes.drugsInApprovalProcess]);
                  }
                });
            },
            (error) => {
              this.toastService.messageError("Error!", "Rollback.", 6000, true);
            }
          );
      });
  }

  returnData() {
    this.dnbService.postReturnSection(this.drugCode).subscribe(
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

        this.canNavigate = true;
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

          this.canNavigate = true;
          this.router.navigate([DnBRoutes.drugVersions]);
        },
        (error) => {
          this.toastService.messageError("Error!", "Rollback.", 6000, true);
        }
      );
  }

  canDeactivate(): Promise<boolean> {
    if (!this.canNavigate) {
      if (!this.enableEditing) {
        return new Promise((resolve, reject) => {
          resolve(true);
        });
      } else if (!this.comparigDataToAutosave()) {
        return this.confirmationNavigation();
      } else {
        return new Promise((resolve, reject) => {
          resolve(true);
        });
      }
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
    this.getPercentage();
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
    const approvedVersion = this.storageService.get(
      storageDrug.approvedDrugVersion,
      true
    );
    const approvedVersionStatus = approvedVersion.versionStatus;
    setTimeout(() => {
      this.navigationItems = createNavigation(
        this.undoRedo.sections,
        approvedVersionStatus,
        !this.shouldCheckFeedback
      );
      this.getPercentage();
    });
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
          this.openDialog = true;
        },
      });
    } else {
      this.openDialog = true;
    }
  }

  checkPercentage() {
    this.shouldMarkSections =
      this.undoRedo.sections.filter(
        (val) => !val.new.completed && val.new.enabled
      ).length === 0;
  }

  sectionNavigateEvt(
    focusType: { type: string; isTabAction: boolean },
    index: number
  ): void {
    this.undoRedo.sections[index].new.focusType = null;
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
    if (event.activeSection === SectionCode.DiagnosisCodeOverlaps) {
      this.autopopulateForOverlaps();
      return;
    }
    if (
      event.activeSection === SectionCode.GlobalReviewCodes ||
      event.activeSection === SectionCode.GlobalReviewIndications
    ) {
      this.getCurrentData(event.activeSection);
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
      if (event.activeSection === SectionCode.DiagnosisCodes) {
        this.sectionsComponent.forEach((item) => {
          if (
            SectionsAutopopulationIndication.indexOf(item.newVersion.id) > -1 ||
            item.newVersion.section.code === SectionCode.GlobalReviewIndications
          ) {
            item.checkSectionsDifference();
          }
        });
        this.groupedSectionsComponent.forEach((item) => {
          if (item.newVersion.section.code === SectionCode.DosingPatterns) {
            item.checkSectionsDifference();
          }
        });
      }
      if (event.activeSection === SectionCode.DiagnosticCodeSummary) {
        this.sectionsComponent.forEach((item) => {
          if (item.newVersion.section.code === SectionCode.GlobalReviewCodes) {
            item.checkSectionsDifference();
          }
        });
      }
      this.undoRedo.sections.forEach((section) => {
        section.new = {
          ...section.new,
        };
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
      const approvedVersion = this.storageService.get(
        storageDrug.approvedDrugVersion,
        true
      );
      const approvedVersionStatus = approvedVersion.versionStatus;
      const clearSections = clearAllSectionFeedback(this.undoRedo.sections);
      this.navigationSections = clearSections;
      this.feedbackComplete = false;
      this.shouldCheckFeedback = false;
      this.navigationItems = createNavigation(
        this.navigationSections,
        approvedVersionStatus,
        !this.shouldCheckFeedback
      );
      this.undoRedo.sections = clearSections;
    });
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

  getDrugData(versionId: string): Observable<(Section | GroupedSection)[]> {
    let sections: (Section | GroupedSection)[];
    if (versionId) {
      return this.dnbService
        .getAggregator(versionId)
        .pipe(
          map((section) =>
            section.map((sectionOne) => versionInformation(sectionOne))
          )
        );
    } else {
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
      let data = getInvalidCurrent(this.undoRedo.sections);
      if (event === null && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].codesInvalid.length > 0) {
            this.massageInvalidCodes(
              dataVersion,
              version,
              data[i].codesInvalid,
              data[i].sectionCode
            );
          }
        }
        this.validIcdCodeVersion = !this.validIcdCodeVersion;
      } else if (event !== null) {
        if (event.codesInvalid.length > 0) {
          this.massageInvalidCodes(
            dataVersion,
            version,
            event.codesInvalid,
            event.sectionCode
          );
        }
      }
    }
  }

  massageInvalidCodes(dataVersion, version, codesInvalid, section) {
    this.toastService.messageWarning(
      "Warning!",
      `The next Code(s) in the ICD-10 Manual for ${
        getDrugVersionId(dataVersion) === undefined
          ? version.versionStatusDescription
          : getDrugVersionId(dataVersion)
      } ${this.storageService
        .get(storageDrug.drugDate, false)
        .substr(6, 4)} were not found to sort it: ` +
        codesInvalid.join(", ") +
        ` in the ` +
        section +
        ".",
      6000,
      true
    );
  }

  isAutosavingActive(event: { checked: boolean }) {
    if (
      this.drugCode !== null &&
      this.undoRedo.drugNameColumn.value &&
      this.enableEditing &&
      (this.version.versionStatus === drugVersionStatus.Draft.code ||
        this.version.versionStatus === drugVersionStatus.InProgress.code)
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

  getCurrentData(sectionCode: SectionCode) {
    if (!this.approvedDataFetched) {
      this.onCurrentChange(true, sectionCode);
    } else {
      this.loadingSpinnerService.isLoading.next(true);
      setTimeout(() => {
        this.shouldShowCurrent = true;
        this.checkCurrentCodes(sectionCode);
        this.loadingSpinnerService.isLoading.next(false);
      });
    }
  }

  checkCurrentCodes(sectionCode: SectionCode) {
    const headerName =
      sectionCode === SectionCode.GlobalReviewCodes
        ? "Global review ICD 10 codes"
        : "Global review indication";
    const cleanHeader =
      sectionCode === SectionCode.GlobalReviewCodes
        ? "Current ICD 10 codes"
        : "Current indication";
    const section = this.undoRedo.sections.find(
      (x) => x.new.section.code === sectionCode
    );
    let currentData: Column[] = getSectionColumnData(
      section.current,
      section.grouped,
      headerName
    ).filter((col) => cleanData(col.value).trim() !== "");
    let newData: Column[] = getSectionColumnData(
      section.new,
      section.grouped,
      headerName
    );
    if (!currentData.some((col) => cleanData(col.value) !== "")) {
      this.toastService.messageWarning(
        "Warning!",
        `No information was found to Autopopulate.`,
        6000,
        true
      );
      return;
    }
    const sectionMsj =
      sectionCode === SectionCode.GlobalReviewCodes
        ? "ICD-10 Codes"
        : "Indications";
    if (!newData.some((col) => cleanData(col.value) !== "")) {
      this.toastService.messageWarning(
        "Warning!",
        `No information was found to compare the Current ${sectionMsj}, please auto-populate the Global Review ${sectionMsj} column first and try again.`,
        6000,
        true
      );
      return;
    }
    const data = clearSectionCurrentData(
      section.new,
      section.grouped,
      cleanHeader
    );
    if (section.grouped) {
      (section.new as GroupedSection).groups = data as GroupRow[];
    } else {
      (section.new as Section).rows = data as Row[];
    }
    let startPosition = 0;
    currentData.forEach((column) => {
      const currentCode = cleanData(column.value);
      newData = getSectionColumnData(section.new, section.grouped, headerName);
      const foundIndx = newData.findIndex(
        (x) =>
          cleanData(x.value).trim().toLowerCase() ===
          currentCode.trim().toLowerCase()
      );
      startPosition = foundIndx >= 0 ? foundIndx : startPosition;
      if (foundIndx >= 0) {
        (section.new as Section).rows[startPosition].columns[0] = {
          ...(section.new as Section).rows[startPosition].columns[0],
          value: currentCode,
        };
        startPosition = startPosition + 1;
      } else {
        const newRow = createNewRow((section.new as Section).rows);
        newRow.columns[0].value = currentCode;
        (section.new as Section).rows.splice(
          startPosition <= newData.length ? startPosition : newData.length,
          0,
          newRow
        );
        if (startPosition <= newData.length) {
          startPosition = startPosition + 1;
        }
      }
    });
    section.new = {
      ...section.new,
    };
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
}
