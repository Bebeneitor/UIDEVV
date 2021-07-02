import { Injectable, Input } from "@angular/core";
import { SectionAutopopulateOverlaps } from "../../models/constants/sectionAutopopulation.constants";
import { SectionCode } from "../../models/constants/sectioncode.constant";
import { ELLMidRule } from "../../models/interfaces/midRule";
import {
  Column,
  GroupedSection,
  GroupRow,
  Row,
  Section,
  UISection,
} from "../../models/interfaces/uibase";
import {
  createNewRow,
  eliminateUndefined,
  getValuesColumn,
  guidGenerator,
  prepareData,
} from "../tools.utils";

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
  undoCopyAllSectionFlag: boolean = false;
  dataCopy: Row[] = null;
  sectionTempGlobalReviewIndication: Section;
  indexEmptyGlobal: string[] = [];
  maxLengthDefault: number = 4000;
  maxLengthFourHundred: number = 400;

  copySectionGroup(newVersion: GroupedSection, currentVersion: GroupedSection) {
    if (this.isSecondaryMalignancy || this.isDailyMaxUnits) {
      this.codes = newVersion.codesColumn.value;
      this.backUpCodes = newVersion.codesColumn.value;
    }
    this.backUpSectionRowsGrouped = this.dataNewVersionGroup(currentVersion);
    this.undoCopySectionGroupFlag = true;
    this.undoCopyRowGroupFlag = false;
    this.undoRemoveRoGroupFlag = !this.undoRemoveRoGroupFlag;
    let exist: boolean = false;
    this.popBackupNewToCurrentGroup(
      this.backUpSectionRowsGrouped,
      newVersion,
      currentVersion,
      exist
    );
    this.checkGroupedSectionsFeedbacks(
      this.backUpSectionRowsGrouped,
      newVersion
    );
  }

  checkGroupedSectionsFeedbacks(
    backUpGroups: GroupRow[],
    newVersion: GroupedSection
  ) {
    let lastIndex = 0;
    let lastGroupIndex = 0;
    newVersion.groups.forEach((group, groupIndex) => {
      lastGroupIndex = groupIndex;
      if (groupIndex < backUpGroups.length) {
        const oldGroup = backUpGroups[groupIndex];
        group.names.forEach((column, nameI) => {
          const oldCol = oldGroup.names[nameI];
          column.feedbackLeft = oldCol.feedbackLeft;
          column.feedbackData = oldCol.feedbackData;
          column.isReadOnly = oldCol.isReadOnly;
        });
        group.rows.forEach((row, rowIndex) => {
          lastIndex = rowIndex;
          if (rowIndex < oldGroup.rows.length) {
            const oldRow = oldGroup.rows[rowIndex];
            row.code = oldRow.code;
            row.columns.forEach((column, colI) => {
              const oldCol = oldRow.columns[colI];
              column.feedbackLeft = oldCol.feedbackLeft;
              column.feedbackData = oldCol.feedbackData;
              column.isReadOnly = oldCol.isReadOnly;
            });
          }
        });
        if (oldGroup.rows.length > group.rows.length) {
          for (let i = lastIndex + 1; i < oldGroup.rows.length; i++) {
            const row = oldGroup.rows[i];
            let feedbacks = [];
            row.columns.forEach((col) => {
              if (col.feedbackData) {
                feedbacks = feedbacks.concat(col.feedbackData);
              }
            });
            newVersion.feedbackData = newVersion.feedbackData.concat(feedbacks);
            newVersion.feedbackLeft += feedbacks.reduce(
              (acc, item) => (acc += !item.resolved ? 1 : 0),
              0
            );
          }
        }
      }
    });
    if (backUpGroups.length > newVersion.groups.length) {
      for (let i = lastGroupIndex + 1; i < backUpGroups.length; i++) {
        const group = backUpGroups[i];
        let feedbacks = [];
        group.names.forEach((col) => {
          if (col.feedbackData) {
            feedbacks = feedbacks.concat(col.feedbackData);
          }
        });
        group.rows.forEach((row) => {
          row.columns.forEach((col) => {
            if (col.feedbackData) {
              feedbacks = feedbacks.concat(col.feedbackData);
            }
          });
        });
        newVersion.feedbackData = newVersion.feedbackData.concat(feedbacks);
        newVersion.feedbackLeft += feedbacks.reduce(
          (acc, item) => (acc += !item.resolved ? 1 : 0),
          0
        );
      }
    }
  }

  dataNewVersionGroup(newVersion: GroupedSection): GroupRow[] {
    if (newVersion.codesColumn) {
      const diff: [[number, string]] = [[0, newVersion.codesColumn.value]];
      newVersion.codesColumn = {
        ...newVersion.codesColumn,
        diff,
      };
    }

    return newVersion.groups.map((group) => {
      return {
        names: group.names.map((column) => {
          const diff: [[number, string]] = [[0, column.value]];
          return {
            ...column,
            diff,
            maxLength: this.maxLengthFourHundred,
          };
        }),
        codeGroupUI: guidGenerator(),
        rows: group.rows.map((row: Row) => {
          return {
            ...row,
            columns: row.columns.map((column) => {
              const diff: [[number, string]] = [[0, column.value]];
              return {
                ...column,
                diff,
                maxLength: this.maxLengthDefault,
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
    if (newVersion.codes && newVersion.codesColumn) {
      newVersion.codes = currentVersion.codes;
      newVersion.codesColumn = {
        ...currentVersion.codesColumn,
      };
    }
    newVersion.groups = currentVersion.groups.map((groups: GroupRow) => {
      return {
        names: groups.names.map((column) => {
          const diff: [[number, string]] = [[0, column.value]];
          return {
            ...column,
            diff,
            isReadOnly: false,
          };
        }),
        codeGroupUI: guidGenerator(),
        rows: groups.rows.map((row: Row) => {
          return {
            ...row,
            code: "",
            columns: row.columns.map((column) => {
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
    backUpGroups: GroupRow[],
    newVersion: GroupedSection,
    currentVersion: GroupedSection,
    exist: boolean
  ) {
    backUpGroups.forEach((rowBack, groupIndex) => {
      let newRowGroup = { names: [], rows: [], codeGroupUI: guidGenerator() };
      const foundGroup = this.checkIfGroupExist(rowBack, newVersion);
      if (foundGroup < 0) {
        this.persistNewGroup(newVersion, newRowGroup, rowBack, groupIndex);
      } else {
        this.persistRowsExistGroup(newVersion.groups, rowBack, foundGroup);
      }
      exist = false;
    });
  }

  checkIfGroupExist(rowBack: GroupRow, currentVersion: GroupedSection): number {
    let exist = -1;
    for (let i = 0; i < currentVersion.groups.length; i++) {
      const rowCurrent = currentVersion.groups[i];
      if (rowBack.names.length === 2) {
        if (
          rowBack.names[0].value.trim() === rowCurrent.names[0].value.trim() &&
          rowBack.names[1].value.trim() === rowCurrent.names[1].value.trim()
        ) {
          exist = i;
          break;
        }
      } else {
        if (
          rowBack.names[0].value.trim() === rowCurrent.names[0].value.trim()
        ) {
          exist = i;
          break;
        }
      }
    }
    return exist;
  }

  persistNewGroup(
    NewVersion: GroupedSection,
    newRowGroup: GroupRow,
    rowBack: GroupRow,
    index: number
  ) {
    newRowGroup.rows = rowBack.rows;
    newRowGroup.names = rowBack.names.map((col, index) => {
      return index === 0 || index === 1
        ? {
            isReadOnly: col.isReadOnly,
            maxLength: this.maxLengthFourHundred,
            value: col.value,
            feedbackData: [],
            feedbackLeft: 0,
          }
        : {
            isReadOnly: col.isReadOnly,
            maxLength: this.maxLengthFourHundred,
            value: "",
            feedbackData: [],
            feedbackLeft: 0,
          };
    });

    NewVersion.groups.splice(index, 0, newRowGroup);
  }

  persistRowsExistGroup(
    newVersionGroups: GroupRow[],
    backUpGroup: GroupRow,
    groupIndex: number
  ) {
    newVersionGroups[groupIndex].rows = backUpGroup.rows.concat(
      newVersionGroups[groupIndex].rows
    );
  }

  rowExistInNewVersion(
    NewVersion: GroupedSection,
    rows: Row,
    index: number,
    indexRowGroup: number
  ) {
    for (var i = 0; i < NewVersion.groups[indexRowGroup].rows.length; i++) {
      if (
        NewVersion.groups[indexRowGroup].rows[i].columns[0].value.trim() ===
        rows.columns[0].value.trim()
      ) {
        return true;
      }
    }
  }

  undoCopySectionGroup(
    newVersion: GroupedSection,
    currentVersion: GroupedSection,
    undoRedo: boolean
  ): void {
    if (this.isSecondaryMalignancy) {
      this.codes = this.backUpCodes;
      this.backUpCodes = newVersion.codesColumn.value;
    }
    this.processUndoCopySectionGroup(newVersion, currentVersion);
    newVersion.groups = this.backUpSectionRowsGrouped;
    if (this.isSecondaryMalignancy) {
      newVersion.codesColumn = {
        ...newVersion.codesColumn,
        value: this.codes,
      };
    }
    this.undoCopySectionGroupFlag = undoRedo ? false : true;
    this.undoCopyRowGroupFlag = false;
    this.undoRemoveRoGroupFlag = !this.undoRemoveRoGroupFlag;
  }

  redoCopySectionGroup(
    newVersion: GroupedSection,
    currentVersion: GroupedSection,
    undoRedo: boolean
  ): void {
    newVersion.groups = this.backUpRedoSectionRowsGrouped;
    if (this.isSecondaryMalignancy) {
      this.codes = this.backUpCodes;
      this.backUpCodes = newVersion.codesColumn.value;
      newVersion.codesColumn = {
        ...newVersion.codesColumn,
        value: this.codes,
      };
    }
    this.undoCopySectionGroupFlag = undoRedo ? false : true;
    this.undoCopyRowGroupFlag = false;
    this.undoRemoveRoGroupFlag = !this.undoRemoveRoGroupFlag;
  }

  processUndoCopySectionGroup(
    newSection: GroupedSection,
    currentVersion: GroupedSection
  ): void {
    this.backUpRedoSectionRowsGrouped = this.dataNewVersionGroup(newSection);
    let exist: boolean = false;
    this.copyDataCurrentToNewGroup(newSection, currentVersion);
    this.popBackupNewToCurrentGroup(
      this.backUpRedoSectionRowsGrouped,
      newSection,
      currentVersion,
      exist
    );
  }

  copySection(newVersion: Section, currentVersion: Section): void {
    if (this.isDailyMaxUnits) {
      this.codes = newVersion.codesColumn.value;
      this.backUpCodes = newVersion.codesColumn.value;
    }
    this.backUpSectionRows = this.dataNewVersion(newVersion);
    this.undoCopySectionFlag = true;
    this.undoCopyRowFlag = false;
    this.undoRemoveRowFlag = !this.undoRemoveRowFlag;
    const exist: boolean = false;
    this.copyDataCurrentToNew(newVersion, currentVersion);
    this.popBackupNewToCurrent(
      this.backUpSectionRows,
      newVersion,
      currentVersion,
      exist
    );
    this.checkSectionsFeedbacks(this.backUpSectionRows, newVersion);
  }

  checkSectionsFeedbacks(backUpRows: Row[], newVersion: Section) {
    let lastIndex = 0;
    newVersion.rows.forEach((row, rowIndex) => {
      if (rowIndex < backUpRows.length) {
        const oldRow = backUpRows[rowIndex];
        row.code = oldRow.code;
        row.columns.forEach((column, colI) => {
          const oldCol = oldRow.columns[colI];
          column.feedbackLeft = oldCol.feedbackLeft;
          column.feedbackData = oldCol.feedbackData;
          column.isReadOnly = oldCol.isReadOnly;
        });
      }
      lastIndex = rowIndex;
    });
    if (backUpRows.length > newVersion.rows.length) {
      for (let i = lastIndex + 1; i < backUpRows.length; i++) {
        const row = backUpRows[i];
        let feedbacks = [];
        row.columns.forEach((col) => {
          if (col.feedbackData) {
            feedbacks = feedbacks.concat(col.feedbackData);
          }
        });
        newVersion.feedbackData = newVersion.feedbackData.concat(feedbacks);
        newVersion.feedbackLeft += feedbacks.reduce(
          (acc, item) => (acc += !item.resolved ? 1 : 0),
          0
        );
      }
    }
  }

  setELLRules(newVersion: Section, rules: ELLMidRule[]) {
    const newRows = newVersion.rows
      .filter((row) => row.columns[0].value.trim().toLowerCase() === "new")
      .map((row) => {
        return {
          ...row,
          columns: row.columns.map((column) => {
            return {
              ...column,
              feedbackLeft: 0,
              feedbackData: [],
            };
          }),
        };
      });
    const rulesRows: Row[] = rules.map((item) => {
      return {
        hasBorder: false,
        codeUI: guidGenerator(),
        columns: [
          {
            isReadOnly: false,
            value: prepareData(item.midrule),
            maxLength: 20,
            feedbackData: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: false,
            value: prepareData(item.description),
            maxLength: 10000,
            feedbackData: [],
            feedbackLeft: 0,
            compareColumn: {
              value: prepareData(item.description),
              isReadOnly: true,
              feedbackLeft: 0,
              feedbackData: [],
            },
          },
          {
            isReadOnly: false,
            value: prepareData(""),
            maxLength: 4000,
            feedbackData: [],
            feedbackLeft: 0,
          },
        ],
      };
    });
    newVersion.rows = rulesRows.concat(newRows);
  }

  dataNewVersion(newVersion: Section): Row[] {
    return newVersion.rows.map((row: Row) => {
      var datarow: Row = {
        ...row,
        columns: row.columns.map((col: Column) => {
          const diff: [[number, string]] = [[0, col.value]];
          const column: Column = {
            ...col,
            diff,
          };
          return column;
        }),
      };
      return datarow;
    });
  }

  copyDataCurrentToNew(newVersion: Section, currentVersion: Section) {
    if (newVersion.codes && newVersion.codesColumn) {
      newVersion.codes = currentVersion.codes;
      newVersion.codesColumn = {
        ...currentVersion.codesColumn,
      };
    }
    newVersion.rows = currentVersion.rows.map((row) => {
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
    newSection: Section,
    currentVersion: Section,
    exist: boolean
  ) {
    backUpSection.map((rowBack, indexRow) => {
      let newRow = { codeUI: "", hasBorder: false, columns: [] };
      currentVersion.rows.map((rowCurrent) => {
        if (rowBack.columns[0].value === rowCurrent.columns[0].value) {
          exist = true;
        }
      });
      if (rowBack.columns[0].value.trim() !== "") {
        if (rowBack.columns[0].value.length > 0) {
          if (!exist) {
            newRow.hasBorder = rowBack.hasBorder;
            newRow.codeUI = guidGenerator();
            newRow.columns = rowBack.columns.map((col, index) => {
              return col.value !== ""
                ? {
                    isReadOnly: col.isReadOnly,
                    value: col.value,
                    feedbackData: [],
                    feedbackLeft: 0,
                  }
                : {
                    isReadOnly: false,
                    value: "",
                    feedbackData: [],
                    feedbackLeft: 0,
                  };
            });
            newSection.rows.splice(newSection.rows.length, 0, newRow);
          }
        }
      }
      exist = false;
    });
  }

  redoCopySection(
    newVersion: Section,
    currentVersion: Section,
    undoRedo: boolean
  ) {
    newVersion.rows = this.backUpRedoSectionRows;
    if (this.isDailyMaxUnits) {
      this.codes = this.backUpCodes;
      this.backUpCodes = newVersion.codesColumn.value;
      newVersion.codesColumn = {
        ...newVersion.codesColumn,
        value: this.codes,
      };
    }
    this.undoCopySectionFlag = undoRedo ? false : true;
    this.undoCopyRowFlag = false;
    this.undoRemoveRowFlag = !this.undoRemoveRowFlag;
  }

  undoCopySection(
    newVersion: Section,
    currentVersion: Section,
    undoRedo: boolean
  ): void {
    if (this.isDailyMaxUnits) {
      this.codes = this.backUpCodes;
      this.backUpCodes = newVersion.codesColumn.value;
    }
    this.processUndoCopySection(newVersion, currentVersion);
    newVersion.rows = this.backUpSectionRows;
    if (this.isDailyMaxUnits) {
      newVersion.codesColumn = {
        ...newVersion.codesColumn,
        value: this.codes,
      };
    }
    this.undoCopySectionFlag = undoRedo ? false : true;
    this.undoCopyRowFlag = false;
    this.undoRemoveRowFlag = !this.undoRemoveRowFlag;
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

  copyColumnSection(newVersion: Section, columnPopulate: number): Row[] {
    if (newVersion.rows === undefined) {
      return [];
    }
    return newVersion.rows.map((row: Row) => {
      var datarow: Row = {
        ...row,
        columns: row.columns.map((col: Column, index) => {
          if (index === columnPopulate) {
            const column: Column = {
              ...col,
              comments: [],
            };
            return column;
          }
        }),
      };
      eliminateUndefined(datarow.columns);
      return datarow;
    });
  }

  undoCtrlZNormalSections(newVersion: Row[]) {
    let rowsPersis: Row[] = [];
    let newRow: Row = { codeUI: "", hasBorder: false, columns: [] };
    newVersion.map((item) => {
      if (!item.hasOwnProperty("isPasteRow") || !item.isPasteRow) {
        rowsPersis.push(item);
      }
    });

    if (rowsPersis.length === 0) {
      newRow = createNewRow(newVersion);
      rowsPersis.splice(0, 0, newRow);
    }
    return rowsPersis;
  }

  undoCtrlZGroupedSections(DataGrouped: GroupRow[]) {
    let newRow: Row = { codeUI: "", hasBorder: false, columns: [] };
    const groupRows = [...DataGrouped[0].rows];
    return DataGrouped.map((groups: GroupRow) => {
      var grouped: GroupRow = {
        names: groups.names.map((column) => {
          const diff: [[number, string]] = [[0, column.value]];
          return {
            ...column,
            diff,
          };
        }),
        codeGroupUI: guidGenerator(),
        rows: groups.rows.map((row: Row) => {
          if (!row.hasOwnProperty("isPasteRow") || !row.isPasteRow) {
            var datarow: Row = {
              ...row,
              code: "",
              columns: row.columns.map((column) => {
                const diff: [[number, string]] = [[0, column.value]];
                return {
                  ...column,
                  diff,
                };
              }),
            };
          }
          return datarow;
        }),
      };
      eliminateUndefined(grouped.rows);
      if (grouped.rows.length === 0) {
        newRow = createNewRow(groupRows);
        grouped.rows.splice(0, 0, newRow);
      }
      return grouped;
    });
  }

  exceptionReadOnly(newVersion: Section) {
    return newVersion.rows.map((row: Row) => {
      var datarow: Row = {
        ...row,
        columns: row.columns.map((col: Column) => {
          const column: Column = {
            ...col,
            isReadOnly: false,
          };
          return column;
        }),
      };
      return datarow;
    });
  }

  copyColumnsMultiSource(sections: UISection[]) {
    this.dataCopy = null;
    sections.forEach((section) => {
      let columnSource = SectionAutopopulateOverlaps.find(
        (o) => o.section === section.id
      );
      if (
        columnSource !== undefined &&
        section.new.section.code !== SectionCode.Age
      ) {
        this.copySourceColumn(section, columnSource);
      }
    });
    this.dataCopy = Object.values(this.dataCopy);
    this.dataCopy = this.deleteSpaces(this.dataCopy, 0);
    let duplicateData = this.getDuplicateDataSection(this.dataCopy);
    if (duplicateData.length === 0) this.dataCopy = null;
    let data = {
      dataCopy: this.dataCopy,
      duplicateData: duplicateData,
    };
    return data;
  }

  copySourceColumn(section: UISection, columnSource): Row[] {
    let dataColumn: Row[];
    for (let i = 0; i < columnSource.columnsSource.length; i++) {
      dataColumn = this.copyColumnSection(
        section.new as Section,
        columnSource.columnsSource[i]
      );
      if (this.dataCopy !== null) {
        this.addColumn(dataColumn);
      } else {
        if (dataColumn !== null) this.dataCopy = { ...dataColumn };
      }
    }
    return dataColumn;
  }

  deleteSpaces(data: Row[], columnSource: number) {
    return data.map((row: Row) => {
      var datarow: Row = {
        ...row,
        columns: row.columns.map((col: Column, index) => {
          if (index === columnSource) {
            return {
              ...col,
              value: col.value.replace(/\s/g, ""),
            };
          } else {
            return {
              ...col,
            };
          }
        }),
      };
      return datarow;
    });
  }

  addColumn(dataColum: Row[]) {
    let columns = dataColum.map((item) => {
      return item.columns;
    });
    for (let j = 0; j < columns.length; j++) {
      if (columns[j].length > 0) {
        this.dataCopy[j].columns.splice(
          this.dataCopy[j].columns.length,
          0,
          columns[j][0]
        );
      }
    }
  }

  getDuplicateDataSection(dataCopy: Row[]): string[] {
    let data: string[] = [];
    let Equals: string[] = [];
    data = getValuesColumn(dataCopy, 0);
    Equals = this.findDuplicates(data);
    return Equals;
  }

  findDuplicates = (arr) => {
    const cleanArr = arr.map((x) => x.trim().toLowerCase());
    return cleanArr.filter((item, index) => cleanArr.indexOf(item) != index);
  };

  getParentChildIndications(
    newVersion: Section,
    backUpDiagCode: Section,
    getDataChildSection: boolean,
    columnPopulate: number
  ) {
    let dataDiff: string[] | Column[];
    let dataPrevious = getValuesColumn(newVersion.rows, 0);
    if (dataPrevious.length === 0 || backUpDiagCode.rows === undefined) {
      return dataPrevious;
    }
    let dataFather = backUpDiagCode.rows
      .map((elm) => elm.columns[columnPopulate])
      .filter((item) => item.value.trim() !== "");
    let dataChild = this.copyColumnSection(newVersion, 0)
      .map((elm) => elm.columns[0])
      .filter((item) => item.value.trim() !== "");

    if (getDataChildSection) {
      dataDiff = dataFather.filter(
        (elm) =>
          !dataChild
            .map((elm) => JSON.stringify(elm.value.trim()))
            .includes(JSON.stringify(elm.value.trim()))
      );
    } else {
      dataDiff = dataChild.filter(
        (elm) =>
          !dataFather
            .map((elm) => JSON.stringify(elm.value.trim()))
            .includes(JSON.stringify(elm.value.trim()))
      );
    }
    return dataDiff;
  }
}
