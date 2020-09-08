import {
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
import { forkJoin, zip } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { flatMap, map, tap } from "rxjs/operators";
import { LoadingSpinnerService } from "src/app/services/spinner.service";
import { StorageService } from "src/app/services/storage.service";
import { ToastMessageService } from "src/app/services/toast-message.service";
import {
  HeaderDialog,
  IconDialog,
} from "../../models/constants/dialogConfig.constants";
import { drugVersionStatus } from "../../models/constants/drug.constants";
import { SectionCode } from "../../models/constants/sectioncode.constant";
import { storageDrug } from "../../models/constants/storage.constants";
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
import { DnbService } from "../../services/dnb.service";
import {
  aggregatorInformation,
  clearNewSection,
  convertSectionNameToID,
  createNavigation,
  versionInformation,
} from "../../utils/convertAPIToUI.utils";
import { convertIUtoAPI } from "../../utils/convertUIToAPI.utils";
import { copyCurrentToNewSection } from "../../utils/copyrow.utils";
import { backupSectionSearchData, cleanData } from "../../utils/tools.utils";
import { CopyToNew } from "../../utils/utils.index";
declare let $: any;
@Component({
  selector: "app-dnb-new-version",
  templateUrl: "./new-version.component.html",
  styleUrls: ["./new-version.component.css"],
  providers: [CopyToNew],
  encapsulation: ViewEncapsulation.None,
})
export class NewVersionComponent implements OnInit, OnDestroy {
  @ViewChild("sectionsOverlay") sectionsOverlay: OverlayPanel;
  drugNameColumn: Column;
  navigationItems: NavigationItem[];
  sections$: Observable<UISection[]>;
  sections: UISection[];
  backupSections: UISection[] = null;
  backupRedoSection: UISection[] = null;
  stickySections: Section[] = [];
  notToCopySections: any[] = [];
  isNavigationOpen: boolean = true;
  startDragItemIndex: number = 0;
  navigationSections: UISection[] = [];
  shouldShowCurrent: boolean = true;
  selectedSectionsOptions: SelectedSections[] = [];
  selectedSections: string[] = [];
  showFindAndReplace: boolean = false;
  coincidences: Coincidence[] = [];
  highlightIndex: number = 0;
  submitReviewDisable: boolean = true;
  saveDisabled: boolean = false;
  shouldShowUndo: boolean = true;
  undoCopySectionFlag: boolean = false;
  observer: IntersectionObserver;
  versionA: string = "";
  versionB: string = drugVersionStatus.Draft.description;
  drugCode: string;
  toggleLabel: string = "Show Compare";
  toggleFullLabel: string = "Show Full Screen";
  openDialog: boolean = false;
  setUpDialog = {
    header: "Submmit as:",
    container: [
      { value: "E", label: "Editorial" },
      {
        value: "L",
        label: "Logical",
      },
    ],
    buttonCancel: true,
    valueDefault: "logical",
  };
  constructor(
    private dnbService: DnbService,
    private storageService: StorageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private toastService: ToastMessageService,
    private loadingSpinnerService: LoadingSpinnerService,
    private copyToNew: CopyToNew
  ) {}

  ngOnInit() {
    this.drugCode = this.storageService.get(storageDrug.drugCode, true);
    const approvedVersion = this.storageService.get(
      storageDrug.approvedDrugVersion,
      true
    );
    const version = this.storageService.get(storageDrug.drugVersion, true);
    const approvedVersionId = approvedVersion.versionId;
    const approvedVersionStatus = approvedVersion.versionStatus;

    if (version.versionStatus === drugVersionStatus.Draft.code) {
      this.submitReviewDisable = true;
    } else {
      this.submitReviewDisable = false;
    }

    this.versionA = this.storageService.get(storageDrug.majorVersion, false);

    this.drugNameColumn = {
      value: this.storageService.get(storageDrug.drugName, false),
      isReadOnly: false,
    };

    let getSections$: Observable<any>;
    if (version.versionId === "empty") {
      getSections$ = this.dnbService.getAggregator(approvedVersionId).pipe(
        map((response) => {
          const result = response.map((section) => {
            return aggregatorInformation(section);
          });
          this.navigationSections = result;
          this.navigationItems = createNavigation(
            this.navigationSections,
            approvedVersionStatus
          );
          this.sections = result;
          this.createSelectSections();
          return result;
        })
      );
    } else {
      getSections$ = forkJoin(
        this.dnbService.getAggregator(approvedVersionId),
        this.dnbService.getAggregator(version.versionId)
      ).pipe(
        map(([sectionOne, sectionTwo]) => {
          const sectionOneUI = sectionOne.map((sectionOne) => {
            return versionInformation(sectionOne);
          });
          const sectionTwoUI = sectionTwo.map((sectionTwo) => {
            return versionInformation(sectionTwo);
          });
          const result = sectionOneUI.map((section, index) => {
            const groupedSections = [
              SectionCode.SecondaryMalignancy,
              SectionCode.DosingPatterns,
              SectionCode.CombinationTherapy,
            ];
            return {
              id: convertSectionNameToID(section.section.name),
              current: section,
              new: sectionTwoUI[index],
              hasRowHeading: false,
              grouped:
                groupedSections.findIndex(
                  (searchSection) => section.section.code === searchSection
                ) > -1,
            };
          });
          this.sections = result;
          this.navigationItems = createNavigation(result);
          return result;
        })
      );
    }

    this.sections$ = getSections$.pipe(
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
    const sectionsSorted = [...this.navigationSections];
    const draggedItem = sectionsSorted.splice(this.startDragItemIndex, 1)[0];
    sectionsSorted.splice(index, 0, draggedItem);
    this.navigationSections = sectionsSorted;
    this.navigationItems = createNavigation(this.navigationSections);
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
  }

  trackBySections(index, section) {
    return section.id;
  }

  onSwitchChange(event: { originalEvent: MouseEvent; checked: true }) {
    this.toggleLabel = !event.checked ? "Show Compare" : "Hide Compare";
  }

  onSwitchFullChange(event: { originalEvent: MouseEvent; checked: true }) {
    this.toggleFullLabel = !event.checked
      ? "Show Full Screen"
      : "Hide Full Screen";
  }

  toggleSectionCopy({
    section,
    status,
  }: {
    section: Section;
    status: boolean;
  }): void {
    const existsInArray =
      this.notToCopySections.find((o) => o.id == section.id) != undefined;
    if (status && existsInArray) {
      this.deleteItemNotToCopySections(section);
    }
    if (!status && !existsInArray) {
      this.addItemNotToCopySections(section);
    }
  }

  deleteItemNotToCopySections(section: Section) {
    var index = this.notToCopySections.indexOf(
      this.notToCopySections.find((o) => o.id == section.id)
    );
    this.notToCopySections.splice(index, 1);
  }

  addItemNotToCopySections(section: Section) {
    var Hiddedsection = {
      id: section.id,
      hidden: true,
    };
    this.notToCopySections.push(Hiddedsection);
  }

  undoStickSection(event) {
    this.stickySections.splice(event.index, 1);
  }

  confirmUndoCopyAll(): void {
    let redoUndoLabel: string = this.shouldShowUndo ? "undo" : "redo";
    this.confirmationService.confirm({
      message:
        "Are you sure you want to " +
        redoUndoLabel +
        " copy to All? You will lose all changes",
      header: HeaderDialog.confirm,
      icon: IconDialog.question,
      accept: () => {
        this.shouldShowUndo = !this.shouldShowUndo;
        if (this.shouldShowUndo) {
          this.redoCopyAll();
        } else {
          this.processUndoCopyAll();
          this.undoCopyAll();
        }
      },
      reject: () => {},
    });
  }

  undoCopyAll(): void {
    this.loadingSpinnerService.isLoading.next(true);
    setTimeout(() => {
      this.backupSections.forEach((section) => {
        const foundIndex = this.sections.findIndex(
          (allSection) => allSection.id === section.id
        );
        if (foundIndex > -1) {
          this.sections[foundIndex] = section;
        }
        section.new = {
          ...section.new,
        };
        section.current = {
          ...section.current,
        };
      });
      this.backupSections = null;
      this.undoCopySectionFlag = this.shouldShowUndo ? false : true;
      this.loadingSpinnerService.isLoading.next(false);
    });
  }

  redoCopyAll(): void {
    this.loadingSpinnerService.isLoading.next(true);
    setTimeout(() => {
      this.backupRedoSection.forEach((section) => {
        const foundIndex = this.sections.findIndex(
          (allSection) => allSection.id === section.id
        );
        if (foundIndex > -1) {
          this.sections[foundIndex] = section;
        }
        section.new = {
          ...section.new,
        };
        section.current = {
          ...section.current,
        };
      });
      this.backupRedoSection = null;
      this.undoCopySectionFlag = this.shouldShowUndo ? false : true;
      this.loadingSpinnerService.isLoading.next(false);
    });
  }

  processUndoCopyAll() {
    setTimeout(() => {
      this.backupRedoSection = this.sections.filter(
        (section) => this.selectedSections.indexOf(section.id) > -1
      );
      this.backupRedoSection = this.backupRedoSection.map((section) => {
        return {
          ...section,
          new: backupSectionSearchData(section.new, section.grouped),
          current: backupSectionSearchData(section.current, section.grouped),
        };
      });
      this.sections = this.sections.map((section) => {
        if (this.selectedSections.indexOf(section.id) === -1) {
          return section;
        }
        const copy = copyCurrentToNewSection(section, section.grouped);
        section.new = {
          ...section.new,
        };
        section.current = {
          ...section.current,
        };
        return copy;
      });
    });
  }

  copyAll(): void {
    this.sectionsOverlay.hide();
    this.loadingSpinnerService.isLoading.next(true);
    setTimeout(() => {
      this.backupSections = this.sections.filter(
        (section) => this.selectedSections.indexOf(section.id) > -1
      );
      this.backupSections = this.backupSections.map((section) => {
        return {
          ...section,
          new: backupSectionSearchData(section.new, section.grouped),
          current: backupSectionSearchData(section.current, section.grouped),
        };
      });
      this.sections = this.sections.map((section) => {
        if (this.selectedSections.indexOf(section.id) === -1) {
          return section;
        }
        const copy = copyCurrentToNewSection(section, section.grouped);
        let backUpSection = this.backupSections.find(
          (x) => x.id === section.id
        );
        if (!section.grouped) {
          let backUpSec: Row[] = (backUpSection.new as Section).rows;
          this.copyToNew.popBackupNewToCurrent(
            backUpSec,
            section.new as Section,
            section.current as Section,
            false
          );
        } else {
          let backUpSec: GroupRow[] = (backUpSection.new as GroupedSection)
            .groups;
          this.copyToNew.popBackupNewToCurrentGroup(
            backUpSec,
            section.new as GroupedSection,
            section.current as GroupedSection,
            false
          );
        }
        section.new = {
          ...section.new,
        };
        section.current = {
          ...section.current,
        };
        return copy;
      });
      this.undoCopySectionFlag = true;
      this.loadingSpinnerService.isLoading.next(false);
    });
  }

  clearAll(): void {
    this.loadingSpinnerService.isLoading.next(true);
    setTimeout(() => {
      this.sections.forEach((section) => {
        const code = section.new.section.code;
        const name = section.new.section.code;
        section.new = clearNewSection(code, name);
      });
      this.loadingSpinnerService.isLoading.next(false);
    });
  }

  openSectionSelect(event): void {
    this.sectionsOverlay.show(event);
    this.createSelectSections();
  }

  createSelectSections(): void {
    var dataShow = [];
    this.selectedSections = [];
    this.sections
      .filter((item) => {
        if (this.notToCopySections.length > 0) {
          if (this.notToCopySections.find((o) => o.id === item.id)) {
            return false;
          }
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
  }

  confirmSaveData() {
    try {
      this.confirmationService.confirm({
        message: "Are you sure you want to to save?",
        header: HeaderDialog.confirm,
        icon: IconDialog.question,
        accept: () => {
          this.saveData();
        },
        reject: () => {},
      });
    } catch (error) {}
  }

  confirmClearAll() {
    try {
      this.confirmationService.confirm({
        message: "Are you sure you want to to clear all sections?",
        header: HeaderDialog.confirm,
        icon: IconDialog.question,
        accept: () => {
          this.clearAll();
        },
        reject: () => {},
      });
    } catch (error) {}
  }

  submitReviewButton(selection: string): void {
    this.openDialog = false;
    this.confirmationService.confirm({
      message: "Do you want to continue with the Approval?",
      header: HeaderDialog.confirm,
      icon: IconDialog.question,
      accept: () => {
        this.saveData(selection);
        // this.router.navigate(["/dnb/drug-versions"]);
      },
      reject: () => {},
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
    this.observer.observe(stickytTriggerEl);
  }

  ngOnDestroy() {
    this.observer && this.observer.disconnect();
  }

  saveData(editType: string = "") {
    const calls$: any[] = [];
    let sectionConvert: Section | GroupedSection;
    // temp removed, when secondary malignancy is working this validation should be back
    // const areSectionsValid = this.validateSections();
    // if (!areSectionsValid) {
    //   return;
    // }
    this.dnbService
      .getNewDrugVersion(this.drugCode, editType)
      .subscribe((drugV: any) => {
        for (const section of this.sections) {
          sectionConvert = convertIUtoAPI(
            section.new as Section | GroupedSection,
            this.drugCode
          );
          if (sectionConvert) {
            // temporary removed
            if (
              sectionConvert.section.code !== SectionCode.SecondaryMalignancy
            ) {
              sectionConvert.drugVersionCode = drugV.drugVersionCode;
              calls$.push(
                this.dnbService.postAggregatorSection(sectionConvert)
              );
            }
          }

          zip(...calls$)
            .pipe(flatMap(() => this.dnbService.postCommitSection(drugV)))
            .subscribe(
              () => {
                this.toastService.messageSuccess(
                  "Success!",
                  `Version saved successfully.`,
                  1500,
                  true
                );
                this.submitReviewDisable = false;
                this.versionB = drugVersionStatus.InProgress.description;
              },
              (error) => {
                this.toastService.messageError(
                  "Error!",
                  "Rollback.",
                  1500,
                  true
                );
              }
            );
        }
      });
  }

  canDeactivate(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.confirmationService.confirm({
        message:
          "Are you sure you want to go back?, all the information will be lost",
        header: HeaderDialog.confirm,
        icon: IconDialog.warning,
        accept: () => {
          resolve();
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
  }

  openDialogSubmit() {
    // temp removed, when secondary malignancy is working this validation should be back
    // const areSectionsValid = this.validateSections();
    // if (!areSectionsValid) {
    //   return;
    // }
    this.openDialog = true;
  }

  validateSections(): boolean {
    let isValid = true;
    this.sections.forEach((section) => {
      if (section.new.section.code === SectionCode.SecondaryMalignancy) {
        const newSection = section.new as GroupedSection;
        isValid = newSection.groups.every((group) =>
          group.names.every((name) => cleanData(name.value) !== "")
        );
        if (!isValid) {
          this.toastService.messageError(
            "Error!",
            "Please enter a value for the ICD-10 Code and Secondary Site columns in Secondary Malignancy Section.",
            1500,
            true
          );
        }
      }
    });
    return isValid;
  }
}
