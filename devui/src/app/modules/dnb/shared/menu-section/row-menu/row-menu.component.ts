import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import { behaviors } from "../../../models/constants/behaviors.constants";
import { defaultMenuPermissions } from "../../../models/constants/rowMenuPermissions.constants";
import {
  blockGroupedCheckBox,
  SectionCode,
} from "../../../models/constants/sectioncode.constant";
import {
  GroupedSection,
  GroupRow,
  Row,
  Section,
} from "../../../models/interfaces/uibase";
import {
  cleanData,
  clearIndication,
  copyIndication,
  createNewGroup,
  createNewRow,
  createNewRowGlobalReview,
  guidGenerator,
  isValueReadOnly,
  moveDataInColumn,
  valuesCorresponding,
} from "../../../utils/tools.utils";

@Component({
  selector: "app-dnb-row-menu",
  templateUrl: "./row-menu.component.html",
  styleUrls: ["./row-menu.component.css"],
})
export class RowMenuComponent implements OnChanges {
  @Input() section: Section | GroupedSection;
  @Input() isGrouped: boolean = false;
  @Input() rowIndex: number = 0;
  @Input() groupIndex: number = 0;
  @Input() visible: boolean = true;
  @Input() undoItems: any = {
    undoFlag: false,
    backUpIndexRow: null,
    backUpIndexGroup: null,
    backUpRow: null,
    backUpGroup: null,
    copyRow: false,
    undoCopyRow: false,
    undoCopyRowGroup: false,
    undoCopyGroup: false,
    undoMultiSelect: false,
  };
  @Input() menuPermissions = defaultMenuPermissions;
  @Input() cancelMultiSelect: boolean = false;
  @Input() typeRemoveMultiple: string = "";

  @Output() behaviorEvent: EventEmitter<any> = new EventEmitter();
  @Output() undoItemsBack: EventEmitter<any> = new EventEmitter();

