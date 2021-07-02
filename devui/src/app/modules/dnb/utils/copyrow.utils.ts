import {
  Column,
  GroupedSection,
  GroupRow,
  Row,
  Section,
  UISection,
} from "../models/interfaces/uibase";
import { CopyToNew } from "./components/copytonew";
import {
  groupExist,
  guidGenerator,
  isEmptyGroup,
  isEmptyRow,
} from "./tools.utils";

export function copyRowUtil(row: Row, groupRows: Row[]) {
  let copied = false;
  let backUpCopyRow: Row;
  let lastCopyWasAdded: boolean = false;
  let lastCopyIndex: number = 0;
  const newRow: Row = {
    codeUI: guidGenerator(),
    hasBorder: false,
    columns: [],
  };
  let cols: any;

  for (let rowI = 0; rowI < groupRows.length; rowI++) {
    const rowM = groupRows[rowI];
    if (
      rowM.columns[0].value === row.columns[0].value ||
      isEmptyRow(rowM.columns)
    ) {
      copied = true;
      backUpCopyRow = backUpRow(rowM);
      cols = rowM.columns.map((col, indexCol) => {
        const value = row.columns[indexCol].value;
        const diff: [[number, string]] = [[0, value]];
        const column: Column = {
          ...col,
          diff,
          value: value,
        };
        return column;
      });
      lastCopyIndex = rowI;
      lastCopyWasAdded = false;
      rowM.columns = cols;
      break;
    }
  }

  if (!copied) {
    newRow.columns = row.columns.map((col, index) => {
      const column: Column = {
        value: col.value,
        isReadOnly: false,
        feedbackData: [],
        feedbackLeft: 0,
      };
      return column;
    });

    backUpCopyRow = backUpRow(newRow);
    lastCopyWasAdded = true;
    lastCopyIndex = groupRows.push(newRow) - 1;
  }

  return {
    backUpCopyRow,
    lastCopyWasAdded,
    lastCopyIndex,
  };
}

export function copyGroupUtil(fromRowGroup: GroupRow, section: GroupedSection) {
  const toRowGroup: GroupRow[] = section.groups;
  const newfromGroup: GroupRow = {
    names: fromRowGroup.names.map((column) => {
      return {
        ...column,
        isReadOnly: false,
      };
    }),
    codeGroupUI: guidGenerator(),
    rows: fromRowGroup.rows.map((row) => {
      return {
        ...row,
        columns: row.columns.map((column) => {
          return {
            ...column,
            isReadOnly: false,
          };
        }),
      };
    }),
  };
  let backUpCopyGroup: GroupRow;
  let lastCopyGroupWasAdded: boolean = false;

  let groupIndex: number = -1;
  groupIndex = groupExist(newfromGroup, toRowGroup);

  if (groupIndex >= 0) {
    backUpCopyGroup = JSON.parse(JSON.stringify(toRowGroup[groupIndex]));
    toRowGroup[groupIndex].rows = toRowGroup[groupIndex].rows.concat(
      newfromGroup.rows
    );
    return { backUpCopyGroup, lastCopyGroupWasAdded, groupIndex };
  }
  groupIndex = -1;
  groupIndex = isEmptyGroup(toRowGroup);

  if (groupIndex >= 0) {
    backUpCopyGroup = JSON.parse(JSON.stringify(toRowGroup[groupIndex]));
    toRowGroup[groupIndex] = newfromGroup;
    return { backUpCopyGroup, lastCopyGroupWasAdded, groupIndex };
  }
  toRowGroup.push(newfromGroup);
  lastCopyGroupWasAdded = true;
  return {
    backUpCopyGroup,
    lastCopyGroupWasAdded,
    groupIndex: toRowGroup.length - 1,
  };
}

export function undoCopyGroupUtil(
  group: GroupRow[],
  backUpGroup: GroupRow,
  lastCopyGroupWasAdded: boolean,
  index: number
) {
  if (lastCopyGroupWasAdded) {
    group.splice(index, 1);
  } else {
    group[index] = backUpGroup;
  }
}

export function undoCopyRowUtil(
  rows: Row[],
  indexR: number,
  lastCopyWasAdded: boolean,
  backUpCopyRow: Row
): void {
  if (lastCopyWasAdded) {
    rows.splice(indexR, 1);
  } else {
    rows[indexR] = backUpCopyRow;
  }
}

function backUpRow(row: Row) {
  return {
    ...row,
    columns: row.columns.map((column) => {
      return {
        ...column,
      };
    }),
  };
}

export function copyCurrentToNewSection(
  section: UISection,
  newSection: Section | GroupedSection,
  isGrouped: boolean
): Section | GroupedSection {
  const copy = new CopyToNew();
  if (newSection.codes && newSection.codesColumn) {
    newSection.codes = section.current.codes;
    const diff: [[number, string]] = [[0, newSection.codesColumn.value]];
    newSection.codesColumn = {
      ...section.current.codesColumn,
      diff,
      compareColumn: null,
      isReadOnly: false,
    };
  }
  if (isGrouped) {
    copy.copyDataCurrentToNewGroup(
      newSection as GroupedSection,
      section.current as GroupedSection
    );
  } else {
    copy.copyDataCurrentToNew(
      newSection as Section,
      section.current as Section
    );
  }
  return newSection;
}

export function copyIngestedToNew(
  newVersion: Section | GroupedSection,
  newIngested: Section | GroupedSection,
  isGrouped: boolean
): Section | GroupedSection {
  const copy = new CopyToNew();
  if (newVersion.codes && newVersion.codesColumn) {
    newVersion.codes = newIngested.codes;
    const diff: [[number, string]] = [[0, newVersion.codesColumn.value]];
    newVersion.codesColumn = {
      ...newIngested.codesColumn,
      diff,
      compareColumn: null,
      isReadOnly: false,
    };
  }
  if (isGrouped) {
    copy.copyDataCurrentToNewGroup(
      newVersion as GroupedSection,
      newIngested as GroupedSection
    );
  } else {
    copy.copyDataCurrentToNew(newVersion as Section, newIngested as Section);
  }
  return newVersion;
}

export function addNewRowUtil(row: Row, groupRows: Row[]) {
  let copied = false;

  const newRow: Row = {
    codeUI: guidGenerator(),
    hasBorder: false,
    columns: [],
  };
  let cols: any;

  for (let rowI = 0; rowI < groupRows.length; rowI++) {
    const rowM = groupRows[rowI];
    if (isEmptyRow(rowM.columns)) {
      copied = true;

      rowM.columns = rowM.columns.map((col, indexCol) => {
        const value = row.columns[indexCol].value;
        return {
          ...col,
          value,
        };
      });
      break;
    }
  }

  if (!copied) {
    newRow.columns = row.columns.map((col, index) => {
      const column: Column = {
        value: col.value,
        isReadOnly: false,
        feedbackData: [],
        feedbackLeft: 0,
      };
      return column;
    });
    groupRows.push(newRow);
  }
}

export function replaceRowUtil(row: Row, groupRows: Row[], rowIndex: number) {
  let copied = false;
  let backUpCopyRow: Row;

  const newRow: Row = {
    codeUI: guidGenerator(),
    hasBorder: false,
    columns: [],
  };

  const rowM = groupRows[rowIndex];

  copied = true;
  backUpCopyRow = backUpRow(rowM);
  groupRows[rowIndex].columns = rowM.columns.map((col, indexCol) => {
    const value = row.columns[indexCol].value;
    const column: Column = {
      ...col,
      value: value,
    };
    return column;
  });
}
