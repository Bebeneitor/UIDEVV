import { Injectable, Input } from "@angular/core";
import {
  Column,
  GroupedSection,
  GroupRow,
  Row,
  Section,
  UISection,
} from "../../models/interfaces/uibase";

@Injectable()
export class CopyToNew {
  @Input() isComparing: boolean = false;
  @Input() hasRowHeading: boolean = false;
  @Input() enableEditing: boolean = true;
  undoCopySectionGroupFlag: boolean = false;
  undoCopyRowGroupFlag: boolean = false;
  undoRemoveRoGroupFlag: boolean = true;
  undoCopySectionFlag: boolean = false;
  undoCopyRowFlag: boolean = false;
  undoRemoveRowFlag: boolean = true;
  backUpSectionRows: Row[] = [];
  backUpRedoSectionRows: Row[] = [];
  backUpSectionRowsGrouped: GroupRow[] = [];
  backUpRedoSectionRowsGrouped: GroupRow[] = [];
  isSecondaryMalignancy: boolean = false;
  isDailyMaxUnits: boolean = false;
  codes: string = "";
  backUpCodes: string = "";
  indexGroup: number = 0;
  undoCopyAllSectionFlag: boolean = false;

  copySectionGroup(newVersion: GroupedSection, currentVersion: GroupedSection) {
    if (this.isSecondaryMalignancy) {
      this.backUpCodes = this.codes;
      this.codes = currentVersion.codes.join(", ");
    }
    this.backUpSectionRowsGrouped = this.dataNewVersionGroup(newVersion);
    this.undoCopySectionGroupFlag = true;
    this.undoCopyRowGroupFlag = false;
    this.undoRemoveRoGroupFlag = !this.undoRemoveRoGroupFlag;
    let exist: boolean = false;
    this.copyDataCurrentToNewGroup(newVersion, currentVersion);
    this.popBackupNewToCurrentGroup(
      this.backUpSectionRowsGrouped,
      newVersion,
      currentVersion,
      exist
    );
  }

  dataNewVersionGroup(newVersion: GroupedSection): GroupRow[] {
    return newVersion.groups.map((group) => {
      return {
        names: group.names.map((column, columnIndex) => {
          const diff: [[number, string]] = [[0, column.value]];
          return {
            ...column,
            diff,
            isReadOnly: false,
          };
        }),
        rows: group.rows.map((row: Row) => {
          return {
            ...row,
            column: row.columns.map((column, columnIndex) => {
              const diff: [[number, string]] = [[0, column.value]];
              return {
                ...column,
                diff,
                isReadOnly: false,
              };
            }),
          };
        }),
      };
    });
  }

  copyDataCurrentToNewGroup(
    newVersion: GroupedSection,
    currentVersion: GroupedSection
  ) {
    newVersion.groups = currentVersion.groups.map((groups: GroupRow) => {
      return {
        names: groups.names.map((column, columnIndex) => {
          const diff: [[number, string]] = [[0, column.value]];
          return {
            ...column,
            diff,
            isReadOnly: false,
          };
        }),
        rows: groups.rows.map((row: Row) => {
          return {
            ...row,
            columns: row.columns.map((column, columnIndex) => {
              const diff: [[number, string]] = [[0, column.value]];
              return {
                ...column,
                diff,
                isReadOnly: false,
              };
            }),
          };
        }),
      };
    });
  }

  popBackupNewToCurrentGroup(
    backUpSection: GroupRow[],
    newVersion: GroupedSection,
    currentVersion: GroupedSection,
    exist: boolean
  ) {
    backUpSection.map((rowBack, indexRow) => {
      let newRowGroup = { names: [], rows: [] };
      if (!this.checkIfGroupExist(rowBack, currentVersion)) {
        this.persistNewGroup(newVersion, newRowGroup, rowBack, indexRow);
      } else {
        this.persistRowsExistGroup(newVersion, newRowGroup, rowBack, indexRow);
      }
      exist = false;
    });
  }

