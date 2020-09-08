import { drugVersionStatus } from "../models/constants/drug.constants";
import { SectionCode } from "../models/constants/sectioncode.constant";
import {
  AgeHeaders,
  AgeTemplate,
  CombinationTherapyHeaders,
  CombinationTherapyTemplate,
  DailyMaximumDoseHeaders,
  DailyMaximumDoseTemplate,
  DailyMaxUnitsHeaders,
  DailyMaxUnitsTemplate,
  DiagnosisCodeOverlapsHeaders,
  DiagnosisCodeOverlapsTemplate,
  DiagnosisCodesHeaders,
  DiagnosisCodesTemplate,
  DiagnosisCodeSummaryHeaders,
  DiagnosisCodeSummaryTemplate,
  DosingPatternsHeaders,
  DosingPatternsTemplate,
  GenderHeaders,
  GenderTemplate,
  GeneralInformationHeaders,
  GeneralInformationTemplate,
  GlobalReviewCodesHeaders,
  GlobalReviewCodesTemplate,
  GlobalReviewIndicationsHeaders,
  GlobalReviewIndicationsTemplate,
  IndicationsHeaders,
  IndicationsTemplate,
  LCDHeaders,
  LCDTemplate,
  ManifestationCodesHeaders,
  ManifestationCodesTemplate,
  MaximumFrequencyTemplate,
  MaximumFrquencyHeaders,
  MedicalJournalHeaders,
  MedicalJournalTemplate,
  NotesHeaders,
  NotesTemplate,
  ReferenceHeaders,
  ReferenceTemplate,
  RulesHeaders,
  RulesTemplate,
  SecondaryMalignancyHeaders,
  SecondaryMalignancyTemplate,
  UnistOverTimeHeaders,
  UnitsOverTimeTemplate,
  VisitOverTimeHeaders,
  VisitOverTimeTemplate,
} from "../models/constants/templates.constant";
import { NavigationItem } from "../models/interfaces/navigation";
import {
  AgeTemplateResponse,
  CombinationTherapyResponse,
  DailyMaximumDoseTemplateResponse,
  DailyMaxUnitsTemplateResponse,
  DiagnosisCodeOverlapsResponse,
  DiagnosisCodesTemplateResponse,
  DiagnosisCodeSummaryTemplateResponse,
  DosingPatternsResponse,
  GenderTemplateResponse,
  GeneralInformationTemplateResponse,
  GlobalReviewCodesResponse,
  GlobalReviewIndicationsResponse,
  IndicationsTemplateResponse,
  LCDTemplateResponse,
  ManifestationCodesTemplateResponse,
  MaximumFrequencyTemplateResponse,
  MedicalJournalTemplateResponse,
  NotesTemplateResponse,
  ReferencesTemplateResponse,
  RulesTemplateResponse,
  SecondaryMalignancyResponse,
  UnitsOverTimeTemplateResponse,
  VisitOverTimeTemplateResponse,
} from "../models/interfaces/section";
import {
  BaseSectionResponse,
  GroupedSection,
  Section,
  UISection,
} from "../models/interfaces/uibase";
import { prepareData } from "./tools.utils";

const maxLengthDefault: number = 4000;
const maxLengthFourHundred: number = 400;
const maxLengthOneHundred: number = 100;
const maxLengthCode: number = 32;

export function generalInformationConvertAPIToUI(
  generalInformation: GeneralInformationTemplateResponse,
  isReadOnly: boolean = false
): Section {
  return {
    drugVersionCode: generalInformation.drugVersionCode,
    section: {
      code: generalInformation.section.code,
      name: generalInformation.section.name,
    },
    headers: GeneralInformationHeaders,
    id: convertSectionNameToID(generalInformation.section.name),
    rows: !generalInformation.data
      ? []
      : generalInformation.data.map((item) => {
          const itemColumn = prepareData(item.item.name);
          const itemDetails = prepareData(item.itemDetails);
          const comments = prepareData(item.comments.join(", "));
          return {
            hasBorder: false,
            columns: [
              {
                isReadOnly: isReadOnly,
                value: itemColumn,
                maxLength: maxLengthDefault,
              },
              {
                isReadOnly: isReadOnly,
                value: itemDetails,
                maxLength: maxLengthDefault,
              },
              {
                isReadOnly: isReadOnly,
                value: comments,
                maxLength: maxLengthDefault,
              },
            ],
          };
        }),
  };
}

export function referencesConvertAPIToUI(
  references: ReferencesTemplateResponse,
  isReadOnly: boolean = false
): Section {
  return {
    drugVersionCode: references.drugVersionCode,
    section: {
      code: references.section.code,
      name: references.section.name,
    },
    headers: ReferenceHeaders,
    id: convertSectionNameToID(references.section.name),
    rows: !references.data
      ? []
      : references.data.map((item) => {
          const referenceType = prepareData(item.referenceSourceDto.name);
          const referenceDetails = prepareData(item.referenceDetails);
          const comments = prepareData(item.comments.join(", "));
          return {
            hasBorder: false,
            columns: [
              {
                isReadOnly: isReadOnly,
                value: referenceType,
                maxLength: maxLengthDefault,
              },
              {
                isReadOnly: isReadOnly,
                value: referenceDetails,
                maxLength: maxLengthDefault,
              },
              {
                isReadOnly: isReadOnly,
                value: comments,
                maxLength: maxLengthDefault,
              },
            ],
          };
        }),
  };
}

