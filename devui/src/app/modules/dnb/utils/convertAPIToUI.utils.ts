import { drugVersionStatus } from "../models/constants/drug.constants";
import { SectionCode } from "../models/constants/sectioncode.constant";
import {
  AgeHeaders,
  AgeTemplate,
  CombinationTherapyHeaders,
  CombinationTherapyTemplate,
  DailyMaximumDoseHeaders,
  DailyMaximumDoseTemplate,
  DailyMaxUnitsGroupedTemplate,
  DailyMaxUnitsHeaders,
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
import {
  BaseSectionResponse,
  GroupedSection,
  Section,
  UISection,
} from "../models/interfaces/uibase";
import {
  cleanData,
  getAPIColumnComments,
  getColumnFeedback,
  getSectionFeedback,
  getSectionFeedbacks,
  getSectionUnresolvedFeedbacksCount,
  guidGenerator,
  isValueReadOnly,
  prepareData,
  valuesCorresponding,
} from "./tools.utils";

const maxLengthDefault: number = 4000;
const maxLengthFourHundred: number = 400;
const maxLengthTwoHundred: number = 200;
const maxLengthOneHundred: number = 100;
const maxLengthCode: number = 32;
const maxLengthHCPCSCode: number = 36;
const maxPlaceholderCodesItems: number = 10;
const maxSectionCodesItems: number = 1000;

function commonConvertAPItoUI(section, sectionName = null) {
  const name = sectionName ? sectionName : section.section.name;
  const sectionFeedback = getSectionFeedback(
    section.uiDecorator.deletedRowFeedbackItemList,
    true,
    section.section.code
  );
  return {
    drugVersionCode: section.drugVersionCode,
    headersUIWidth: [],
    section: {
      code: section.section.code,
      name: name,
    },
    id: convertSectionNameToID(name),
    focusType: null,
    feedbackData: sectionFeedback,
    feedbackLeft: sectionFeedback.reduce(
      (acc, item) => (acc += !item.resolved ? 1 : 0),
      0
    ),
    completed: section.uiDecorator.sectionComplete,
    enabled: section.uiDecorator.sectionActive,
  };
}

export function generalInformationConvertAPIToUI(
  generalInformation: GeneralInformationTemplateResponse,
  isReadOnly: boolean = false
): GroupedSection {
  return {
    ...commonConvertAPItoUI(generalInformation),
    headers: GeneralInformationHeaders,
    groups: !generalInformation.data
      ? []
      : generalInformation.data.map((group) => {
          const generalInformationFeedback = getColumnFeedback(
            group.data[0].feedbackItemsList,
            false,
            generalInformation.section.code,
            GeneralInformationHeaders[0]
          );
          return {
            names: [
              {
                isReadOnly: true,
                value: prepareData(group.item.name),
                maxLength: maxLengthFourHundred,
                feedbackData: generalInformationFeedback,
                feedbackLeft: generalInformationFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  group.data[0].documentNoteList,
                  generalInformation.section.code,
                  GeneralInformationHeaders[0]
                ),
              },
            ],
            codeGroupUI: guidGenerator(),
            rows: group.data.map((item) => {
              const detailsFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                generalInformation.section.code,
                GeneralInformationHeaders[1]
              );
              const commentsFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                generalInformation.section.code,
                GeneralInformationHeaders[2]
              );
              return {
                hasBorder: false,
                code: item.code,
                codeUI: guidGenerator(),
                columns: [
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.itemDetails),
                    maxLength: maxLengthDefault,
                    feedbackData: detailsFeedback,
                    feedbackLeft: detailsFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      generalInformation.section.code,
                      GeneralInformationHeaders[1]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.comments.join(", ")),
                    maxLength: maxLengthDefault,
                    feedbackData: commentsFeedback,
                    feedbackLeft: commentsFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      generalInformation.section.code,
                      GeneralInformationHeaders[2]
                    ),
                  },
                ],
              };
            }),
          };
        }),
  };
}

export function referencesConvertAPIToUI(
  references: ReferencesTemplateResponse,
  isReadOnly: boolean = false
): GroupedSection {
  return {
    ...commonConvertAPItoUI(references),
    headers: ReferenceHeaders,
    groups: !references.data
      ? []
      : references.data.map((group) => {
          const referenceTypeFeedback = getColumnFeedback(
            group.data[0].feedbackItemsList,
            false,
            references.section.code,
            ReferenceHeaders[0]
          );
          return {
            names: [
              {
                isReadOnly: true,
                value: prepareData(
                  group.referenceSourceDto ? group.referenceSourceDto.name : ""
                ),
                maxLength: maxLengthFourHundred,
                feedbackData: referenceTypeFeedback,
                feedbackLeft: referenceTypeFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  group.data[0].documentNoteList,
                  references.section.code,
                  ReferenceHeaders[0]
                ),
              },
            ],
            codeGroupUI: guidGenerator(),
            rows: group.data.map((item) => {
              const referenceDetailsFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                references.section.code,
                ReferenceHeaders[1]
              );
              const commentsFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                references.section.code,
                ReferenceHeaders[2]
              );
              return {
                hasBorder: false,
                code: item.code,
                codeUI: guidGenerator(),
                columns: [
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.referenceDetails),
                    maxLength: maxLengthDefault,
                    feedbackData: referenceDetailsFeedback,
                    feedbackLeft: referenceDetailsFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      references.section.code,
                      ReferenceHeaders[1]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.comments.join(", ")),
                    maxLength: maxLengthDefault,
                    feedbackData: commentsFeedback,
                    feedbackLeft: commentsFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      references.section.code,
                      ReferenceHeaders[2]
                    ),
                  },
                ],
              };
            }),
          };
        }),
  };
}

