import { SectionCode } from "../constants/sectioncode.constant";
import { FeedbackItemsList } from "./section";

export interface UISection {
  id: string;
  current: Section | GroupedSection;
  new: Section | GroupedSection;
  hasRowHeading: boolean;
  grouped: boolean;
}

export interface Row {
  hasBorder: boolean;
  columns: Column[];
  code?: string;
  codeUI?: string;
  invalidCodes?: string;
  isPasteRow?: boolean;
}
export interface GroupRow {
  names: Column[];
  codeGroupUI?: string;
  rows: Row[];
}

export interface Column {
  isReadOnly: boolean;
  value: string;
  compareColumn?: Column;
  diff?: [number, string][];
  searchData?: SearchData;
  feedbackData: FeedBackData[];
  feedbackLeft: number;
  highlight?: number;
  maxLength?: number;
  regExValidator?: RegExp;
  regExMessage?: string;
  regExTitle?: string;
  isArrayValue?: boolean;
  maxArrayItems?: number;
  placeholder?: string;
  focus?: {
    hasFocus: boolean;
    range?: number;
    isTabAction?: boolean;
  };
  comments?: CommentData[];
}

export interface Coincidence {
  column: Column;
  position: number;
  columnId: number;
  sectionIndex: number;
  sectionType: string;
  rowIndex: number;
  groupIndex?: number;
  columnIndex: number;
  isGrouped: boolean;
  isDrugName: boolean;
  isName: boolean;
  isSectionCodes: boolean;
}

interface BaseSection {
  drugVersionCode: string;
  id: string;
  section: {
    code: string;
    name: string;
  };
  codes?: string[];
  codesColumn?: Column;
  headers: string[];
  headersUIWidth: number[];
  completed?: boolean;
  enabled?: boolean;
  focusType?: { type: string; isTabAction?: boolean };
  feedbackData?: FeedBackData[];
  feedbackLeft?: number;
  sortColumn?: string;
  messages?: string[];
}

export interface Section extends BaseSection {
  rows: Row[];
}

export interface GroupedSection extends BaseSection {
  groups: GroupRow[];
}

export interface BaseSectionResponse {
  drugVersionCode: string;
  section: {
    code: string;
    name: string;
  };
  uiDecorator?: {
    sectionActive: boolean;
    sectionComplete: boolean;
    deletedRowFeedbackItemList: FeedbackItemsList[];
    warningMessagesList?: string[];
  };
}

export interface SelectedSections {
  label: string;
  value: string;
}

export interface SearchData {
  positions: number[];
  length: number;
}

export interface FeedBackData {
  elementId?: string; //UI purpose
  isSectionFeedback?: boolean; //UI purpose
  resolved?: boolean; //UI purpose
  hidden?: boolean; //UI purpose
  htmlSourceText?: string; //UI purpose

  instanceId?: number;

  itemId: number;
  sectionRowUuid: string;
  feedback: string;
  sourceText: string;
  beginIndex: number;
  endIndex: number;
  uiColumnAttribute: string;
  feedbackStatusCode?: string;
  uiSectionCode: string;
  createdBy: string;
  createdById: number;
  createdOn: string;
}
export interface CommentData {
  elementId?: string; //UI purpose

  sectionRowUuid: string;
  comment: string;
  beginIndex: number;
  endIndex: number;
  uiColumnAttribute: string;
  uiSectionCode: string;
}

export interface ELLRow extends Row {
  found: boolean;
}

export interface VersionColumnData {
  versionId: string;
  sections: ColumnData[];
  current_sections: ColumnData[];
}

export interface ColumnData {
  code: SectionCode;
  headersUIWidth: number[];
}