export function NotesConvertAPIToUI(
  notes: NotesTemplateResponse,
  isReadOnly: boolean = false
): Section {
  return {
    drugVersionCode: notes.drugVersionCode,
    section: {
      code: notes.section.code,
      name: notes.section.name,
    },
    headers: NotesHeaders,
    id: convertSectionNameToID(notes.section.name),
    rows: !notes.data
      ? []
      : notes.data.map((item) => {
          const note = prepareData(item.note);
          const comments = prepareData(item.comments.join(", "));
          return {
            hasBorder: false,
            columns: [
              {
                isReadOnly: isReadOnly,
                value: note,
                maxLength: maxLengthDefault,
              },
              {
                isReadOnly: isReadOnly,
                value: comments,
                maxLength: maxLengthDefault,
              },
            ],
          };
        }),
  };
}

export function LCDConvertAPIToUI(
  LCD: LCDTemplateResponse,
  isReadOnly: boolean = false
): Section {
  return {
    drugVersionCode: LCD.drugVersionCode,
    section: {
      code: LCD.section.code,
      name: LCD.section.name,
    },
    headers: LCDHeaders,
    id: convertSectionNameToID(LCD.section.name),
    rows: !LCD.data
      ? []
      : LCD.data.map((item) => {
          const lcd = prepareData(item.lcd);
          const macName = prepareData(item.macName);
          const comments = prepareData(item.comments.join(", "));
          return {
            hasBorder: false,
            columns: [
              {
                isReadOnly: isReadOnly,
                value: lcd,
                maxLength: maxLengthDefault,
              },
              {
                isReadOnly: isReadOnly,
                value: macName,
                maxLength: maxLengthDefault,
              },
              {
                isReadOnly: isReadOnly,
                value: comments,
                maxLength: maxLengthDefault,
              },
            ],
          };
        }),
  };
}

export function MedicalJournalConvertAPIToUI(
  medicalJournal: MedicalJournalTemplateResponse,
  isReadOnly: boolean = false
): Section {
  return {
    drugVersionCode: medicalJournal.drugVersionCode,
    section: {
      code: medicalJournal.section.code,
      name: medicalJournal.section.name,
    },
    headers: MedicalJournalHeaders,
    id: convertSectionNameToID(medicalJournal.section.name),
    rows: !medicalJournal.data
      ? []
      : medicalJournal.data.map((item) => {
          return {
            hasBorder: false,
            columns: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.citation),
                maxLength: maxLengthDefault,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.comments.join(",")),
                // maxLength: maxLengthDefault, temp removal since QA needs to test API failure
              },
            ],
          };
        }),
  };
}

export function IndicationsConvertAPIToUI(
  indications: IndicationsTemplateResponse,
  isReadOnly: boolean = false
): Section {
  return {
    drugVersionCode: indications.drugVersionCode,
    section: {
      code: indications.section.code,
      name: indications.section.name,
    },
    headers: IndicationsHeaders,
    id: convertSectionNameToID(indications.section.name),
    rows: !indications.data
      ? []
      : indications.data.map((item) => {
          return {
            hasBorder: false,
            columns: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.drugLabel),
                maxLength: maxLengthFourHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.clinicalPharmacology),
                maxLength: maxLengthFourHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.micromedexDrugDex),
                maxLength: maxLengthFourHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.nccn),
                maxLength: maxLengthFourHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.lexiDrugs),
                maxLength: maxLengthFourHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.ahfsDi),
                maxLength: maxLengthFourHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.lcd),
                maxLength: maxLengthFourHundred,
              },
            ],
          };
        }),
  };
}

export function DailyMaxUnitsConvertAPItoUI(
  dailyMaxUnits: DailyMaxUnitsTemplateResponse,
  isReadOnly: boolean = false
): Section {
  const sectionName = dailyMaxUnits.section.name;
  const codes = dailyMaxUnits.codes ? dailyMaxUnits.codes : [];
  return {
    drugVersionCode: SectionCode.DailyMaxUnits,
    section: {
      code: dailyMaxUnits.section.code,
      name: sectionName,
    },
    headers: DailyMaxUnitsHeaders,
    codes: codes,
    codesColumn: {
      value: codes.join(", "),
      isReadOnly: isReadOnly,
      regExValidator: /[^A-Z\d\s,]/,
      regExMessage: "Only commas are acepted for special characters",
      regExTitle: "Daily Maximum Units Values For HCPCS Codes",
      maxLength: maxLengthCode
    },
    id: convertSectionNameToID(sectionName),
    rows: !dailyMaxUnits.data
      ? []
      : dailyMaxUnits.data.map((item) => {
          return {
            hasBorder: item.hasBorder,
            columns: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.dmuvItemDto.name),
                maxLength: maxLengthOneHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.currentValues),
                maxLength: maxLengthDefault,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.newValues),
                maxLength: maxLengthDefault,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.comments.join("")),
                maxLength: maxLengthDefault,
              },
            ],
          };
        }),
  };
}