export function NotesConvertAPIToUI(
  notes: NotesTemplateResponse,
  isReadOnly: boolean = false
): Section {
  return {
    ...commonConvertAPItoUI(notes),
    headers: NotesHeaders,
    rows: !notes.data
      ? []
      : notes.data.map((item) => {
          const note = prepareData(item.note);
          const comments = prepareData(item.comments.join(", "));
          const noteFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            notes.section.code,
            NotesHeaders[0]
          );
          const commentsFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            notes.section.code,
            NotesHeaders[1]
          );
          return {
            hasBorder: false,
            code: item.code,
            codeUI: guidGenerator(),
            columns: [
              {
                isReadOnly: isReadOnly,
                value: note,
                maxLength: maxLengthDefault,
                feedbackData: noteFeedback,
                feedbackLeft: noteFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  notes.section.code,
                  NotesHeaders[0]
                ),
              },
              {
                isReadOnly: isReadOnly,
                value: comments,
                maxLength: maxLengthDefault,
                feedbackData: commentsFeedback,
                feedbackLeft: commentsFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  notes.section.code,
                  NotesHeaders[1]
                ),
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
    ...commonConvertAPItoUI(LCD),
    headers: LCDHeaders,
    rows: !LCD.data
      ? []
      : LCD.data.map((item) => {
          const lcd = prepareData(item.lcd);
          const macName = prepareData(item.macName);
          const comments = prepareData(item.comments.join(", "));
          const lcdFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            LCD.section.code,
            LCDHeaders[0]
          );
          const macNameFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            LCD.section.code,
            LCDHeaders[1]
          );
          const commentsFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            LCD.section.code,
            LCDHeaders[2]
          );
          return {
            hasBorder: false,
            code: item.code,
            codeUI: guidGenerator(),
            columns: [
              {
                isReadOnly: isReadOnly,
                value: lcd,
                maxLength: maxLengthDefault,
                feedbackData: lcdFeedback,
                feedbackLeft: lcdFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  LCD.section.code,
                  LCDHeaders[0]
                ),
              },
              {
                isReadOnly: isReadOnly,
                value: macName,
                maxLength: maxLengthDefault,
                feedbackData: macNameFeedback,
                feedbackLeft: macNameFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  LCD.section.code,
                  LCDHeaders[1]
                ),
              },
              {
                isReadOnly: isReadOnly,
                value: comments,
                maxLength: maxLengthDefault,
                feedbackData: commentsFeedback,
                feedbackLeft: commentsFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  LCD.section.code,
                  LCDHeaders[2]
                ),
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
    ...commonConvertAPItoUI(medicalJournal),
    headers: MedicalJournalHeaders,
    rows: !medicalJournal.data
      ? []
      : medicalJournal.data.map((item) => {
          const citationFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            medicalJournal.section.code,
            MedicalJournalHeaders[0]
          );
          const commentsFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            medicalJournal.section.code,
            MedicalJournalHeaders[1]
          );
          return {
            hasBorder: false,
            code: item.code,
            codeUI: guidGenerator(),
            columns: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.citation),
                maxLength: maxLengthDefault,
                feedbackData: citationFeedback,
                feedbackLeft: citationFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  medicalJournal.section.code,
                  MedicalJournalHeaders[0]
                ),
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.comments.join(", ")),
                maxLength: maxLengthDefault,
                feedbackData: commentsFeedback,
                feedbackLeft: commentsFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  medicalJournal.section.code,
                  MedicalJournalHeaders[1]
                ),
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
    ...commonConvertAPItoUI(indications),
    headers: IndicationsHeaders,
    rows: !indications.data
      ? []
      : indications.data.map((item) => {
          const drugLabelFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            indications.section.code,
            IndicationsHeaders[0]
          );
          const clinicalFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            indications.section.code,
            IndicationsHeaders[1]
          );
          const microFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            indications.section.code,
            IndicationsHeaders[2]
          );
          const nccnFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            indications.section.code,
            IndicationsHeaders[3]
          );
          const lexiFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            indications.section.code,
            IndicationsHeaders[4]
          );
          const ahfsFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            indications.section.code,
            IndicationsHeaders[5]
          );
          const lcdFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            indications.section.code,
            IndicationsHeaders[6]
          );
          return {
            hasBorder: false,
            code: item.code,
            codeUI: guidGenerator(),
            columns: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.drugLabel),
                maxLength: maxLengthFourHundred,
                feedbackData: drugLabelFeedback,
                feedbackLeft: drugLabelFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  indications.section.code,
                  IndicationsHeaders[0]
                ),
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.clinicalPharmacology),
                maxLength: maxLengthFourHundred,
                feedbackData: clinicalFeedback,
                feedbackLeft: clinicalFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  indications.section.code,
                  IndicationsHeaders[1]
                ),
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.micromedexDrugDex),
                maxLength: maxLengthFourHundred,
                feedbackData: microFeedback,
                feedbackLeft: microFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  indications.section.code,
                  IndicationsHeaders[2]
                ),
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.nccn),
                maxLength: maxLengthFourHundred,
                feedbackData: nccnFeedback,
                feedbackLeft: nccnFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  indications.section.code,
                  IndicationsHeaders[3]
                ),
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.lexiDrugs),
                maxLength: maxLengthFourHundred,
                feedbackData: lexiFeedback,
                feedbackLeft: lexiFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  indications.section.code,
                  IndicationsHeaders[4]
                ),
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.ahfsDi),
                maxLength: maxLengthFourHundred,
                feedbackData: ahfsFeedback,
                feedbackLeft: ahfsFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  indications.section.code,
                  IndicationsHeaders[5]
                ),
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.lcd),
                maxLength: maxLengthFourHundred,
                feedbackData: lcdFeedback,
                feedbackLeft: lcdFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  indications.section.code,
                  IndicationsHeaders[7]
                ),
              },
            ],
          };
        }),
  };
}

export function DailyMaxUnitsConvertAPItoUI(
  dailyMaxUnits: DailyMaxUnitsGroupedTemplateResponse,
  valuesForReadOnly: string[],
  isReadOnly: boolean = false
): GroupedSection {
  const codes = dailyMaxUnits.codes ? dailyMaxUnits.codes : [];
  return {
    ...commonConvertAPItoUI(dailyMaxUnits),
    headers: DailyMaxUnitsHeaders,
    codes: codes,
    codesColumn: {
      value: codes.join(", "),
      isReadOnly: isReadOnly,
      regExValidator: /[^A-Z\d\s,]/,
      regExMessage: "Only commas are acepted for special characters",
      regExTitle: "Daily Maximum Units Values For HCPCS Codes",
      maxLength: maxLengthCode,
      maxArrayItems: maxPlaceholderCodesItems,
      isArrayValue: true,
      feedbackData: [],
      feedbackLeft: 0,
    },
    groups: !dailyMaxUnits.data
      ? []
      : dailyMaxUnits.data.map((group) => {
          const dailyMaxUnitsFeedback = getColumnFeedback(
            group.data[0].feedbackItemsList,
            false,
            dailyMaxUnits.section.code,
            DailyMaxUnitsHeaders[0]
          );
          return {
            names: [
              {
                isReadOnly: true,
                value: prepareData(group.dmuvItemDto.name),
                maxLength: maxLengthOneHundred,
                feedbackData: dailyMaxUnitsFeedback,
                feedbackLeft: dailyMaxUnitsFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  group.data[0].documentNoteList,
                  dailyMaxUnits.section.code,
                  DailyMaxUnitsHeaders[0]
                ),
              },
            ],
            codeGroupUI: guidGenerator(),
            rows: group.data.map((item, itemIndex) => {
              const currentFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                dailyMaxUnits.section.code,
                DailyMaxUnitsHeaders[1]
              );
              const newFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                dailyMaxUnits.section.code,
                DailyMaxUnitsHeaders[2]
              );
              const commentsFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                dailyMaxUnits.section.code,
                DailyMaxUnitsHeaders[3]
              );
              return {
                hasBorder:
                  item.hasBorder ||
                  (itemIndex + 1 === group.data.length && group.hasBorder),
                code: item.code,
                codeUI: guidGenerator(),
                columns: [
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.currentValues),
                    maxLength: maxLengthDefault,
                    feedbackData: currentFeedback,
                    feedbackLeft: currentFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      dailyMaxUnits.section.code,
                      DailyMaxUnitsHeaders[1]
                    ),
                  },
                  {
                    isReadOnly: isValueReadOnly(
                      cleanData(group.dmuvItemDto.name),
                      valuesForReadOnly
                    ),
                    value: prepareData(item.newValues),
                    maxLength: maxLengthDefault,
                    feedbackData: newFeedback,
                    feedbackLeft: newFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      dailyMaxUnits.section.code,
                      DailyMaxUnitsHeaders[2]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.comments.join(", ")),
                    maxLength: maxLengthDefault,
                    feedbackData: commentsFeedback,
                    feedbackLeft: commentsFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      dailyMaxUnits.section.code,
                      DailyMaxUnitsHeaders[3]
                    ),
                  },
                ],
              };
            }),
          };
        }),
  };
}

