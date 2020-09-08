import { SectionCode } from "../models/constants/sectioncode.constant";
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
import { GroupedSection, Section } from "../models/interfaces/uibase";
import { cleanData } from "./tools.utils";

function generalInformationConvertUItoAPI(
  generalInformation: Section
): GeneralInformationTemplateResponse {
  return {
    drugVersionCode: generalInformation.drugVersionCode,
    section: {
      code: generalInformation.section.code,
      name: generalInformation.section.name,
    },
    data: generalInformation.rows.map((itemRow, index) => {
      return {
        code: "",
        item: { code: "", name: cleanData(itemRow.columns[0].value) },
        itemDetails: cleanData(itemRow.columns[1].value),
        comments: cleanData(itemRow.columns[2].value).split(","),
        order: index,
      };
    }),
  };
}

function referencesConvertUItoAPI(
  references: Section
): ReferencesTemplateResponse {
  return {
    drugVersionCode: references.drugVersionCode,
    section: {
      code: references.section.code,
      name: references.section.name,
    },
    data: references.rows.map((itemRow, index) => {
      return {
        code: "",
        referenceSourceDto: {
          code: "",
          name: cleanData(itemRow.columns[0].value),
        },
        referenceDetails: cleanData(itemRow.columns[1].value),
        comments: cleanData(itemRow.columns[2].value).split(","),
        order: index,
      };
    }),
  };
}

function medicalJournalConverUIToAPI(
  medicalJournal: Section
): MedicalJournalTemplateResponse {
  return {
    drugVersionCode: medicalJournal.drugVersionCode,
    section: {
      code: medicalJournal.section.code,
      name: medicalJournal.section.name,
    },
    data: medicalJournal.rows.map((itemRow, index) => {
      return {
        code: "",
        citation: cleanData(itemRow.columns[0].value),
        comments: cleanData(itemRow.columns[1].value).split(","),
        order: index,
      };
    }),
  };
}

function manifestationCodesConvertUIToAPI(
  manifestationCodes: Section
): ManifestationCodesTemplateResponse {
  return {
    drugVersionCode: manifestationCodes.drugVersionCode,
    section: {
      code: manifestationCodes.section.code,
      name: manifestationCodes.section.name,
    },
    data: manifestationCodes.rows.map((itemRow, index) => {
      return {
        code: "",
        icd10Code: {
          icd10CodeId: 0,
          icd10Code: cleanData(itemRow.columns[0].value),
          description: "",
        },
        indication: cleanData(itemRow.columns[1].value),
        comments: cleanData(itemRow.columns[2].value).split(","),
        order: index,
      };
    }),
  };
}

function diagnosisCodeSummaryConvertUIToAPI(
  diagnosisCodeSummary: Section
): DiagnosisCodeSummaryTemplateResponse {
  return {
    drugVersionCode: diagnosisCodeSummary.drugVersionCode,
    section: {
      code: diagnosisCodeSummary.section.code,
      name: diagnosisCodeSummary.section.name,
    },
    data: diagnosisCodeSummary.rows.map((itemRow, index) => {
      return {
        code: "",
        indication: cleanData(itemRow.columns[0].value),
        icd10Codes: cleanSplitArrays(cleanData(itemRow.columns[1].value)),
        comments: cleanData(itemRow.columns[2].value).split(","),
        order: index,
      };
    }),
  };
}

function diagnosisCodesConvertUIToAPI(
  diagnosisCodes: Section
): DiagnosisCodesTemplateResponse {
  return {
    drugVersionCode: diagnosisCodes.drugVersionCode,
    section: {
      code: diagnosisCodes.section.code,
      name: diagnosisCodes.section.name,
    },
    data: diagnosisCodes.rows.map((itemRow, index) => {
      const nccnCodes = cleanSplitArrays(
        cleanData(itemRow.columns[1].value)
      ).map((ncc) => {
        return {
          icd10CodeId: 0,
          icd10Code: ncc,
          description: "",
        };
      });

      const lcdCodes = cleanSplitArrays(
        cleanData(itemRow.columns[2].value)
      ).map((ncc) => {
        return {
          icd10CodeId: 0,
          icd10Code: ncc,
          description: "",
        };
      });

      return {
        code: "",
        comments: cleanData(itemRow.columns[3].value).split(","),
        indication: cleanData(itemRow.columns[0].value),
        nccnIcdsCodes: nccnCodes,
        lcdIcdsCodes: lcdCodes,
        order: index,
      };
    }),
  };
}