export function DiagnosisCodesConvertAPItoUI(
  diagnosisCodes: DiagnosisCodesTemplateResponse,
  isReadOnly: boolean = false
): Section {
  const sectionName = diagnosisCodes.section.name;
  return {
    drugVersionCode: diagnosisCodes.drugVersionCode,
    section: {
      code: diagnosisCodes.section.code,
      name: sectionName,
    },
    headers: DiagnosisCodesHeaders,
    id: convertSectionNameToID(sectionName),
    rows: !diagnosisCodes.data
      ? []
      : diagnosisCodes.data.map((item) => {
          const nccnCodes = item.nccnIcdsCodes.map((code) => code.icd10Code);
          const lcdCodes = item.lcdIcdsCodes.map((code) => code.icd10Code);
          return {
            hasBorder: false,
            columns: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.indication),
                maxLength: maxLengthDefault,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(nccnCodes.join(", ")),
                maxLength: maxLengthDefault,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(lcdCodes.join(", ")),
                maxLength: maxLengthDefault,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.comments.join(", ")),
                maxLength: maxLengthDefault,
              },
            ],
          };
        }),
  };
}

export function DiagnosisCodeSummaryConvertAPItoUI(
  DiagnosisCodeSummary: DiagnosisCodeSummaryTemplateResponse,
  isReadOnly: boolean = false
): Section {
  return {
    drugVersionCode: DiagnosisCodeSummary.drugVersionCode,
    section: {
      code: DiagnosisCodeSummary.section.code,
      name: DiagnosisCodeSummary.section.name,
    },
    headers: DiagnosisCodeSummaryHeaders,
    id: convertSectionNameToID(DiagnosisCodeSummary.section.name),
    rows: !DiagnosisCodeSummary.data
      ? []
      : DiagnosisCodeSummary.data.map((item) => {
          return {
            hasBorder: false,
            columns: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.indication),
                maxLength: maxLengthDefault,
              },

              {
                isReadOnly: isReadOnly,
                value: prepareData(item.icd10Codes.join(",")),
                maxLength: maxLengthDefault,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.comments.join(",")),
                maxLength: maxLengthDefault,
              },
            ],
          };
        }),
  };
}

export function ManifestationCodesConvertAPItoUI(
  ManifestationCodes: ManifestationCodesTemplateResponse,
  isReadOnly: boolean = false
): Section {
  return {
    drugVersionCode: ManifestationCodes.drugVersionCode,
    section: {
      code: ManifestationCodes.section.code,
      name: ManifestationCodes.section.name,
    },
    headers: ManifestationCodesHeaders,
    id: convertSectionNameToID(ManifestationCodes.section.name),
    rows: !ManifestationCodes.data
      ? []
      : ManifestationCodes.data.map((item) => {
          return {
            hasBorder: false,
            columns: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.icd10Code.icd10Code),
                maxLength: maxLengthDefault,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.indication),
                maxLength: maxLengthDefault,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.comments.join(",")),
                maxLength: maxLengthDefault,
              },
            ],
          };
        }),
  };
}

export function MaximumFrecuencyConvertAPItoUI(
  MaximumFrecuency: MaximumFrequencyTemplateResponse,
  isReadOnly: boolean = false
): Section {
  return {
    drugVersionCode: SectionCode.MaximumFrequency,
    section: {
      code: MaximumFrecuency.section.code,
      name: MaximumFrecuency.section.name,
    },
    headers: MaximumFrquencyHeaders,
    id: convertSectionNameToID(MaximumFrecuency.section.name),
    rows: !MaximumFrecuency.data
      ? []
      : MaximumFrecuency.data.map((item) => {
          return {
            hasBorder: false,
            columns: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.indication),
                maxLength: maxLengthDefault,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.maximumFrequency),
                maxLength: maxLengthDefault,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.comments.join(",")),
                maxLength: maxLengthDefault,
              },
            ],
          };
        }),
  };
}

export function AgeConvertAPItoUI(
  Age: AgeTemplateResponse,
  isReadOnly: boolean = false
): Section {
  return {
    drugVersionCode: SectionCode.Age,
    section: {
      code: Age.section.code,
      name: Age.section.name,
    },
    headers: AgeHeaders,
    id: convertSectionNameToID(Age.section.name),
    rows: !Age.data
      ? []
      : Age.data.map((item) => {
          return {
            hasBorder: false,
            columns: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.indication.label),
                maxLength: maxLengthFourHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.age),
                maxLength: maxLengthFourHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.comments.join(",")),
                maxLength: maxLengthFourHundred,
              },
            ],
          };
        }),
  };
}

export function DailyMaximumDoseConvertAPItoUI(
  DailyMaxDose: DailyMaximumDoseTemplateResponse,
  isReadOnly: boolean = false
): Section {
  return {
    drugVersionCode: "",
    section: {
      code: DailyMaxDose.section.code,
      name: DailyMaxDose.section.name,
    },
    headers: DailyMaximumDoseHeaders,
    id: convertSectionNameToID(DailyMaxDose.section.name),
    rows: !DailyMaxDose.data
      ? []
      : DailyMaxDose.data.map((item) => {
          return {
            hasBorder: false,
            columns: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.indication.label),
                maxLength: maxLengthFourHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.maximumDosingPattern),
                maxLength: maxLengthFourHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.maximumDose),
                maxLength: maxLengthFourHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.maximumUnits),
                maxLength: maxLengthFourHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.comments.join(", ")),
                maxLength: maxLengthDefault,
              },
            ],
          };
        }),
  };
}

