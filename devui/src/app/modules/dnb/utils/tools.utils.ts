import { StorageService } from "src/app/services/storage.service";
import { allowedASCII } from "../models/constants/ascii.constants";
import {
  drugVersionStatus,
  FeedBackStatus
} from "../models/constants/drug.constants";
import { SectionCode } from "../models/constants/sectioncode.constant";
import {
  storageDrug,
  storageGeneral
} from "../models/constants/storage.constants";
import {
  CommentItemsList,
  FeedbackItemsList
} from "../models/interfaces/section";
import {
  Column,
  ColumnData,
  CommentData,
  FeedBackData,
  GroupedSection,
  GroupRow,
  Row,
  Section,
  UISection,
  VersionColumnData
} from "../models/interfaces/uibase";
declare let $: any;
export const valuesCorresponding = ["CMS Prof MUE", "CMS OP MUE"];

export function prepareData(text: string): string {
  return text ? `${text.replace(/\n+$/, "")}\n` : "\n";
}

export function cleanData(text: string): string {
  return text ? text.replace(/\n+$/, "") : "";
}

export function isValueReadOnly(
  valuecorrespondig: string,
  valuesForReadOnly: string[]
): boolean {
  let isResult = false;
  let value = valuesForReadOnly.find((val) => val === valuecorrespondig);
  if (value !== undefined) isResult = true;
  return isResult;
}

