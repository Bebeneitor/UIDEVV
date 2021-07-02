export const DnBActions = {
  SECTION_CHANGE: "SECTION_CHANGE",
  GROUPED_SECTION_CHANGE: "GROUPED_SECTION_CHANGE",
  COLUMN_CHANGE: "COLUMN_CHANGE",
  GROUPED_COLUMN_CHANGE: "GROUPED_COLUMN_CHANGE",
  BATCH_SECTIONS: "BATCH_SECTIONS",
  DRUG_NAME: "DRUG_NAME",
  SECTION_HEADER_CODES_DATA: "SECTION_HEADER_CODES_DATA",
  SECTION_HEADER_DATA: "SECTION_HEADER_DATA",
  GROUPED_COLUMN_SEARCH_CHANGE: "GROUPED_COLUMN_SEARCH_CHANGE",
  COLUMN_SEARCH_CHANGE: "COLUMN_SEARCH_CHANGE",
  SECTION_HEADER_CODES_SEARCH_DATA: "SECTION_HEADER_CODES_SEARCH_DATA",
  BATCH_SECTIONS_HEADER: "BATCH_SECTIONS_HEADER",
};

export interface SectionPosition {
  isDrugName: boolean;
  isSectionCodes: boolean;
  sectionIndex: number;
  isGrouped: boolean;
  isName: boolean;
  groupIndex: number;
  rowIndex: number;
  columnIndex: number;
  oldVal: string;
}

export interface BatchSectionsPosition {
  sectionsCode: string[];
}

export interface SectionHeader {
  completed: boolean;
}