export function GenderConvertAPItoUI(
  Gender: GenderTemplateResponse,
  isReadOnly: boolean = false
): Section {
  return {
    drugVersionCode: SectionCode.Gender,
    section: {
      code: Gender.section.code,
      name: Gender.section.name,
    },
    headers: GenderHeaders,
    id: convertSectionNameToID(Gender.section.name),
    rows: !Gender.data
      ? []
      : Gender.data.map((item) => {
          return {
            hasBorder: false,
            columns: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.indication.label),
                maxLength: maxLengthFourHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.gender),
                maxLength: maxLengthFourHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.comments.join(",")),
                maxLength: maxLengthFourHundred,
              },
            ],
          };
        }),
  };
}

export function UnitsOverTimeConvertAPItoUI(
  template: UnitsOverTimeTemplateResponse,
  isReadOnly: boolean = false
): Section {
  return {
    drugVersionCode: SectionCode.UnitsOverTime,
    section: {
      code: template.section.code,
      name: template.section.name,
    },
    headers: UnistOverTimeHeaders,
    id: convertSectionNameToID(template.section.name),
    rows: !template.data
      ? []
      : template.data.map((item) => {
          return {
            hasBorder: false,
            columns: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.indication.label),
                maxLength: maxLengthFourHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.units),
                maxLength: 20,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.interval),
                maxLength: 40,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.comments.join(", ")),
                maxLength: maxLengthDefault,
              },
            ],
          };
        }),
  };
}

export function VisitOverTimeConvertAPItoUI(
  VisitOverTime: VisitOverTimeTemplateResponse,
  isReadOnly: boolean = false
): Section {
  return {
    drugVersionCode: SectionCode.VisitOverTime,
    section: {
      code: VisitOverTime.section.code,
      name: VisitOverTime.section.name,
    },
    headers: VisitOverTimeHeaders,
    id: convertSectionNameToID(VisitOverTime.section.name),
    rows: !VisitOverTime.data
      ? []
      : VisitOverTime.data.map((item) => {
          return {
            hasBorder: false,
            columns: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.indication.label),
                maxLength: maxLengthFourHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.visits),
                maxLength: maxLengthOneHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.interval),
                maxLength: maxLengthOneHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.comments.join(",")),
                maxLength: maxLengthDefault,
              },
            ],
          };
        }),
  };
}

export function CombinationTherapyAPItoUI(
  CombinationTherapy: CombinationTherapyResponse,
  isReadOnly: boolean = false
): GroupedSection {
  return {
    drugVersionCode: SectionCode.CombinationTherapy,
    section: {
      code: CombinationTherapy.section.code,
      name: CombinationTherapy.section.name,
    },
    headers: CombinationTherapyHeaders,
    id: convertSectionNameToID(CombinationTherapy.section.name),
    groups: !CombinationTherapy.data
      ? []
      : CombinationTherapy.data.map((group) => {
          return {
            names: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(group.indication.label),
				maxLength: maxLengthFourHundred,
              },
            ],
            rows: group.data.map((item) => {
              const codes = item.codes.map((code) => code.code).join(", ");
              return {
                hasBorder: false,
                columns: [
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.combination),
                    maxLength: maxLengthDefault,
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(codes),
                    maxLength: maxLengthDefault,
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.comments.join(",")),
                    maxLength: maxLengthDefault,
                  },
                ],
              };
            }),
          };
        }),
  };
}

export function DosingPatternsAPItoUI(
  DosingPatterns: DosingPatternsResponse,
  isReadOnly: boolean = false
): GroupedSection {
  return {
    drugVersionCode: SectionCode.DosingPatterns,
    section: {
      code: DosingPatterns.section.code,
      name: DosingPatterns.section.name,
    },
    headers: DosingPatternsHeaders,
    id: convertSectionNameToID(DosingPatterns.section.name),
    groups: !DosingPatterns.data
      ? []
      : DosingPatterns.data.map((group) => {
          return {
            names: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(group.indication.label),
				maxLength: maxLengthFourHundred,
              },
            ],
            rows: group.data.map((item) => {
              return {
                hasBorder: false,
                columns: [
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.drugLabel),
                    maxLength: maxLengthDefault,
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.clinicalPharma),
                    maxLength: maxLengthDefault,
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.micromedex),
                    maxLength: maxLengthDefault,
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.nccn),
                    maxLength: maxLengthDefault,
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.lexiDrugs),
                    maxLength: maxLengthDefault,
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.ahfsDi),
                    maxLength: maxLengthDefault,
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.other),
                    maxLength: maxLengthDefault,
                  },
                ],
              };
            }),
          };
        }),
  };
}

