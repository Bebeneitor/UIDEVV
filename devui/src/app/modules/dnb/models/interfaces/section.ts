import { BaseSectionResponse } from "./uibase";

interface Indication {
  code: string;
  label?: string;
}

export interface GeneralInformationTemplateResponse
  extends BaseSectionResponse {
  data: GeneralInformationGroup[];
}

interface GeneralInformationGroup {
  item?: {
    code: string;
    name: string;
  };

  data: GenaralInformationRow[];
}

interface GenaralInformationRow {
  code: string;
  itemDetails?: string;
  comments: string[];
  order?: number;
  feedbackItemsList?: FeedbackItemsList[];
  documentNoteList?: CommentItemsList[];
}

export interface LCDTemplateResponse extends BaseSectionResponse {
  data: LCDRow[];
}
interface LCDRow {
  code: string;
  comments: string[];
  lcd?: string;
  macName?: string;
  order?: number;
  feedbackItemsList?: FeedbackItemsList[];
  documentNoteList?: CommentItemsList[];
}

export interface ReferencesTemplateResponse extends BaseSectionResponse {
  data: ReferencesGroup[];
}

interface ReferencesGroup {
  referenceSourceDto?: {
    code: string;
    name: string;
  };
  data: ReferencesRow[];
}

interface ReferencesRow {
  code: string;
  comments: string[];
  referenceSourceDto?: {
    code: string;
    name: string;
  };
  referenceDetails?: string;
  order?: number;
  feedbackItemsList?: FeedbackItemsList[];
  documentNoteList?: CommentItemsList[];
}

export interface MedicalJournalTemplateResponse extends BaseSectionResponse {
  data: MedicalJournalRow[];
}
interface MedicalJournalRow {
  code: string;
  citation: string;
  comments: string[];
  order?: number;
  feedbackItemsList?: FeedbackItemsList[];
  documentNoteList?: CommentItemsList[];
}

export interface IndicationsTemplateResponse extends BaseSectionResponse {
  data: IndicationsRow[];
}
interface IndicationsRow {
  code: string;
  drugLabel: string;
  clinicalPharmacology: string;
  micromedexDrugDex: string;
  nccn: string;
  lexiDrugs: string;
  ahfsDi: string;
  lcd: string;
  order?: number;
  feedbackItemsList?: FeedbackItemsList[];
  documentNoteList?: CommentItemsList[];
}

export interface NotesTemplateResponse extends BaseSectionResponse {
  data: NotesRow[];
}
interface NotesRow {
  code: string;
  comments: string[];
  note?: string;
  order?: number;
  feedbackItemsList?: FeedbackItemsList[];
  documentNoteList?: CommentItemsList[];
}

export interface DailyMaxUnitsGroupedTemplateResponse
  extends BaseSectionResponse {
  codes: string[];
  data: DailyMaxUnitsGroup[];
}

interface DailyMaxUnitsGroup {
  dmuvItemDto?: {
    code: string;
    name: string;
  };
  data: DailyMaxUnitsRow[];
  hasBorder?: boolean;
}
interface DailyMaxUnitsRow {
  code: string;
  comments: string[];
  feedbackItemsList?: FeedbackItemsList[];
  documentNoteList?: CommentItemsList[];
  order?: number;
  hasBorder?: boolean;
  currentValues?: string;
  newValues?: string;
}

export interface DiagnosisCodeSummaryTemplateResponse
  extends BaseSectionResponse {
  data: DiagnosisCodeSummaryRow[];
}
interface DiagnosisCodeSummaryRow {
  code: string;
  indication?: Indication;
  icd10Codes: string[];
  invalidIcd10Codes: string[];
  comments: string[];
  order?: number;
  feedbackItemsList?: FeedbackItemsList[];
  documentNoteList?: CommentItemsList[];
}

export interface ManifestationCodesTemplateResponse
  extends BaseSectionResponse {
  data: ManifestationCodesRow[];
}
interface ManifestationCodesRow {
  code: string;
  indication?: Indication;
  icd10Code?: {
    icd10CodeId: number;
    icd10Code: string;
    description: string;
  };
  comments: string[];
  order?: number;
  feedbackItemsList?: FeedbackItemsList[];
  documentNoteList?: CommentItemsList[];
}

