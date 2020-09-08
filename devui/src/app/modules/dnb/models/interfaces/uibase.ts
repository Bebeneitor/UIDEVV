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
}
export interface GroupRow {
  hasBorder?: boolean;
  names: Column[];
  rows: Row[];
}

export interface Column {
  isReadOnly: boolean;
  value: string;
  compareColumn?: Column;
  diff?: [number, string][];
  searchData?: SearchData;
  highlight?: number;
  maxLength?: number;
  regExValidator?: RegExp;
  regExMessage?: string;
  regExTitle?: string;
}

export interface Coincidence {
  column: Column;
  position: number;
  columnId: number;
  sectionIndex: number;
  sectionType: string;
}

export interface Section {
  drugVersionCode: string;
  id: string;
  section: {
    code: string;
    name: string;
  };
  codes?: string[];
  codesColumn?: Column;
  headers: string[];
  rows: Row[];
}

export interface GroupedSection {
  drugVersionCode: string;
  id: string;
  section: {
    code: string;
    name: string;
  };
  codes?: string[];
  codesColumn?: Column;
  headers: string[];
  groups: GroupRow[];
}

export interface BaseSectionResponse {
  drugVersionCode: string;
  section: {
    code: string;
    name: string;
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