export function DiagnosisCodesConvertAPItoUI(
  diagnosisCodes: DiagnosisCodesTemplateResponse,
  isReadOnly: boolean = false
): Section {
  return {
    ...commonConvertAPItoUI(diagnosisCodes),
    sortColumn: "Indication",
    messages: diagnosisCodes.uiDecorator.warningMessagesList
      ? diagnosisCodes.uiDecorator.warningMessagesList
      : [],
    headers: DiagnosisCodesHeaders,
    rows: !diagnosisCodes.data
      ? []
      : diagnosisCodes.data.map((item) => {
          const codesInvalid = item.nccnIcdsCodesInvalid
            .map((code) => code.icd10Code)
            .concat(item.lcdIcdsCodesInvalid.map((code) => code.icd10Code))
            .filter((item) => item !== "");
          const nccnCodes = item.nccnIcdsCodes
            .map((code) => code.icd10Code)
            .concat(item.nccnIcdsCodesInvalid.map((code) => code.icd10Code))
            .filter((item) => item !== "");
          const lcdCodes = item.lcdIcdsCodes
            .map((code) => code.icd10Code)
            .concat(item.lcdIcdsCodesInvalid.map((code) => code.icd10Code))
            .filter((item) => item !== "");
          const indicationFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            diagnosisCodes.section.code,
            DiagnosisCodesHeaders[0]
          );
          const nccnFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            diagnosisCodes.section.code,
            DiagnosisCodesHeaders[1]
          );
          const lcdFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            diagnosisCodes.section.code,
            DiagnosisCodesHeaders[2]
          );
          const commentsFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            diagnosisCodes.section.code,
            DiagnosisCodesHeaders[3]
          );
          return {
            hasBorder: false,
            code: item.code,
            invalidCodes: codesInvalid.join(", "),
            codeUI: guidGenerator(),
            columns: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.indication),
                maxLength: maxLengthTwoHundred,
                feedbackData: indicationFeedback,
                feedbackLeft: indicationFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  diagnosisCodes.section.code,
                  DiagnosisCodesHeaders[0]
                ),
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(nccnCodes.join(", ")),
                maxLength: maxLengthDefault,
                isArrayValue: true,
                maxArrayItems: maxSectionCodesItems,
                feedbackData: nccnFeedback,
                feedbackLeft: nccnFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  diagnosisCodes.section.code,
                  DiagnosisCodesHeaders[1]
                ),
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(lcdCodes.join(", ")),
                maxLength: maxLengthDefault,
                isArrayValue: true,
                maxArrayItems: maxSectionCodesItems,
                feedbackData: lcdFeedback,
                feedbackLeft: lcdFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  diagnosisCodes.section.code,
                  DiagnosisCodesHeaders[2]
                ),
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.comments.join(", ")),
                maxLength: maxLengthDefault,
                feedbackData: commentsFeedback,
                feedbackLeft: commentsFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  diagnosisCodes.section.code,
                  DiagnosisCodesHeaders[3]
                ),
              },
            ],
          };
        }),
  };
}

export function DiagnosisCodeSummaryConvertAPItoUI(
  diagnosisCodeSummary: DiagnosisCodeSummaryTemplateResponse,
  isReadOnly: boolean = false
): Section {
  return {
    ...commonConvertAPItoUI(diagnosisCodeSummary),
    headers: DiagnosisCodeSummaryHeaders,
    messages: diagnosisCodeSummary.uiDecorator.warningMessagesList
      ? diagnosisCodeSummary.uiDecorator.warningMessagesList
      : [],
    rows: !diagnosisCodeSummary.data
      ? []
      : diagnosisCodeSummary.data.map((item) => {
          const icd10Codes = item.icd10Codes.concat(item.invalidIcd10Codes);
          const indicationFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            diagnosisCodeSummary.section.code,
            DiagnosisCodeSummaryHeaders[0]
          );
          const icdFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            diagnosisCodeSummary.section.code,
            DiagnosisCodeSummaryHeaders[1]
          );
          const commentsFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            diagnosisCodeSummary.section.code,
            DiagnosisCodeSummaryHeaders[2]
          );
          return {
            hasBorder: false,
            code: item.code,
            invalidCodes: item.invalidIcd10Codes.join(", "),
            codeUI: guidGenerator(),
            columns: [
              {
                isReadOnly: true,
                value: prepareData(item.indication.label),
                maxLength: maxLengthDefault,
                feedbackData: indicationFeedback,
                feedbackLeft: indicationFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  diagnosisCodeSummary.section.code,
                  DiagnosisCodeSummaryHeaders[0]
                ),
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(icd10Codes.join(", ")),
                maxLength: maxLengthDefault,
                isArrayValue: true,
                maxArrayItems: maxSectionCodesItems,
                feedbackData: icdFeedback,
                feedbackLeft: icdFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  diagnosisCodeSummary.section.code,
                  DiagnosisCodeSummaryHeaders[1]
                ),
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.comments.join(", ")),
                maxLength: maxLengthDefault,
                feedbackData: commentsFeedback,
                feedbackLeft: commentsFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  diagnosisCodeSummary.section.code,
                  DiagnosisCodeSummaryHeaders[2]
                ),
              },
            ],
          };
        }),
  };
}

export function ManifestationCodesConvertAPItoUI(
  manifestationCodes: ManifestationCodesTemplateResponse,
  isReadOnly: boolean = false
): Section {
  return {
    ...commonConvertAPItoUI(manifestationCodes),
    headers: ManifestationCodesHeaders,
    rows: !manifestationCodes.data
      ? []
      : manifestationCodes.data.map((item) => {
          const icdFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            manifestationCodes.section.code,
            ManifestationCodesHeaders[0]
          );
          const indicationFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            manifestationCodes.section.code,
            ManifestationCodesHeaders[1]
          );
          const commentsFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            manifestationCodes.section.code,
            ManifestationCodesHeaders[2]
          );
          return {
            hasBorder: false,
            code: item.code,
            codeUI: guidGenerator(),
            columns: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.icd10Code.icd10Code),
                maxLength: maxLengthTwoHundred,
                feedbackData: icdFeedback,
                feedbackLeft: icdFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  manifestationCodes.section.code,
                  ManifestationCodesHeaders[0]
                ),
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.indication.label),
                maxLength: maxLengthDefault,
                feedbackData: indicationFeedback,
                feedbackLeft: indicationFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  manifestationCodes.section.code,
                  ManifestationCodesHeaders[1]
                ),
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.comments.join(", ")),
                maxLength: maxLengthDefault,
                feedbackData: commentsFeedback,
                feedbackLeft: commentsFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  manifestationCodes.section.code,
                  ManifestationCodesHeaders[2]
                ),
              },
            ],
          };
        }),
  };
}

