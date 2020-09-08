import { BaseSectionResponse } from "./uibase";

export interface GeneralInformationTemplateResponse
  extends BaseSectionResponse {
  data: GeneralInformationRow[];
}
interface GeneralInformationRow {
  code: string;
  comments: string[];
  item?: {
    code: string;
    name: string;
  };
  itemDetails?: string;
  order?: number;
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
}

export interface ReferencesTemplateResponse extends BaseSectionResponse {
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
}

export interface MedicalJournalTemplateResponse extends BaseSectionResponse {
  data: MedicalJournalRow[];
}
interface MedicalJournalRow {
  code: string;
  citation: string;
  comments: string[];
  order?: number;
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
}

export interface NotesTemplateResponse extends BaseSectionResponse {
  data: NotesRow[];
}
interface NotesRow {
  code: string;
  comments: string[];
  note?: string;
  order?: number;
}

export interface DailyMaxUnitsTemplateResponse extends BaseSectionResponse {
  data: DailyMaxUnitsRow[];
  codes: string[];
}
interface DailyMaxUnitsRow {
  code: string;
  comments: string[];
  dmuvItemDto?: {
    code?: string;
    name: string;
  };
  hasBorder?: boolean;
  order?: number;
  currentValues?: string;
  newValues?: string;
}

export interface DiagnosisCodeSummaryTemplateResponse
  extends BaseSectionResponse {
  data: DiagnosisCodeSummaryRow[];
}
interface DiagnosisCodeSummaryRow {
  code: string;
  indication?: string;
  icd10Codes: string[];
  comments: string[];
  order?: number;
}

export interface ManifestationCodesTemplateResponse
  extends BaseSectionResponse {
  data: ManifestationCodesRow[];
}
interface ManifestationCodesRow {
  code: string;
  indication?: string;
  icd10Code?: {
    icd10CodeId: number;
    icd10Code: string;
    description: string;
  };
  comments: string[];
  order?: number;
}

export interface MaximumFrequencyTemplateResponse extends BaseSectionResponse {
  data: MaximumFrequencyRow[];
}
interface MaximumFrequencyRow {
  code: string;
  indication?: string;
  maximumFrequency?: string;
  comments: string[];
  order?: number;
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
  lcdIcdsCodes?: {
    icd10CodeId: number;
    icd10Code: string;
    description: string;
  }[];
  order?: number;
}

export interface AgeTemplateResponse extends BaseSectionResponse {
  data: AgeRow[];
}
interface AgeRow {
  code: string;
  comments: string[];
  indication?: {
    code: string;
    label: string;
  };
  age?: string;
  order?: number;
}

export interface DailyMaximumDoseTemplateResponse extends BaseSectionResponse {
  data: DailyMaximumDoseRow[];
}

interface DailyMaximumDoseRow {
  code: string;
  indication?: {
    code: string;
    label: string;
  };
  maximumDosingPattern?: string;
  maximumDose?: string;
  maximumUnits?: string;
  comments: string[];
  order?: number;
}

export interface GenderTemplateResponse extends BaseSectionResponse {
  data: GenderRow[];
}

interface GenderRow {
  code: string;
  comments: string[];
  indication?: {
    code: string;
    label: string;
  };
  gender?: string;
  order?: number;
}

export interface UnitsOverTimeTemplateResponse extends BaseSectionResponse {
  data: UnitsOverTimeRow[];
}

interface UnitsOverTimeRow {
  code: string;
  indication?: {
    code: string;
    label: string;
  };
  units?: string;
  interval?: string;
  comments?: string[];
  order?: number;
}

export interface VisitOverTimeTemplateResponse extends BaseSectionResponse {
  data: VisitOverTimeRow[];
}

interface VisitOverTimeRow {
  code: string;
  indication?: {
    code: string;
    label: string;
  };
  visits: string;
  interval: string;
  comments: string[];
  order?: number;
}

export interface CombinationTherapyResponse extends BaseSectionResponse {
  data: CombinationTherapyGroup[];
}

interface CombinationTherapyGroup {
  indication: {
    code: string;
    label: string;
  };
  data: CombinationTherapyRow[];
}

interface CombinationTherapyRow {
  code: string;
  combination: string;
  codes?: { code?: string }[];
  comments: string[];
  order?: number;
}

export interface DosingPatternsResponse extends BaseSectionResponse {
  data: DosingPatternsGroup[];
}

interface DosingPatternsGroup {
  indication: {
    code: string;
    label: string;
  };
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
}

export interface DiagnosisCodeOverlapsResponse extends BaseSectionResponse {
  data: DiagnosisCodeOverlapsRow[];
}
interface DiagnosisCodeOverlapsRow {
  code: string;
  hasBorder?: boolean;
  order?: number;
  icd10Code?: { description: string; icd10Code: string };
  indication?: {
    code: string;
    label: string;
  };
  units?: string;
  frequency?: string;
  unitsOverTime?: string;
  visitsOverTime?: string;
  age?: string;
  comments: string[];
}

export interface GlobalReviewIndicationsResponse extends BaseSectionResponse {
  data: GlobalReviewIndicationsRow[];
}

interface GlobalReviewIndicationsRow {
  code: string;
  indication?: { code: string; label: string };
  globalReviewIndication?: string;
  comments: string[];
  order?: number;
}

export interface SecondaryMalignancyResponse extends BaseSectionResponse {
  data: SecondaryMalignancyGroup[];
  codes: string[];
}

interface SecondaryMalignancyGroup {
  malignancyIcdsCodes: malignancyIcdCodes[];
  secondarySite: string;
  data: SecondaryMalignancyRow[];
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
}
