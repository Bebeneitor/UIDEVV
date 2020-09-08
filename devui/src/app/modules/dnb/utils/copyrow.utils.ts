import {
  Column,
  GroupedSection,
  GroupRow,
  Row,
  Section,
  UISection,
} from "../models/interfaces/uibase";
import { groupExist, isEmptyGroup, isEmptyRow } from "./tools.utils";

export function copyRowUtil(row: Row, groupRows: Row[]) {
  let copied = false;
  let backUpCopyRow: Row;
  let lastCopyWasAdded: boolean = false;
  let lastCopyIndex: number = 0;
  const newRow: Row = { hasBorder: false, columns: [] };
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
        const column: Column = {
          ...col,
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

export function copyGroupUtil(fromRowGroup: GroupRow, toRowGroup: GroupRow[]) {
  const newfromGroup = {
    names: fromRowGroup.names.map((column) => {
      return {
        ...column,
        isReadOnly: false,
      };
    }),
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
    toRowGroup[groupIndex] = newfromGroup;
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
  isGrouped: boolean
): UISection {
  if (isGrouped) {
    (section.new as GroupedSection).groups = (section.current as GroupedSection).groups.map(
      (group) => {
        return {
          ...group,
          names: group.names.map((column) => {
            const diff: [[number, string]] = [[0, column.value]];
            column.diff = diff;
            column.compareColumn = null;
            return {
              ...column,
              diff,
              compareColumn: null,
              isReadOnly: false,
            };
          }),
          rows: group.rows.map((row) => {
            return {
              ...row,
              columns: row.columns.map((column) => {
                const diff: [[number, string]] = [[0, column.value]];
                column.diff = diff;
                column.compareColumn = null;
                return {
                  ...column,
                  diff,
                  compareColumn: null,
                  isReadOnly: false,
                };
              }),
            };
          }),
        };
      }
    );
  } else {
    (section.new as Section).rows = (section.current as Section).rows.map(
      (row) => {
        return {
          ...row,
          columns: row.columns.map((column) => {
            const diff: [[number, string]] = [[0, column.value]];
            column.diff = diff;
            column.compareColumn = null;
            return {
              ...column,
              diff,
              compareColumn: null,
              isReadOnly: false,
            };
          }),
        };
      }
    );
  }
  return section;
}