export function MaximumFrecuencyConvertAPItoUI(
  maximumFrecuency: MaximumFrequencyTemplateResponse,
  isReadOnly: boolean = false
): GroupedSection {
  return {
    ...commonConvertAPItoUI(maximumFrecuency),
    headers: MaximumFrquencyHeaders,
    groups: !maximumFrecuency.data
      ? []
      : maximumFrecuency.data.map((group) => {
          const indicationFeedback = getColumnFeedback(
            group.data[0].feedbackItemsList,
            false,
            maximumFrecuency.section.code,
            MaximumFrquencyHeaders[0]
          );
          return {
            names: [
              {
                isReadOnly: true,
                value: prepareData(group.indication),
                maxLength: maxLengthDefault,
                feedbackData: indicationFeedback,
                feedbackLeft: indicationFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  group.data[0].documentNoteList,
                  maximumFrecuency.section.code,
                  MaximumFrquencyHeaders[0]
                ),
              },
            ],
            codeGroupUI: guidGenerator(),
            rows: group.data.map((item) => {
              const maxFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                maximumFrecuency.section.code,
                MaximumFrquencyHeaders[1]
              );
              const commentsFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                maximumFrecuency.section.code,
                MaximumFrquencyHeaders[2]
              );
              return {
                hasBorder: false,
                code: item.code,
                codeUI: guidGenerator(),
                columns: [
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.maximumFrequency),
                    maxLength: maxLengthDefault,
                    feedbackData: maxFeedback,
                    feedbackLeft: maxFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      maximumFrecuency.section.code,
                      MaximumFrquencyHeaders[1]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.comments.join(", ")),
                    maxLength: maxLengthDefault,
                    feedbackData: commentsFeedback,
                    feedbackLeft: commentsFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      maximumFrecuency.section.code,
                      MaximumFrquencyHeaders[2]
                    ),
                  },
                ],
              };
            }),
          };
        }),
  };
}

export function AgeConvertAPItoUI(
  age: AgeTemplateResponse,
  isReadOnly: boolean = false
): GroupedSection {
  return {
    ...commonConvertAPItoUI(age),
    headers: AgeHeaders,
    groups: !age.data
      ? []
      : age.data.map((group) => {
          const labelFeedback = getColumnFeedback(
            group.data[0].feedbackItemsList,
            false,
            age.section.code,
            AgeHeaders[0]
          );
          return {
            names: [
              {
                isReadOnly: true,
                value: prepareData(group.indication.label),
                maxLength: maxLengthFourHundred,
                feedbackData: labelFeedback,
                feedbackLeft: labelFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  group.data[0].documentNoteList,
                  age.section.code,
                  AgeHeaders[0]
                ),
              },
            ],
            codeGroupUI: guidGenerator(),
            rows: group.data.map((item) => {
              const ageFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                age.section.code,
                AgeHeaders[1]
              );
              const commentsFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                age.section.code,
                AgeHeaders[2]
              );
              return {
                hasBorder: false,
                code: item.code,
                codeUI: guidGenerator(),
                columns: [
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.age),
                    maxLength: maxLengthFourHundred,
                    feedbackData: ageFeedback,
                    feedbackLeft: ageFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      age.section.code,
                      AgeHeaders[1]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.comments.join(", ")),
                    maxLength: maxLengthDefault,
                    feedbackData: commentsFeedback,
                    feedbackLeft: commentsFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      age.section.code,
                      AgeHeaders[2]
                    ),
                  },
                ],
              };
            }),
          };
        }),
  };
}

export function DailyMaximumDoseConvertAPItoUI(
  dailyMaxDose: DailyMaximumDoseTemplateResponse,
  isReadOnly: boolean = false
): GroupedSection {
  return {
    ...commonConvertAPItoUI(dailyMaxDose),
    headers: DailyMaximumDoseHeaders,
    groups: !dailyMaxDose.data
      ? []
      : dailyMaxDose.data.map((group) => {
          const indicationFeedback = getColumnFeedback(
            group.data[0].feedbackItemsList,
            false,
            dailyMaxDose.section.code,
            DailyMaximumDoseHeaders[0]
          );
          return {
            names: [
              {
                isReadOnly: true,
                value: prepareData(
                  group.indication ? group.indication.label : ""
                ),
                maxLength: maxLengthFourHundred,
                feedbackData: indicationFeedback,
                feedbackLeft: indicationFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  group.data[0].documentNoteList,
                  dailyMaxDose.section.code,
                  ReferenceHeaders[0]
                ),
              },
            ],
            codeGroupUI: guidGenerator(),
            rows: group.data.map((item) => {
              const maxdosingFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                dailyMaxDose.section.code,
                DailyMaximumDoseHeaders[1]
              );
              const maxdoseFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                dailyMaxDose.section.code,
                DailyMaximumDoseHeaders[2]
              );
              const maxunitsFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                dailyMaxDose.section.code,
                DailyMaximumDoseHeaders[3]
              );
              const commentsFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                dailyMaxDose.section.code,
                DailyMaximumDoseHeaders[4]
              );

              return {
                hasBorder: false,
                code: item.code,
                codeUI: guidGenerator(),
                columns: [
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.maximumDosingPattern),
                    maxLength: maxLengthFourHundred,
                    feedbackData: maxdosingFeedback,
                    feedbackLeft: maxdosingFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      dailyMaxDose.section.code,
                      DailyMaximumDoseHeaders[1]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.maximumDose),
                    maxLength: maxLengthFourHundred,
                    feedbackData: maxdoseFeedback,
                    feedbackLeft: maxdoseFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      dailyMaxDose.section.code,
                      DailyMaximumDoseHeaders[2]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.maximumUnits),
                    maxLength: maxLengthFourHundred,
                    feedbackData: maxunitsFeedback,
                    feedbackLeft: maxunitsFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      dailyMaxDose.section.code,
                      DailyMaximumDoseHeaders[3]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.comments.join(", ")),
                    maxLength: maxLengthDefault,
                    feedbackData: commentsFeedback,
                    feedbackLeft: commentsFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      dailyMaxDose.section.code,
                      DailyMaximumDoseHeaders[4]
                    ),
                  },
                ],
              };
            }),
          };
        }),
  };
}

export function GenderConvertAPItoUI(
  gender: GenderTemplateResponse,
  isReadOnly: boolean = false
): Section {
  return {
    ...commonConvertAPItoUI(gender),
    headers: GenderHeaders,
    rows: !gender.data
      ? []
      : gender.data.map((item) => {
          const labelFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            gender.section.code,
            GenderHeaders[0]
          );
          const genderFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            gender.section.code,
            GenderHeaders[1]
          );
          const commentsFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            gender.section.code,
            GenderHeaders[2]
          );
          return {
            hasBorder: false,
            code: item.code,
            codeUI: guidGenerator(),
            columns: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.indication.label),
                maxLength: maxLengthFourHundred,
                feedbackData: labelFeedback,
                feedbackLeft: labelFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  gender.section.code,
                  GenderHeaders[0]
                ),
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.gender),
                maxLength: maxLengthFourHundred,
                feedbackData: genderFeedback,
                feedbackLeft: genderFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  gender.section.code,
                  GenderHeaders[1]
                ),
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.comments.join(", ")),
                maxLength: maxLengthFourHundred,
                feedbackData: commentsFeedback,
                feedbackLeft: commentsFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  gender.section.code,
                  GenderHeaders[2]
                ),
              },
            ],
          };
        }),
  };
}

