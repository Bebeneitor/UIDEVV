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
import { filter } from "rxjs/internal/operators/filter";
import { StorageService } from "src/app/services/storage.service";
import { behaviors } from "../../models/constants/behaviors.constants";
import {
  HeaderDialog,
  IconDialog,
} from "../../models/constants/dialogConfig.constants";
import { SectionCode } from "../../models/constants/sectioncode.constant";
import { storageDrug } from "../../models/constants/storage.constants";
import { Column, Row, Section } from "../../models/interfaces/uibase";
import { DnbStoreService } from "../../services/dnb-store.service";
import { convertIUtoAPI } from "../../utils/convertUIToAPI.utils";
import { copyRowUtil, undoCopyRowUtil } from "../../utils/copyrow.utils";
import { CopyToNew } from "../../utils/utils.index";
import { SectionComponent } from "../section/section.component";

@Component({
  selector: "app-dnb-sections-container",
  templateUrl: "./sections-container.component.html",
  styleUrls: ["./sections-container.component.css"],
  providers: [CopyToNew],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionsContainerComponent
  implements OnChanges, OnInit, OnDestroy {
  @ViewChild("editSection") editSection: SectionComponent;
  @Input() currentVersion: Section;
  @Input() newVersion: Section;
  @Input() isComparing: boolean = false;
  @Input() showCurrent: boolean = false;
  @Input() hasRowHeading: boolean = false;
  @Input() set enableEditing(value: boolean) {
    this.hideDisableToggle = value;
    this._enableEditing = value;
  }
  @Output() newVersionChanged: EventEmitter<Section> = new EventEmitter();
  @Output() stickySection: EventEmitter<Section> = new EventEmitter();
  @Output() toggleSectionCopy: EventEmitter<{
    section: Section;
    status: boolean;
  }> = new EventEmitter();
  hideDisableToggle: boolean = false;
  undoCopySectionFlag: boolean = false;
  undoCopyRowFlag: boolean = false;
  backUpSectionRows: Row[] = [];
  backUpCopyRow: Row = null;
  lastCopyWasAdded: boolean = false;
  lastCopyIndex: number = 0;
  expandSection: boolean = true;
  isDailyMaxUnits: boolean = false;
  currentCodes: string = "";
  consoleCount: number = 0;
  drugCode: string = "";
  cellChangeSubscribe: Subscription;
  sectionChangeSubscribe: Subscription;
  shouldDisableSection: boolean = false;
  _enableEditing: boolean = false;
  shouldShowUndo: boolean = true;
  constructor(
    private copyToNew: CopyToNew,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef,
    private dnbStore: DnbStoreService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.drugCode = this.storageService.get(storageDrug.drugCode, true);
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

  ngOnDestroy() {
    this.cellChangeSubscribe && this.cellChangeSubscribe.unsubscribe();
    this.sectionChangeSubscribe && this.sectionChangeSubscribe.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.newVersion) {
      this.isDailyMaxUnits =
        this.newVersion.section.code === SectionCode.DailyMaxUnits;
      this.currentCodes = this.isDailyMaxUnits
        ? this.currentVersion.codes.join(", ")
        : "";
    }
    if (changes.isComparing) {
      this.resetCompare();
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
      case behaviors.addRow:
        this.checkSectionsDifference();
        break;
      case behaviors.removeRow:
        this.checkSectionsDifference();
        break;
      case behaviors.movedRow:
        this.checkSectionsDifference();
        break;
      default:
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
      !this.shouldDisableSection && this.expandSection;
    this.toggleSectionCopy.emit({
      section: this.newVersion,
      status: removeSectionFromCopy,
    });
  }

  resetCompare(): void {
    if (this.isComparing) {
      this.newVersion.rows.forEach((row, rowIndex) => {
        row.columns.forEach((column, columnIndex) => {
          this.checkColumnChange(column, columnIndex, rowIndex);
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
      return foundRow ? foundRow.columns[columnIndex] : null;
    } else {
      if (
        this.currentVersion.rows.length === 0 ||
        this.currentVersion.rows.length <= rowIndex
      ) {
        return null;
      }
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
      reject: () => {},
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
      reject: () => {},
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

  consoleResponse() {
    if (this.consoleCount === 2) {
      console.log(
        `${this.newVersion.section.name}`,
        convertIUtoAPI(this.newVersion, this.drugCode)
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