export function DiagnosisCodeOverlapsConvertAPItoUI(
  diagnosisCodeOverlaps: DiagnosisCodeOverlapsResponse,
  isReadOnly: boolean = false
): Section {
  return {
    drugVersionCode: SectionCode.DiagnosisCodeOverlaps,
    section: {
      code: diagnosisCodeOverlaps.section.code,
      name: diagnosisCodeOverlaps.section.name,
    },
    headers: DiagnosisCodeOverlapsHeaders,
    id: convertSectionNameToID(diagnosisCodeOverlaps.section.name),
    rows: !diagnosisCodeOverlaps.data
      ? []
      : diagnosisCodeOverlaps.data.map((item) => {
          return {
            hasBorder: item.hasBorder,
            columns: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(
                  item.icd10Code ? item.icd10Code.icd10Code : ""
                ),
                maxLength: maxLengthFourHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(
                  item.indication ? item.indication.label : ""
                ),
                maxLength: maxLengthFourHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.units),
                maxLength: maxLengthFourHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.frequency),
                maxLength: maxLengthFourHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.unitsOverTime),
                maxLength: maxLengthFourHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.visitsOverTime),
                maxLength: maxLengthFourHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.age),
                maxLength: maxLengthFourHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.comments.join(", ")),
                maxLength: maxLengthFourHundred,
              },
            ],
          };
        }),
  };
}

export function GlobalReviewIndicationsConvertAPItoUI(
  globalReviewIndications: GlobalReviewIndicationsResponse,
  isReadOnly: boolean = false
): Section {
  return {
    drugVersionCode: SectionCode.GlobalReviewIndications,
    section: {
      code: globalReviewIndications.section.code,
      name: globalReviewIndications.section.name,
    },
    headers: GlobalReviewIndicationsHeaders,
    id: convertSectionNameToID(globalReviewIndications.section.name),
    rows: !globalReviewIndications.data
      ? []
      : globalReviewIndications.data.map((item) => {
          return {
            hasBorder: false,
            columns: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(
                  item.indication ? item.indication.label : ""
                ),
                maxLength: maxLengthFourHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.globalReviewIndication),
                maxLength: maxLengthFourHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.comments.join(", ")),
                maxLength: maxLengthFourHundred,
              },
            ],
          };
        }),
  };
}

export function SecondaryMalignancyAPItoUI(
  SecondaryMalignancy: SecondaryMalignancyResponse,
  isReadOnly: boolean = false
): GroupedSection {
  const codes = SecondaryMalignancy.codes ? SecondaryMalignancy.codes : [];
  return {
    drugVersionCode: SectionCode.SecondaryMalignancy,
    section: {
      code: SecondaryMalignancy.section.code,
      name: SecondaryMalignancy.section.name,
    },
    headers: SecondaryMalignancyHeaders,
    codes: codes,
    codesColumn: {
      value: codes.join(", "),
      isReadOnly: isReadOnly,
    },
    id: convertSectionNameToID(SecondaryMalignancy.section.name),
    groups: !SecondaryMalignancy.data
      ? []
      : SecondaryMalignancy.data.map((group) => {
          return {
            names: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(
                  group.malignancyIcdsCodes
                    .map((item) => {
                      return item.icd10Code;
                    })
                    .join(",")
                ),
                maxLength: maxLengthFourHundred
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(group.secondarySite),
                maxLength: maxLengthFourHundred
              },
            ],
            rows: group.data.map((item) => {
              return {
                hasBorder: item.hasBorder,
                columns: [
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.primaryMalignancy),
                    maxLength: maxLengthFourHundred,
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.units),
                    maxLength: maxLengthFourHundred,
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.frequency),
                    maxLength: maxLengthFourHundred,
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.unitsOverTime),
                    maxLength: maxLengthFourHundred,
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.visitsOverTime),
                    maxLength: maxLengthFourHundred,
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.age),
                    maxLength: maxLengthFourHundred,
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.comments.join(",")),
                    maxLength: maxLengthDefault,
                  },
                ],
              };
            }),
          };
        }),
  };
}

export function GlobalReviewCodesConvertAPItoUI(
  GlobalReviewCodes: GlobalReviewCodesResponse,
  isReadOnly: boolean = false
): Section {
  return {
    drugVersionCode: SectionCode.GlobalReviewCodes,
    section: {
      code: GlobalReviewCodes.section.code,
      name: GlobalReviewCodes.section.name,
    },
    headers: GlobalReviewCodesHeaders,
    id: convertSectionNameToID(GlobalReviewCodes.section.name),
    rows: !GlobalReviewCodes.data
      ? []
      : GlobalReviewCodes.data.map((item) => {
          return {
            hasBorder: false,
            columns: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.currentIcd10CodeRange.icd10Code),
                maxLength: maxLengthFourHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.globalReviewIcd10Code.icd10Code),
                maxLength: maxLengthFourHundred,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.comments.join(",")),
                maxLength: maxLengthFourHundred,
              },
            ],
          };
        }),
  };
}

export function RulesAPItoUI(
  rules: RulesTemplateResponse,
  isReadOnly: boolean = false,
  sectionName: string
): Section {
  return {
    drugVersionCode: SectionCode.Rules,
    section: {
      code: rules.section.code,
      name: sectionName,
    },
    headers: RulesHeaders,
    id: convertSectionNameToID(sectionName),
    rows: !rules.data
      ? []
      : rules.data.map((item) => {
          return {
            hasBorder: false,
            columns: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.rule),
                maxLength: 20,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.description),
                maxLength: 10000,
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.comments.join(", ")),
                maxLength: maxLengthDefault,
              },
            ],
          };
        }),
  };
}

export function convertSectionNameToID(name: string): string {
  return name.replace(/\s/g, "_").toLowerCase();
}