export function createNewRow(rows: Row[]): Row {
  const newColumns = rows[0].columns.map((col) => {
    const diff: [number, string][] = [[0, ""]];
    return {
      maxLength: col.maxLength,
      regExValidator: col.regExValidator,
      regExMessage: col.regExMessage,
      regExTitle: col.regExTitle,
      isArrayValue: col.isArrayValue,
      maxArrayItems: col.maxArrayItems,
      isReadOnly: col.isReadOnly,
      feedbackData: [],
      comments: [],
      feedbackLeft: 0,
      value: "",
      diff,
    };
  });
  return {
    hasBorder: false,
    columns: newColumns,
    codeUI: guidGenerator(),
    code: "",
  };
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

export function isFullEmptyGroup(group: GroupRow): boolean {
  const rowsEmpty = group.rows.every((row) => isEmptyRow(row.columns));
  const namesEmpty = isEmptyRow(group.names);
  return rowsEmpty && namesEmpty;
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
      codesColumn: {
        ...section.codesColumn,
      },
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
      codesColumn: {
        ...section.codesColumn,
      },
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

export function cloneSection(
  section: Section | GroupedSection,
  grouped: boolean
): Section | GroupedSection {
  if (grouped) {
    return {
      ...section,
      codesColumn: {
        ...section.codesColumn,
      },
      groups: (section as GroupedSection).groups.map((group) => {
        return {
          ...group,
          names: group.names.map((column) => {
            return {
              ...column,
            };
          }),
          rows: group.rows.map((row) => {
            return {
              ...row,
              columns: row.columns.map((column) => {
                return {
                  ...column,
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
      codesColumn: {
        ...section.codesColumn,
      },
      rows: (section as Section).rows.map((row) => {
        return {
          ...row,
          columns: row.columns.map((column) => {
            return {
              ...column,
            };
          }),
        };
      }),
    };
  }
}

export function getDrugVersionId(version) {
  const draftStatuses = [
    drugVersionStatus.InProgress,
    drugVersionStatus.inReview,
    drugVersionStatus.submitedReview,
  ];
  return version.versionStatus &&
    draftStatuses.some((status) => status.code === version.versionStatus.code)
    ? "Draft"
    : version.majorVersion;
}

export function readFromClipboard(event: ClipboardEvent): Row[] {
  let externalClipboardtext = event.clipboardData.getData("text/html");
  const rows: Row[] = [];
  let groupedCount = 0;
  let savedGroupColumn;
  $($.parseHTML(externalClipboardtext))
    .find("tr")
    .each((_, item) => {
      let cols: Column[] = [];
      if (groupedCount > 0) {
        cols.push(savedGroupColumn);
        groupedCount--;
      }
      $(item)
        .find("td")
        .each((colIndex, col) => {
          const value = cleanData(col.textContent.trim());
          const cleaned = value
            .split(/\r?\n/)
            .map((row) => row.trim().split(/\s+/).join(" "))
            .join("\n");
          const chars = allowedASCII.reduce((acc, item) => acc + item, "");
          const searchstring = `[^${chars}]`;
          let val = cleaned.replace(new RegExp(searchstring, "g"), "");
          val = val.replace(/[\r\n]/g, " ");
          const newColumn = {
            isReadOnly: false,
            value: val,
            feedbackData: [],
            feedbackLeft: 0,
          };
          const rowspan = $(col).attr("rowspan");
          if (rowspan && colIndex === 0) {
            groupedCount = rowspan - 1;
            savedGroupColumn = newColumn;
          }
          cols.push(newColumn);
        });
      const newRow: Row = {
        codeUI: guidGenerator(),
        hasBorder: false,
        code: "",
        columns: cols,
      };
      rows.push(newRow);
    });
  return rows;
}

export function calculatePercentage(navigationSections: UISection[]): string {
  let totalSections = navigationSections.filter(
    (val) => val.new.enabled
  ).length;
  let totalCompletedSections = navigationSections.filter(
    (val) => val.new.completed
  ).length;
  return (totalCompletedSections / totalSections).toFixed(2);
}

export function filterCurrentrUser(users, currentUser) {
  return [
    { label: "Select User", value: null },
    ...users
      .filter((user) => user.userId !== currentUser.userId)
      .map((user) => {
        return {
          label: user.firstName,
          value: user.userId,
        };
      }),
  ];
}

export function checkCollision(lineA, lineB): boolean {
  return (
    (lineA.start > lineB.start && lineA.start < lineB.end) ||
    (lineA.end > lineB.start && lineA.end < lineB.end) ||
    (lineB.start > lineA.start && lineB.start < lineA.end) ||
    (lineB.end > lineA.start && lineB.end < lineA.end)
  );
}

export function getSectionFeedbacks(
  section: Section | GroupedSection,
  isGrouped: boolean
): FeedBackData[] {
  let feedbacks = [];
  if (section.feedbackData) {
    feedbacks = feedbacks.concat(section.feedbackData);
  }
  if (isGrouped) {
    (section as GroupedSection).groups.forEach((group) => {
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
    });
  } else {
    (section as Section).rows.forEach((row) => {
      row.columns.forEach((col) => {
        if (col.feedbackData) {
          feedbacks = feedbacks.concat(col.feedbackData);
        }
      });
    });
  }
  return feedbacks;
}

export function getAllFeedbacks(sections: UISection[]): FeedBackData[] {
  let feedbacks = [];
  sections.forEach((section) => {
    feedbacks = feedbacks.concat(
      getSectionFeedbacks(section.new, section.grouped)
    );
  });

  return feedbacks;
}

export function removeAllComments(
  sections: UISection[],
  checkCurrent = true
): UISection[] {
  sections.forEach((section) => {
    if (checkCurrent) {
      section.current = removeaAllCommentsSection(
        section.current,
        section.grouped
      );
    }
    section.new = removeaAllCommentsSection(section.new, section.grouped);
  });

  return sections;
}

export function removeaAllCommentsSection(
  section: Section | GroupedSection,
  isGrouped: boolean
): Section | GroupedSection {
  if (isGrouped) {
    (section as GroupedSection).groups.forEach((group) => {
      group.names.forEach((col) => {
        col.comments = [];
      });
      group.rows.forEach((row) => {
        row.columns.forEach((col) => {
          col.comments = [];
        });
      });
    });
  } else {
    (section as Section).rows.forEach((row) => {
      row.columns.forEach((col) => {
        col.comments = [];
      });
    });
  }
  return section;
}

export function clearSectionFeedback(section: UISection): UISection {
  return section.grouped
    ? {
        ...section,
        new: {
          ...section.new,
          feedbackData: [],
          feedbackLeft: 0,
          groups: (section.new as GroupedSection).groups.map((group) => {
            return {
              ...group,
              names: group.names.map((name) => {
                return {
                  ...name,
                  feedbackData: [],
                  feedbackLeft: 0,
                };
              }),
              rows: group.rows.map((row) => {
                return {
                  ...row,
                  columns: row.columns.map((column) => {
                    return {
                      ...column,
                      feedbackData: [],
                      feedbackLeft: 0,
                    };
                  }),
                };
              }),
            };
          }),
        },
      }
    : {
        ...section,
        new: {
          ...section.new,
          feedbackData: [],
          feedbackLeft: 0,
          rows: (section.new as Section).rows.map((row) => {
            return {
              ...row,
              columns: row.columns.map((column) => {
                return {
                  ...column,
                  feedbackData: [],
                  feedbackLeft: 0,
                };
              }),
            };
          }),
        },
      };
}

export function getAllUnresolvedFeedbacks(sections: UISection[]): number {
  return getAllFeedbacks(sections).filter((feedback) => !feedback.resolved)
    .length;
}

export function clearAllSectionFeedback(sections: UISection[]): UISection[] {
  return sections.map((section) => clearSectionFeedback(section));
}

export function getSectionUnresolvedFeedbacksCount(
  section: Section | GroupedSection,
  isGrouped: boolean
): number {
  return getSectionFeedbacks(section, isGrouped).filter(
    (feedback) => !feedback.resolved
  ).length;
}

export function getSectionFeedback(
  feedbackItemsList: FeedbackItemsList[],
  isSectionFeedback: boolean,
  uiSectionCode: string
) {
  if (!feedbackItemsList) {
    return [];
  }
  return feedbackItemsList.map((feedback) => {
    return {
      itemId: feedback.itemId,
      sectionRowUuid: feedback.sectionRowUuid,
      feedback: feedback.feedback,
      sourceText: feedback.sourceText,
      beginIndex: feedback.beginIndex,
      endIndex: feedback.endIndex,
      uiColumnAttribute: feedback.uiColumnAttribute,
      feedbackStatusCode: feedback.feedbackStatusCode,
      uiSectionCode,
      createdBy: feedback.createdBy,
      createdById: feedback.createdById,
      createdOn: feedback.createdOn,
      resolved: feedback.feedbackStatusCode === FeedBackStatus.Resolved.code,
      hidden: false,
      isSectionFeedback,
    };
  });
}

export function getAPIColumnComments(
  commentItemsList: CommentItemsList[],
  uiSectionCode: string,
  uiColumnAttribute: string
): CommentData[] {
  if (!commentItemsList) {
    return [];
  }
  return commentItemsList
    .filter((comment) => comment.uiColumnAttribute === uiColumnAttribute)
    .map((comment) => {
      return {
        sectionRowUuid: comment.sectionRowUuid,
        comment: comment.documentNote,
        beginIndex: comment.beginIndex,
        endIndex: comment.endIndex,
        uiColumnAttribute: comment.uiColumnAttribute,
        uiSectionCode,
        elementId: guidGenerator(),
      };
    });
}

export function getColumnFeedback(
  feedbackItemsList: FeedbackItemsList[],
  isSectionFeedback: boolean,
  uiSectionCode: string,
  uiColumnAttribute: string
): FeedBackData[] {
  if (!feedbackItemsList) {
    return [];
  }
  return feedbackItemsList
    .filter((feedback) => feedback.uiColumnAttribute === uiColumnAttribute)
    .map((feedback) => {
      return {
        itemId: feedback.itemId,
        sectionRowUuid: feedback.sectionRowUuid,
        feedback: feedback.feedback,
        sourceText: feedback.sourceText,
        beginIndex: feedback.beginIndex,
        endIndex: feedback.endIndex,
        uiColumnAttribute: feedback.uiColumnAttribute,
        feedbackStatusCode: feedback.feedbackStatusCode,
        uiSectionCode,
        createdBy: feedback.createdBy,
        createdById: feedback.createdById,
        createdOn: feedback.createdOn,
        resolved: feedback.feedbackStatusCode === FeedBackStatus.Resolved.code,
        hidden: false,
        isSectionFeedback,
      };
    });
}

export function transformUItoAPIFeedback(
  feedbacks: FeedBackData[]
): FeedbackItemsList[] {
  if (!feedbacks) {
    return [];
  }
  return feedbacks.map((feedback) => {
    return {
      beginIndex: feedback.beginIndex,
      createdBy: feedback.createdBy,
      createdById: feedback.createdById,
      endIndex: feedback.endIndex,
      feedback: feedback.feedback,
      feedbackStatusCode: feedback.resolved
        ? FeedBackStatus.Resolved.code
        : FeedBackStatus.Sent.code,
      itemId: feedback.itemId,
      sectionRowUuid: feedback.sectionRowUuid,
      sourceText: feedback.sourceText,
      uiColumnAttribute: feedback.uiColumnAttribute,
    };
  });
}

export function transformUItoAPIComment(
  comments: CommentData[]
): CommentItemsList[] {
  if (!comments) {
    return [];
  }
  return comments.map((comment) => {
    return {
      beginIndex: comment.beginIndex,
      endIndex: comment.endIndex,
      sectionRowUuid: comment.sectionRowUuid,
      uiColumnAttribute: comment.uiColumnAttribute,
      sectionCode: comment.uiSectionCode,
      documentNote: comment.comment,
    };
  });
}

export function getColumnFeedbacks(columns: Column[]): FeedbackItemsList[] {
  let feedbacks = [];
  columns.forEach((col) => {
    if (col.feedbackData) {
      const transformedFeedback = transformUItoAPIFeedback(col.feedbackData);
      feedbacks = feedbacks.concat(transformedFeedback);
    }
  });
  return feedbacks;
}

export function getColumnComments(columns: Column[]): CommentItemsList[] {
  let comments = [];
  columns.forEach((col) => {
    if (col.comments) {
      const transformedComments = transformUItoAPIComment(col.comments);
      comments = comments.concat(transformedComments);
    }
  });
  return comments;
}

export function getSectionRowFeedbacks(row: Row): FeedbackItemsList[] {
  return getColumnFeedbacks(row.columns);
}

export function getSectionRowComments(row: Row): CommentItemsList[] {
  return getColumnComments(row.columns);
}

export function validateDataForAutopopulation(dataCopy: Row[]): boolean {
  let result = true;
  var myRegEx = /^[0-9A-Za-z.,\-]+$/;
  let data: string[] = getValuesColumn(dataCopy, 0);
  data.map((item) => {
    if (item.trim() !== "") {
      item = item.replace(/\s/g, "");
      if (!myRegEx.test(item) || /^[^ ]+ [^ ]+$/.test(item)) {
        result = false;
        return;
      }
    }
  });
  return result;
}

export function getValuesColumn(dataCopy: Row[], column: number): string[] {
  let data: string[] = [];
  if (dataCopy === null) return data;
  for (var i = 0; i < dataCopy.length; i++) {
    if (
      dataCopy[i].columns.length > 0 &&
      dataCopy[i].columns[column].value.trim() !== ""
    ) {
      if (dataCopy[i].columns[column].value.includes(",")) {
        let val = dataCopy[i].columns[column].value.split(",");
        val = val.map((s) => s.replace(/\s/g, ""));
        val = val.filter((v) => v != "");
        data.push(...val);
      } else {
        data.push(dataCopy[i].columns[column].value.replace(/\s/g, ""));
      }
    }
  }
  return data;
}

export function getValuesInGroup(
  dataCopy: GroupRow[],
  column: number
): string[] {
  let data: string[] = [];
  if (dataCopy === null) return data;
  for (var i = 0; i < dataCopy.length; i++) {
    if (
      dataCopy[i].names.length > 0 &&
      dataCopy[i].names[column].value.trim() !== ""
    ) {
      if (dataCopy[i].names[column].value.includes(",")) {
        let val = dataCopy[i].names[column].value.split(",");
        val = val.map((s) => s.replace(/\s/g, ""));
        val = val.filter((v) => v != "");
        data.push(...val);
      } else {
        data.push(dataCopy[i].names[column].value.replace(/\s/g, ""));
      }
    }
  }
  return data;
}

export function processResponseAutopopulate(response) {
  let allRows = [];
  let Row = { hasBorder: false, code: "", columns: [] };
  let Columns = {
    isReadOnly: true,
    feedbackData: [],
    feedbackLeft: 0,
    value: "",
  };
  for (let j = 0; j < response.data.lstValidIcd10Codes.length; j++) {
    Columns = {
      ...Columns,
      value: response.data.lstValidIcd10Codes[j],
    };
    Row = {
      ...Row,
      columns: [Columns],
    };
    allRows.push(Row);
  }
  for (let j = 0; j < response.data.lstInvalidIcd10Codes.length; j++) {
    Columns = {
      ...Columns,
      value: response.data.lstInvalidIcd10Codes[j],
    };
    Row = {
      ...Row,
      columns: [Columns],
    };
    allRows.push(Row);
  }
  return allRows;
}

export function guidGenerator() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function validateVersionDrug(sections: UISection[]): boolean[] {
  let result: boolean[];
  const storage = new StorageService();
  result = sections.map((section) => {
    if (
      section.new.section.code === SectionCode.DiagnosisCodes ||
      section.new.section.code === SectionCode.DiagnosticCodeSummary
    ) {
      if ((section.new as Section).messages !== undefined) {
        if (
          (section.new as Section).messages.length > 0 &&
          (section.new as Section).messages[0].includes("1005")
        ) {
          storage.set(
            storageDrug.drugDate,
            (section.new as Section).messages[0].substr(17, 4),
            false
          );
          return !result;
        }
      }
      if ((section.current as Section).messages !== undefined) {
        if (
          (section.current as Section).messages.length > 0 &&
          (section.current as Section).messages[0].includes("1005")
        ) {
          storage.set(
            storageDrug.drugDate,
            (section.current as Section).messages[0].substr(17, 4),
            false
          );
          return !result;
        }
      }
    }
  });
  return result.filter((item) => item !== undefined && item !== false);
}

export function formatTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  var time = `${hours}:${minutes}:${seconds} ${ampm}`;
  var timeAmPm = `${hours}:${minutes} ${ampm}`;
  return { time: time, timeAmPm: timeAmPm };
}

export function createNewRowGlobalReview(rows: Row[]): Row {
  let newColumns = rows[0].columns.map((col) => {
    const diff: [number, string][] = [[0, ""]];
    return {
      maxLength: col.maxLength,
      isReadOnly: false,
      feedbackData: [],
      feedbackLeft: 0,
      value: "",
      diff,
    };
  });
  return { hasBorder: false, columns: newColumns, codeUI: guidGenerator() };
}

export function copyIndication(section: Section, column: number): Row[] {
  return section.rows.map((row: Row) => {
    var datarow: Row = {
      ...row,
      columns: row.columns.map((col, index) => {
        if (index === column) {
          return {
            ...col,
          };
        }
      }),
    };
    eliminateUndefined(datarow.columns);
    return datarow;
  });
}

export function clearIndication(section: Section, column: number) {
  for (let i = 0; i < section.rows.length; i++) {
    if ((section as Section).rows[i].columns[column]) {
      const columnClear = {
        ...(section as Section).rows[i].columns[column],
        value: "",
      };
      section.rows[i].columns[column] = columnClear;
    }
  }
}

export function eliminateUndefined(arr) {
  for (let i = 0; i < arr.length; ) {
    if (typeof arr[i] !== "undefined") {
      i++;
      continue;
    }
    arr.splice(i, 1);
  }
}

export function moveDataInColumn(
  section: Section,
  columnNum: number,
  indicationData: Row[]
) {
  for (var i = 0; i < (section as Section).rows.length; i++) {
    for (var j = 0; j < indicationData.length; j++) {
      if (i === j) {
        const column = {
          ...indicationData[j].columns[0],
        };
        (section as Section).rows[i].columns[columnNum] = column;
      }
    }
  }
}

export function getVersionColumnData(
  versionId: string,
  section: Section | GroupedSection,
  isCurrent: boolean,
  storageService: StorageService
): number[] {
  const columnData: VersionColumnData[] = storageService.get(
    storageGeneral.dnbVersionColumns,
    true
  );
  let versionData: VersionColumnData = null;
  if (columnData !== null && versionId !== "") {
    versionData =
      columnData.find((section) => section.versionId === versionId) || null;
  }
  let headersUIWidth: number[] = [];
  if (versionData !== null) {
    const sections = isCurrent
      ? versionData.current_sections
      : versionData.sections;
    if (sections !== undefined) {
      const columns = sections.find(
        (cols) => cols.code === section.section.code
      );
      headersUIWidth = columns !== undefined ? columns.headersUIWidth : [];
    }
  }
  if (headersUIWidth.length === 0) {
    const headersLength = +section.headers.length;
    const equalColumnWidth = +(100 / headersLength).toFixed();
    headersUIWidth = [...new Array(headersLength).fill(equalColumnWidth)];
  }
  return headersUIWidth;
}

export function saveVersionColumnData(
  sections: UISection[],
  versionId: string,
  oldVersionId: string,
  newOnly: boolean,
  storageService: StorageService
) {
  const sectionsColumnData = setColumnWidths(sections, false);
  const currentSectionsColumnData = newOnly
    ? []
    : setColumnWidths(sections, true);
  const columnsData: VersionColumnData = {
    versionId,
    sections: sectionsColumnData,
    current_sections: currentSectionsColumnData,
  };
  let allVersionsData: VersionColumnData[] =
    storageService.get(storageGeneral.dnbVersionColumns, true) || [];
  if (oldVersionId) {
    allVersionsData = allVersionsData.filter(
      (version) => version.versionId !== oldVersionId
    );
  }
  allVersionsData.push(columnsData);
  if (allVersionsData.length > 10) {
    allVersionsData.shift();
  }
  storageService.set(storageGeneral.dnbVersionColumns, allVersionsData, true);
}

export function setColumnWidths(
  sections: UISection[],
  isCurrent: boolean
): ColumnData[] {
  return sections.map((section) => {
    return isCurrent
      ? {
          code: section.current.section.code as SectionCode,
          headersUIWidth: section.current.headersUIWidth,
        }
      : {
          code: section.new.section.code as SectionCode,
          headersUIWidth: section.new.headersUIWidth,
        };
  });
}

export function createNewGroup(
  newVersion: GroupedSection,
  index: number
): GroupRow {
  const newGroupHeaders = newVersion.groups[0].names.map((col) => {
    const diff: [number, string][] = [[0, ""]];
    return {
      maxLength: col.maxLength,
      isReadOnly: false,
      feedbackData: [],
      feedbackLeft: 0,
      value: "",
      diff,
    };
  });
  const newRow = createNewRow(newVersion.groups[index].rows);
  return {
    rows: [newRow],
    names: newGroupHeaders,
    codeGroupUI: guidGenerator(),
  };
}

export function pasteClipboardRows(
  rows: Row[],
  selectedColumn: { colIndex: number; rowIndex: number },
  sectionRows: Row[],
  isAutopopulate: boolean
) {
  if (!selectedColumn) {
    return sectionRows;
  }
  const startCol = selectedColumn.colIndex;
  const startRow = selectedColumn.rowIndex;
  rows.forEach((row, rowIndex) => {
    const currentRowIndex = startRow + rowIndex;
    if (currentRowIndex >= sectionRows.length && isAutopopulate) {
      const newCols = [...sectionRows[0].columns];
      const newRow: Row = {
        hasBorder: false,
        codeUI: guidGenerator(),
        columns: newCols.map((col) => {
          return {
            ...col,
            feedbackData: [],
            feedbackLeft: 0,
            isReadOnly: false,
            value: "\n",
          };
        }),
      };
      sectionRows.splice(sectionRows.length, 0, newRow);
    }
    if (sectionRows[currentRowIndex] !== undefined)
      sectionRows[currentRowIndex].isPasteRow = true;
    const originRow = sectionRows[currentRowIndex];
    if (originRow) {
      const columns = row.columns;
      columns.forEach((col, colIndex) => {
        const currentColIndex = startCol + colIndex;
        if (currentColIndex < sectionRows[currentRowIndex].columns.length) {
          const originalCol = originRow.columns[currentColIndex];
          if (!originalCol.isReadOnly) {
            originRow.columns[currentColIndex] = {
              ...originalCol,
              value: col.value,
            };
          }
        }
      });
    }
  });
  return sectionRows;
}

export function pasteClipboardGroups(
  rows: Row[],
  selectedColumn: {
    colIndex: number;
    rowIndex: number;
    groupIndex: number;
    isGroupHeader: boolean;
  },
  groupRows: GroupRow[]
): GroupRow[] {
  if (!selectedColumn) {
    return groupRows;
  }
  let startCol = selectedColumn.colIndex;
  let startRow = selectedColumn.rowIndex;
  const startGroup = selectedColumn.groupIndex;
  const selectedGroup = groupRows[startGroup];
  if (selectedColumn.isGroupHeader) {
    for (let i = startCol; i < selectedGroup.names.length; i++) {
      rows = rows.map((row) => {
        const column = row.columns.shift();
        if (!selectedGroup.names[i].isReadOnly) {
          selectedGroup.names[i] = {
            ...selectedGroup.names[i],
            value: selectedGroup.names[i].value + column.value + "\n",
          };
        }
        return {
          ...row,
          columns: row.columns,
        };
      });
    }
    startCol = 0;
    startRow = 0;
  }

  rows.forEach((row, rowIndex) => {
    const currentRowIndex = startRow + rowIndex;
    if (currentRowIndex >= selectedGroup.rows.length) {
      const newCols = [...selectedGroup.rows[0].columns];
      const newRow: Row = {
        hasBorder: false,
        codeUI: guidGenerator(),
        columns: newCols.map((col) => {
          return {
            ...col,
            feedbackData: [],
            feedbackLeft: 0,
            isReadOnly: false,
            value: "\n",
          };
        }),
      };
      selectedGroup.rows.splice(selectedGroup.rows.length, 0, newRow);
    }
    if (selectedGroup.rows[currentRowIndex] !== undefined)
      selectedGroup.rows[currentRowIndex].isPasteRow = true;
    const originRow = selectedGroup.rows[currentRowIndex];
    const columns = row.columns;
    columns.forEach((col, colIndex) => {
      const currentColIndex = startCol + colIndex;
      if (
        currentColIndex < selectedGroup.rows[currentRowIndex].columns.length
      ) {
        const originalCol = originRow.columns[currentColIndex];
        if (!originalCol.isReadOnly) {
          originRow.columns[currentColIndex] = {
            ...originalCol,
            value: col.value,
          };
        }
      }
    });
  });
  return groupRows;
}

export function compareToOrder(firstItem, secondItem) {
  let comparison = 0;

  if (firstItem.index > secondItem.index) {
    comparison = 1;
  } else if (firstItem.index < secondItem.index) {
    comparison = -1;
  }
  return comparison;
}


export function getInvalidCurrent(sections:UISection[]){
  let data = sections.map((section) => {
    if (
      section.new.section.code === SectionCode.DiagnosisCodes ||
      section.new.section.code === SectionCode.DiagnosticCodeSummary
    ) {
      if ((section.current as Section).rows.length > 0) {
        let data =  {
          codesInvalid: (section.current as Section).rows
            .map((item) => item.invalidCodes)
            .filter(function (item) {
              return item !== "";
            }),
          sectionCode:
           (section.current as Section).section.code === SectionCode.DiagnosisCodes
              ? "Diagnosis Code"
              : "Diagnosis Code Summary",
        };
        return data;
      }
    }
  });
  eliminateUndefined(data);
  return data;
}