function notesConvertUIToAPI(notes: Section): NotesTemplateResponse {
  return {
    drugVersionCode: notes.drugVersionCode,
    section: {
      code: notes.section.code,
      name: notes.section.name,
    },
    data: notes.rows.map((itemRow, index) => {
      return {
        code: "",
        note: cleanData(itemRow.columns[0].value),
        comments: cleanData(itemRow.columns[1].value).split(","),
        order: index,
      };
    }),
  };
}

function LCDConvertUIToAPI(lcd: Section): LCDTemplateResponse {
  return {
    drugVersionCode: lcd.drugVersionCode,
    section: {
      code: lcd.section.code,
      name: lcd.section.name,
    },
    data: lcd.rows.map((itemRow, index) => {
      return {
        code: "",
        lcd: cleanData(itemRow.columns[0].value),
        comments: cleanData(itemRow.columns[2].value).split(","),
        macName: cleanData(itemRow.columns[1].value),
        order: index,
      };
    }),
  };
}

function dailyMaximumDoseConvertUIToAPI(
  dmd: Section
): DailyMaximumDoseTemplateResponse {
  return {
    drugVersionCode: dmd.drugVersionCode,
    section: {
      code: dmd.section.code,
      name: dmd.section.name,
    },
    data: dmd.rows.map((itemRow, index) => {
      return {
        code: "",
        indication: {
          code: "",
          label: cleanData(itemRow.columns[0].value),
        },
        maximumDosingPattern: cleanData(itemRow.columns[1].value),
        maximumDose: cleanData(itemRow.columns[2].value),
        maximumUnits: cleanData(itemRow.columns[3].value),
        comments: cleanData(itemRow.columns[4].value).split(","),
        order: index,
      };
    }),
  };
}

function IndicationsConvertUIToAPI(
  indications: Section
): IndicationsTemplateResponse {
  return {
    drugVersionCode: indications.drugVersionCode,
    section: {
      code: indications.section.code,
      name: indications.section.name,
    },
    data: indications.rows.map((itemRow, index) => {
      return {
        code: "",
        drugLabel: cleanData(itemRow.columns[0].value),
        clinicalPharmacology: cleanData(itemRow.columns[1].value),
        micromedexDrugDex: cleanData(itemRow.columns[2].value),
        nccn: cleanData(itemRow.columns[3].value),
        lexiDrugs: cleanData(itemRow.columns[4].value),
        ahfsDi: cleanData(itemRow.columns[5].value),
        lcd: cleanData(itemRow.columns[6].value),
        order: index,
      };
    }),
  };
}

function maximumFrequencyConvertUIToAPI(
  maxFreq: Section
): MaximumFrequencyTemplateResponse {
  return {
    drugVersionCode: maxFreq.drugVersionCode,
    section: {
      code: maxFreq.section.code,
      name: maxFreq.section.name,
    },
    data: maxFreq.rows.map((itemRow, index) => {
      return {
        code: "",
        indication: cleanData(itemRow.columns[0].value),
        maximumFrequency: cleanData(itemRow.columns[1].value),
        comments: cleanData(itemRow.columns[2].value).split(","),
        order: index,
      };
    }),
  };
}

function UnitsOverTimeConvertUIToAPI(
  uot: Section
): UnitsOverTimeTemplateResponse {
  return {
    drugVersionCode: uot.drugVersionCode,
    section: {
      code: uot.section.code,
      name: uot.section.name,
    },
    data: uot.rows.map((itemRow, index) => {
      return {
        code: "",
        indication: { code: "", label: cleanData(itemRow.columns[0].value) },
        units: cleanData(itemRow.columns[1].value),
        interval: cleanData(itemRow.columns[2].value),
        comments: cleanData(itemRow.columns[3].value).split(","),
        order: index,
      };
    }),
  };
}

