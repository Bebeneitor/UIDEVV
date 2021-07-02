import { SectionCode } from "../models/constants/sectioncode.constant";
import {
  AgeTemplateResponse,
  CombinationTherapyResponse,
  DailyMaximumDoseTemplateResponse,
  DailyMaxUnitsGroupedTemplateResponse,
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
import {
  cleanData,
  getColumnComments,
  getColumnFeedbacks,
  getSectionRowComments,
  getSectionRowFeedbacks,
  transformUItoAPIFeedback,
} from "./tools.utils";

function commonConvertUItoAPI(section: Section | GroupedSection) {
  return {
    drugVersionCode: section.drugVersionCode,
    section: {
      code: section.section.code,
      name: section.section.name,
    },
    uiDecorator: {
      sectionActive: section.enabled,
      sectionComplete: section.completed,
      deletedRowFeedbackItemList: transformUItoAPIFeedback(
        section.feedbackData
      ),
    },
  };
}

function generalInformationConvertUItoAPI(
  generalInformation: GroupedSection
): GeneralInformationTemplateResponse {
  return {
    ...commonConvertUItoAPI(generalInformation),
    data: generalInformation.groups.map((group) => {
      const groupNamesFeedback = getColumnFeedbacks(group.names);
      const groupNamesComments = getColumnComments(group.names);
      return {
        item: { code: "", name: cleanData(group.names[0].value) },
        data: group.rows.map((itemRow, index) => {
          const feedBack = index === 0 ? groupNamesFeedback : [];
          const comments = index === 0 ? groupNamesComments : [];
          return {
            code: itemRow.code,
            itemDetails: cleanData(itemRow.columns[0].value),
            comments: Array.of(cleanData(itemRow.columns[1].value)),
            order: index,
            feedbackItemsList: feedBack.concat(getSectionRowFeedbacks(itemRow)),
            documentNoteList: comments.concat(getSectionRowComments(itemRow)),
          };
        }),
      };
    }),
  };
}

function referencesConvertUItoAPI(
  dco: GroupedSection
): ReferencesTemplateResponse {
  return {
    ...commonConvertUItoAPI(dco),
    data: dco.groups.map((group) => {
      const groupNamesFeedback = getColumnFeedbacks(group.names);
      const groupNamesComments = getColumnComments(group.names);
      return {
        referenceSourceDto: {
          code: "",
          name: cleanData(group.names[0].value),
        },
        data: group.rows.map((itemRow, index) => {
          const feedBack = index === 0 ? groupNamesFeedback : [];
          const comments = index === 0 ? groupNamesComments : [];
          return {
            code: itemRow.code,
            referenceDetails: cleanData(itemRow.columns[0].value),
            comments: Array.of(cleanData(itemRow.columns[1].value)),
            order: index,
            feedbackItemsList: feedBack.concat(getSectionRowFeedbacks(itemRow)),
            documentNoteList: comments.concat(getSectionRowComments(itemRow)),
          };
        }),
      };
    }),
  };
}

function medicalJournalConverUIToAPI(
  medicalJournal: Section
): MedicalJournalTemplateResponse {
  return {
    ...commonConvertUItoAPI(medicalJournal),
    data: medicalJournal.rows.map((itemRow, index) => {
      return {
        code: itemRow.code,
        citation: cleanData(itemRow.columns[0].value),
        comments: Array.of(cleanData(itemRow.columns[1].value)),
        order: index,
        feedbackItemsList: getSectionRowFeedbacks(itemRow),
        documentNoteList: getSectionRowComments(itemRow),
      };
    }),
  };
}

function manifestationCodesConvertUIToAPI(
  manifestationCodes: Section
): ManifestationCodesTemplateResponse {
  return {
    ...commonConvertUItoAPI(manifestationCodes),
    data: manifestationCodes.rows.map((itemRow, index) => {
      return {
        code: itemRow.code,
        icd10Code: {
          icd10CodeId: 0,
          icd10Code: cleanData(itemRow.columns[0].value),
          description: "",
        },
        indication: { code: "", label: cleanData(itemRow.columns[1].value) },
        comments: Array.of(cleanData(itemRow.columns[2].value)),
        order: index,
        feedbackItemsList: getSectionRowFeedbacks(itemRow),
        documentNoteList: getSectionRowComments(itemRow),
      };
    }),
  };
}

function diagnosisCodeSummaryConvertUIToAPI(
  diagnosisCodeSummary: Section
): DiagnosisCodeSummaryTemplateResponse {
  return {
    ...commonConvertUItoAPI(diagnosisCodeSummary),
    data: diagnosisCodeSummary.rows.map((itemRow, index) => {
      return {
        code: itemRow.code,
        indication: {
          code: "",
          label: cleanData(itemRow.columns[0].value),
        },
        icd10Codes: cleanSplitArrays(cleanData(itemRow.columns[1].value)),
        invalidIcd10Codes: [],
        comments: Array.of(cleanData(itemRow.columns[2].value)),
        order: index,
        feedbackItemsList: getSectionRowFeedbacks(itemRow),
        documentNoteList: getSectionRowComments(itemRow),
      };
    }),
  };
}

function diagnosisCodesConvertUIToAPI(
  diagnosisCodes: Section
): DiagnosisCodesTemplateResponse {
  return {
    ...commonConvertUItoAPI(diagnosisCodes),
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
        code: itemRow.code,
        comments: Array.of(cleanData(itemRow.columns[3].value)),
        indication: cleanData(itemRow.columns[0].value),
        nccnIcdsCodes: nccnCodes,
        lcdIcdsCodes: lcdCodes,
        lcdIcdsCodesInvalid: [],
        order: index,
        feedbackItemsList: getSectionRowFeedbacks(itemRow),
        documentNoteList: getSectionRowComments(itemRow),
      };
    }),
  };
}