export function UnitsOverTimeConvertAPItoUI(
  uot: UnitsOverTimeTemplateResponse,
  isReadOnly: boolean = false
): GroupedSection {
  return {
    ...commonConvertAPItoUI(uot),
    headers: UnistOverTimeHeaders,
    groups: !uot.data
      ? []
      : uot.data.map((group) => {
          const labelFeedback = getColumnFeedback(
            group.data[0].feedbackItemsList,
            false,
            uot.section.code,
            UnistOverTimeHeaders[0]
          );
          return {
            names: [
              {
                isReadOnly: true,
                value: prepareData(group.indication.label),
                maxLength: maxLengthFourHundred,
                feedbackData: labelFeedback,
                feedbackLeft: labelFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  group.data[0].documentNoteList,
                  uot.section.code,
                  UnistOverTimeHeaders[0]
                ),
              },
            ],
            codeGroupUI: guidGenerator(),
            rows: group.data.map((item) => {
              const unitsFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                uot.section.code,
                UnistOverTimeHeaders[1]
              );
              const intervalFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                uot.section.code,
                UnistOverTimeHeaders[2]
              );
              const commentsFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                uot.section.code,
                UnistOverTimeHeaders[3]
              );
              return {
                hasBorder: false,
                code: item.code,
                codeUI: guidGenerator(),
                columns: [
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.units),
                    maxLength: 20,
                    feedbackData: unitsFeedback,
                    feedbackLeft: unitsFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      uot.section.code,
                      UnistOverTimeHeaders[1]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.interval),
                    maxLength: 40,
                    feedbackData: intervalFeedback,
                    feedbackLeft: intervalFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      uot.section.code,
                      UnistOverTimeHeaders[2]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.comments.join(", ")),
                    maxLength: maxLengthDefault,
                    feedbackData: commentsFeedback,
                    feedbackLeft: commentsFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      uot.section.code,
                      UnistOverTimeHeaders[3]
                    ),
                  },
                ],
              };
            }),
          };
        }),
  };
}

export function VisitOverTimeConvertAPItoUI(
  visitOverTime: VisitOverTimeTemplateResponse,
  isReadOnly: boolean = false
): GroupedSection {
  return {
    ...commonConvertAPItoUI(visitOverTime),
    headers: VisitOverTimeHeaders,
    groups: !visitOverTime.data
      ? []
      : visitOverTime.data.map((group) => {
          const indicationFeedback = getColumnFeedback(
            group.data[0].feedbackItemsList,
            false,
            visitOverTime.section.code,
            VisitOverTimeHeaders[0]
          );
          return {
            names: [
              {
                isReadOnly: true,
                value: prepareData(
                  group.indication ? group.indication.label : ""
                ),
                maxLength: maxLengthFourHundred,
                feedbackData: indicationFeedback,
                feedbackLeft: indicationFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  group.data[0].documentNoteList,
                  visitOverTime.section.code,
                  VisitOverTimeHeaders[0]
                ),
              },
            ],
            codeGroupUI: guidGenerator(),
            rows: group.data.map((item) => {
              const visitsFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                visitOverTime.section.code,
                VisitOverTimeHeaders[1]
              );
              const intervalFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                visitOverTime.section.code,
                VisitOverTimeHeaders[2]
              );
              const commentsFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                visitOverTime.section.code,
                VisitOverTimeHeaders[3]
              );

              return {
                hasBorder: false,
                code: item.code,
                codeUI: guidGenerator(),
                columns: [
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.visits),
                    maxLength: maxLengthFourHundred,
                    feedbackData: visitsFeedback,
                    feedbackLeft: visitsFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      visitOverTime.section.code,
                      VisitOverTimeHeaders[1]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.interval),
                    maxLength: maxLengthFourHundred,
                    feedbackData: intervalFeedback,
                    feedbackLeft: intervalFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      visitOverTime.section.code,
                      VisitOverTimeHeaders[2]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.comments.join(", ")),
                    maxLength: maxLengthDefault,
                    feedbackData: commentsFeedback,
                    feedbackLeft: commentsFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      visitOverTime.section.code,
                      VisitOverTimeHeaders[3]
                    ),
                  },
                ],
              };
            }),
          };
        }),
  };
}

export function CombinationTherapyAPItoUI(
  combinationTherapy: CombinationTherapyResponse,
  isReadOnly: boolean = false
): GroupedSection {
  return {
    ...commonConvertAPItoUI(combinationTherapy),
    headers: CombinationTherapyHeaders,
    groups: !combinationTherapy.data
      ? []
      : combinationTherapy.data.map((group) => {
          const indicationFeedback = getColumnFeedback(
            group.data[0].feedbackItemsList,
            false,
            combinationTherapy.section.code,
            CombinationTherapyHeaders[0]
          );
          return {
            names: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(group.indication.label),
                maxLength: maxLengthFourHundred,
                feedbackData: indicationFeedback,
                feedbackLeft: indicationFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  group.data[0].documentNoteList,
                  combinationTherapy.section.code,
                  CombinationTherapyHeaders[0]
                ),
              },
            ],
            codeGroupUI: guidGenerator(),
            rows: group.data.map((item) => {
              const codes = item.codes.map((code) => code.code).join(", ");
              const combinationFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                combinationTherapy.section.code,
                CombinationTherapyHeaders[1]
              );
              const codesFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                combinationTherapy.section.code,
                CombinationTherapyHeaders[2]
              );
              const commentsFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                combinationTherapy.section.code,
                CombinationTherapyHeaders[3]
              );
              return {
                hasBorder: false,
                code: item.code,
                codeUI: guidGenerator(),
                columns: [
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.combination),
                    maxLength: maxLengthDefault,
                    feedbackData: combinationFeedback,
                    feedbackLeft: combinationFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      combinationTherapy.section.code,
                      CombinationTherapyHeaders[1]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(codes),
                    maxLength: maxLengthHCPCSCode,
                    isArrayValue: true,
                    maxArrayItems: maxSectionCodesItems,
                    feedbackData: codesFeedback,
                    feedbackLeft: codesFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      combinationTherapy.section.code,
                      CombinationTherapyHeaders[2]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.comments.join(", ")),
                    maxLength: maxLengthDefault,
                    feedbackData: commentsFeedback,
                    feedbackLeft: commentsFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      combinationTherapy.section.code,
                      CombinationTherapyHeaders[3]
                    ),
                  },
                ],
              };
            }),
          };
        }),
  };
}