  checkIfGroupExist(
    rowBack: GroupRow,
    currentVersion: GroupedSection
  ): boolean {
    let exist = false;
    let groupIndix = 0;
    currentVersion.groups.map((rowCurrent, index) => {
      if (rowBack.names.length === 2) {
        if (
          rowBack.names[0].value.trim() === rowCurrent.names[0].value.trim() &&
          rowBack.names[1].value.trim() === rowCurrent.names[1].value.trim()
        ) {
          groupIndix = index;
          exist = true;
        }
      } else {
        if (
          rowBack.names[0].value.trim() === rowCurrent.names[0].value.trim()
        ) {
          groupIndix = index;
          exist = true;
        }
      }
    });
    this.indexGroup = groupIndix;
    return exist;
  }

  persistNewGroup(
    NewVersion: GroupedSection,
    newRowGroup: GroupRow,
    rowBack: GroupRow,
    indexRow: number
  ) {
    newRowGroup.rows = rowBack.rows;
    newRowGroup.names = rowBack.names.map((col, index) => {
      return index === 0 || index === 1
        ? {
            isReadOnly: false,
            value: col.value,
          }
        : {
            isReadOnly: false,
            value: "",
          };
    });
    NewVersion.groups.splice(NewVersion.groups.length, 0, newRowGroup);
  }

  persistRowsExistGroup(
    newVersion: GroupedSection,
    newRowGroup: GroupRow,
    rowBack: any,
    indexRow: number
  ) {
    newRowGroup.rows[indexRow] = rowBack.rows.map((row, index) => {
      if (row.hasOwnProperty("columns") && row.columns[0].value.trim() !== "")
        this.persisRow(newVersion, row, index, indexRow);
    });
  }

  persisRow(
    newVersion: GroupedSection,
    rows: Row,
    index: number,
    indexRowGroup: number
  ) {
    let data: Row;
    const existRow = this.rowExistInNewVersion(
      newVersion,
      rows,
      index,
      indexRowGroup
    );
    if (existRow === undefined) {
      data = {
        hasBorder: false,
        columns: rows.columns,
      };
    }
    if (data !== undefined) {
      if (this.indexGroup !== indexRowGroup) {
        var exist = this.rowExistInNewVersion(
          newVersion,
          rows,
          index,
          this.indexGroup
        );
        if (exist === undefined)
          newVersion.groups[this.indexGroup].rows.splice(
            newVersion.groups[this.indexGroup].rows.length,
            0,
            data
          );
      } else {
        newVersion.groups[indexRowGroup].rows.splice(
          newVersion.groups[indexRowGroup].rows.length,
          0,
          data
        );
      }
    }
  }

  rowExistInNewVersion(
    NewVersion: GroupedSection,
    rows: Row,
    index: number,
    indexRowGroup: number
  ) {
    for (var i = 0; i < NewVersion.groups[indexRowGroup].rows.length; i++) {
      if (NewVersion.groups[indexRowGroup].rows[i].hasOwnProperty("columns")) {
        if (
          NewVersion.groups[indexRowGroup].rows[i].columns[0].value.trim() ===
          rows.columns[0].value.trim()
        ) {
          return true;
        }
      }
    }
  }

  undoCopySectionGroup(
    newVersion: GroupedSection,
    currentVersion: GroupedSection,
    undoRedo: boolean
  ): void {
    this.processUndoCopySectionGroup(newVersion, currentVersion);
    newVersion.groups = this.backUpSectionRowsGrouped;
    this.undoCopySectionGroupFlag = undoRedo ? false : true;
    this.undoCopyRowGroupFlag = false;
    this.undoRemoveRoGroupFlag = !this.undoRemoveRoGroupFlag;
    if (this.isSecondaryMalignancy) {
      this.codes = this.backUpCodes;
      this.backUpCodes = null;
    }
  }

  redoCopySectionGroup(
    newVersion: GroupedSection,
    currentVersion: GroupedSection,
    undoRedo: boolean
  ): void {
    newVersion.groups = this.backUpRedoSectionRowsGrouped;
    this.undoCopySectionGroupFlag = undoRedo ? false : true;
    this.undoCopyRowGroupFlag = false;
    this.undoRemoveRoGroupFlag = !this.undoRemoveRoGroupFlag;
    if (this.isSecondaryMalignancy) {
      this.codes = this.backUpCodes;
      this.backUpCodes = null;
    }
  }