function notesConvertUIToAPI(notes: Section): NotesTemplateResponse {
  return {
    ...commonConvertUItoAPI(notes),
    data: notes.rows.map((itemRow, index) => {
      return {
        code: itemRow.code,
        note: cleanData(itemRow.columns[0].value),
        comments: Array.of(cleanData(itemRow.columns[1].value)),
        order: index,
        feedbackItemsList: getSectionRowFeedbacks(itemRow),
        documentNoteList: getSectionRowComments(itemRow),
      };
    }),
  };
}

function LCDConvertUIToAPI(lcd: Section): LCDTemplateResponse {
  return {
    ...commonConvertUItoAPI(lcd),
    data: lcd.rows.map((itemRow, index) => {
      return {
        code: itemRow.code,
        lcd: cleanData(itemRow.columns[0].value),
        comments: Array.of(cleanData(itemRow.columns[2].value)),
        macName: cleanData(itemRow.columns[1].value),
        order: index,
        feedbackItemsList: getSectionRowFeedbacks(itemRow),
        documentNoteList: getSectionRowComments(itemRow),
      };
    }),
  };
}

function dailyMaximumDoseConvertUIToAPI(
  dmd: GroupedSection
): DailyMaximumDoseTemplateResponse {
  return {
    ...commonConvertUItoAPI(dmd),
    data: dmd.groups.map((group) => {
      const groupNamesFeedback = getColumnFeedbacks(group.names);
      const groupNamesComments = getColumnComments(group.names);
      return {
        indication: {
          code: "",
          label: cleanData(group.names[0].value),
        },
        data: group.rows.map((itemRow, index) => {
          const feedBack = index === 0 ? groupNamesFeedback : [];
          const comments = index === 0 ? groupNamesComments : [];
          return {
            code: itemRow.code,
            maximumDosingPattern: cleanData(itemRow.columns[0].value),
            maximumDose: cleanData(itemRow.columns[1].value),
            maximumUnits: cleanData(itemRow.columns[2].value),
            comments: Array.of(cleanData(itemRow.columns[3].value)),
            order: index,
            feedbackItemsList: feedBack.concat(getSectionRowFeedbacks(itemRow)),
            documentNoteList: comments.concat(getSectionRowComments(itemRow)),
          };
        }),
      };
    }),
  };
}