export function aggregatorInformation(item: BaseSectionResponse): UISection {
  switch (item.section.code) {
    case SectionCode.GeneralInformation:
      return {
        id: convertSectionNameToID(item.section.name),
        current: generalInformationConvertAPIToUI(
          item as GeneralInformationTemplateResponse,
          true
        ),
        new: generalInformationConvertAPIToUI(GeneralInformationTemplate),
        hasRowHeading: true,
        grouped: false,
      };
    case SectionCode.References:
      return {
        id: convertSectionNameToID(item.section.name),
        current: referencesConvertAPIToUI(
          item as ReferencesTemplateResponse,
          true
        ),
        new: referencesConvertAPIToUI(ReferenceTemplate),
        hasRowHeading: true,
        grouped: false,
      };
    case SectionCode.LCD:
      return {
        id: convertSectionNameToID(item.section.name),
        current: LCDConvertAPIToUI(item as LCDTemplateResponse, true),
        new: LCDConvertAPIToUI(LCDTemplate),
        hasRowHeading: false,
        grouped: false,
      };
    case SectionCode.Notes:
      return {
        id: convertSectionNameToID(item.section.name),
        current: NotesConvertAPIToUI(item as NotesTemplateResponse, true),
        new: NotesConvertAPIToUI(NotesTemplate),
        hasRowHeading: false,
        grouped: false,
      };

    case SectionCode.MedicalJournal:
      return {
        id: convertSectionNameToID(item.section.name),
        current: MedicalJournalConvertAPIToUI(
          item as MedicalJournalTemplateResponse,
          true
        ),
        new: MedicalJournalConvertAPIToUI(MedicalJournalTemplate),
        hasRowHeading: false,
        grouped: false,
      };
    case SectionCode.Indications:
      return {
        id: convertSectionNameToID(item.section.name),
        current: IndicationsConvertAPIToUI(
          item as IndicationsTemplateResponse,
          true
        ),
        new: IndicationsConvertAPIToUI(IndicationsTemplate),
        hasRowHeading: false,
        grouped: false,
      };
    case SectionCode.DailyMaxUnits:
      return {
        id: convertSectionNameToID(item.section.name),
        current: DailyMaxUnitsConvertAPItoUI(
          item as DailyMaxUnitsTemplateResponse,
          true
        ),
        new: DailyMaxUnitsConvertAPItoUI(DailyMaxUnitsTemplate),
        hasRowHeading: true,
        grouped: false,
      };
    case SectionCode.DiagnosisCodes:
      return {
        id: convertSectionNameToID(item.section.name),
        current: DiagnosisCodesConvertAPItoUI(
          item as DiagnosisCodesTemplateResponse,
          true
        ),
        new: DiagnosisCodesConvertAPItoUI(DiagnosisCodesTemplate),
        hasRowHeading: false,
        grouped: false,
      };
    case SectionCode.DiagnosticCodeSummary:
      return {
        id: convertSectionNameToID(item.section.name),
        current: DiagnosisCodeSummaryConvertAPItoUI(
          item as DiagnosisCodeSummaryTemplateResponse,
          true
        ),
        new: DiagnosisCodeSummaryConvertAPItoUI(DiagnosisCodeSummaryTemplate),
        hasRowHeading: false,
        grouped: false,
      };

    case SectionCode.MaximumFrequency:
      return {
        id: convertSectionNameToID(item.section.name),
        current: MaximumFrecuencyConvertAPItoUI(
          item as MaximumFrequencyTemplateResponse,
          true
        ),
        new: MaximumFrecuencyConvertAPItoUI(MaximumFrequencyTemplate),
        hasRowHeading: false,
        grouped: false,
      };
    case SectionCode.ManifestationCodes:
      return {
        id: convertSectionNameToID(item.section.name),
        current: ManifestationCodesConvertAPItoUI(
          item as ManifestationCodesTemplateResponse,
          true
        ),
        new: ManifestationCodesConvertAPItoUI(ManifestationCodesTemplate),
        hasRowHeading: false,
        grouped: false,
      };
    case SectionCode.Age:
      return {
        id: convertSectionNameToID(item.section.name),
        current: AgeConvertAPItoUI(item as AgeTemplateResponse, true),
        new: AgeConvertAPItoUI(AgeTemplate),
        hasRowHeading: false,
        grouped: false,
      };
    case SectionCode.DailyMaximumDose:
      return {
        id: convertSectionNameToID(item.section.name),
        current: DailyMaximumDoseConvertAPItoUI(
          item as DailyMaximumDoseTemplateResponse,
          true
        ),
        new: DailyMaximumDoseConvertAPItoUI(DailyMaximumDoseTemplate),
        hasRowHeading: false,
        grouped: false,
      };
    case SectionCode.Gender:
      return {
        id: convertSectionNameToID(item.section.name),
        current: GenderConvertAPItoUI(item as GenderTemplateResponse, true),
        new: GenderConvertAPItoUI(GenderTemplate),
        hasRowHeading: false,
        grouped: false,
      };
    case SectionCode.UnitsOverTime:
      return {
        id: convertSectionNameToID(item.section.name),
        current: UnitsOverTimeConvertAPItoUI(
          item as UnitsOverTimeTemplateResponse,
          true
        ),
        new: UnitsOverTimeConvertAPItoUI(UnitsOverTimeTemplate),
        hasRowHeading: false,
        grouped: false,
      };
    case SectionCode.VisitOverTime:
      return {
        id: convertSectionNameToID(item.section.name),
        current: VisitOverTimeConvertAPItoUI(
          item as VisitOverTimeTemplateResponse,
          true
        ),
        new: VisitOverTimeConvertAPItoUI(VisitOverTimeTemplate),
        hasRowHeading: false,
        grouped: false,
      };
    case SectionCode.CombinationTherapy:
      return {
        id: convertSectionNameToID(item.section.name),
        current: CombinationTherapyAPItoUI(
          item as CombinationTherapyResponse,
          true
        ),
        new: CombinationTherapyAPItoUI(CombinationTherapyTemplate),
        hasRowHeading: false,
        grouped: true,
      };
    case SectionCode.DosingPatterns:
      return {
        id: convertSectionNameToID(item.section.name),
        current: DosingPatternsAPItoUI(item as DosingPatternsResponse, true),
        new: DosingPatternsAPItoUI(DosingPatternsTemplate),
        hasRowHeading: false,
        grouped: true,
      };
    case SectionCode.DiagnosisCodeOverlaps:
      return {
        id: convertSectionNameToID(item.section.name),
        current: DiagnosisCodeOverlapsConvertAPItoUI(
          item as DiagnosisCodeOverlapsResponse,
          true
        ),
        new: DiagnosisCodeOverlapsConvertAPItoUI(DiagnosisCodeOverlapsTemplate),
        hasRowHeading: false,
        grouped: false,
      };
    case SectionCode.GlobalReviewIndications:
      return {
        id: convertSectionNameToID(item.section.name),
        current: GlobalReviewIndicationsConvertAPItoUI(
          item as GlobalReviewIndicationsResponse,
          true
        ),
        new: GlobalReviewIndicationsConvertAPItoUI(
          GlobalReviewIndicationsTemplate
        ),
        hasRowHeading: false,
        grouped: false,
      };
    case SectionCode.SecondaryMalignancy:
      return {
        id: convertSectionNameToID(item.section.name),
        current: SecondaryMalignancyAPItoUI(
          item as SecondaryMalignancyResponse,
          true
        ),
        new: SecondaryMalignancyAPItoUI(SecondaryMalignancyTemplate),
        hasRowHeading: false,
        grouped: true,
      };
    case SectionCode.GlobalReviewCodes:
      return {
        id: convertSectionNameToID(item.section.name),
        current: GlobalReviewCodesConvertAPItoUI(
          item as GlobalReviewCodesResponse,
          true
        ),
        new: GlobalReviewCodesConvertAPItoUI(GlobalReviewCodesTemplate),
        hasRowHeading: false,
        grouped: false,
      };
    case SectionCode.Rules:
      const sectionName = item.section.name;
      return {
        id: convertSectionNameToID(sectionName),
        current: RulesAPItoUI(item as RulesTemplateResponse, true, sectionName),
        new: RulesAPItoUI(RulesTemplate, false, sectionName),
        hasRowHeading: false,
        grouped: false,
      };
    default:
      break;
  }
}