  processUndoCopySectionGroup(
    originSection: GroupedSection,
    currentVersion: GroupedSection
  ): void {
    this.backUpRedoSectionRowsGrouped = this.dataNewVersionGroup(originSection);
    let exist: boolean = false;
    this.copyDataCurrentToNewGroup(originSection, currentVersion);
    this.popBackupNewToCurrentGroup(
      this.backUpRedoSectionRowsGrouped,
      originSection,
      currentVersion,
      exist
    );
  }

  copySection(originSection: Section, currentVersion: Section): void {
    if (this.isDailyMaxUnits) {
      this.backUpCodes = this.codes;
      this.codes = currentVersion.codes.join(", ");
    }
    this.backUpSectionRows = this.dataNewVersion(originSection);
    this.undoCopySectionFlag = true;
    this.undoCopyRowFlag = false;
    this.undoRemoveRowFlag = !this.undoRemoveRowFlag;
    const exist: boolean = false;
    this.copyDataCurrentToNew(originSection, currentVersion);
    this.popBackupNewToCurrent(
      this.backUpSectionRows,
      originSection,
      currentVersion,
      exist
    );
  }

  dataNewVersion(newVersion: Section): Row[] {
    return newVersion.rows.map((row: Row) => {
      var datarow: Row = {
        ...row,
        columns: row.columns.map((col: Column) => {
          const column: Column = {
            ...col,
          };
          return column;
        }),
      };
      return datarow;
    });
  }

  copyDataCurrentToNew(originSection: Section, currentVersion: Section) {
    originSection.rows = currentVersion.rows.map((row) => {
      return {
        ...row,
        columns: row.columns.map((column, columnIndex) => {
          const diff: [[number, string]] = [[0, column.value]];
          return {
            ...column,
            diff,
            isReadOnly: false,
          };
        }),
      };
    });
  }

  popBackupNewToCurrent(
    backUpSection: Row[],
    originSection: Section,
    currentVersion: Section,
    exist: boolean
  ) {
    backUpSection.map((rowBack, indexRow) => {
      let newRow = { hasBorder: false, columns: [] };
      currentVersion.rows.map((rowCurrent) => {
        if (rowBack.columns[0].value === rowCurrent.columns[0].value) {
          exist = true;
        }
      });
      if (rowBack.columns[0].value.trim() !== "") {
        if (rowBack.columns[0].value.length > 0) {
          if (!exist) {
            newRow.hasBorder = rowBack.hasBorder;
            newRow.columns = rowBack.columns.map((col, index) => {
              return col.value !== ""
                ? {
                    isReadOnly: false,
                    value: col.value,
                  }
                : {
                    isReadOnly: false,
                    value: "",
                  };
            });
            originSection.rows.splice(originSection.rows.length, 0, newRow);
          }
        }
      }
      exist = false;
    });
  }

  redoCopySection(
    originSection: Section,
    currentVersion: Section,
    undoRedo: boolean
  ) {
    originSection.rows = this.backUpRedoSectionRows;
    this.undoCopySectionFlag = undoRedo ? false : true;
    this.undoCopyRowFlag = false;
    this.undoRemoveRowFlag = !this.undoRemoveRowFlag;
    if (this.isDailyMaxUnits) {
      this.codes = this.backUpCodes;
      this.backUpCodes = null;
    }
  }

  undoCopySection(
    originSection: Section,
    currentVersion: Section,
    undoRedo: boolean
  ): void {
    this.processUndoCopySection(originSection, currentVersion);
    originSection.rows = this.backUpSectionRows;
    this.undoCopySectionFlag = undoRedo ? false : true;
    this.undoCopyRowFlag = false;
    this.undoRemoveRowFlag = !this.undoRemoveRowFlag;
    if (this.isDailyMaxUnits) {
      this.codes = this.backUpCodes;
      this.backUpCodes = null;
    }
  }

  processUndoCopySection(
    originSection: Section,
    currentVersion: Section
  ): void {
    this.backUpRedoSectionRows = this.dataNewVersion(originSection);
    const exist: boolean = false;
    this.copyDataCurrentToNew(originSection, currentVersion);
    this.popBackupNewToCurrent(
      this.backUpRedoSectionRows,
      originSection,
      currentVersion,
      exist
    );
  }
}
