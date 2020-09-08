import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import { defaultMenuPermissions } from "../../../models/constants/rowMenuPermissions.constants";
import {
  GroupedSection,
  GroupRow,
  Row,
  Section,
} from "../../../models/interfaces/uibase";
import { behaviors } from "../../../models/constants/behaviors.constants";

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
    wasGroupRemoved: false,
    backUpRow: null,
    backUpGroup: null,
    copyRow: false,
    undoCopyRow: false,
    undoRemoveGroup: false,
    undoCopyRowGroup: false,
    undoCopyGroup: false,
  };
  @Input() menuPermissions = defaultMenuPermissions;
  @Output() behaviorEvent: EventEmitter<any> = new EventEmitter();
  @Output() undoItemsBack: EventEmitter<any> = new EventEmitter();

  undoRemoveRowFlagChild: boolean = false;
  undoRemoveGroupFlagChild: boolean = false;
  undoCopyRowFlag: boolean = false;
  undoCopyRowGroupFlag: boolean = false;
  undoCopyGroupFlag: boolean = false;
  shouldMoveUp: boolean = false;
  shouldMoveDown: boolean = false;
  ngOnChanges(changes: SimpleChanges) {
    if (changes.undoItems) {
      this.undoRemoveRowFlagChild = changes.undoItems.currentValue.undoFlag;
      this.undoRemoveGroupFlagChild =
        changes.undoItems.currentValue.undoRemoveGroup;
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
    if (this.isGrouped) {
      const groupedSection = (this.section as GroupedSection).groups;
      if (groupedSection.length === 1 && groupedSection[0].rows.length === 1) {
        this.addRow();
      }
      this.undoItemsBack.emit({
        undoFlag: true,
        backUpIndexRow: this.rowIndex,
        backUpIndexGroup: this.groupIndex,
        wasGroupRemoved: groupedSection[this.groupIndex].rows.length === 1,
        backUpGroup: groupedSection[this.groupIndex],
        backUpRow: groupedSection[this.groupIndex].rows.splice(
          this.rowIndex,
          1
        )[0],
      });
      if (groupedSection[this.groupIndex].rows.length === 0) {
        groupedSection.splice(this.groupIndex, 1)[0];
      }
    } else {
      if ((this.section as Section).rows.length === 1) {
        this.addRow();
      }
      this.undoItemsBack.emit({
        undoFlag: true,
        backUpIndexRow: this.rowIndex,
        backUpRow: (this.section as Section).rows.splice(this.rowIndex, 1)[0],
      });
    }
    this.behaviorEvent.emit({ behavior: behaviors.removeRow });
  }

  removeGroup(): void {
    if ((this.section as GroupedSection).groups.length === 1) {
      this.addGroup();
    }
    this.undoItemsBack.emit({
      undoRemoveGroup: true,
      backUpIndexGroup: this.groupIndex,
      wasGroupRemoved: true,
      backUpGroup: (this.section as GroupedSection).groups.splice(
        this.groupIndex,
        1
      )[0],
    });
    this.behaviorEvent.emit({ behavior: behaviors.removeGroup });
  }

  undoRemoveRow(): void {
    if (this.isGrouped) {
      const groupedSection = (this.section as GroupedSection).groups;
      if (this.undoItems.wasGroupRemoved) {
        groupedSection.splice(
          this.undoItems.backUpIndexGroup,
          0,
          this.undoItems.backUpGroup
        );
        groupedSection[this.undoItems.backUpIndexGroup].rows.splice(
          this.undoItems.backUpIndexRow,
          0,
          this.undoItems.backUpRow
        );
      } else {
        groupedSection[this.undoItems.backUpIndexGroup].rows.splice(
          this.undoItems.backUpIndexRow,
          0,
          this.undoItems.backUpRow
        );
      }
    } else {
      (this.section as Section).rows.splice(
        this.undoItems.backUpIndexRow,
        0,
        this.undoItems.backUpRow
      );
    }
    this.undoItemsBack.emit({
      undoFlag: false,
      backUpIndexRow: -1,
      backUpIndexGroup: -1,
      backUpRow: null,
      backUpGroup: null,
    });
    this.behaviorEvent.emit({ behavior: behaviors.undoRemoveRow });
  }

  undoRemoveGroup(): void {
    (this.section as GroupedSection).groups.splice(
      this.undoItems.backUpIndexGroup,
      0,
      this.undoItems.backUpGroup
    );
    this.undoItemsBack.emit({
      undoRemoveGroup: false,
      backUpIndexRow: -1,
      backUpIndexGroup: -1,
      backUpRow: null,
      backUpGroup: null,
    });
    this.behaviorEvent.emit({ behavior: behaviors.undoRemoveGroup });
  }

  addRow(): void {
    const newRow = this.createNewRow((this.section as Section).rows);
    (this.section as Section).rows.splice(this.rowIndex + 1, 0, newRow);
    this.behaviorEvent.emit({ behavior: behaviors.addRow });
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
    if (group.rows.length === indexRow + 1) {
      if (group.hasOwnProperty("hasBorder")) {
        group.hasBorder = !group.hasBorder;
      } else {
        group.hasBorder = !row.hasBorder;
      }
      row.hasBorder = !row.hasBorder;
    } else {
      row.hasBorder = !row.hasBorder;
    }
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
    const newRow = this.createNewRow(groupedSection[this.groupIndex].rows);
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
    const newColumns = rows[0].columns.map((col) => {
      const diff: [number, string][] = [[0, ""]];
      return {
        maxLength: col.maxLength,
        isReadOnly: false,
        value: "",
        diff,
      };
    });
    return { hasBorder: false, columns: newColumns };
  }

  createNewGroup(groups: GroupRow[]): GroupRow {
    const newGroupHeaders = groups[0].names.map(() => {
      const diff: [number, string][] = [[0, ""]];
      return {
        isReadOnly: false,
        value: "",
        diff,
      };
    });
    const newRow = this.createNewRow(
      (this.section as GroupedSection).groups[this.groupIndex].rows
    );
    return { rows: [newRow], names: newGroupHeaders };
  }

  duplicateRow(rows: Row[], rowIndex: number): Row {
    const newColumns = rows[rowIndex].columns.map((column) => {
      return {
        isReadOnly: false,
        value: column.value,
      };
    });
    return { hasBorder: false, columns: newColumns };
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
}