export function versionInformation(
  item: BaseSectionResponse
): Section | GroupedSection {
  switch (item.section.code) {
    case SectionCode.GeneralInformation:
      return generalInformationConvertAPIToUI(
        item as GeneralInformationTemplateResponse,
        true
      );
    case SectionCode.References:
      return referencesConvertAPIToUI(item as ReferencesTemplateResponse, true);
    case SectionCode.LCD:
      return LCDConvertAPIToUI(item as LCDTemplateResponse, true);
    case SectionCode.Notes:
      return NotesConvertAPIToUI(item as NotesTemplateResponse, true);
    case SectionCode.MedicalJournal:
      return MedicalJournalConvertAPIToUI(
        item as MedicalJournalTemplateResponse,
        true
      );
    case SectionCode.Indications:
      return IndicationsConvertAPIToUI(
        item as IndicationsTemplateResponse,
        true
      );
    case SectionCode.DailyMaxUnits:
      return DailyMaxUnitsConvertAPItoUI(
        item as DailyMaxUnitsTemplateResponse,
        true
      );
    case SectionCode.DiagnosisCodes:
      return DiagnosisCodesConvertAPItoUI(
        item as DiagnosisCodesTemplateResponse,
        true
      );
    case SectionCode.DiagnosticCodeSummary:
      return DiagnosisCodeSummaryConvertAPItoUI(
        item as DiagnosisCodeSummaryTemplateResponse,
        true
      );
    case SectionCode.MaximumFrequency:
      return MaximumFrecuencyConvertAPItoUI(
        item as MaximumFrequencyTemplateResponse,
        true
      );
    case SectionCode.ManifestationCodes:
      return ManifestationCodesConvertAPItoUI(
        item as ManifestationCodesTemplateResponse,
        true
      );
    case SectionCode.Age:
      return AgeConvertAPItoUI(item as AgeTemplateResponse, true);
    case SectionCode.DailyMaximumDose:
      return DailyMaximumDoseConvertAPItoUI(
        item as DailyMaximumDoseTemplateResponse,
        true
      );
    case SectionCode.Gender:
      return GenderConvertAPItoUI(item as GenderTemplateResponse, true);
    case SectionCode.UnitsOverTime:
      return UnitsOverTimeConvertAPItoUI(
        item as UnitsOverTimeTemplateResponse,
        true
      );
    case SectionCode.VisitOverTime:
      return VisitOverTimeConvertAPItoUI(
        item as VisitOverTimeTemplateResponse,
        true
      );
    case SectionCode.CombinationTherapy:
      return CombinationTherapyAPItoUI(
        item as CombinationTherapyResponse,
        true
      );
    case SectionCode.DosingPatterns:
      return DosingPatternsAPItoUI(item as DosingPatternsResponse, true);
    case SectionCode.DiagnosisCodeOverlaps:
      return DiagnosisCodeOverlapsConvertAPItoUI(
        item as DiagnosisCodeOverlapsResponse,
        true
      );
    case SectionCode.GlobalReviewIndications:
      return GlobalReviewIndicationsConvertAPItoUI(
        item as GlobalReviewIndicationsResponse,
        true
      );
    case SectionCode.SecondaryMalignancy:
      return SecondaryMalignancyAPItoUI(
        item as SecondaryMalignancyResponse,
        true
      );
    case SectionCode.GlobalReviewCodes:
      return GlobalReviewCodesConvertAPItoUI(
        item as GlobalReviewCodesResponse,
        true
      );
    case SectionCode.Rules:
      return RulesAPItoUI(
        item as RulesTemplateResponse,
        true,
        item.section.name
      );
    default:
      break;
  }
}