export function DosingPatternsAPItoUI(
  dosingPatterns: DosingPatternsResponse,
  isReadOnly: boolean = false
): GroupedSection {
  return {
    ...commonConvertAPItoUI(dosingPatterns),
    headers: DosingPatternsHeaders,
    groups: !dosingPatterns.data
      ? []
      : dosingPatterns.data.map((group) => {
          const indicationFeedback = getColumnFeedback(
            group.data[0].feedbackItemsList,
            false,
            dosingPatterns.section.code,
            DosingPatternsHeaders[0]
          );
          return {
            names: [
              {
                isReadOnly: true,
                value: prepareData(group.indication.label),
                maxLength: maxLengthFourHundred,
                feedbackData: indicationFeedback,
                feedbackLeft: indicationFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  group.data[0].documentNoteList,
                  dosingPatterns.section.code,
                  DosingPatternsHeaders[0]
                ),
              },
            ],
            codeGroupUI: guidGenerator(),
            rows: group.data.map((item) => {
              const labelFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                dosingPatterns.section.code,
                DosingPatternsHeaders[1]
              );
              const clinicaleedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                dosingPatterns.section.code,
                DosingPatternsHeaders[2]
              );
              const microFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                dosingPatterns.section.code,
                DosingPatternsHeaders[3]
              );
              const nccnFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                dosingPatterns.section.code,
                DosingPatternsHeaders[4]
              );
              const lexiFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                dosingPatterns.section.code,
                DosingPatternsHeaders[5]
              );
              const ahfsFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                dosingPatterns.section.code,
                DosingPatternsHeaders[6]
              );
              const otherFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                dosingPatterns.section.code,
                DosingPatternsHeaders[7]
              );
              return {
                hasBorder: false,
                code: item.code,
                codeUI: guidGenerator(),
                columns: [
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.drugLabel),
                    maxLength: maxLengthDefault,
                    feedbackData: labelFeedback,
                    feedbackLeft: labelFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      dosingPatterns.section.code,
                      DosingPatternsHeaders[1]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.clinicalPharma),
                    maxLength: maxLengthDefault,
                    feedbackData: clinicaleedback,
                    feedbackLeft: clinicaleedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      dosingPatterns.section.code,
                      DosingPatternsHeaders[2]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.micromedex),
                    maxLength: maxLengthDefault,
                    feedbackData: microFeedback,
                    feedbackLeft: microFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      dosingPatterns.section.code,
                      DosingPatternsHeaders[3]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.nccn),
                    maxLength: maxLengthDefault,
                    feedbackData: nccnFeedback,
                    feedbackLeft: nccnFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      dosingPatterns.section.code,
                      DosingPatternsHeaders[4]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.lexiDrugs),
                    maxLength: maxLengthDefault,
                    feedbackData: lexiFeedback,
                    feedbackLeft: lexiFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      dosingPatterns.section.code,
                      DosingPatternsHeaders[5]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.ahfsDi),
                    maxLength: maxLengthDefault,
                    feedbackData: ahfsFeedback,
                    feedbackLeft: ahfsFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      dosingPatterns.section.code,
                      DosingPatternsHeaders[6]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.other),
                    maxLength: maxLengthDefault,
                    feedbackData: otherFeedback,
                    feedbackLeft: otherFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      dosingPatterns.section.code,
                      DosingPatternsHeaders[7]
                    ),
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
): GroupedSection {
  return {
    ...commonConvertAPItoUI(diagnosisCodeOverlaps),
    headers: DiagnosisCodeOverlapsHeaders,
    groups: !diagnosisCodeOverlaps.data
      ? []
      : diagnosisCodeOverlaps.data.map((group) => {
          const icd10Feedback = getColumnFeedback(
            group.data[0].feedbackItemsList,
            false,
            diagnosisCodeOverlaps.section.code,
            DiagnosisCodeOverlapsHeaders[0]
          );
          return {
            names: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(group.icd10Code.icd10Code),
                maxLength: maxLengthFourHundred,
                feedbackData: icd10Feedback,
                feedbackLeft: icd10Feedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  group.data[0].documentNoteList,
                  diagnosisCodeOverlaps.section.code,
                  DiagnosisCodeOverlapsHeaders[0]
                ),
              },
            ],
            codeGroupUI: guidGenerator(),
            rows: group.data.map((item, itemIndex) => {
              const indicationFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                diagnosisCodeOverlaps.section.code,
                DiagnosisCodeOverlapsHeaders[1]
              );
              const unitsFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                diagnosisCodeOverlaps.section.code,
                DiagnosisCodeOverlapsHeaders[2]
              );
              const frequencyFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                diagnosisCodeOverlaps.section.code,
                DiagnosisCodeOverlapsHeaders[3]
              );
              const uotFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                diagnosisCodeOverlaps.section.code,
                DiagnosisCodeOverlapsHeaders[4]
              );
              const votFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                diagnosisCodeOverlaps.section.code,
                DiagnosisCodeOverlapsHeaders[5]
              );
              const ageFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                diagnosisCodeOverlaps.section.code,
                DiagnosisCodeOverlapsHeaders[6]
              );
              const commentsFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                diagnosisCodeOverlaps.section.code,
                DiagnosisCodeOverlapsHeaders[7]
              );
              return {
                hasBorder:
                  item.hasBorder ||
                  (itemIndex + 1 === group.data.length && group.hasBorder),
                code: item.code,
                codeUI: guidGenerator(),
                columns: [
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.indication.label),
                    maxLength: maxLengthFourHundred,
                    feedbackData: indicationFeedback,
                    feedbackLeft: indicationFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      diagnosisCodeOverlaps.section.code,
                      DiagnosisCodeOverlapsHeaders[2]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.units),
                    maxLength: maxLengthFourHundred,
                    feedbackData: unitsFeedback,
                    feedbackLeft: unitsFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      diagnosisCodeOverlaps.section.code,
                      DiagnosisCodeOverlapsHeaders[2]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.frequency),
                    maxLength: maxLengthFourHundred,
                    feedbackData: frequencyFeedback,
                    feedbackLeft: frequencyFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      diagnosisCodeOverlaps.section.code,
                      DiagnosisCodeOverlapsHeaders[2]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.unitsOverTime),
                    maxLength: maxLengthFourHundred,
                    feedbackData: uotFeedback,
                    feedbackLeft: uotFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      diagnosisCodeOverlaps.section.code,
                      DiagnosisCodeOverlapsHeaders[2]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.visitsOverTime),
                    maxLength: maxLengthFourHundred,
                    feedbackData: votFeedback,
                    feedbackLeft: votFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      diagnosisCodeOverlaps.section.code,
                      DiagnosisCodeOverlapsHeaders[2]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.age),
                    maxLength: maxLengthFourHundred,
                    feedbackData: ageFeedback,
                    feedbackLeft: ageFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      diagnosisCodeOverlaps.section.code,
                      DiagnosisCodeOverlapsHeaders[2]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.comments.join(", ")),
                    maxLength: maxLengthDefault,
                    feedbackData: commentsFeedback,
                    feedbackLeft: commentsFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      diagnosisCodeOverlaps.section.code,
                      DiagnosisCodeOverlapsHeaders[7]
                    ),
                  },
                ],
              };
            }),
          };
        }),
  };
}

export function GlobalReviewIndicationsConvertAPItoUI(
  globalReviewIndications: GlobalReviewIndicationsResponse,
  isReadOnly: boolean = false
): Section {
  return {
    ...commonConvertAPItoUI(globalReviewIndications),
    headers: GlobalReviewIndicationsHeaders,
    rows: !globalReviewIndications.data
      ? []
      : globalReviewIndications.data.map((item) => {
          const indicationFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            globalReviewIndications.section.code,
            GlobalReviewIndicationsHeaders[0]
          );
          const globalFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            globalReviewIndications.section.code,
            GlobalReviewIndicationsHeaders[1]
          );
          const commentsFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            globalReviewIndications.section.code,
            GlobalReviewIndicationsHeaders[2]
          );
          return {
            hasBorder: false,
            code: item.code,
            codeUI: guidGenerator(),
            columns: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(
                  item.indication ? item.indication.label : ""
                ),
                maxLength: maxLengthFourHundred,
                feedbackData: indicationFeedback,
                feedbackLeft: indicationFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  globalReviewIndications.section.code,
                  GlobalReviewIndicationsHeaders[0]
                ),
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.globalReviewIndication),
                maxLength: maxLengthFourHundred,
                feedbackData: globalFeedback,
                feedbackLeft: globalFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  globalReviewIndications.section.code,
                  GlobalReviewIndicationsHeaders[1]
                ),
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.comments.join(", ")),
                maxLength: maxLengthDefault,
                feedbackData: commentsFeedback,
                feedbackLeft: commentsFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  globalReviewIndications.section.code,
                  GlobalReviewIndicationsHeaders[2]
                ),
              },
            ],
          };
        }),
  };
}