function IndicationsConvertUIToAPI(
  indications: Section
): IndicationsTemplateResponse {
  return {
    ...commonConvertUItoAPI(indications),
    data: indications.rows.map((itemRow, index) => {
      return {
        code: itemRow.code,
        drugLabel: cleanData(itemRow.columns[0].value),
        clinicalPharmacology: cleanData(itemRow.columns[1].value),
        micromedexDrugDex: cleanData(itemRow.columns[2].value),
        nccn: cleanData(itemRow.columns[3].value),
        lexiDrugs: cleanData(itemRow.columns[4].value),
        ahfsDi: cleanData(itemRow.columns[5].value),
        lcd: cleanData(itemRow.columns[6].value),
        order: index,
        feedbackItemsList: getSectionRowFeedbacks(itemRow),
        documentNoteList: getSectionRowComments(itemRow),
      };
    }),
  };
}

function maximumFrequencyConvertUIToAPI(
  maxFreq: GroupedSection
): MaximumFrequencyTemplateResponse {
  return {
    ...commonConvertUItoAPI(maxFreq),
    data: maxFreq.groups.map((group) => {
      const groupNamesFeedback = getColumnFeedbacks(group.names);
      const groupNamesComments = getColumnComments(group.names);
      return {
        indication: cleanData(group.names[0].value),
        data: group.rows.map((itemRow, index) => {
          const feedBack = index === 0 ? groupNamesFeedback : [];
          const comments = index === 0 ? groupNamesComments : [];
          return {
            code: itemRow.code,
            maximumFrequency: cleanData(itemRow.columns[0].value),
            comments: Array.of(cleanData(itemRow.columns[1].value)),
            order: index,
            feedbackItemsList: feedBack.concat(getSectionRowFeedbacks(itemRow)),
            documentNoteList: comments.concat(getSectionRowComments(itemRow)),
          };
        }),
      };
    }),
  };
}

function UnitsOverTimeConvertUIToAPI(
  uot: GroupedSection
): UnitsOverTimeTemplateResponse {
  return {
    ...commonConvertUItoAPI(uot),
    data: uot.groups.map((group) => {
      const groupNamesFeedback = getColumnFeedbacks(group.names);
      const groupNamesComments = getColumnComments(group.names);
      return {
        indication: { code: "", label: cleanData(group.names[0].value) },
        data: group.rows.map((itemRow, index) => {
          const feedBack = index === 0 ? groupNamesFeedback : [];
          const comments = index === 0 ? groupNamesComments : [];
          return {
            code: itemRow.code,
            units: cleanData(itemRow.columns[0].value),
            interval: cleanData(itemRow.columns[1].value),
            comments: Array.of(cleanData(itemRow.columns[2].value)),
            order: index,
            feedbackItemsList: feedBack.concat(getSectionRowFeedbacks(itemRow)),
            documentNoteList: comments.concat(getSectionRowComments(itemRow)),
          };
        }),
      };
    }),
  };
}

function VisitsOverTimeConvertUIToAPI(
  vot: GroupedSection
): VisitOverTimeTemplateResponse {
  return {
    ...commonConvertUItoAPI(vot),
    data: vot.groups.map((group) => {
      const groupNamesFeedback = getColumnFeedbacks(group.names);
      const groupNamesComments = getColumnComments(group.names);
      return {
        indication: {
          code: "",
          label: cleanData(group.names[0].value),
        },
        data: group.rows.map((itemRow, index) => {
          const feedBack = index === 0 ? groupNamesFeedback : [];
          const comments = index === 0 ? groupNamesComments : [];
          return {
            code: itemRow.code,
            visits: cleanData(itemRow.columns[0].value),
            interval: cleanData(itemRow.columns[1].value),
            comments: Array.of(cleanData(itemRow.columns[2].value)),
            order: index,
            feedbackItemsList: feedBack.concat(getSectionRowFeedbacks(itemRow)),
            documentNoteList: comments.concat(getSectionRowComments(itemRow)),
          };
        }),
      };
    }),
  };
}