function VisitsOverTimeConvertUIToAPI(
  vot: Section
): VisitOverTimeTemplateResponse {
  return {
    drugVersionCode: vot.drugVersionCode,
    section: {
      code: vot.section.code,
      name: vot.section.name,
    },
    data: vot.rows.map((itemRow, index) => {
      return {
        code: "",
        indication: { code: "", label: cleanData(itemRow.columns[0].value) },
        visits: cleanData(itemRow.columns[1].value),
        interval: cleanData(itemRow.columns[2].value),
        comments: cleanData(itemRow.columns[3].value).split(","),
        order: index,
      };
    }),
  };
}

function GlobalReviewCodesConvertUIToAPI(
  GlobalReview: Section
): GlobalReviewCodesResponse {
  return {
    drugVersionCode: GlobalReview.drugVersionCode,
    section: {
      code: GlobalReview.section.code,
      name: GlobalReview.section.name,
    },
    data: GlobalReview.rows.map((itemRow, index) => {
      return {
        code: "",
        currentIcd10CodeRange: {
          icd10CodeId: 0,
          icd10Code: cleanData(itemRow.columns[0].value),
        },
        globalReviewIcd10Code: {
          icd10CodeId: 0,
          icd10Code: cleanData(itemRow.columns[1].value),
        },
        comments: cleanData(itemRow.columns[2].value).split(","),
        order: index,
      };
    }),
  };
}

function GlobalReviewIndicationsConvertUIToAPI(
  GlobalReview: Section
): GlobalReviewIndicationsResponse {
  return {
    drugVersionCode: GlobalReview.drugVersionCode,
    section: {
      code: GlobalReview.section.code,
      name: GlobalReview.section.name,
    },
    data: GlobalReview.rows.map((itemRow, index) => {
      return {
        code: "",
        indication: { code: "", label: cleanData(itemRow.columns[0].value) },
        globalReviewIndication: cleanData(itemRow.columns[1].value),
        comments: cleanData(itemRow.columns[2].value).split(","),
        order: index,
      };
    }),
  };
}

function CombinationTherapyConvertUIToAPI(
  Combination: GroupedSection
): CombinationTherapyResponse {
  return {
    drugVersionCode: Combination.drugVersionCode,
    section: {
      code: Combination.section.code,
      name: Combination.section.name,
    },
    data: Combination.groups.map((group) => {
      return {
        indication: { code: "", label: cleanData(group.names[0].value) },
        data: group.rows.map((itemRow, index) => {
          const codes = cleanData(itemRow.columns[1].value)
            .split(",")
            .map((code) => {
              return code ? { code } : {};
            });
          return Object.keys(codes[0]).length === 1
            ? {
                code: "",
                combination: cleanData(itemRow.columns[0].value),
                codes: codes,
                comments: cleanData(itemRow.columns[2].value).split(","),
                order: index,
              }
            : {
                code: "",
                combination: cleanData(itemRow.columns[0].value),
                comments: cleanData(itemRow.columns[2].value).split(","),
                order: index,
              };
        }),
      };
    }),
  };
}

function AgeConvertUIToAPI(age: Section): AgeTemplateResponse {
  return {
    drugVersionCode: age.drugVersionCode,
    section: {
      code: age.section.code,
      name: age.section.name,
    },
    data: age.rows.map((itemRow, index) => {
      return {
        code: "",
        indication: {
          code: "",
          label: cleanData(itemRow.columns[0].value),
        },
        age: cleanData(itemRow.columns[1].value),
        comments: cleanData(itemRow.columns[2].value).split(","),
        order: index,
      };
    }),
  };
}

