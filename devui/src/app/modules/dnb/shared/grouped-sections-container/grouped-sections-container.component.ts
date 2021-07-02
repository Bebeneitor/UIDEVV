import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
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
import { filter } from "rxjs/operators";
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
  ParentSections,
  SectionAutopopulationGlobal,
  SectionsAutopopulationIndication,
} from "../../models/constants/sectionAutopopulation.constants";
import { SectionCode } from "../../models/constants/sectioncode.constant";
import {
  Column,
  GroupedSection,
  GroupRow,
  Row,
} from "../../models/interfaces/uibase";
import { DnbStoreService } from "../../services/dnb-store.service";
import {
  copyGroupUtil,
  copyRowUtil,
  undoCopyGroupUtil,
  undoCopyRowUtil,
} from "../../utils/copyrow.utils";
import {
  getSectionFeedbacks,
  getSectionUnresolvedFeedbacksCount,
  groupExist,
  guidGenerator,
  isEmptyGroup,
} from "../../utils/tools.utils";
import { CopyToNew } from "../../utils/utils.index";
import { GroupedSectionComponent } from "../grouped-section/grouped-section.component";

@Component({
  selector: "app-dnb-grouped-sections-container",
  templateUrl: "./grouped-sections-container.component.html",
  styleUrls: ["./grouped-sections-container.component.css"],
  providers: [CopyToNew],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupedSectionsContainerComponent
  implements OnChanges, OnInit, OnDestroy {
  @ViewChild("editSection",{static: false}) editSection: GroupedSectionComponent;
  @Input() currentVersion: GroupedSection;
  @Input() newVersion: GroupedSection;
  @Input() isApproverReviewing: boolean = false;
  @Input() feedbackComplete: boolean = false;
  @Input() hasRowHeading: boolean = false;
  @Input() isComparing: boolean = false;
  @Input() showCurrent: boolean = false;
  @Input() enableEditing: boolean = true;
  @Input() focusType: { type: string; isTabAction?: boolean } = null;
  @Input() sectionIndex: number;

  @Output()
  newVersionChanged: EventEmitter<GroupedSection> = new EventEmitter();
  @Output() stickySection: EventEmitter<GroupedSection> = new EventEmitter();
  @Output() toggleSectionCopy: EventEmitter<{
    section: GroupedSection;
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
  @Output() feedbackUpdate = new EventEmitter<number>();
  @Output() dataPopulateSections: EventEmitter<{
    dataCopy: Row[] | GroupRow[];
    activeSection: string;
  }> = new EventEmitter();
  dnbCodes = dnbCodes;
  hideDisableToggle: boolean = this.enableEditing;
  expandSection: boolean = true;
  backUpCopyRow: Row = null;
  backUpCopyRowGroup: GroupRow = null;
  backUpCopyGroup: GroupRow = null;
  backUpSection: GroupedSection;
  backupRowGroupIndex: number = 0;
  backupGroupIndex: number = 0;
  backUpRowGroupGroupIndex: number = -1;
  lastCopyWasAdded: boolean = false;
  lastCopyGroupWasAdded: boolean = false;
  lastCopyIndex: number = 0;
  isSecondaryMalignancy: boolean = false;
  isDailyMaxUnits: boolean = false;
  currentCodes: string = "";
  cellChangeSubscribe: Subscription;
  sectionChangeSubscribe: Subscription;
  shouldEnableSection: boolean = true;
  _enableEditing: boolean = this.enableEditing;
  shouldShowUndo: boolean = true;
  newSectionUnsolvedFeedbackCount: number = 0;
  newSectionFeedbackCount: number = 0;
  backUpSectionRowsGrouped: GroupRow[] = [];
  sectionsChildsAutopopulate = [];
  sectionsAutopopulate = ParentSections;
  autopopulateTooltipLabel: string = "";
  constructor(
    private copyToNew: CopyToNew,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef,
    private dnbStore: DnbStoreService
  ) {}

  ngOnInit() {
    this.sectionsChildsAutopopulate = SectionAutopopulationGlobal.concat(
      SectionsAutopopulationIndication
    );
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
          this.currentVersion.groups.forEach((group) => {
            group.names.forEach((col) => {
              if (col.compareColumn === null) {
                col.diff = [[-1, col.value]];
              }
            });
            group.rows.forEach((row) => {
              row.columns.forEach((col) => {
                if (col.compareColumn === null) {
                  col.diff = [[-1, col.value]];
                }
              });
            });
          });

          this.currentVersion = {
            ...this.currentVersion,
            groups: this.currentVersion.groups.map((group) => {
              return {
                ...group,
                rows: group.rows.map((row) => {
                  return {
                    ...row,
                  };
                }),
              };
            }),
          };
        }
      });
  }

  ngOnDestroy() {
    this.cellChangeSubscribe && this.cellChangeSubscribe.unsubscribe();
    this.sectionChangeSubscribe && this.sectionChangeSubscribe.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.newVersion) {
      this.isSecondaryMalignancy =
        this.newVersion.section.code === SectionCode.SecondaryMalignancy;
      this.isDailyMaxUnits =
        this.newVersion.section.code === SectionCode.DailyMaxUnits;
      this.copyToNew.isDailyMaxUnits = this.isDailyMaxUnits;
      this.copyToNew.isSecondaryMalignancy = this.isSecondaryMalignancy;
      this.currentCodes = this.isSecondaryMalignancy
        ? this.currentVersion.codes.join(", ")
        : this.isDailyMaxUnits
        ? this.currentVersion.codes.join(", ")
        : "";

      if (
        !this.isApproverReviewing ||
        (this.isApproverReviewing && this.feedbackComplete)
      ) {
        this.getNewVersionFeedbackLeft();
      }
    }

    if (changes.isComparing) {
      this.resetCompare();
    }
    if (changes.focusType) {
      if (
        (this.isSecondaryMalignancy || this.isDailyMaxUnits) &&
        this.focusType &&
        this.focusType.type === arrowNavigation.down
      ) {
        this.newVersion.codesColumn.focus = {
          hasFocus: true,
          isTabAction: this.focusType.isTabAction,
        };
        this.focusType = null;
      }
    }
  }

  autopopulate() {
    this.autopopulateOverlapsSection();
  }

  autopopulateOverlapsSection() {
    this.confirmationService.confirm({
      message:
        "This action will feed and replace All the Section data. Do you want to continue?",
      header: HeaderDialog.confirm,
      icon: IconDialog.question,
      accept: () => {
        this.dataPopulateSections.emit({
          dataCopy: null,
          activeSection: this.newVersion.section.code,
        });
      },
    });
  }

  behavior(event): void {
    switch (event.behavior) {
      case behaviors.copyRowGroup:
        this.copyRowGroup(event.row, event.groupIndex);
        this.checkSectionsDifference();
        break;
      case behaviors.undoCopyRowGroup:
        this.undoCopyRowGroup();
        this.checkSectionsDifference();
        break;
      case behaviors.copyGroup:
        this.copyGroup(event.groupRow, event.groupIndex);
        this.checkSectionsDifference();
        break;
      case behaviors.undoCopyGroup:
        this.undoCopyGroup();
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

  copyRowGroup(row: Row, groupIndex: number): void {
    let groupExistingIndex: number = -1;
    let values: any = null;
    let groupIndexBlank: number = -1;
    this.lastCopyGroupWasAdded = false;
    groupExistingIndex = groupExist(
      this.currentVersion.groups[groupIndex],
      this.newVersion.groups
    );

    if (groupExistingIndex > -1) {
      values = copyRowUtil(
        row,
        this.newVersion.groups[groupExistingIndex].rows
      );
    } else {
      groupIndexBlank = isEmptyGroup(this.newVersion.groups);
      if (groupIndexBlank === -1) {
        const newGroup: GroupRow = {
          names: this.newVersion.groups[0].names.map(() => {
            const diff: [number, string][] = [[0, ""]];
            return {
              isReadOnly: false,
              value: "",
              diff,
              feedbackData: [],
              feedbackLeft: 0,
            };
          }),
          codeGroupUI: guidGenerator(),
          rows: [
            {
              hasBorder: false,
              codeUI: guidGenerator(),
              columns: this.newVersion.groups[0].rows[0].columns.map(() => {
                const diff: [number, string][] = [[0, ""]];
                return {
                  isReadOnly: false,
                  value: "",
                  diff,
                  feedbackData: [],
                  feedbackLeft: 0,
                };
              }),
            },
          ],
        };
        groupIndexBlank = this.newVersion.groups.push(newGroup) - 1;
        values = copyRowUtil(row, this.newVersion.groups[groupIndexBlank].rows);
        values.lastCopyGroupWasAdded = true;
        this.lastCopyGroupWasAdded = true;
        values.groupIndex = groupIndexBlank;
        this.backupGroupIndex = values.groupIndex;
        values.lastCopyIndex = true;
        this.backUpCopyGroup = values.backUpCopyGroup;
      } else {
        this.backUpCopyRowGroup = JSON.parse(
          JSON.stringify(this.newVersion.groups[groupIndexBlank])
        );
        values = copyRowUtil(row, this.newVersion.groups[groupIndexBlank].rows);
      }
      const names = this.currentVersion.groups[groupIndex].names.map(
        (column) => {
          return {
            ...column,
            isReadOnly: false,
          };
        }
      );
      this.newVersion.groups[groupIndexBlank].names = names;
      this.backUpRowGroupGroupIndex = groupIndexBlank;
    }
    this.backupRowGroupIndex = groupIndex;
    this.lastCopyIndex = values.lastCopyIndex;
    this.lastCopyWasAdded = values.lastCopyWasAdded;
    this.backUpCopyRow = values.backUpCopyRow;

    this.newVersion = {
      ...this.newVersion,
    };
  }

  undoCopyRowGroup(): void {
    if (this.lastCopyGroupWasAdded) {
      undoCopyGroupUtil(
        this.newVersion.groups,
        this.backUpCopyGroup,
        this.lastCopyGroupWasAdded,
        this.backupGroupIndex
      );
      this.backUpCopyGroup = null;
    } else if (this.backUpRowGroupGroupIndex >= 0 && !this.lastCopyWasAdded) {
      undoCopyGroupUtil(
        this.newVersion.groups,
        this.backUpCopyRowGroup,
        false,
        this.backUpRowGroupGroupIndex
      );
    } else {
      undoCopyRowUtil(
        this.newVersion.groups[this.backupRowGroupIndex].rows,
        this.lastCopyIndex,
        this.lastCopyWasAdded,
        this.backUpCopyRow
      );
    }
    this.backUpCopyRow = null;
    this.backUpRowGroupGroupIndex = -1;

    this.newVersion = {
      ...this.newVersion,
    };
  }

  copyGroup(groupRow: GroupRow, groupIndex: number) {
    const values = copyGroupUtil(groupRow, this.newVersion);

    this.backUpCopyGroup = values.backUpCopyGroup;
    this.lastCopyGroupWasAdded = values.lastCopyGroupWasAdded;
    this.backupGroupIndex = values.groupIndex;

    this.newVersion = {
      ...this.newVersion,
    };
  }

  undoCopyGroup() {
    undoCopyGroupUtil(
      this.newVersion.groups,
      this.backUpCopyGroup,
      this.lastCopyGroupWasAdded,
      this.backupGroupIndex
    );
    this.backUpCopyGroup = null;

    this.newVersion = {
      ...this.newVersion,
    };
  }

  resetCompare(): void {
    if (this.isComparing) {
      this.currentVersion.groups.forEach((group) => {
        group.names.forEach((header) => {
          (header as any).compared = false;
        });
        group.rows.forEach((row) => {
          row.columns.forEach((column) => {
            (column as any).compared = false;
          });
        });
      });
      this.checkSectionColumns(this.newVersion);
      this.currentVersion.groups.forEach((group) => {
        group.names.forEach((header) => {
          header.compareColumn = null;
          if ((header as any).compared === false) {
            header.diff = [[-1, header.value]];
          }
        });
        group.rows.forEach((row) => {
          row.columns.forEach((column) => {
            column.compareColumn = null;
            if ((column as any).compared === false) {
              column.diff = [[-1, column.value]];
            }
          });
        });
      });
    } else {
      this.setSectionColumns(this.currentVersion);
      this.setSectionColumns(this.newVersion);
    }
  }

  setSectionColumns(section: GroupedSection, value: number = 0): void {
    section.groups.forEach((group) => {
      group.names.forEach((column) => {
        column.compareColumn = null;
        column.diff = [[value, column.value]];
      });
      group.rows.forEach((row) => {
        row.columns.forEach((column) => {
          column.compareColumn = null;
          column.diff = [[value, column.value]];
        });
      });
    });
  }

  checkSectionColumns(section: GroupedSection): void {
    section.groups.forEach((group, groupIndex) => {
      group.names.forEach((header, headerIndex) => {
        this.checkColumnChange(header, headerIndex, 0, groupIndex, true);
      });
      group.rows.forEach((row, rowIndex) => {
        row.columns.forEach((column, columnIndex) => {
          this.checkColumnChange(column, columnIndex, rowIndex, groupIndex);
        });
      });
    });
  }

  checkColumnChange(
    column: Column,
    columnIndex: number,
    rowIndex: number,
    groupIndex: number,
    isHeader: boolean = false
  ): void {
    if (this.isComparing) {
      const originalCell = this.getOrignalCell(
        columnIndex,
        rowIndex,
        groupIndex,
        isHeader
      );
      if (originalCell == null) {
        column.compareColumn = null;
      } else {
        (originalCell as any).compared = true;
        column.compareColumn = originalCell;
        column.compareColumn.compareColumn = column;
      }
    }
  }

  getGroupName(section: GroupedSection, groupIndex: number): string {
    return section.groups[groupIndex].names
      .map((name) => name.value)
      .reduce((acc, current) => acc + current);
  }

  getOrignalCell(
    columnIndex: number,
    rowIndex: number,
    groupIndex: number,
    isHeader: boolean = false
  ): Column {
    const groupRowName = this.getGroupName(this.newVersion, groupIndex);
    const foundGroup = this.currentVersion.groups.find(
      (_, groupIndex) =>
        this.getGroupName(this.currentVersion, groupIndex) === groupRowName
    );
    if (foundGroup) {
      if (isHeader) {
        if (
          foundGroup.names.length === 0 ||
          foundGroup.names[columnIndex] === undefined
        ) {
          return null;
        }
        return foundGroup.names[columnIndex];
      } else {
        if (
          foundGroup.rows.length === 0 ||
          foundGroup.rows[rowIndex] === undefined
        ) {
          return null;
        }
        return foundGroup.rows[rowIndex].columns[columnIndex];
      }
    }
    return null;
  }

  updateCompareSection(): void {
    this.editSection.updateCompareColumns();
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

  confirmCopySectionGroup() {
    this.confirmationService.confirm({
      message: "Are you sure you want to copy",
      header: "Confirm Copy",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.copyToNew.copySectionGroup(this.newVersion, this.currentVersion);
        this.newVersion = {
          ...this.newVersion,
        };
        this.checkSectionsDifference();
        this.cd.detectChanges();
      },
    });
  }

  confirmUndoCopySectionGroup(): void {
    let redoUndoLabel: string = this.shouldShowUndo ? "undo" : "redo";
    this.confirmationService.confirm({
      message:
        "Are you sure you want to " +
        redoUndoLabel +
        " copy to new? You will lose all changes",
      header: HeaderDialog.confirm,
      icon: IconDialog.question,
      accept: () => {
        this.shouldShowUndo = !this.shouldShowUndo;
        this.shouldShowUndo
          ? this.copyToNew.redoCopySectionGroup(
              this.newVersion,
              this.currentVersion,
              this.shouldShowUndo
            )
          : this.copyToNew.undoCopySectionGroup(
              this.newVersion,
              this.currentVersion,
              this.shouldShowUndo
            );

        this.newVersion = {
          ...this.newVersion,
        };
        this.checkSectionsDifference();
        this.cd.detectChanges();
      },
    });
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
    if (
      (this.isSecondaryMalignancy || this.isDailyMaxUnits) &&
      type === arrowNavigation.up
    ) {
      this.newVersion.codesColumn.focus = { hasFocus: true, isTabAction };
    } else {
      this.sectionNavigate.emit({ type, isTabAction });
    }
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

  openSectionFeedback(section: GroupedSectionComponent) {
    section.openSectionFeedbacks();
  }

  getNewVersionFeedbackLeft() {
    this.newSectionUnsolvedFeedbackCount = getSectionUnresolvedFeedbacksCount(
      this.newVersion,
      true
    );
    this.newSectionFeedbackCount = getSectionFeedbacks(
      this.newVersion,
      true
    ).length;
    if (this.newSectionFeedbackCount === 0) {
      this.newSectionUnsolvedFeedbackCount = null;
    }
  }

  createSectionCodesPosition() {
    {
      return {
        sectionIndex: this.sectionIndex,
        isSectionCodes: true,
      };
    }
  }
}