  undoCopyRowFlag: boolean = false;
  undoCopyRowGroupFlag: boolean = false;
  undoCopyGroupFlag: boolean = false;
  shouldMoveUp: boolean = false;
  shouldMoveDown: boolean = false;
  blockGroupedCheckBox = blockGroupedCheckBox;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.undoItems) {
      this.undoCopyRowFlag = changes.undoItems.currentValue.undoCopyRow;
      this.undoCopyRowGroupFlag =
        changes.undoItems.currentValue.undoCopyRowGroup;
      this.undoCopyGroupFlag = changes.undoItems.currentValue.undoCopyGroup;
    }
    let rows;
    if (this.isGrouped) {
      rows = (this.section as GroupedSection).groups[this.groupIndex].rows;
    } else {
      rows = (this.section as Section).rows;
    }
    this.shouldMoveDown = rows && this.rowIndex < rows.length - 1;
    this.shouldMoveUp = this.rowIndex > 0;
  }

  removeRow(): void {
    this.behaviorEvent.emit({
      behavior: behaviors.removeRow,
    });
  }

  removeGroup(): void {
    this.behaviorEvent.emit({ behavior: behaviors.removeGroup });
  }

  addRow(): void {
    const newRow = createNewRow((this.section as Section).rows);
    (this.section as Section).rows.splice(this.rowIndex + 1, 0, newRow);
    this.behaviorEvent.emit({ behavior: behaviors.addRow });
  }

  addManyRows(): void {
    this.behaviorEvent.emit({
      behavior: behaviors.addManyRows,
      rowIndex: this.rowIndex,
    });
  }

  addGroup() {
    const groupedSection = (this.section as GroupedSection).groups;
    const newGroup = this.createNewGroup(groupedSection);
    groupedSection.splice(this.groupIndex + 1, 0, newGroup);
    this.behaviorEvent.emit({ behavior: behaviors.addGroup });
  }

  moveItem(position: number): void {
    if (this.isGrouped) {
      let rowMoved: Row;
      const group = (this.section as GroupedSection).groups[this.groupIndex];
      rowMoved = group.rows.splice(this.rowIndex, 1)[0];
      group.rows.splice(this.rowIndex + position, 0, rowMoved);
    } else {
      let rowMoved: Row;
      rowMoved = (this.section as Section).rows.splice(this.rowIndex, 1)[0];
      (this.section as Section).rows.splice(
        this.rowIndex + position,
        0,
        rowMoved
      );
    }
    this.behaviorEvent.emit({ behavior: behaviors.movedRow });
  }

  moveGroup(position: number): void {
    let groupMoved: GroupRow;
    groupMoved = (this.section as GroupedSection).groups.splice(
      this.groupIndex,
      1
    )[0];
    (this.section as GroupedSection).groups.splice(
      this.groupIndex + position,
      0,
      groupMoved
    );
    this.behaviorEvent.emit({ behavior: behaviors.movedGroup });
  }

  toggleSeparation(row: Row): void {
    row.hasBorder = !row.hasBorder;
  }

  toggleSeparationGroup(group: GroupRow, row: Row, indexRow: number): void {
    row.hasBorder = !row.hasBorder;
  }

  toggleCompleteSeparationGroup(
    group: GroupRow,
    row: Row,
    indexRow: number
  ): void {
    group.rows[group.rows.length - 1].hasBorder =
      !group.rows[group.rows.length - 1].hasBorder;
  }

  copyRow(): void {
    const row = (this.section as Section).rows[this.rowIndex];
    this.undoItemsBack.emit({
      ...this.undoItems,
      undoCopyRow: true,
    });
    this.behaviorEvent.emit({
      behavior: behaviors.copyRow,
      row,
      rowIndex: this.rowIndex,
    });
  }

  undoCopyRow(): void {
    this.behaviorEvent.emit({ behavior: behaviors.undoCopyRow });
  }

  addGroupRow(): void {
    const groupedSection = (this.section as GroupedSection).groups;
    const newRow = createNewRow(groupedSection[this.groupIndex].rows);
    if (this.section.section.code === SectionCode.DailyMaxUnits) {
      newRow.columns[1].isReadOnly = isValueReadOnly(
        cleanData(groupedSection[this.groupIndex].names[0].value),
        valuesCorresponding
      );
    }
    if (
      this.controlBorderLastRow(
        groupedSection[this.groupIndex].rows.length,
        groupedSection[this.groupIndex].rows
      )
    ) {
      newRow.hasBorder = true;
    }
    groupedSection[this.groupIndex].rows.splice(this.rowIndex + 1, 0, newRow);
    this.behaviorEvent.emit({ behavior: behaviors.addGroupRow });
  }

  controlBorderLastRow(totalRows: number, rowsSection: Row[]): boolean {
    var borderRow = false;
    if (totalRows === this.rowIndex + 1) {
      if (rowsSection[this.rowIndex].hasOwnProperty("hasBorder")) {
        if (rowsSection[this.rowIndex].hasBorder === true) {
          rowsSection[this.rowIndex].hasBorder = false;
          borderRow = true;
        }
      }
    }
    return borderRow;
  }

  duplicateDosing(): void {
    const groupedSection = (this.section as GroupedSection).groups;
    const newRow = this.duplicateRow(
      groupedSection[this.groupIndex].rows,
      this.rowIndex
    );
    groupedSection[this.groupIndex].rows.splice(this.rowIndex + 1, 0, newRow);
    this.behaviorEvent.emit({ behavior: behaviors.duplicateDosing });
  }

  createNewRow(rows: Row[]): Row {
    return createNewRow(rows);
  }

  createNewGroup(groups: GroupRow[]): GroupRow {
    return createNewGroup(this.section as GroupedSection, this.groupIndex);
  }

  duplicateRow(rows: Row[], rowIndex: number): Row {
    const newColumns = rows[rowIndex].columns.map((column) => {
      return {
        maxLength: column.maxLength,
        isReadOnly: false,
        feedbackData: [],
        feedbackLeft: 0,
        value: column.value,
      };
    });
    return { hasBorder: false, columns: newColumns, codeUI: guidGenerator() };
  }

  copyColumn() {
    this.behaviorEvent.emit({ behavior: behaviors.copyColumn });
  }

  pasteColumn() {
    this.behaviorEvent.emit({ behavior: behaviors.pasteColumn });
  }

  copyGroup(): void {
    const groupRow = (this.section as GroupedSection).groups[this.groupIndex];

    this.undoItemsBack.emit({
      ...this.undoItems,
      undoCopyGroup: true,
      undoCopyRowGroup: false,
    });

    this.behaviorEvent.emit({
      behavior: behaviors.copyGroup,
      groupRow,
      groupIndex: this.groupIndex,
    });
  }

  undoCopyGroup(): void {
    this.undoItemsBack.emit({
      ...this.undoItems,
      undoCopyGroup: false,
      undoCopyRowGroup: false,
    });
    this.behaviorEvent.emit({ behavior: behaviors.undoCopyGroup });
  }

  copyGroupRow(): void {
    const groupRow = (this.section as GroupedSection).groups[this.groupIndex]
      .rows[this.rowIndex];

    this.undoItemsBack.emit({
      ...this.undoItems,
      undoCopyRowGroup: true,
      undoCopyGroup: false,
    });

    this.behaviorEvent.emit({
      behavior: behaviors.copyRowGroup,
      row: groupRow,
      groupIndex: this.groupIndex,
    });
  }

  undoCopyGroupRow(): void {
    this.undoItemsBack.emit({
      ...this.undoItems,
      undoCopyGroup: false,
      undoCopyRowGroup: false,
    });
    this.behaviorEvent.emit({ behavior: behaviors.undoCopyRowGroup });
  }
  addMidRule() {
    this.behaviorEvent.emit({ behavior: behaviors.addMidRule });
  }

  detailEdit() {
    this.behaviorEvent.emit({ behavior: behaviors.detailEdit });
  }

  addExistingMidRule() {
    this.behaviorEvent.emit({ behavior: behaviors.addExistingMidRule });
  }

  checkFeedback() {
    this.behaviorEvent.emit({ behavior: behaviors.checkFeedback });
  }

  behaviorMultipleRow(behavior) {
    this.behaviorEvent.emit({ behavior: behavior });
  }

  addComment() {
    this.behaviorEvent.emit({ behavior: behaviors.addComment });
  }

  editComment() {
    this.behaviorEvent.emit({ behavior: behaviors.editComment });
  }

  indicationRemove(): void {
    let indicationData = copyIndication(this.section as Section, 0);
    clearIndication(this.section as Section, 0);
    const newRow = createNewRowGlobalReview((this.section as Section).rows);
    (this.section as Section).rows.splice(this.rowIndex, 0, newRow);
    moveDataInColumn(this.section as Section, 0, indicationData);
    this.behaviorEvent.emit({ behavior: behaviors.indicationRemove });
  }

  indicationAdded(): void {
    let indicationData = copyIndication(this.section as Section, 1);
    clearIndication(this.section as Section, 1);
    const newRow = createNewRowGlobalReview((this.section as Section).rows);
    (this.section as Section).rows.splice(this.rowIndex, 0, newRow);
    moveDataInColumn(this.section as Section, 1, indicationData);
    this.behaviorEvent.emit({ behavior: behaviors.indicationAdded });
  }
}
