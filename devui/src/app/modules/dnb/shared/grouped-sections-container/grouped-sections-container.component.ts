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
import { behaviors } from "../../models/constants/behaviors.constants";
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
import { groupExist, isEmptyGroup } from "../../utils/tools.utils";
import { CopyToNew } from "../../utils/utils.index";
import { GroupedSectionComponent } from "../grouped-section/grouped-section.component";
import { convertIUtoAPI } from '../../utils/convertUIToAPI.utils';
import { HeaderDialog, IconDialog } from '../../models/constants/dialogConfig.constants';

@Component({
  selector: "app-dnb-grouped-sections-container",
  templateUrl: "./grouped-sections-container.component.html",
  styleUrls: ["./grouped-sections-container.component.css"],
  providers: [CopyToNew],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupedSectionsContainerComponent
  implements OnChanges, OnInit, OnDestroy {
  @ViewChild("editSection") editSection: GroupedSectionComponent;
  @Input() currentVersion: GroupedSection;
  @Input() newVersion: GroupedSection;
  @Input() hasRowHeading: boolean = false;
  @Input() isComparing: boolean = false;
  @Input() showCurrent: boolean = false;
  @Input() set enableEditing(value: boolean) {
    this.hideDisableToggle = value;
    this._enableEditing = value;
  }
  @Output() newVersionChanged: EventEmitter<
    GroupedSection
  > = new EventEmitter();
  @Output() stickySection: EventEmitter<GroupedSection> = new EventEmitter();
  @Output() toggleSectionCopy: EventEmitter<{
    section: GroupedSection;
    status: boolean;
  }> = new EventEmitter();
  hideDisableToggle: boolean = false;
  expandSection: boolean = true;
  backUpCopyRow: Row = null;
  backUpCopyRowGroup: GroupRow = null;
  backUpCopyGroup: GroupRow = null;
  backupRowGroupIndex: number = 0;
  backupGroupIndex: number = 0;
  backUpRowGroupGroupIndex: number = -1;
  lastCopyWasAdded: boolean = false;
  lastCopyGroupWasAdded: boolean = false;
  lastCopyIndex: number = 0;
  isSecondaryMalignancy: boolean = false;
  currentCodes: string = "";
  consoleCount: number = 0;
  cellChangeSubscribe: Subscription;
  sectionChangeSubscribe: Subscription;
  shouldDisableSection: boolean = false;
  _enableEditing: boolean = false;
  shouldShowUndo: boolean = true;
  constructor(
    private copyToNew: CopyToNew,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef,
    private dnbStore: DnbStoreService
  ) {}

  ngOnInit() {
    this.cellChangeSubscribe = this.dnbStore.updateCurrentColumn
      .pipe(filter((val) => val !== null))
      .subscribe(({ sectionId, compareColumn, diff }) => {
        if (this.currentVersion.section.name === sectionId) {
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
        if (this.currentVersion.section.name === sectionId) {
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
      this.currentCodes = this.isSecondaryMalignancy
        ? this.currentVersion.codes.join(", ")
        : "";
    }

    if (changes.isComparing) {
      this.resetCompare();
    }
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
            };
          }),
          rows: [
            {
              hasBorder: false,
              columns: this.newVersion.groups[0].rows[0].columns.map(() => {
                const diff: [number, string][] = [[0, ""]];
                return {
                  isReadOnly: false,
                  value: "",
                  diff,
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
    const values = copyGroupUtil(groupRow, this.newVersion.groups);

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
      this.checkSectionColumns(this.newVersion);
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
          foundGroup.names.length <= columnIndex
        ) {
          return null;
        }
        return foundGroup.names[columnIndex];
      } else {
        if (
          foundGroup.rows.length === 0 ||
          foundGroup.rows.length <= rowIndex
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
      !this.shouldDisableSection && this.expandSection;
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
      reject: () => {},
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
          :this.copyToNew.undoCopySectionGroup(this.newVersion, this.currentVersion, this.shouldShowUndo);

        this.checkSectionsDifference();
        this.newVersion = {
          ...this.newVersion,
        };

      },
      reject: () => {},
    });
  }



  consoleResponseGroup() {
    if (this.consoleCount === 2) {
      console.log(
        `${this.newVersion.section.name}`,
        convertIUtoAPI(this.newVersion)
      );
      this.consoleCount = 0;
    } else {
      this.consoleCount++;
    }
  }

  disableChange() {
    this._enableEditing = !this.shouldDisableSection;
    const removeSectionFromCopy =
      !this.shouldDisableSection && this.expandSection;
    this.toggleSectionCopy.emit({
      section: this.newVersion,
      status: removeSectionFromCopy,
    });
  }
}