export interface MaximumFrequencyTemplateResponse extends BaseSectionResponse {
  data: MaximumFrequencyGroup[];
}

interface MaximumFrequencyGroup {
  indication: string;
  data: MaximumFrequencyRow[];
}

interface MaximumFrequencyRow {
  code: string;
  maximumFrequency?: string;
  comments: string[];
  order?: number;
  feedbackItemsList?: FeedbackItemsList[];
  documentNoteList?: CommentItemsList[];
}

export interface DiagnosisCodesTemplateResponse extends BaseSectionResponse {
  data: DiagnosisCodesRow[];
}
interface DiagnosisCodesRow {
  code: string;
  comments: string[];
  indication?: string;
  nccnIcdsCodes?: {
    icd10CodeId: number;
    icd10Code: string;
    description: string;
  }[];
  nccnIcdsCodesInvalid?: {
    icd10CodeId: number;
    icd10Code: string;
    description: string;
  }[];
  lcdIcdsCodes?: {
    icd10CodeId: number;
    icd10Code: string;
    description: string;
  }[];
  lcdIcdsCodesInvalid?: {
    icd10CodeId: number;
    icd10Code: string;
    description: string;
  }[];
  order?: number;
  feedbackItemsList?: FeedbackItemsList[];
  documentNoteList?: CommentItemsList[];
}

export interface AgeTemplateResponse extends BaseSectionResponse {
  data: AgeGroup[];
}

interface AgeGroup {
  indication?: Indication;
  data: AgeRow[];
}

interface AgeRow {
  code: string;
  comments: string[];

  age?: string;
  order?: number;
  feedbackItemsList?: FeedbackItemsList[];
  documentNoteList?: CommentItemsList[];
}

export interface DailyMaximumDoseTemplateResponse extends BaseSectionResponse {
  data: DailyMaximumDoseGroup[];
}

interface DailyMaximumDoseGroup {
  indication?: {
    code: string;
    label: string;
  };
  data: DailyMaximumDoseRow[];
}

interface DailyMaximumDoseRow {
  code: string;
  indication?: Indication;
  maximumDosingPattern?: string;
  maximumDose?: string;
  maximumUnits?: string;
  comments: string[];
  order?: number;
  feedbackItemsList?: FeedbackItemsList[];
  documentNoteList?: CommentItemsList[];
}

export interface GenderTemplateResponse extends BaseSectionResponse {
  data: GenderRow[];
}

interface GenderRow {
  code: string;
  comments: string[];
  indication?: Indication;
  gender?: string;
  order?: number;
  feedbackItemsList?: FeedbackItemsList[];
  documentNoteList?: CommentItemsList[];
}

export interface UnitsOverTimeTemplateResponse extends BaseSectionResponse {
  data: UnitsOverTimeGroup[];
}

interface UnitsOverTimeGroup {
  indication?: Indication;
  data: UnitsOverTimeRow[];
}

interface UnitsOverTimeRow {
  code: string;
  units?: string;
  interval?: string;
  comments?: string[];
  order?: number;
  feedbackItemsList?: FeedbackItemsList[];
  documentNoteList?: CommentItemsList[];
}

export interface VisitOverTimeTemplateResponse extends BaseSectionResponse {
  data: VisitOverTimeGroup[];
}

interface VisitOverTimeGroup {
  indication?: Indication;
  data: VisitOverTimeRow[];
}

interface VisitOverTimeRow {
  code: string;
  indication?: Indication;
  visits: string;
  interval: string;
  comments: string[];
  order?: number;
  feedbackItemsList?: FeedbackItemsList[];
  documentNoteList?: CommentItemsList[];
}

export interface CombinationTherapyResponse extends BaseSectionResponse {
  data: CombinationTherapyGroup[];
}

interface CombinationTherapyGroup {
  indication: Indication;
  data: CombinationTherapyRow[];
}

