import { SectionCode } from "./sectioncode.constant";

export const SectionsAutopopulationIndication = [
  "diagnosis_code_summary",
  "daily_maximum_dose_(standard)",
  "maximum_frequency_(standard)",
  "age",
  "units_over_time_(standard)",
  "visits_over_time_(standard)",
  "dosing_patterns"
];

export const SectionAutopopulationGlobal = [
  "global_review_-_icd-10_codes"
]

export const SectionAutopopulationReview = [
  "global_review_-_indications",
  "diagnosis_code_overlaps"
]

export const ParentSections = [
  SectionCode.DiagnosisCodes,
  SectionCode.DiagnosticCodeSummary,
  SectionCode.DiagnosisCodeOverlaps,
  SectionCode.GlobalReviewIndications,
  SectionCode.GlobalReviewCodes
]

export const SectionAutopopulateOverlaps = [
  { section: "diagnosis_code_summary", columnsSource:[1,0], columnsAutopopulate: [0,1] },
  { section: "daily_maximum_dose_(standard)", columnsSource:[3], columnsAutopopulate: [2] },
  { section: "maximum_frequency_(standard)", columnsSource:[1], columnsAutopopulate: [1,0] },
  { section: "units_over_time_(standard)", columnsSource:[1], columnsAutopopulate: [1,0] },
  { section: "visits_over_time_(standard)", columnsSource:[1], columnsAutopopulate: [1,0] },
  { section: "age", columnsSource:[1], columnsAutopopulate: [6] },
];


export const columnPopulate = {
  Indication: 0,
  GlobalReviewIndication: 1,
};