export function SecondaryMalignancyAPItoUI(
  secondaryMalignancy: SecondaryMalignancyResponse,
  isReadOnly: boolean = false
): GroupedSection {
  const codes = secondaryMalignancy.codes ? secondaryMalignancy.codes : [];
  return {
    ...commonConvertAPItoUI(secondaryMalignancy),
    headers: SecondaryMalignancyHeaders,
    codes: codes,
    codesColumn: {
      value: codes.join(", "),
      isReadOnly: isReadOnly,
      regExValidator: /[^A-Z\d\s,.-]/,
      regExMessage:
        "Only commas, hyphens and dots are acepted for special characters",
      regExTitle: "Secondary Malignancy ICD-10 Codes (Standard)",
      maxLength: maxLengthTwoHundred,
      maxArrayItems: maxPlaceholderCodesItems,
      isArrayValue: true,
      feedbackData: [],
      feedbackLeft: 0,
    },
    groups: !secondaryMalignancy.data
      ? []
      : secondaryMalignancy.data.map((group) => {
          const icd10Feedback = getColumnFeedback(
            group.data[0].feedbackItemsList,
            false,
            secondaryMalignancy.section.code,
            SecondaryMalignancyHeaders[0]
          );
          const secondaryFeedback = getColumnFeedback(
            group.data[0].feedbackItemsList,
            false,
            secondaryMalignancy.section.code,
            SecondaryMalignancyHeaders[1]
          );
          return {
            names: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(
                  group.malignancyIcdsCodes
                    .map((item) => {
                      return item.icd10Code;
                    })
                    .join(", ")
                ),
                maxLength: maxLengthFourHundred,
                isArrayValue: true,
                maxArrayItems: maxSectionCodesItems,
                feedbackData: icd10Feedback,
                feedbackLeft: icd10Feedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  group.data[0].documentNoteList,
                  secondaryMalignancy.section.code,
                  SecondaryMalignancyHeaders[0]
                ),
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(group.secondarySite),
                maxLength: maxLengthFourHundred,
                feedbackData: secondaryFeedback,
                feedbackLeft: secondaryFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  group.data[0].documentNoteList,
                  secondaryMalignancy.section.code,
                  SecondaryMalignancyHeaders[1]
                ),
              },
            ],
            codeGroupUI: guidGenerator(),
            rows: group.data.map((item, itemIndex) => {
              const primaryFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                secondaryMalignancy.section.code,
                SecondaryMalignancyHeaders[2]
              );
              const unitsFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                secondaryMalignancy.section.code,
                SecondaryMalignancyHeaders[3]
              );
              const freqFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                secondaryMalignancy.section.code,
                SecondaryMalignancyHeaders[4]
              );
              const uotFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                secondaryMalignancy.section.code,
                SecondaryMalignancyHeaders[5]
              );
              const votFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                secondaryMalignancy.section.code,
                SecondaryMalignancyHeaders[6]
              );
              const ageFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                secondaryMalignancy.section.code,
                SecondaryMalignancyHeaders[7]
              );
              const commentsFeedback = getColumnFeedback(
                item.feedbackItemsList,
                false,
                secondaryMalignancy.section.code,
                SecondaryMalignancyHeaders[8]
              );
              return {
                hasBorder:
                  item.hasBorder ||
                  (itemIndex + 1 === group.data.length && group.hasBorder),
                code: item.code,
                codeUI: guidGenerator(),
                columns: [
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.primaryMalignancy),
                    maxLength: maxLengthFourHundred,
                    feedbackData: primaryFeedback,
                    feedbackLeft: primaryFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      secondaryMalignancy.section.code,
                      SecondaryMalignancyHeaders[2]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.units),
                    maxLength: maxLengthFourHundred,
                    feedbackData: unitsFeedback,
                    feedbackLeft: unitsFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      secondaryMalignancy.section.code,
                      SecondaryMalignancyHeaders[3]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.frequency),
                    maxLength: maxLengthFourHundred,
                    feedbackData: freqFeedback,
                    feedbackLeft: freqFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      secondaryMalignancy.section.code,
                      SecondaryMalignancyHeaders[4]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.unitsOverTime),
                    maxLength: maxLengthFourHundred,
                    feedbackData: uotFeedback,
                    feedbackLeft: uotFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      secondaryMalignancy.section.code,
                      SecondaryMalignancyHeaders[5]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.visitsOverTime),
                    maxLength: maxLengthFourHundred,
                    feedbackData: votFeedback,
                    feedbackLeft: votFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      secondaryMalignancy.section.code,
                      SecondaryMalignancyHeaders[6]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.age),
                    maxLength: maxLengthFourHundred,
                    feedbackData: ageFeedback,
                    feedbackLeft: ageFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      secondaryMalignancy.section.code,
                      SecondaryMalignancyHeaders[7]
                    ),
                  },
                  {
                    isReadOnly: isReadOnly,
                    value: prepareData(item.comments.join(", ")),
                    maxLength: maxLengthDefault,
                    feedbackData: commentsFeedback,
                    feedbackLeft: commentsFeedback.reduce(
                      (acc, item) => (acc += !item.resolved ? 1 : 0),
                      0
                    ),
                    comments: getAPIColumnComments(
                      item.documentNoteList,
                      secondaryMalignancy.section.code,
                      SecondaryMalignancyHeaders[8]
                    ),
                  },
                ],
              };
            }),
          };
        }),
  };
}

