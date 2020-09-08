import {
  Column,
  GroupedSection,
  GroupRow,
  Section,
} from "../models/interfaces/uibase";

export function prepareData(text: string): string {
  return text ? `${text.replace(/\n+$/, "")}\n` : "\n";
}

export function cleanData(text: string): string {
  const cleanData = text.replace(/\n+$/, "");
  return text ? cleanData : "";
}

export function groupExist(fromRowGroup: GroupRow, toRowGroup: GroupRow[]) {
  let groupExistFlag: boolean = true;
  let columnsGroup = null;
  let groupIndex: number = -1;

  for (let rowI = 0; rowI < toRowGroup.length; rowI++) {
    columnsGroup = toRowGroup[rowI].names;

    groupExistFlag = true;
    for (let colI = 0; colI < columnsGroup.length; colI++) {
      if (fromRowGroup.names[colI].value !== columnsGroup[colI].value) {
        groupExistFlag = false;
      }
    }
    if (groupExistFlag) {
      groupIndex = rowI;
      break;
    }
  }

  return groupIndex;
}
export function isEmptyRow(columns: Column[]): boolean {
  return columns.every(
    (column) =>
      column.value === "" ||
      column.value === null ||
      column.value.trim() === "" ||
      column.value.length === 0
  );
}
export function isEmptyGroup(groups: GroupRow[]) {
  let groupIndexBlank: number = -1;
  let groupBlank: boolean = false;
  let rowBlank: boolean = true;
  for (let groupI = 0; groupI < groups.length; groupI++) {
    groupBlank = false;
    rowBlank = true;
    if (isEmptyRow(groups[groupI].names)) {
      groupBlank = true;

      for (let rowI = 0; rowI < groups[groupI].rows.length; rowI++) {
        if (!isEmptyRow(groups[groupI].rows[rowI].columns)) {
          rowBlank = false;
          break;
        }
      }

      if (groupBlank && rowBlank) {
        groupIndexBlank = groupI;
        break;
      }
    }
  }
  return groupIndexBlank;
}

export function escapeRegExp(string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function backupSectionSearchData(
  section: Section | GroupedSection,
  grouped
): Section | GroupedSection {
  if (grouped) {
    return {
      ...section,
      groups: (section as GroupedSection).groups.map((group) => {
        return {
          ...group,
          names: group.names.map((column) => {
            return {
              ...column,
              searchData: column.searchData ? { ...column.searchData } : null,
            };
          }),
          rows: group.rows.map((row) => {
            return {
              ...row,
              columns: row.columns.map((column) => {
                return {
                  ...column,
                  searchData: column.searchData
                    ? { ...column.searchData }
                    : null,
                };
              }),
            };
          }),
        };
      }),
    };
  } else {
    return {
      ...section,
      rows: (section as Section).rows.map((row) => {
        return {
          ...row,
          columns: row.columns.map((column) => {
            return {
              ...column,
              searchData: column.searchData ? { ...column.searchData } : null,
            };
          }),
        };
      }),
    };
  }
}