function dailyMaxUnitsConvertUIToAPI(
  dailyMaxUnits: Section
): DailyMaxUnitsTemplateResponse {
  const codes = cleanSplitArrays(cleanData(dailyMaxUnits.codesColumn.value));
  return {
    drugVersionCode: dailyMaxUnits.drugVersionCode,
    section: {
      code: dailyMaxUnits.section.code,
      name: dailyMaxUnits.section.name,
    },
    codes: codes,
    data: dailyMaxUnits.rows.map((itemRow, index) => {
      return {
        code: "",
        hasBorder: itemRow.hasBorder,
        dmuvItemDto: {
          name: cleanData(itemRow.columns[0].value),
        },
        currentValues: cleanData(itemRow.columns[1].value),
        newValues: cleanData(itemRow.columns[2].value),
        comments: cleanData(itemRow.columns[3].value).split(","),
        order: index,
      };
    }),
  };
}

function DosingPatternsConvertUIToAPI(
  Dosing: GroupedSection
): DosingPatternsResponse {
  return {
    drugVersionCode: Dosing.drugVersionCode,
    section: {
      code: Dosing.section.code,
      name: Dosing.section.name,
    },
    data: Dosing.groups.map((group) => {
      return {
        indication: { code: "", label: cleanData(group.names[0].value) },
        data: group.rows.map((itemRow, index) => {
          return {
            code: "",
            drugLabel: cleanData(itemRow.columns[0].value),
            clinicalPharma: cleanData(itemRow.columns[1].value),
            micromedex: cleanData(itemRow.columns[2].value),
            nccn: cleanData(itemRow.columns[3].value),
            lexiDrugs: cleanData(itemRow.columns[4].value),
            ahfsDi: cleanData(itemRow.columns[5].value),
            other: cleanData(itemRow.columns[6].value),
            order: index,
          };
        }),
      };
    }),
  };
}

function GenderConvertUIToAPI(gender: Section): GenderTemplateResponse {
  return {
    drugVersionCode: gender.drugVersionCode,
    section: {
      code: gender.section.code,
      name: gender.section.name,
    },
    data: gender.rows.map((itemRow, index) => {
      return {
        code: "",
        indication: {
          code: "",
          label: cleanData(itemRow.columns[0].value),
        },
        gender: cleanData(itemRow.columns[1].value),
        comments: cleanData(itemRow.columns[2].value).split(","),
        order: index,
      };
    }),
  };
}

function diagnosisCodeOverlapsConvertUIToAPI(
  dco: Section
): DiagnosisCodeOverlapsResponse {
  return {
    drugVersionCode: dco.drugVersionCode,
    section: {
      code: dco.section.code,
      name: dco.section.name,
    },
    data: dco.rows.map((itemRow, index) => {
      return {
        code: "",
        hasBorder: itemRow.hasBorder,
        order: index,
        icd10Code: {
          icd10Code: cleanData(itemRow.columns[0].value),
          description: "",
        },
        indication: { code: "", label: cleanData(itemRow.columns[1].value) },
        units: cleanData(itemRow.columns[2].value),
        frequency: cleanData(itemRow.columns[3].value),
        unitsOverTime: cleanData(itemRow.columns[4].value),
        visitsOverTime: cleanData(itemRow.columns[5].value),
        age: cleanData(itemRow.columns[6].value),
        comments: cleanData(itemRow.columns[7].value).split(","),
      };
    }),
  };
}

function rulesConvertUIToAPI(
  rule: Section,
  drugCode: string = ""
): RulesTemplateResponse {
  return {
    drugVersionCode: rule.drugVersionCode,
    drugCode: drugCode,
    section: {
      code: rule.section.code,
      name: rule.section.name,
    },
    data: rule.rows.map((itemRow, index) => {
      return {
        code: "",
        rule: cleanData(itemRow.columns[0].value),
        description: cleanData(itemRow.columns[1].value),
        comments: cleanData(itemRow.columns[2].value).split(","),
        order: index,
      };
    }),
  };
}