export function createNavigation(
  sections: UISection[],
  versionStatus: string = ""
): NavigationItem[] {
  return sections.map((section) => {
    let id = section.new.section.name;
    let name = section.new.section.name;
    if (section.current.section.code === SectionCode.DosingPatterns) {
      id = section.current.section.name;
    }
    if (section.current.section.code === SectionCode.Rules) {
      id = section.current.section.name;
    }
    if (section.current.section.code === SectionCode.DailyMaxUnits) {
      if (
        versionStatus === drugVersionStatus.Approved.code ||
        versionStatus === drugVersionStatus.PendingApproval.code
      ) {
        name = ` ${name} ${section.new.codes.join(", ")}`;
      } else if (versionStatus === drugVersionStatus.Draft.code) {
        name = ` ${section.current.section.name} ${section.current.codes.join(
          ", "
        )}`;
      }
    }

    return {
      name: name,
      id: convertSectionNameToID(id),
    };
  });
}

export function clearNewSection(
  code: string,
  name: string
): Section | GroupedSection {
  switch (code) {
    case SectionCode.GeneralInformation:
      return generalInformationConvertAPIToUI(GeneralInformationTemplate);
    case SectionCode.References:
      return referencesConvertAPIToUI(ReferenceTemplate);
    case SectionCode.LCD:
      return LCDConvertAPIToUI(LCDTemplate);
    case SectionCode.Notes:
      return NotesConvertAPIToUI(NotesTemplate);
    case SectionCode.MedicalJournal:
      return MedicalJournalConvertAPIToUI(MedicalJournalTemplate);
    case SectionCode.Indications:
      return IndicationsConvertAPIToUI(IndicationsTemplate);
    case SectionCode.DailyMaxUnits:
      return DailyMaxUnitsConvertAPItoUI(DailyMaxUnitsTemplate);
    case SectionCode.DiagnosisCodes:
      return DiagnosisCodesConvertAPItoUI(DiagnosisCodesTemplate);
    case SectionCode.DiagnosticCodeSummary:
      return DiagnosisCodeSummaryConvertAPItoUI(DiagnosisCodeSummaryTemplate);
    case SectionCode.MaximumFrequency:
      return MaximumFrecuencyConvertAPItoUI(MaximumFrequencyTemplate);
    case SectionCode.ManifestationCodes:
      return ManifestationCodesConvertAPItoUI(ManifestationCodesTemplate);
    case SectionCode.Age:
      return AgeConvertAPItoUI(AgeTemplate);
    case SectionCode.DailyMaximumDose:
      return DailyMaximumDoseConvertAPItoUI(DailyMaximumDoseTemplate);
    case SectionCode.Gender:
      return GenderConvertAPItoUI(GenderTemplate);
    case SectionCode.UnitsOverTime:
      return UnitsOverTimeConvertAPItoUI(UnitsOverTimeTemplate);
    case SectionCode.VisitOverTime:
      return VisitOverTimeConvertAPItoUI(VisitOverTimeTemplate);
    case SectionCode.CombinationTherapy:
      return CombinationTherapyAPItoUI(CombinationTherapyTemplate);
    case SectionCode.DosingPatterns:
      return DosingPatternsAPItoUI(DosingPatternsTemplate);
    case SectionCode.DiagnosisCodeOverlaps:
      return DiagnosisCodeOverlapsConvertAPItoUI(DiagnosisCodeOverlapsTemplate);
    case SectionCode.GlobalReviewIndications:
      return GlobalReviewIndicationsConvertAPItoUI(
        GlobalReviewIndicationsTemplate
      );
    case SectionCode.SecondaryMalignancy:
      return SecondaryMalignancyAPItoUI(SecondaryMalignancyTemplate);
    case SectionCode.GlobalReviewCodes:
      return GlobalReviewCodesConvertAPItoUI(GlobalReviewCodesTemplate);
    case SectionCode.Rules:
      return RulesAPItoUI(RulesTemplate, false, name);
    default:
      break;
  }
}
