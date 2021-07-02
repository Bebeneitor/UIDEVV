import {
  Column,
  GroupedSection,
  GroupRow,
  Row,
  Section,
} from "../models/interfaces/uibase";
import { isEmptyRow, isFullEmptyGroup } from "./tools.utils";

export function getSectionColumnData(
  section: Section | GroupedSection,
  grouped: boolean,
  columnName: string
): Column[] {
  let columns: Column[] = [];
  const getIndex = (name: string, headers: string[]): number =>
    headers.indexOf(name);
  const getColumnsData = (index: number, rows: Row[]): Column[] => {
    const data: Column[] = [];
    rows.forEach((row) => {
      row.columns.forEach((col, i) => {
        if (i === index) {
          data.push(col);
        }
      });
    });
    return data;
  };
  if (section) {
    const hIndex = getIndex(columnName, section.headers);
    if (grouped) {
      (section as GroupedSection).groups.forEach((group) => {
        columns = columns.concat(getColumnsData(hIndex, group.rows));
      });
    } else {
      columns = getColumnsData(hIndex, (section as Section).rows);
    }
  }
  return columns;
}

export function clearSectionCurrentData(
  section: Section | GroupedSection,
  grouped: boolean,
  columnName: string
): Row[] | GroupRow[] {
  let data: Row[] | GroupRow[] = [];
  const getIndex = (name: string, headers: string[]): number =>
    headers.indexOf(name);

  if (section) {
    const hIndex = getIndex(columnName, section.headers);
    if (grouped) {
      const namesCount = (section as GroupedSection).groups[0].names.length;
      if (namesCount <= hIndex) {
        (section as GroupedSection).groups.forEach((group) => {
          group.names[hIndex].value = "";
        });
      } else {
        (section as GroupedSection).groups.forEach((group) => {
          group.rows.forEach((row) => {
            row.columns[hIndex].value = "";
          });
        });
      }
      (section as GroupedSection).groups.forEach((group) => {
        if (!isFullEmptyGroup(group)) {
          (data as GroupRow[]).push(group);
        } else {
          let feedbacks = section.feedbackData;
          group.names.forEach((column: Column) => {
            if (column.feedbackData && column.feedbackData.length > 0) {
              feedbacks = feedbacks.concat(column.feedbackData);
            }
          });
          group.rows.forEach((row: Row) => {
            row.columns.forEach((column: Column) => {
              if (column.feedbackData && column.feedbackData.length > 0) {
                feedbacks = feedbacks.concat(column.feedbackData);
              }
            });
          });
          section.feedbackData = feedbacks;
        }
      });
    } else {
      (section as Section).rows.forEach((row) => {
        row.columns[hIndex].value = "";
      });
      (section as Section).rows.forEach((row) => {
        if (!isEmptyRow(row.columns)) {
          (data as Row[]).push(row);
        } else {
          let feedbacks = section.feedbackData;
          row.columns.forEach((column: Column) => {
            if (column.feedbackData && column.feedbackData.length > 0) {
              feedbacks = feedbacks.concat(column.feedbackData);
            }
          });
          section.feedbackData = feedbacks;
        }
      });
    }
  }
  return data;
}