function GlobalReviewCodesConvertUIToAPI(
  GlobalReview: Section
): GlobalReviewCodesResponse {
  return {
    ...commonConvertUItoAPI(GlobalReview),
    data: GlobalReview.rows.map((itemRow, index) => {
      return {
        code: itemRow.code,
        currentIcd10CodeRange: {
          icd10CodeId: 0,
          icd10Code: cleanData(itemRow.columns[0].value),
        },
        globalReviewIcd10Code: {
          icd10CodeId: 0,
          icd10Code: cleanData(itemRow.columns[1].value),
        },
        comments: Array.of(cleanData(itemRow.columns[2].value)),
        order: index,
        feedbackItemsList: getSectionRowFeedbacks(itemRow),
        documentNoteList: getSectionRowComments(itemRow),
      };
    }),
  };
}

function GlobalReviewIndicationsConvertUIToAPI(
  GlobalReview: Section
): GlobalReviewIndicationsResponse {
  return {
    ...commonConvertUItoAPI(GlobalReview),
    data: GlobalReview.rows.map((itemRow, index) => {
      return {
        code: itemRow.code,
        indication: { code: "", label: cleanData(itemRow.columns[0].value) },
        globalReviewIndication: cleanData(itemRow.columns[1].value),
        comments: Array.of(cleanData(itemRow.columns[2].value)),
        order: index,
        feedbackItemsList: getSectionRowFeedbacks(itemRow),
        documentNoteList: getSectionRowComments(itemRow),
      };
    }),
  };
}

function CombinationTherapyConvertUIToAPI(
  Combination: GroupedSection
): CombinationTherapyResponse {
  return {
    ...commonConvertUItoAPI(Combination),
    data: Combination.groups.map((group) => {
      const groupNamesFeedback = getColumnFeedbacks(group.names);
      const groupNamesComments = getColumnComments(group.names);
      return {
        indication: { code: "", label: cleanData(group.names[0].value) },
        data: group.rows.map((itemRow, index) => {
          const codes = cleanSplitArrays(
            cleanData(itemRow.columns[1].value)
          ).map((code) => {
            return code ? { code } : {};
          });
          const feedBack = index === 0 ? groupNamesFeedback : [];
          const comments = index === 0 ? groupNamesComments : [];
          return codes.length > 0
            ? {
                code: itemRow.code,
                combination: cleanData(itemRow.columns[0].value),
                codes: codes,
                comments: Array.of(cleanData(itemRow.columns[2].value)),
                order: index,
                feedbackItemsList: feedBack.concat(
                  getSectionRowFeedbacks(itemRow)
                ),
                documentNoteList: comments.concat(
                  getSectionRowComments(itemRow)
                ),
              }
            : {
                code: itemRow.code,
                combination: cleanData(itemRow.columns[0].value),
                comments: Array.of(cleanData(itemRow.columns[2].value)),
                order: index,
                feedbackItemsList: feedBack.concat(
                  getSectionRowFeedbacks(itemRow)
                ),
                documentNoteList: comments.concat(
                  getSectionRowComments(itemRow)
                ),
              };
        }),
      };
    }),
  };
}

function AgeConvertUIToAPI(age: GroupedSection): AgeTemplateResponse {
  return {
    ...commonConvertUItoAPI(age),
    data: age.groups.map((group, index) => {
      const groupNamesFeedback = getColumnFeedbacks(group.names);
      const groupNamesComments = getColumnComments(group.names);
      return {
        indication: {
          code: "",
          label: cleanData(group.names[0].value),
        },
        data: group.rows.map((itemRow, index) => {
          const feedBack = index === 0 ? groupNamesFeedback : [];
          const comments = index === 0 ? groupNamesComments : [];
          return {
            code: itemRow.code,
            age: cleanData(itemRow.columns[0].value),
            comments: Array.of(cleanData(itemRow.columns[1].value)),
            order: index,
            feedbackItemsList: feedBack.concat(getSectionRowFeedbacks(itemRow)),
            documentNoteList: comments.concat(getSectionRowComments(itemRow)),
          };
        }),
      };
    }),
  };
}