export function GlobalReviewCodesConvertAPItoUI(
  globalReviewCodes: GlobalReviewCodesResponse,
  isReadOnly: boolean = false
): Section {
  return {
    ...commonConvertAPItoUI(globalReviewCodes),
    headers: GlobalReviewCodesHeaders,
    rows: !globalReviewCodes.data
      ? []
      : globalReviewCodes.data.map((item) => {
          const currentFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            globalReviewCodes.section.code,
            GlobalReviewCodesHeaders[0]
          );
          const globalFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            globalReviewCodes.section.code,
            GlobalReviewCodesHeaders[1]
          );
          const commentsFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            globalReviewCodes.section.code,
            GlobalReviewCodesHeaders[2]
          );
          return {
            hasBorder: false,
            code: item.code,
            codeUI: guidGenerator(),
            columns: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.currentIcd10CodeRange.icd10Code),
                maxLength: maxLengthTwoHundred,
                feedbackData: currentFeedback,
                feedbackLeft: currentFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  globalReviewCodes.section.code,
                  GlobalReviewCodesHeaders[0]
                ),
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.globalReviewIcd10Code.icd10Code),
                maxLength: maxLengthFourHundred,
                feedbackData: globalFeedback,
                feedbackLeft: globalFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  globalReviewCodes.section.code,
                  GlobalReviewCodesHeaders[1]
                ),
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.comments.join(", ")),
                maxLength: maxLengthDefault,
                feedbackData: commentsFeedback,
                feedbackLeft: commentsFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  globalReviewCodes.section.code,
                  GlobalReviewCodesHeaders[2]
                ),
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
    ...commonConvertAPItoUI(rules, sectionName),
    headers: RulesHeaders,
    rows: !rules.data
      ? []
      : rules.data.map((item) => {
          const ruleFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            rules.section.code,
            RulesHeaders[0]
          );
          const descriptionFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            rules.section.code,
            RulesHeaders[1]
          );
          const commentsFeedback = getColumnFeedback(
            item.feedbackItemsList,
            false,
            rules.section.code,
            RulesHeaders[2]
          );
          return {
            hasBorder: false,
            code: item.code,
            codeUI: guidGenerator(),
            columns: [
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.rule),
                maxLength: 200,
                feedbackData: ruleFeedback,
                feedbackLeft: ruleFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  rules.section.code,
                  RulesHeaders[0]
                ),
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.description),
                maxLength: 10000,
                feedbackData: descriptionFeedback,
                feedbackLeft: descriptionFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  rules.section.code,
                  RulesHeaders[1]
                ),
              },
              {
                isReadOnly: isReadOnly,
                value: prepareData(item.comments.join(", ")),
                maxLength: maxLengthDefault,
                feedbackData: commentsFeedback,
                feedbackLeft: commentsFeedback.reduce(
                  (acc, item) => (acc += !item.resolved ? 1 : 0),
                  0
                ),
                comments: getAPIColumnComments(
                  item.documentNoteList,
                  rules.section.code,
                  RulesHeaders[2]
                ),
              },
            ],
          };
        }),
  };
}

export function convertSectionNameToID(name: string): string {
  return name.replace(/\s/g, "_").toLowerCase();
}

export function versionInformation(
  item: BaseSectionResponse,
  isReadOnly: boolean = false
): Section | GroupedSection {
  switch (item.section.code) {
    case SectionCode.GeneralInformation:
      return generalInformationConvertAPIToUI(
        item as GeneralInformationTemplateResponse,
        isReadOnly
      );
    case SectionCode.References:
      return referencesConvertAPIToUI(
        item as ReferencesTemplateResponse,
        isReadOnly
      );
    case SectionCode.LCD:
      return LCDConvertAPIToUI(item as LCDTemplateResponse, isReadOnly);
    case SectionCode.Notes:
      return NotesConvertAPIToUI(item as NotesTemplateResponse, isReadOnly);
    case SectionCode.MedicalJournal:
      return MedicalJournalConvertAPIToUI(
        item as MedicalJournalTemplateResponse,
        isReadOnly
      );
    case SectionCode.Indications:
      return IndicationsConvertAPIToUI(
        item as IndicationsTemplateResponse,
        isReadOnly
      );
    case SectionCode.DailyMaxUnits:
      return DailyMaxUnitsConvertAPItoUI(
        item as DailyMaxUnitsGroupedTemplateResponse,
        valuesCorresponding,
        isReadOnly
      );
    case SectionCode.DiagnosisCodes:
      return DiagnosisCodesConvertAPItoUI(
        item as DiagnosisCodesTemplateResponse,
        isReadOnly
      );
    case SectionCode.DiagnosticCodeSummary:
      return DiagnosisCodeSummaryConvertAPItoUI(
        item as DiagnosisCodeSummaryTemplateResponse,
        isReadOnly
      );
    case SectionCode.MaximumFrequency:
      return MaximumFrecuencyConvertAPItoUI(
        item as MaximumFrequencyTemplateResponse,
        isReadOnly
      );
    case SectionCode.ManifestationCodes:
      return ManifestationCodesConvertAPItoUI(
        item as ManifestationCodesTemplateResponse,
        isReadOnly
      );
    case SectionCode.Age:
      return AgeConvertAPItoUI(item as AgeTemplateResponse, isReadOnly);
    case SectionCode.DailyMaximumDose:
      return DailyMaximumDoseConvertAPItoUI(
        item as DailyMaximumDoseTemplateResponse,
        isReadOnly
      );
    case SectionCode.Gender:
      return GenderConvertAPItoUI(item as GenderTemplateResponse, isReadOnly);
    case SectionCode.UnitsOverTime:
      return UnitsOverTimeConvertAPItoUI(
        item as UnitsOverTimeTemplateResponse,
        isReadOnly
      );
    case SectionCode.VisitOverTime:
      return VisitOverTimeConvertAPItoUI(
        item as VisitOverTimeTemplateResponse,
        isReadOnly
      );
    case SectionCode.CombinationTherapy:
      return CombinationTherapyAPItoUI(
        item as CombinationTherapyResponse,
        isReadOnly
      );
    case SectionCode.DosingPatterns:
      return DosingPatternsAPItoUI(item as DosingPatternsResponse, isReadOnly);
    case SectionCode.DiagnosisCodeOverlaps:
      return DiagnosisCodeOverlapsConvertAPItoUI(
        item as DiagnosisCodeOverlapsResponse,
        isReadOnly
      );
    case SectionCode.GlobalReviewIndications:
      return GlobalReviewIndicationsConvertAPItoUI(
        item as GlobalReviewIndicationsResponse,
        isReadOnly
      );
    case SectionCode.SecondaryMalignancy:
      return SecondaryMalignancyAPItoUI(
        item as SecondaryMalignancyResponse,
        isReadOnly
      );
    case SectionCode.GlobalReviewCodes:
      return GlobalReviewCodesConvertAPItoUI(
        item as GlobalReviewCodesResponse,
        isReadOnly
      );
    case SectionCode.Rules:
      return RulesAPItoUI(
        item as RulesTemplateResponse,
        isReadOnly,
        item.section.name
      );
    default:
      break;
  }
}

export function createNavigation(
  sections: UISection[],
  versionStatus: string = "",
  hideFeedback: boolean = true
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
    const feedbackCount = !hideFeedback
      ? getSectionFeedbacks(section.new, section.grouped).length
      : 0;
    return {
      name: name,
      id: convertSectionNameToID(id),
      completed: section.new.completed,
      feedbackLeft:
        feedbackCount > 0
          ? getSectionUnresolvedFeedbacksCount(section.new, section.grouped)
          : null,
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
      return DailyMaxUnitsConvertAPItoUI(
        DailyMaxUnitsGroupedTemplate,
        valuesCorresponding
      );
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

export function createCurrentPlaceholder(
  section: BaseSectionResponse,
  grouped: boolean
): Section | GroupedSection {
  return grouped
    ? {
        drugVersionCode: section.drugVersionCode,
        section: {
          code: section.section.code,
          name: section.section.name,
        },
        headers: [],
        headersUIWidth: [],
        codes: [],
        id: convertSectionNameToID(section.section.name),
        groups: [],
      }
    : {
        drugVersionCode: section.drugVersionCode,
        section: {
          code: section.section.code,
          name: section.section.name,
        },
        codes: [],
        headers: [],
        headersUIWidth: [],
        id: convertSectionNameToID(section.section.name),
        rows: [],
      };
}