function secondaryMalignancyConvertUIToAPI(
  secondaryMalignancy: GroupedSection
): SecondaryMalignancyResponse {
  const codes = cleanSplitArrays(
    cleanData(secondaryMalignancy.codesColumn.value)
  );
  return {
    drugVersionCode: secondaryMalignancy.drugVersionCode,
    section: {
      code: secondaryMalignancy.section.code,
      name: secondaryMalignancy.section.name,
    },
    codes: codes,
    data: secondaryMalignancy.groups.map((group) => {
      const malignancyIcdCodes = cleanSplitArrays(
        cleanData(group.names[0].value)
      ).map((code) => {
        return { icd10Code: code };
      });
      const secondarySite = cleanData(group.names[1].value);
      return {
        malignancyIcdsCodes: malignancyIcdCodes,
        secondarySite: secondarySite,
        data: group.rows.map((itemRow, index) => {
          return {
            code: "",
            order: index,
            hasBorder: itemRow.hasBorder,
            primaryMalignancy: cleanData(itemRow.columns[0].value),
            units: cleanData(itemRow.columns[1].value),
            frequency: cleanData(itemRow.columns[2].value),
            unitsOverTime: cleanData(itemRow.columns[3].value),
            visitsOverTime: cleanData(itemRow.columns[4].value),
            age: cleanData(itemRow.columns[5].value),
            comments: cleanData(itemRow.columns[6].value).split(","),
          };
        }),
      };
    }),
  };
}

export function convertIUtoAPI(
  item: Section | GroupedSection,
  drugCode: string = ""
): any {
  switch (item.section.code) {
    case SectionCode.GeneralInformation:
      return generalInformationConvertUItoAPI(item as Section);
    case SectionCode.References:
      return referencesConvertUItoAPI(item as Section);
    case SectionCode.LCD:
      return LCDConvertUIToAPI(item as Section);
    case SectionCode.Notes:
      return notesConvertUIToAPI(item as Section);
    case SectionCode.MedicalJournal:
      return medicalJournalConverUIToAPI(item as Section);
    case SectionCode.Indications:
      return IndicationsConvertUIToAPI(item as Section);
    case SectionCode.DailyMaxUnits:
      return dailyMaxUnitsConvertUIToAPI(item as Section);
    case SectionCode.DiagnosisCodes:
      return diagnosisCodesConvertUIToAPI(item as Section);
    case SectionCode.DiagnosticCodeSummary:
      return diagnosisCodeSummaryConvertUIToAPI(item as Section);
    case SectionCode.MaximumFrequency:
      return maximumFrequencyConvertUIToAPI(item as Section);
    case SectionCode.ManifestationCodes:
      return manifestationCodesConvertUIToAPI(item as Section);
    case SectionCode.Age:
      return AgeConvertUIToAPI(item as Section);
    case SectionCode.DailyMaximumDose:
      return dailyMaximumDoseConvertUIToAPI(item as Section);
    case SectionCode.Gender:
      return GenderConvertUIToAPI(item as Section);
    case SectionCode.UnitsOverTime:
      return UnitsOverTimeConvertUIToAPI(item as Section);
    case SectionCode.VisitOverTime:
      return VisitsOverTimeConvertUIToAPI(item as Section);
    case SectionCode.CombinationTherapy:
      return CombinationTherapyConvertUIToAPI(item as GroupedSection);
    case SectionCode.DosingPatterns:
      return DosingPatternsConvertUIToAPI(item as GroupedSection);
    case SectionCode.DiagnosisCodeOverlaps:
      return diagnosisCodeOverlapsConvertUIToAPI(item as Section);
    case SectionCode.GlobalReviewIndications:
      return GlobalReviewIndicationsConvertUIToAPI(item as Section);
    case SectionCode.SecondaryMalignancy:
      return secondaryMalignancyConvertUIToAPI(item as GroupedSection);
    case SectionCode.GlobalReviewCodes:
      return GlobalReviewCodesConvertUIToAPI(item as Section);
    case SectionCode.Rules:
      return rulesConvertUIToAPI(item as Section, drugCode);
    default:
      return;
  }
}

function cleanSplitArrays(value: string): string[] {
  return value
    .split(",")
    .map((code) => code.trim())
    .filter((code) => code);
}