function dailyMaxUnitsConvertUIToAPI(
  dailyMaxUnits: GroupedSection
): DailyMaxUnitsGroupedTemplateResponse {
  const codes = cleanSplitArrays(cleanData(dailyMaxUnits.codesColumn.value));
  return {
    ...commonConvertUItoAPI(dailyMaxUnits),
    codes: codes,
    data: dailyMaxUnits.groups.map((group) => {
      const groupNamesFeedback = getColumnFeedbacks(group.names);
      const groupNamesComments = getColumnComments(group.names);
      return {
        dmuvItemDto: { code: "", name: group.names[0].value },
        data: group.rows.map((itemRow, index) => {
          const feedBack = index === 0 ? groupNamesFeedback : [];
          const comments = index === 0 ? groupNamesComments : [];
          return {
            code: itemRow.code,
            hasBorder: itemRow.hasBorder,
            currentValues: itemRow.columns[0].value,
            newValues: itemRow.columns[1].value,
            comments: Array.of(cleanData(itemRow.columns[2].value)),
            order: index,
            feedbackItemsList: feedBack.concat(getSectionRowFeedbacks(itemRow)),
            documentNoteList: comments.concat(getSectionRowComments(itemRow)),
          };
        }),
      };
    }),
  };
}

function DosingPatternsConvertUIToAPI(
  Dosing: GroupedSection
): DosingPatternsResponse {
  return {
    ...commonConvertUItoAPI(Dosing),
    data: Dosing.groups.map((group) => {
      const groupNamesFeedback = getColumnFeedbacks(group.names);
      const groupNamesComments = getColumnComments(group.names);
      return {
        indication: { code: "", label: cleanData(group.names[0].value) },
        data: group.rows.map((itemRow, index) => {
          const feedBack = index === 0 ? groupNamesFeedback : [];
          const comments = index === 0 ? groupNamesComments : [];
          return {
            code: itemRow.code,
            drugLabel: cleanData(itemRow.columns[0].value),
            clinicalPharma: cleanData(itemRow.columns[1].value),
            micromedex: cleanData(itemRow.columns[2].value),
            nccn: cleanData(itemRow.columns[3].value),
            lexiDrugs: cleanData(itemRow.columns[4].value),
            ahfsDi: cleanData(itemRow.columns[5].value),
            other: cleanData(itemRow.columns[6].value),
            order: index,
            feedbackItemsList: feedBack.concat(getSectionRowFeedbacks(itemRow)),
            documentNoteList: comments.concat(getSectionRowComments(itemRow)),
          };
        }),
      };
    }),
  };
}

function GenderConvertUIToAPI(gender: Section): GenderTemplateResponse {
  return {
    ...commonConvertUItoAPI(gender),
    data: gender.rows.map((itemRow, index) => {
      return {
        code: itemRow.code,
        indication: {
          code: "",
          label: cleanData(itemRow.columns[0].value),
        },
        gender: cleanData(itemRow.columns[1].value),
        comments: Array.of(cleanData(itemRow.columns[2].value)),
        order: index,
        feedbackItemsList: getSectionRowFeedbacks(itemRow),
        documentNoteList: getSectionRowComments(itemRow),
      };
    }),
  };
}

function diagnosisCodeOverlapsConvertUIToAPI(
  dco: GroupedSection
): DiagnosisCodeOverlapsResponse {
  return {
    ...commonConvertUItoAPI(dco),
    data: dco.groups.map((group) => {
      const groupNamesFeedback = getColumnFeedbacks(group.names);
      const groupNamesComments = getColumnComments(group.names);
      return {
        icd10Code: { icd10Code: cleanData(group.names[0].value) },
        data: group.rows.map((itemRow, index) => {
          const feedBack = index === 0 ? groupNamesFeedback : [];
          const comments = index === 0 ? groupNamesComments : [];
          return {
            code: itemRow.code,
            hasBorder: itemRow.hasBorder,
            order: index,
            indication: { code: "", label: cleanData(itemRow.columns[0].value) },
            units: cleanData(itemRow.columns[1].value),
            frequency: cleanData(itemRow.columns[2].value),
            unitsOverTime: cleanData(itemRow.columns[3].value),
            visitsOverTime: cleanData(itemRow.columns[4].value),
            age: cleanData(itemRow.columns[5].value),
            comments: Array.of(cleanData(itemRow.columns[6].value)),
            feedbackItemsList: feedBack.concat(getSectionRowFeedbacks(itemRow)),
            documentNoteList: comments.concat(getSectionRowComments(itemRow)),
          };
        })
      }
    }),
  };
}