interface CombinationTherapyRow {
  code: string;
  combination: string;
  codes?: { code?: string }[];
  comments: string[];
  order?: number;
  feedbackItemsList?: FeedbackItemsList[];
  documentNoteList?: CommentItemsList[];
}

export interface DosingPatternsResponse extends BaseSectionResponse {
  data: DosingPatternsGroup[];
}

interface DosingPatternsGroup {
  indication: Indication;
  data: DosingPatternsRow[];
}

interface DosingPatternsRow {
  code: string;
  drugLabel: string;
  clinicalPharma: string;
  micromedex: string;
  nccn: string;
  lexiDrugs: string;
  ahfsDi: string;
  other: string;
  order?: number;
  feedbackItemsList?: FeedbackItemsList[];
  documentNoteList?: CommentItemsList[];
}

export interface DiagnosisCodeOverlapsResponse extends BaseSectionResponse {
  data: DiagnosisCodeOverlapsGroup[];
}

interface DiagnosisCodeOverlapsGroup {
  icd10Code: { icd10Code: string };
  hasBorder?: boolean;
  data: DiagnosisCodeOverlapsRow[];
}

interface DiagnosisCodeOverlapsRow {
  code: string;
  hasBorder?: boolean;
  order?: number;
  indication?: Indication;
  units?: string;
  frequency?: string;
  unitsOverTime?: string;
  visitsOverTime?: string;
  age?: string;
  comments: string[];
  feedbackItemsList?: FeedbackItemsList[];
  documentNoteList?: CommentItemsList[];
}

export interface GlobalReviewIndicationsResponse extends BaseSectionResponse {
  data: GlobalReviewIndicationsRow[];
}

interface GlobalReviewIndicationsRow {
  code: string;
  indication?: Indication;
  globalReviewIndication?: string;
  comments: string[];
  order?: number;
  feedbackItemsList?: FeedbackItemsList[];
  documentNoteList?: CommentItemsList[];
}

export interface SecondaryMalignancyResponse extends BaseSectionResponse {
  data: SecondaryMalignancyGroup[];
  codes: string[];
}

interface SecondaryMalignancyGroup {
  malignancyIcdsCodes: malignancyIcdCodes[];
  secondarySite: string;
  data: SecondaryMalignancyRow[];
  hasBorder?: boolean;
}

interface malignancyIcdCodes {
  icd10Code: string;
}

interface SecondaryMalignancyRow {
  code: string;
  order: number;
  hasBorder: boolean;
  primaryMalignancy: string;
  units: string;
  frequency: string;
  unitsOverTime: string;
  visitsOverTime: string;
  age?: string;
  comments: string[];
  feedbackItemsList?: FeedbackItemsList[];
  documentNoteList?: CommentItemsList[];
}

export interface GlobalReviewCodesResponse extends BaseSectionResponse {
  data: GlobalReviewCodesRow[];
}
interface GlobalReviewCodesRow {
  code: string;
  comments: string[];
  currentIcd10CodeRange: {
    icd10CodeId: number;
    icd10Code: string;
  };
  globalReviewIcd10Code: {
    icd10CodeId: number;
    icd10Code: string;
  };
  order?: number;
  feedbackItemsList?: FeedbackItemsList[];
  documentNoteList?: CommentItemsList[];
}

export interface RulesTemplateResponse extends BaseSectionResponse {
  data: RulesRow[];
  drugCode?: string;
}

interface RulesRow {
  code: string;
  description: string;
  rule: string;
  comments: string[];
  order?: number;
  feedbackItemsList?: FeedbackItemsList[];
  documentNoteList?: CommentItemsList[];
}

export interface FeedbackItemsList {
  beginIndex: number;
  createdBy: string;
  createdById: number;
  createdOn?: string;
  endIndex: number;
  feedback: string;
  feedbackStatusCode: string;
  itemId: number;
  sectionRowUuid: string;
  sourceText: string;
  uiColumnAttribute: string;
}

export interface CommentItemsList {
  sectionCode: string;
  sectionRowUuid: string;
  uiColumnAttribute: string;
  documentNote: string;
  beginIndex: number;
  endIndex: number;
}