function rulesConvertUIToAPI(
  rule: Section,
  drugCode: string = ""
): RulesTemplateResponse {
  return {
    ...commonConvertUItoAPI(rule),
    drugCode: drugCode,
    data: rule.rows.map((itemRow, index) => {
      return {
        code: itemRow.code,
        rule: cleanData(itemRow.columns[0].value),
        description: cleanData(itemRow.columns[1].value),
        comments: Array.of(cleanData(itemRow.columns[2].value)),
        order: index,
        feedbackItemsList: getSectionRowFeedbacks(itemRow),
        documentNoteList: getSectionRowComments(itemRow),
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
    ...commonConvertUItoAPI(secondaryMalignancy),
    codes: codes,
    data: secondaryMalignancy.groups.map((group, groupIndex) => {
      const malignancyIcdCodes = cleanSplitArrays(
        cleanData(group.names[0].value)
      ).map((code) => {
        return { icd10Code: code };
      });
      const secondarySite = cleanData(group.names[1].value);
      const groupNamesFeedback = getColumnFeedbacks(group.names);
      const groupNamesComments = getColumnComments(group.names);
      return {
        malignancyIcdsCodes: malignancyIcdCodes,
        secondarySite: secondarySite,
        data: group.rows.map((itemRow, index) => {
          const feedBack = index === 0 ? groupNamesFeedback : [];
          const comments = index === 0 ? groupNamesComments : [];
          return {
            code: itemRow.code,
            order: index,
            hasBorder: itemRow.hasBorder,
            primaryMalignancy: cleanData(itemRow.columns[0].value),
            units: cleanData(itemRow.columns[1].value),
            frequency: cleanData(itemRow.columns[2].value),
            unitsOverTime: cleanData(itemRow.columns[3].value),
            visitsOverTime: cleanData(itemRow.columns[4].value),
            age: cleanData(itemRow.columns[5].value),
            comments: Array.of(cleanData(itemRow.columns[6].value)),
            feedbackItemsList: feedBack.concat(getSectionRowFeedbacks(itemRow)),
            documentNoteList: comments.concat(getSectionRowComments(itemRow)),
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
      return generalInformationConvertUItoAPI(item as GroupedSection);
    case SectionCode.References:
      return referencesConvertUItoAPI(item as GroupedSection);
    case SectionCode.LCD:
      return LCDConvertUIToAPI(item as Section);
    case SectionCode.Notes:
      return notesConvertUIToAPI(item as Section);
    case SectionCode.MedicalJournal:
      return medicalJournalConverUIToAPI(item as Section);
    case SectionCode.Indications:
      return IndicationsConvertUIToAPI(item as Section);
    case SectionCode.DailyMaxUnits:
      return dailyMaxUnitsConvertUIToAPI(item as GroupedSection);
    case SectionCode.DiagnosisCodes:
      return diagnosisCodesConvertUIToAPI(item as Section);
    case SectionCode.DiagnosticCodeSummary:
      return diagnosisCodeSummaryConvertUIToAPI(item as Section);
    case SectionCode.MaximumFrequency:
      return maximumFrequencyConvertUIToAPI(item as GroupedSection);
    case SectionCode.ManifestationCodes:
      return manifestationCodesConvertUIToAPI(item as Section);
    case SectionCode.Age:
      return AgeConvertUIToAPI(item as GroupedSection);
    case SectionCode.DailyMaximumDose:
      return dailyMaximumDoseConvertUIToAPI(item as GroupedSection);
    case SectionCode.Gender:
      return GenderConvertUIToAPI(item as Section);
    case SectionCode.UnitsOverTime:
      return UnitsOverTimeConvertUIToAPI(item as GroupedSection);
    case SectionCode.VisitOverTime:
      return VisitsOverTimeConvertUIToAPI(item as GroupedSection);
    case SectionCode.CombinationTherapy:
      return CombinationTherapyConvertUIToAPI(item as GroupedSection);
    case SectionCode.DosingPatterns:
      return DosingPatternsConvertUIToAPI(item as GroupedSection);
    case SectionCode.DiagnosisCodeOverlaps:
      return diagnosisCodeOverlapsConvertUIToAPI(item as GroupedSection);
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
