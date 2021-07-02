import { async, TestBed } from "@angular/core/testing";
import { SectionCode } from "../models/constants/sectioncode.constant";
import { GlobalReviewCodesTemplate } from "../models/constants/templates.constant";
import {
  AgeTemplateResponse,
  CombinationTherapyResponse,
  CommentItemsList,
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
  GroupedSection,
  Section,
  UISection,
} from "../models/interfaces/uibase";
import {
  AgeConvertAPItoUI,
  clearNewSection,
  CombinationTherapyAPItoUI,
  convertSectionNameToID,
  createNavigation,
  DailyMaximumDoseConvertAPItoUI,
  DailyMaxUnitsConvertAPItoUI,
  DiagnosisCodeOverlapsConvertAPItoUI,
  DiagnosisCodesConvertAPItoUI,
  DiagnosisCodeSummaryConvertAPItoUI,
  DosingPatternsAPItoUI,
  GenderConvertAPItoUI,
  generalInformationConvertAPIToUI,
  GlobalReviewCodesConvertAPItoUI,
  GlobalReviewIndicationsConvertAPItoUI,
  IndicationsConvertAPIToUI,
  LCDConvertAPIToUI,
  ManifestationCodesConvertAPItoUI,
  MaximumFrecuencyConvertAPItoUI,
  MedicalJournalConvertAPIToUI,
  NotesConvertAPIToUI,
  referencesConvertAPIToUI,
  RulesAPItoUI,
  SecondaryMalignancyAPItoUI,
  UnitsOverTimeConvertAPItoUI,
  versionInformation,
  VisitOverTimeConvertAPItoUI,
} from "./convertAPIToUI.utils";
const feedback = {
  beginIndex: 0,
  createdBy: "test",
  createdById: 0,
  endIndex: 0,
  feedback: "test",
  feedbackStatusCode: "test",
  itemId: 0,
  sectionRowUuid: "test",
  sourceText: "test",
  uiColumnAttribute: "Item",
};

const comment: CommentItemsList = {
  beginIndex: 0,
  endIndex: 0,
  sectionRowUuid: "test",
  sectionCode: "",
  documentNote: "",
  uiColumnAttribute: "Item",
};
const feedbackList = [
  feedback,
  {
    ...feedback,
    uiColumnAttribute: "Item Details",
  },
  {
    ...feedback,
    uiColumnAttribute: "Comments",
  },
  {
    ...feedback,
    uiColumnAttribute: "Comment",
  },
  {
    ...feedback,
    uiColumnAttribute: "LCD",
  },
  {
    ...feedback,
    uiColumnAttribute: "MAC Name",
  },
  {
    ...feedback,
    uiColumnAttribute: "Reference Type",
  },
  {
    ...feedback,
    uiColumnAttribute: "Reference Details",
  },
  {
    ...feedback,
    uiColumnAttribute: "Citation",
  },
  {
    ...feedback,
    uiColumnAttribute: "Drug Label",
  },
  {
    ...feedback,
    uiColumnAttribute: "Clinical Pharmacology",
  },
  {
    ...feedback,
    uiColumnAttribute: "CitatiMicromedex DrugDexon",
  },
  {
    ...feedback,
    uiColumnAttribute: "NCCN",
  },
  {
    ...feedback,
    uiColumnAttribute: "Lexi-Drugs",
  },
  {
    ...feedback,
    uiColumnAttribute: "AHFS-DI",
  },
  {
    ...feedback,
    uiColumnAttribute: "LCD",
  },
];
const commmentList: CommentItemsList[] = [
  {
    ...comment,
    uiColumnAttribute: "Item Details",
  },
  {
    ...comment,
    uiColumnAttribute: "Comments",
  },
  {
    ...comment,
    uiColumnAttribute: "Comment",
  },
  {
    ...comment,
    uiColumnAttribute: "LCD",
  },
  {
    ...comment,
    uiColumnAttribute: "MAC Name",
  },
  {
    ...comment,
    uiColumnAttribute: "Reference Type",
  },
  {
    ...comment,
    uiColumnAttribute: "Reference Details",
  },
  {
    ...comment,
    uiColumnAttribute: "Citation",
  },
  {
    ...comment,
    uiColumnAttribute: "Drug Label",
  },
  {
    ...comment,
    uiColumnAttribute: "Clinical Pharmacology",
  },
  {
    ...comment,
    uiColumnAttribute: "CitatiMicromedex DrugDexon",
  },
  {
    ...comment,
    uiColumnAttribute: "NCCN",
  },
  {
    ...comment,
    uiColumnAttribute: "Lexi-Drugs",
  },
  {
    ...comment,
    uiColumnAttribute: "AHFS-DI",
  },
  {
    ...comment,
    uiColumnAttribute: "LCD",
  },
];
const valuesCorresponding = ["CMS Prof MUE", "CMS OP MUE"];
// #region 'Const responses'
const LCDResponse: LCDTemplateResponse = {
  drugVersionCode: "58714459-c73a-4240-9847-ea358f9f0b5e",
  section: {
    code: SectionCode.LCD,
    name: "LCDs",
  },
  data: [
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
      comments: ["Comment 1", "Comment 2"],
      lcd: "None",
      macName: "LCD Details",
      feedbackItemsList: feedbackList,
      documentNoteList: commmentList,
    },
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
      comments: [],
      lcd: "None",
      macName: "LCD Details 2",
      feedbackItemsList: feedbackList,
      documentNoteList: commmentList,
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [feedback],
  },
};

const generalInformationResponse: GeneralInformationTemplateResponse = {
  drugVersionCode: "d73cdb40-c206-4109-97d5-0aa7bb631eb8",
  section: {
    code: SectionCode.GeneralInformation,
    name: "General Information",
  },
  data: [
    {
      item: {
        code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
        name: "[HCPCS] (Descriptor)",
      },
      data: [
        {
          code: "111f6444-ce58-4b5b-b3d8-8285bb42e093",
          itemDetails: "9171 (Injection, docetaxel, 1 mg)",
          comments: ["Comment 01", "Comment 02", "Comment 03"],
          order: 0,
          feedbackItemsList: [],
          documentNoteList: [],
        },
      ],
    },
    {
      item: {
        code: "e06dce9e-d5cc-4480-ad1c-5739fe33e72d",
        name: "Administration codes",
      },
      data: [
        {
          code: "c2a34103-db76-4e48-b392-7c5529bf0ce0",
          itemDetails: "96413, 96415, 96417",
          comments: ["Comment 01", "Comment 02", "Comment 03"],
          order: 1,
          feedbackItemsList: [],
          documentNoteList: [],
        },
      ],
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [],
  },
};
const referenceResponse: ReferencesTemplateResponse = {
  drugVersionCode: "58714459-c73a-4240-9847-ea358f9f0b5e",
  section: {
    code: SectionCode.References,
    name: "References",
  },
  data: [
    {
      referenceSourceDto: {
        code: "",
        name: "Drug Label",
      },
      data: [
        {
          code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
          comments: ["Comment 1", "Comment 2"],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          referenceSourceDto: {
            code: "PI1",
            name: "Drug Label",
          },
          referenceDetails:
            "Drug Label, Docetaxel, (docetaxel injection, solution, concentrate), May 2019",
        },
      ],
    },
    {
      referenceSourceDto: {
        code: "",
        name: "Clinical Pharmacology",
      },
      data: [
        {
          code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
          comments: [],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          referenceSourceDto: {
            code: "CP1",
            name: "Clinical Pharmacology",
          },
          referenceDetails: "Clinical Pharmacology, docetaxel, January 2019",
        },
      ],
    },
    {
      referenceSourceDto: {
        code: "",
        name: "Micromedex DrugDex",
      },
      data: [
        {
          code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
          comments: [],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          referenceSourceDto: {
            code: "DD1",
            name: "Micromedex DrugDex",
          },
          referenceDetails: "Micromedex DrugDex, docetaxel, May 2019",
        },
      ],
    },
    {
      referenceSourceDto: {
        code: "",
        name: "NCCN",
      },
      data: [
        {
          code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
          comments: [],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          referenceSourceDto: {
            code: "NCCN1",
            name: "NCCN",
          },
          referenceDetails: "NCCN, docetaxel, May 2019",
        },
      ],
    },
    {
      referenceSourceDto: {
        code: "",
        name: "Lexi-Drugs",
      },
      data: [
        {
          code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
          comments: [],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          referenceSourceDto: {
            code: "LEXI1",
            name: "Lexi-Drugs",
          },
          referenceDetails:
            "Lexi-Drugs, docetaxel, May 2019Drug Label, Docetaxel, (docetaxel injection, solution, concentrate), May 2019",
        },
      ],
    },
    {
      referenceSourceDto: {
        code: "",
        name: "AHFS-DI",
      },
      data: [
        {
          code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
          comments: [],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          referenceSourceDto: {
            code: "AHFS1",
            name: "AHFS-DI",
          },
          referenceDetails: "Lexi-Drugs, docetaxel, May 2019",
        },
      ],
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [feedback],
  },
};

const notesResponse: NotesTemplateResponse = {
  data: [
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
      comments: [],
      feedbackItemsList: feedbackList,
      documentNoteList: commmentList,
      note: "Drug Label: Should not be given if neutrophil counts are <1500 cells/mm3. Obtain frequent blood counts to monitor for neutropenia.",
    },
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d63",
      comments: [],
      feedbackItemsList: feedbackList,
      documentNoteList: commmentList,
      note: "Drug Label: Should not be given if bilirubin >ULN, or if AST and/or ALT >1.5 x ULN concomitant with alkaline phosphatase >2.5 x ULN. LFT elevations increase risk of severe or life-threatening complications. Obtain LFTs before each treatment cycle.",
    },
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d64",
      comments: [],
      feedbackItemsList: feedbackList,
      documentNoteList: commmentList,
      note: "Drug Label: Premedicate with oral corticosteroids.",
    },
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d65",
      comments: [],
      feedbackItemsList: feedbackList,
      documentNoteList: commmentList,
      note: "Drug Label: The safety and effectivness of Docetaxel Injection in pediatric patients have not been established.",
    },
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
      comments: [],
      feedbackItemsList: feedbackList,
      documentNoteList: commmentList,
      note: "Clinical Pharmacology: The suggested maximum tolerated dose (MTD) for docetaxel is dependent on performance status, other chemotherapy agents or radiation given in combination, and disease state. The optimal dose or infusion duration of docetaxel has not been determined. Therefore, dosing may vary from protocol to protocol.",
    },
  ],
  drugVersionCode: "58714459-c73a-4240-9847-ea358f9f0b5e",
  section: {
    code: "UI-S-NOTE",
    name: "Notes",
  },
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [feedback],
  },
};

const indicationsResponse: IndicationsTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.Indications,
    name: "Indications",
  },
  data: [
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
      feedbackItemsList: feedbackList,
      documentNoteList: commmentList,
      drugLabel: "drugLabel",
      clinicalPharmacology: "clinicalPharmacology",
      micromedexDrugDex: "micromedexDrugDex",
      nccn: "nccn",
      lexiDrugs: "lexiDrugs",
      ahfsDi: "ahfsDi",
      lcd: "lcd",
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [feedback],
  },
};

const medicalJournalResponse: MedicalJournalTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.MedicalJournal,
    name: "Medical_Journal",
  },
  data: [
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
      citation: "citation",
      feedbackItemsList: feedbackList,
      documentNoteList: commmentList,
      comments: ["comment1", "comment2"],
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [feedback],
  },
};

const diagnosisCodeSummaryResponse: DiagnosisCodeSummaryTemplateResponse = {
  drugVersionCode: "58714459-c73a-4240-9847-ea358f9f0b5e",
  section: {
    code: SectionCode.DiagnosticCodeSummary,
    name: "Diagnosis code summary",
  },
  data: [
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
      indication: { code: "", label: "indication" },
      comments: [],
      icd10Codes: ["C48.0", "C48.1-C48.8", "C49-C49.9"],
      invalidIcd10Codes: [],
      feedbackItemsList: feedbackList,
      documentNoteList: commmentList,
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [feedback],
    warningMessagesList: [],
  },
};

const diagnosisCodeResponse: DiagnosisCodesTemplateResponse = {
  drugVersionCode: "58714459-c73a-4240-9847-ea358f9f0b5e",
  section: {
    code: SectionCode.DiagnosisCodes,
    name: "Diagnosis Codes",
  },
  data: [
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
      comments: [],
      feedbackItemsList: feedbackList,
      documentNoteList: commmentList,
      indication: "test",
      nccnIcdsCodes: [
        {
          icd10Code: "test",
          icd10CodeId: 0,
          description: "test",
        },
      ],
      nccnIcdsCodesInvalid: [],
      lcdIcdsCodes: [
        {
          icd10Code: "test",
          icd10CodeId: 0,
          description: "test",
        },
      ],
      lcdIcdsCodesInvalid: [],
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [feedback],
    warningMessagesList: [],
  },
};

const dailyMaxUnitsResponse: DailyMaxUnitsGroupedTemplateResponse = {
  drugVersionCode: "58714459-c73a-4240-9847-ea358f9f0b5e",
  section: {
    code: SectionCode.DailyMaxUnits,
    name: "Daily Maximum Units Values For HCPCS",
  },
  codes: ["code"],
  data: [
    {
      dmuvItemDto: {
        code: "cmsprofmue",
        name: "",
      },
      data: [
        {
          code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
          currentValues: "test nccn",
          newValues: "test lcd",
          comments: [],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
        },
      ],
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [feedback],
  },
};

const maximumFrequencyResponse: MaximumFrequencyTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.MaximumFrequency,
    name: "Maximum Frequency (Standard)",
  },
  data: [
    {
      indication: "indication",
      data: [
        {
          code: "bcda8e19-9629-46e3-a193-1fc542e46d62",

          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          maximumFrequency: "maximumFrequency",
          comments: [],
        },
      ],
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [feedback],
  },
};

const manifestationCodesResponse: ManifestationCodesTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.ManifestationCodes,
    name: "Manifestation Codes",
  },
  data: [
    {
      icd10Code: {
        icd10CodeId: 1,
        icd10Code: "10",
        description: "",
      },
      code: "",
      feedbackItemsList: feedbackList,
      documentNoteList: commmentList,
      indication: { code: "", label: "indeictaion" },
      comments: [],
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [feedback],
  },
};
const ageResponse: AgeTemplateResponse = {
  drugVersionCode: "02760dff-dae3-47c7-92c3-a12eb8618623",
  section: {
    code: SectionCode.Age,
    name: "Age",
  },
  data: [
    {
      indication: {
        code: "49d2b743-dc8b-4fc6-b6bc-c3d0d5112018",
        label: "angiosarcoma",
      },
      data: [
        {
          code: "3338b688-6e91-47dd-9dbf-51079e7c97",
          comments: ["Lexi-Drugs"],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          age: "Infants, children and adults",
        },
      ],
    },
    {
      indication: {
        code: "87dfe534-4598-4759-b4b3-9c36e1313a33",
        label: "bladder cancer",
      },
      data: [
        {
          code: "bbc41bfc-65b9-4d79-96de-bf2efe436b79",
          comments: [],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          age: "18 years of age and older",
        },
      ],
    },
    {
      indication: {
        code: "097cbaff-620c-4eb1-bfe0-c791dece38b3",
        label: "breast cancer",
      },
      data: [
        {
          code: "88daecb7-8c10-4c0e-afb4-d1d98c487d71",
          comments: [],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          age: "18 years of age and older",
        },
      ],
    },
    {
      indication: {
        code: "d55c12f2-6f2d-4192-aedd-7403413fbf14",
        label: "esophageal cancer",
      },
      data: [
        {
          code: "4645d184-045a-4b1e-9653-3cf2f6c8be6e",
          comments: [],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,

          age: "18 years of age and older",
        },
      ],
    },
    {
      indication: {
        code: "d513e9a7-fef0-4836-868c-032623944ea9",
        label: "esophagogastric junction cancers",
      },
      data: [
        {
          code: "69dd704a-80ed-4458-98e0-1dbf1b762a",
          comments: [],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,

          age: "18 years of age and older",
        },
      ],
    },
    {
      indication: {
        code: "4f4b61d0-0fd9-4f4f-a937-bde5d6531bd0",
        label: "Ewingâ€™s sarcoma",
      },
      data: [
        {
          code: "e2094d43-863d-4d06-b271-e1a7c4179391",
          comments: ["Lexi-Drugs\nInfants (1 month-2 years)"],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,

          age: "Infants, children and adults",
        },
      ],
    },
    {
      indication: {
        code: "c959bbe2-88bf-4416-a98f-70f0c5f9d585",
        label: "gastric cancer",
      },
      data: [
        {
          code: "5c2a0dd3-3ee4-4a01-aad7-ba0ee20b11b9",
          comments: [],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,

          age: "18 years of age and older",
        },
      ],
    },
    {
      indication: {
        code: "05703116-7733-48e4-9404-2678cdf73e73",
        label: "harvesting of peripheral blood stem cells, mobilization",
      },
      data: [
        {
          code: "10dc04f2-8495-408a-b702-7acf89f00f63",
          comments: [],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,

          age: "18 years of age and older",
        },
      ],
    },
    {
      indication: {
        code: "c01c494a-6cbc-46c1-be6f-f366e3f87866",
        label: "head and neck cancer",
      },

      data: [
        {
          code: "b3603094-0dfd-4b86-af1b-fa4f7f7ea4f4",
          comments: [],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          age: "18 years of age and older",
        },
      ],
    },
    {
      indication: {
        code: "b101423d-8825-4a39-8f6e-67aa6802e415",
        label: "melanoma",
      },
      data: [
        {
          code: "bae57d13-a100-4098-b489-328ae2dc9d",
          comments: [],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,

          age: "18 years of age and older",
        },
      ],
    },
    {
      indication: {
        code: "bc6ceb4d-8c9d-4c4b-8dad-620bf18c8882",
        label: "non-small cell lung cancer",
      },
      data: [
        {
          code: "8727adb4-6373-4293-af1d-48f388e91697",
          comments: [],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,

          age: "18 years of age and older",
        },
      ],
    },
    {
      indication: {
        code: "ce1c76dd-b605-4340-a325-44c4808231",
        label: "occult primary",
      },
      data: [
        {
          code: "8da3b7b8-62cc-4f05-9bc3-f4532d9034a2",
          comments: [],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,

          age: "18 years of age and older",
        },
      ],
    },
    {
      indication: {
        code: "2c768c67-3d8c-4eb2-ad44-f76ecc205f23",
        label: "osteosarcoma",
      },
      data: [
        {
          code: "fee1006a-b99b-4eb7-a55f-6bf2933f78a6",
          comments: ["Lexi-Drugs"],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,

          age: "Infants, children and adults",
        },
      ],
    },
    {
      indication: {
        code: "88acc301-592c-4278-957d-222eea68f2c8",
        label: "ovarian cancer/fallopian tube cancer/primary peritoneal cancer",
      },
      data: [
        {
          code: "02a10a5f-5ada-4b2d-9912-362cddfa88bd",
          comments: [],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,

          age: "18 years of age and older",
        },
      ],
    },
    {
      indication: {
        code: "7da5b228-d037-455f-b4-1b7ea3736b",
        label: "prostate cancer",
      },
      data: [
        {
          code: "dbf08df9-7f72-4fba-85a9-8806a25995c2",
          comments: [],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,

          age: "18 years of age and older",
        },
      ],
    },
    {
      indication: {
        code: "3b618cc3-e723-4baf-81dd-5240ef03e779",
        label: "rhabdomyosarcoma",
      },
      data: [
        {
          code: "98942dc7-f2b0-40a4-a72a-62d817e531d9",
          comments: ["Lexi-Drugs"],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,

          age: "Infants, children and adults",
        },
      ],
    },
    {
      indication: {
        code: "95e0d850-7903-41dc-a373-89adf91ab13b",
        label: "small cell lung cancer",
      },
      data: [
        {
          code: "892281fa-2ace-42d9-9d66-5735f261e1bf",
          comments: [],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,

          age: "18 years of age and older",
        },
      ],
    },
    {
      indication: {
        code: "cd4c5c-ac26-4480-9bc6-7abe7d4dedf9",
        label:
          "soft tissue sarcoma (extremity/superficial trunk, head/neck) (retroperitoneal/intra-abdominal)",
      },
      data: [
        {
          code: "a8ac3e0e-a759-41da-8285-7700bb202658",
          comments: ["Lexi-Drugs"],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,

          age: "Infants, children and adults",
        },
      ],
    },
    {
      indication: {
        code: "f52dff11-715a-42a1-a2f6-f0ddd884ce5c",
        label: "thyroid carcinoma- anaplastic carcinoma",
      },
      data: [
        {
          code: "0e8f73-cd15-4baa-9db5-ae76bb0f5a78",
          comments: [],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,

          age: "18 years of age and older",
        },
      ],
    },
    {
      indication: {
        code: "3d8c6ea6-075c-42a1-b137-4add792bffee",
        label: "urothelial carcinoma",
      },
      data: [
        {
          code: "6edb8d01-3050-4fa7-ae04-0a781301fdca",
          comments: [],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,

          age: "18 years of age and older",
        },
      ],
    },
    {
      indication: {
        code: "f526858a-29cc-4b9c-9b8c-a41e9233558d",
        label: "uterine sarcoma",
      },
      data: [
        {
          code: "8b6ede9a-bab5-4e96-8be7-16f02a8d388e",
          comments: [],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,

          age: "18 years of age and older",
        },
      ],
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [feedback],
  },
};

const dailyMaximumDoseResponse: DailyMaximumDoseTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.DailyMaximumDose,
    name: "Daily Maximum Dose",
  },
  data: [
    {
      indication: {
        code: "code",
        label: "label",
      },
      data: [
        {
          code: "",
          maximumDosingPattern: "maximumDosingPattern",
          maximumDose: "maximumDose",
          maximumUnits: "maximumUnits",
          comments: [],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
        },
      ],
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [feedback],
  },
};
const genderResponse: GenderTemplateResponse = {
  drugVersionCode: "02760dff-dae3-47c7-92c3-a12eb8618623",
  section: {
    code: SectionCode.Gender,
    name: "Gender",
  },
  data: [
    {
      code: "3338b688-6e91-47dd-9dbf-51079e7c97",
      comments: ["Lexi-Drugs"],
      feedbackItemsList: feedbackList,
      documentNoteList: commmentList,
      indication: {
        code: "49d2b743-dc8b-4fc6-b6bc-c3d0d5112018",
        label: "angiosarcoma",
      },
      gender: "Male",
    },
    {
      code: "bbc41bfc-65b9-4d79-96de-bf2efe436b79",
      comments: [],
      feedbackItemsList: feedbackList,
      documentNoteList: commmentList,
      indication: {
        code: "87dfe534-4598-4759-b4b3-9c36e1313a33",
        label: "bladder cancer",
      },
      gender: "Female",
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [feedback],
  },
};

const unitsOverTimeResponse: UnitsOverTimeTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.UnitsOverTime,
    name: "Units Over Time (Standard)",
  },
  data: [
    {
      indication: {
        code: "code",
        label: "",
      },
      data: [
        {
          code: "code",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          units: "units",
          interval: "interval",
          comments: [],
        },
      ],
    },
    {
      indication: {
        code: "code",
        label: "",
      },
      data: [
        {
          code: "code",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          units: "units",
          interval: "interval",
          comments: [],
        },
      ],
    },
    {
      indication: {
        code: "code",
        label: "",
      },
      data: [
        {
          code: "code",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          units: "units",
          interval: "interval",
          comments: [],
        },
      ],
    },
    {
      indication: {
        code: "code",
        label: "",
      },
      data: [
        {
          code: "code",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          units: "units",
          interval: "interval",
          comments: [],
        },
      ],
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [feedback],
  },
};

const VisitOverTimeResponse: VisitOverTimeTemplateResponse = {
  drugVersionCode: "02760dff-dae3-47c7-92c3-a12eb8618623",
  section: {
    code: SectionCode.VisitOverTime,
    name: "Visits over time",
  },
  data: [
    {
      indication: {
        code: "49d2b743-dc8b-4fc6-b6bc-c3d0d5112018",
        label: "breast cancer",
      },
      data: [
        {
          code: "3338b688-6e91-47dd-9dbf-51079e721c97",
          visits: "13",
          interval: "26 weeks",
          comments: [],
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
        },
      ],
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [feedback],
  },
};

const diagnosisCodeOverlapsResponse: DiagnosisCodeOverlapsResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.DiagnosisCodeOverlaps,
    name: "Diagnosis Code Overlaps",
  },

  data: [
    {
      icd10Code: {
        icd10Code: "",
      },
      data: [
        {
          order: 0,
          code: "",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          indication: {
            code: "",
            label: "",
          },
          units: "",
          frequency: "",
          unitsOverTime: "",
          visitsOverTime: "",
          age: "",
          hasBorder: false,
          comments: [],
        },
      ],
    },
    {
      icd10Code: {
        icd10Code: "",
      },
      data: [
        {
          order: 0,
          code: "",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          indication: {
            code: "",
            label: "",
          },
          units: "",
          frequency: "",
          unitsOverTime: "",
          visitsOverTime: "",
          age: "",
          hasBorder: true,
          comments: [],
        },
      ],
    },
    {
      icd10Code: {
        icd10Code: "",
      },
      data: [
        {
          order: 0,
          code: "",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          indication: {
            code: "",
            label: "",
          },
          units: "",
          frequency: "",
          unitsOverTime: "",
          visitsOverTime: "",
          age: "",
          hasBorder: false,
          comments: [],
        },
      ],
    },
    {
      icd10Code: {
        icd10Code: "",
      },
      data: [
        {
          order: 0,
          code: "",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          indication: {
            code: "",
            label: "",
          },
          units: "",
          frequency: "",
          unitsOverTime: "",
          visitsOverTime: "",
          age: "",
          hasBorder: false,
          comments: [],
        },
      ],
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [feedback],
  },
};

const combinationTherapyResponse: CombinationTherapyResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.CombinationTherapy,
    name: "Combination Therapy",
  },
  data: [
    {
      indication: {
        code: "",
        label: "",
      },
      data: [
        {
          code: "",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          comments: [],
          combination: "",
          codes: [],
        },
      ],
    },
    {
      indication: {
        code: "",
        label: "",
      },
      data: [
        {
          code: "",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          comments: [],
          combination: "",
          codes: [],
        },
      ],
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [feedback],
  },
};

const GlobalReviewIndicationsResponse: GlobalReviewIndicationsResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.DiagnosisCodeOverlaps,
    name: "Global Review - Indications",
  },

  data: [
    {
      code: "",
      order: 0,
      feedbackItemsList: feedbackList,
      documentNoteList: commmentList,
      indication: { code: "", label: "" },
      globalReviewIndication: "",
      comments: [],
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [feedback],
  },
};

const GlobalReviewCodesResponse: GlobalReviewCodesResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.GlobalReviewCodes,
    name: "Global Review - ICD-10 Codes",
  },
  data: [
    {
      code: "",
      feedbackItemsList: feedbackList,
      documentNoteList: commmentList,
      currentIcd10CodeRange: {
        icd10CodeId: 0,
        icd10Code: "",
      },
      globalReviewIcd10Code: {
        icd10CodeId: 0,
        icd10Code: "",
      },
      comments: [],
    },
    {
      code: "",
      feedbackItemsList: feedbackList,
      documentNoteList: commmentList,
      currentIcd10CodeRange: {
        icd10CodeId: 0,
        icd10Code: "",
      },
      globalReviewIcd10Code: {
        icd10CodeId: 0,
        icd10Code: "",
      },
      comments: [],
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [feedback],
  },
};

const SecondaryMalignancyResponse: SecondaryMalignancyResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.SecondaryMalignancy,
    name: "Secondary malignancy(C77-C79.9) ICD-10 codes",
  },
  data: [
    {
      malignancyIcdsCodes: [
        {
          icd10Code: "",
        },
      ],
      secondarySite: "",
      data: [
        {
          code: "",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          order: 0,
          hasBorder: false,
          primaryMalignancy: "",
          units: "",
          frequency: "",
          unitsOverTime: "",
          visitsOverTime: "",
          age: "",
          comments: [],
        },
        {
          code: "",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          order: 0,
          hasBorder: false,
          primaryMalignancy: "",
          units: "",
          frequency: "",
          unitsOverTime: "",
          visitsOverTime: "",
          age: "",
          comments: [],
        },
        {
          code: "",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          order: 0,
          hasBorder: false,
          primaryMalignancy: "",
          units: "",
          frequency: "",
          unitsOverTime: "",
          visitsOverTime: "",
          age: "",
          comments: [],
        },
        {
          code: "",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          order: 0,
          hasBorder: false,
          primaryMalignancy: "",
          units: "",
          frequency: "",
          unitsOverTime: "",
          visitsOverTime: "",
          age: "",
          comments: [],
        },
        {
          code: "",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          order: 0,
          hasBorder: false,
          primaryMalignancy: "",
          units: "",
          frequency: "",
          unitsOverTime: "",
          visitsOverTime: "",
          age: "",
          comments: [],
        },
      ],
    },
    {
      malignancyIcdsCodes: [
        {
          icd10Code: "",
        },
      ],
      secondarySite: "",
      data: [
        {
          code: "",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          order: 0,
          hasBorder: false,
          primaryMalignancy: "",
          units: "",
          frequency: "",
          unitsOverTime: "",
          visitsOverTime: "",
          age: "",
          comments: [],
        },
        {
          code: "",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          order: 0,
          hasBorder: false,
          primaryMalignancy: "",
          units: "",
          frequency: "",
          unitsOverTime: "",
          visitsOverTime: "",
          age: "",
          comments: [],
        },
        {
          code: "",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          order: 0,
          hasBorder: false,
          primaryMalignancy: "",
          units: "",
          frequency: "",
          unitsOverTime: "",
          visitsOverTime: "",
          age: "",
          comments: [],
        },
        {
          code: "",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          order: 0,
          hasBorder: false,
          primaryMalignancy: "",
          units: "",
          frequency: "",
          unitsOverTime: "",
          visitsOverTime: "",
          age: "",
          comments: [],
        },
        {
          code: "",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          order: 0,
          hasBorder: false,
          primaryMalignancy: "",
          units: "",
          frequency: "",
          unitsOverTime: "",
          visitsOverTime: "",
          age: "",
          comments: [],
        },
      ],
    },
    {
      malignancyIcdsCodes: [
        {
          icd10Code: "",
        },
      ],
      secondarySite: "",
      data: [
        {
          code: "",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          order: 0,
          hasBorder: false,
          primaryMalignancy: "",
          units: "",
          frequency: "",
          unitsOverTime: "",
          visitsOverTime: "",
          age: "",
          comments: [],
        },
        {
          code: "",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          order: 0,
          hasBorder: false,
          primaryMalignancy: "",
          units: "",
          frequency: "",
          unitsOverTime: "",
          visitsOverTime: "",
          age: "",
          comments: [],
        },
        {
          code: "",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          order: 0,
          hasBorder: false,
          primaryMalignancy: "",
          units: "",
          frequency: "",
          unitsOverTime: "",
          visitsOverTime: "",
          age: "",
          comments: [],
        },
        {
          code: "",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          order: 0,
          hasBorder: false,
          primaryMalignancy: "",
          units: "",
          frequency: "",
          unitsOverTime: "",
          visitsOverTime: "",
          age: "",
          comments: [],
        },
        {
          code: "",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          order: 0,
          hasBorder: false,
          primaryMalignancy: "",
          units: "",
          frequency: "",
          unitsOverTime: "",
          visitsOverTime: "",
          age: "",
          comments: [],
        },
      ],
    },
    {
      malignancyIcdsCodes: [
        {
          icd10Code: "",
        },
      ],
      secondarySite: "",
      data: [
        {
          code: "",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          order: 0,
          hasBorder: false,
          primaryMalignancy: "",
          units: "",
          frequency: "",
          unitsOverTime: "",
          visitsOverTime: "",
          age: "",
          comments: [],
        },
        {
          code: "",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          order: 0,
          hasBorder: false,
          primaryMalignancy: "",
          units: "",
          frequency: "",
          unitsOverTime: "",
          visitsOverTime: "",
          age: "",
          comments: [],
        },
        {
          code: "",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          order: 0,
          hasBorder: false,
          primaryMalignancy: "",
          units: "",
          frequency: "",
          unitsOverTime: "",
          visitsOverTime: "",
          age: "",
          comments: [],
        },
        {
          code: "",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          order: 0,
          hasBorder: false,
          primaryMalignancy: "",
          units: "",
          frequency: "",
          unitsOverTime: "",
          visitsOverTime: "",
          age: "",
          comments: [],
        },
        {
          code: "",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          order: 0,
          hasBorder: false,
          primaryMalignancy: "",
          units: "",
          frequency: "",
          unitsOverTime: "",
          visitsOverTime: "",
          age: "",
          comments: [],
        },
      ],
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [feedback],
  },
  codes: ["10"],
};

const dosingPatternsResponse: DosingPatternsResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.DosingPatterns,
    name: "Dosing Patterns",
  },
  data: [
    {
      indication: {
        code: "",
        label: "indication",
      },
      data: [
        {
          code: "text",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          drugLabel: "text",
          clinicalPharma: "text",
          micromedex: "text",
          nccn: "text",
          lexiDrugs: "text",
          ahfsDi: "text",
          other: "text",
        },
      ],
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [feedback],
  },
};

const diangosiCodesOverlapsResponse: DiagnosisCodeOverlapsResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.DiagnosisCodeOverlaps,
    name: "Diagnosis Codes Overlaps",
  },
  data: [
    {
      icd10Code: { icd10Code: "code" },
      data: [
        {
          code: "text",
          feedbackItemsList: feedbackList,
          documentNoteList: commmentList,
          indication: {
            code: "text",
            label: "text",
          },
          units: "text",
          frequency: "text",
          unitsOverTime: "text",
          visitsOverTime: "text",
          age: "text",
          comments: [],
        },
      ],
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [feedback],
  },
};

const globalReviewIndicationResponse: GlobalReviewIndicationsResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.GlobalReviewIndications,
    name: "Global Review Indications",
  },
  data: [
    {
      code: "text",
      feedbackItemsList: feedbackList,
      documentNoteList: commmentList,
      indication: { code: "text", label: "code" },
      globalReviewIndication: "text",
      comments: [],
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [feedback],
  },
};

const rulesResponse: RulesTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.Rules,
    name: "Rules",
  },
  data: [
    {
      feedbackItemsList: feedbackList,
      documentNoteList: commmentList,
      code: "text",
      description: "text",
      rule: "text",
      comments: [],
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [feedback],
  },
};

// #endregion 'Const responses'

fdescribe("convertAPIToUI", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({}).compileComponents();
  }));

  // #region 'Section Tests'
  it("should convert general information API response to UI elements", () => {
    const section = generalInformationConvertAPIToUI(
      generalInformationResponse
    );

    expect(section.groups.length).toBe(generalInformationResponse.data.length);
    expect(section.groups[0].names[0].value).toBe(
      `${generalInformationResponse.data[0].item.name}\n`
    );
  });

  it("should convert reference API response to UI elements", () => {
    const section = referencesConvertAPIToUI(referenceResponse);
    expect(section.groups.length).toBe(referenceResponse.data.length);

    expect(section.groups[0].names[0].value).toBe(
      `${referenceResponse.data[0].referenceSourceDto.name}\n`
    );
  });

  it("should convert LCD API response to UI elements", () => {
    const section = LCDConvertAPIToUI(LCDResponse);
    expect(section.rows.length).toBe(LCDResponse.data.length);

    expect(section.rows[0].columns[0].value).toBe(
      `${LCDResponse.data[0].lcd}\n`
    );
  });

  it("should convert Notes API response to UI elements", () => {
    const section = NotesConvertAPIToUI(notesResponse);
    expect(section.rows.length).toBe(notesResponse.data.length);

    expect(section.rows[0].columns[0].value).toBe(
      `${notesResponse.data[0].note}\n`
    );
  });

  it("should convert Indications API response to UI elements", () => {
    const section = IndicationsConvertAPIToUI(indicationsResponse);
    expect(section.rows.length).toBe(indicationsResponse.data.length);

    expect(section.rows[0].columns[0].value).toBe(
      `${indicationsResponse.data[0].drugLabel}\n`
    );
  });

  it("should convert Medical Journal API response to UI elements", () => {
    const section = MedicalJournalConvertAPIToUI(medicalJournalResponse);
    expect(section.rows.length).toBe(medicalJournalResponse.data.length);

    expect(section.rows[0].columns[0].value).toBe(
      `${medicalJournalResponse.data[0].citation}\n`
    );
  });

  it("should convert Daily Max Units API response to UI elements", () => {
    const section = DailyMaxUnitsConvertAPItoUI(
      dailyMaxUnitsResponse,
      valuesCorresponding
    );

    expect(section.groups.length).toBe(dailyMaxUnitsResponse.data.length);

    expect(section.groups[0].names[0].value).toBe(
      `${dailyMaxUnitsResponse.data[0].dmuvItemDto.name}\n`
    );
  });

  it("should convert Diagnosis code API response to UI elements", () => {
    const section = DiagnosisCodesConvertAPItoUI(diagnosisCodeResponse);

    expect(section.rows.length).toBe(diagnosisCodeResponse.data.length);

    expect(section.rows[0].columns[0].value).toBe(
      `${diagnosisCodeResponse.data[0].indication}\n`
    );
  });

  it("should convert Diagnosis code summary API response to UI elements", () => {
    const section = DiagnosisCodeSummaryConvertAPItoUI(
      diagnosisCodeSummaryResponse
    );

    expect(section.rows.length).toBe(diagnosisCodeSummaryResponse.data.length);

    expect(section.rows[0].columns[0].value).toBe(
      `${diagnosisCodeSummaryResponse.data[0].indication.label}\n`
    );
  });

  it("should convert Maximum frequency API response to UI elements", () => {
    const section = MaximumFrecuencyConvertAPItoUI(maximumFrequencyResponse);

    expect(section.groups[0].rows.length).toBe(
      maximumFrequencyResponse.data.length
    );

    expect(section.groups[0].names[0].value).toBe(
      `${maximumFrequencyResponse.data[0].indication}\n`
    );
  });

  it("should convert Manifestation codes API response to UI elements", () => {
    const section = ManifestationCodesConvertAPItoUI(
      manifestationCodesResponse
    );

    expect(section.rows.length).toBe(manifestationCodesResponse.data.length);

    expect(section.rows[0].columns[0].value).toBe(
      `${manifestationCodesResponse.data[0].icd10Code.icd10Code}\n`
    );
  });

  it("should convert Age API response to UI elements", () => {
    const section = AgeConvertAPItoUI(ageResponse);

    expect(section.groups[0].rows.length).toBe(ageResponse.data[0].data.length);

    expect(section.groups[0].names[0].value).toBe(
      `${ageResponse.data[0].indication.label}\n`
    );
  });

  it("should convert Daily Maximum Dose API response to UI elements", () => {
    const section = DailyMaximumDoseConvertAPItoUI(dailyMaximumDoseResponse);

    expect(section.groups[0].rows.length).toBe(
      dailyMaximumDoseResponse.data.length
    );

    expect(section.groups[0].names[0].value).toBe(
      `${dailyMaximumDoseResponse.data[0].indication.label}\n`
    );
  });

  it("should convert Gender  API response to UI elements", () => {
    const section = GenderConvertAPItoUI(genderResponse);

    expect(section.rows.length).toBe(genderResponse.data.length);

    expect(section.rows[0].columns[0].value).toBe(
      `${genderResponse.data[0].indication.label}\n`
    );
  });

  it("should convert Units over time  API response to UI elements", () => {
    const section = UnitsOverTimeConvertAPItoUI(unitsOverTimeResponse);

    expect(section.groups.length).toBe(unitsOverTimeResponse.data.length);

    expect(section.groups[0].names[0].value).toBe(
      `${unitsOverTimeResponse.data[0].indication.label}\n`
    );
  });

  it("should convert Visit Over time API response to UI elements", () => {
    const section = VisitOverTimeConvertAPItoUI(VisitOverTimeResponse);

    expect(section.groups.length).toBe(VisitOverTimeResponse.data.length);

    expect(section.groups[0].names[0].value).toBe(
      `${VisitOverTimeResponse.data[0].indication.label}\n`
    );
  });

  it("should convert Global reviews code API response to UI elements", () => {
    const section = GlobalReviewCodesConvertAPItoUI(GlobalReviewCodesTemplate);

    expect(section.rows.length).toBe(GlobalReviewCodesTemplate.data.length);

    expect(section.rows[0].columns[0].value).toBe(
      `${GlobalReviewCodesTemplate.data[0].currentIcd10CodeRange.icd10Code}\n`
    );
  });

  it("should convert combination therapy elements", () => {
    const section = CombinationTherapyAPItoUI(combinationTherapyResponse);
    expect(section.groups.length).toBe(combinationTherapyResponse.data.length);
    expect(section.groups[0].names[0].value).toBe(
      `${combinationTherapyResponse.data[0].indication.label}\n`
    );
  });

  it("should convert dosing patterns elements", () => {
    const section = DosingPatternsAPItoUI(dosingPatternsResponse);
    expect(section.groups.length).toBe(dosingPatternsResponse.data.length);
    expect(section.groups[0].names[0].value).toBe(
      `${dosingPatternsResponse.data[0].indication.label}\n`
    );
  });

  it("should convert diagnosis code overlaps elements", () => {
    const section = DiagnosisCodeOverlapsConvertAPItoUI(
      diangosiCodesOverlapsResponse
    );
    expect(section.groups.length).toBe(
      diangosiCodesOverlapsResponse.data.length
    );
    expect(section.groups[0].names[0].value).toBe(
      `${diangosiCodesOverlapsResponse.data[0].icd10Code.icd10Code}\n`
    );
  });

  it("should convert global review indications elements", () => {
    const section = GlobalReviewIndicationsConvertAPItoUI(
      globalReviewIndicationResponse
    );
    expect(section.rows.length).toBe(
      globalReviewIndicationResponse.data.length
    );
    expect(section.rows[0].columns[0].value).toBe(
      `${globalReviewIndicationResponse.data[0].indication.label}\n`
    );
  });

  it("should convert secondary malignancy elements", () => {
    const section = SecondaryMalignancyAPItoUI(SecondaryMalignancyResponse);
    expect(section.groups.length).toBe(SecondaryMalignancyResponse.data.length);
    expect(section.groups[0].names[0].value).toBe(
      `${SecondaryMalignancyResponse.data[0].malignancyIcdsCodes[0].icd10Code}\n`
    );
  });

  it("should convert rules elements", () => {
    const section = RulesAPItoUI(rulesResponse, true, "");
    expect(section.rows.length).toBe(rulesResponse.data.length);
    expect(section.rows[0].columns[0].value).toBe(
      `${rulesResponse.data[0].rule}\n`
    );
  });

  it("should convert string into an id", () => {
    const id = convertSectionNameToID("General Info");
    expect(id).toBe("general_info");
  });

  // #endregion 'Section Tests'
  it("should create only one version section", () => {
    const LCDUISection = versionInformation(LCDResponse);
    expect(LCDUISection.id).toBe("lcds");
    expect((LCDUISection as Section).rows[0].columns[0].value).toEqual(
      `${LCDResponse.data[0].lcd}\n`
    );

    const GISection = versionInformation(generalInformationResponse);
    expect(GISection.id).toBe("general_information");
    expect((GISection as GroupedSection).groups[0].names[0].value).toEqual(
      `${generalInformationResponse.data[0].item.name}\n`
    );

    const RefUISection = versionInformation(referenceResponse);
    expect(RefUISection.id).toBe("references");
    expect((RefUISection as GroupedSection).groups[0].names[0].value).toEqual(
      `${referenceResponse.data[0].data[0].referenceSourceDto.name}\n`
    );

    const NotesUISection = versionInformation(notesResponse);
    expect(NotesUISection.id).toBe("notes");
    expect((NotesUISection as Section).rows[0].columns[0].value).toEqual(
      `${notesResponse.data[0].note}\n`
    );

    const IndicationsUISection = versionInformation(indicationsResponse);
    expect(IndicationsUISection.id).toBe("indications");
    expect((IndicationsUISection as Section).rows[0].columns[0].value).toEqual(
      `${indicationsResponse.data[0].drugLabel}\n`
    );

    const medicalJournalUISection = versionInformation(medicalJournalResponse);

    expect(medicalJournalUISection.id).toBe("medical_journal");
    expect(
      (medicalJournalUISection as Section).rows[0].columns[0].value
    ).toEqual(`${medicalJournalResponse.data[0].citation}\n`);

    const dailyMaxUnitsUISection = versionInformation(dailyMaxUnitsResponse);
    expect(dailyMaxUnitsUISection.id).toBe(
      "daily_maximum_units_values_for_hcpcs"
    );

    expect(
      (dailyMaxUnitsUISection as GroupedSection).groups[0].names[0].value
    ).toEqual(`${dailyMaxUnitsResponse.data[0].dmuvItemDto.name}\n`);

    const diagnosisCodeUISection = versionInformation(diagnosisCodeResponse);
    expect(diagnosisCodeUISection.id).toBe("diagnosis_codes");
    expect(
      (diagnosisCodeUISection as Section).rows[0].columns[0].value
    ).toEqual(`${diagnosisCodeResponse.data[0].indication}\n`);

    const diagnosisCodeSUmmaryUISection = versionInformation(
      diagnosisCodeSummaryResponse
    );
    expect(diagnosisCodeSUmmaryUISection.id).toBe("diagnosis_code_summary");
    expect(
      (diagnosisCodeSUmmaryUISection as Section).rows[0].columns[0].value
    ).toEqual(`${diagnosisCodeSummaryResponse.data[0].indication.label}\n`);

    const maximumFrequencyUISection = versionInformation(
      maximumFrequencyResponse
    );
    expect(maximumFrequencyUISection.id).toBe("maximum_frequency_(standard)");
    expect(
      (maximumFrequencyUISection as GroupedSection).groups[0].names[0].value
    ).toEqual(`${maximumFrequencyResponse.data[0].indication}\n`);

    const manifestationCodesUISection = versionInformation(
      manifestationCodesResponse
    );
    expect(manifestationCodesUISection.id).toBe("manifestation_codes");
    expect(
      (manifestationCodesUISection as Section).rows[0].columns[0].value
    ).toEqual(`${manifestationCodesResponse.data[0].icd10Code.icd10Code}\n`);

    const ageUISection = versionInformation(ageResponse);
    expect(ageUISection.id).toBe("age");
    expect((ageUISection as GroupedSection).groups[0].names[0].value).toEqual(
      `${ageResponse.data[0].indication.label}\n`
    );

    const DailyMaxDoseUISection = versionInformation(dailyMaximumDoseResponse);
    expect(DailyMaxDoseUISection.id).toBe("daily_maximum_dose");
    expect(
      (DailyMaxDoseUISection as GroupedSection).groups[0].names[0].value
    ).toEqual(`${dailyMaximumDoseResponse.data[0].indication.label}\n`);

    const genderUISection = versionInformation(genderResponse);
    expect(genderUISection.id).toBe("gender");
    expect((genderUISection as Section).rows[0].columns[0].value).toEqual(
      `${genderResponse.data[0].indication.label}\n`
    );

    const unitsOverTimeUISection = versionInformation(unitsOverTimeResponse);
    expect(unitsOverTimeUISection.id).toBe("units_over_time_(standard)");
    expect(
      (unitsOverTimeUISection as GroupedSection).groups[0].names[0].value
    ).toEqual(`${unitsOverTimeResponse.data[0].indication.label}\n`);

    const globalReviewCodesUISection = versionInformation(
      GlobalReviewCodesTemplate
    );
    expect(globalReviewCodesUISection.id).toBe("global_review_-_icd-10_codes");
    expect(
      (globalReviewCodesUISection as Section).rows[0].columns[0].value
    ).toEqual(
      `${GlobalReviewCodesTemplate.data[0].currentIcd10CodeRange.icd10Code}\n`
    );

    const combinationTherapyUISection = versionInformation(
      combinationTherapyResponse
    );
    expect(combinationTherapyUISection.id).toBe("combination_therapy");
    expect(
      (combinationTherapyUISection as GroupedSection).groups[0].names[0].value
    ).toEqual(`${combinationTherapyResponse.data[0].indication.label}\n`);

    const visitsUISection = versionInformation(VisitOverTimeResponse);
    expect(visitsUISection.id).toBe("visits_over_time");
    expect(
      (visitsUISection as GroupedSection).groups[0].names[0].value
    ).toEqual(`${VisitOverTimeResponse.data[0].indication.label}\n`);

    const dosignPatternsUISection = versionInformation(dosingPatternsResponse);
    expect(dosignPatternsUISection.id).toBe("dosing_patterns");
    expect(
      (dosignPatternsUISection as GroupedSection).groups[0].names[0].value
    ).toEqual(`${dosingPatternsResponse.data[0].indication.label}\n`);

    const diagnosisCodeverlapsUISection = versionInformation(
      diagnosisCodeOverlapsResponse
    );
    expect(diagnosisCodeverlapsUISection.id).toBe("diagnosis_code_overlaps");
    expect(
      (diagnosisCodeverlapsUISection as GroupedSection).groups[0].names[0].value
    ).toEqual(`${diagnosisCodeOverlapsResponse.data[0].icd10Code.icd10Code}\n`);

    const globalReviewIndicationsUISection = versionInformation(
      globalReviewIndicationResponse
    );
    expect(globalReviewIndicationsUISection.id).toBe(
      "global_review_indications"
    );
    expect(
      (globalReviewIndicationsUISection as Section).rows[0].columns[0].value
    ).toEqual(`${globalReviewIndicationResponse.data[0].indication.label}\n`);

    const rulesUISection = versionInformation(rulesResponse);
    expect(rulesUISection.id).toBe("rules");
    expect((rulesUISection as Section).rows[0].columns[0].value).toEqual(
      `${rulesResponse.data[0].rule}\n`
    );

    const secondaryUISection = versionInformation(SecondaryMalignancyResponse);
    expect(secondaryUISection.id).toBe(
      "secondary_malignancy(c77-c79.9)_icd-10_codes"
    );
    expect(
      (secondaryUISection as GroupedSection).groups[0].names[0].value
    ).toEqual(
      `${SecondaryMalignancyResponse.data[0].malignancyIcdsCodes[0].icd10Code}\n`
    );
  });

  it("should clear a section information", () => {
    const LCDUISection = clearNewSection(LCDResponse.section.code, "");
    expect(LCDUISection.id).toBe("lcds");
    expect((LCDUISection as Section).rows[0].columns[0].value).toEqual(`\n`);

    const GISection = clearNewSection(
      generalInformationResponse.section.code,
      ""
    );
    expect(GISection.id).toBe("general_information");
    expect((GISection as GroupedSection).groups[0].names[0].value).toEqual(
      `[HCPCS] (Descriptor)\n`
    );

    const RefUISection = clearNewSection(referenceResponse.section.code, "");
    expect(RefUISection.id).toBe("references");
    expect((RefUISection as GroupedSection).groups[0].names[0].value).toEqual(
      `Drug Label\n`
    );

    const NotesUISection = clearNewSection(notesResponse.section.code, "");
    expect(NotesUISection.id).toBe("notes");
    expect((NotesUISection as Section).rows[0].columns[0].value).toEqual(`\n`);

    const IndicationsUISection = clearNewSection(
      indicationsResponse.section.code,
      ""
    );
    expect(IndicationsUISection.id).toBe("indications");
    expect((IndicationsUISection as Section).rows[0].columns[0].value).toEqual(
      `\n`
    );

    const medicalJournalUISection = clearNewSection(
      medicalJournalResponse.section.code,
      ""
    );

    expect(medicalJournalUISection.id).toBe("medical_journal");
    expect(
      (medicalJournalUISection as Section).rows[0].columns[0].value
    ).toEqual(`\n`);

    const dailyMaxUnitsUISection = clearNewSection(
      dailyMaxUnitsResponse.section.code,
      ""
    );
    expect(dailyMaxUnitsUISection.id).toBe(
      "daily_maximum_units_values_for_hcpcs"
    );

    expect(
      (dailyMaxUnitsUISection as GroupedSection).groups[0].names[0].value
    ).toEqual(`CMS Prof MUE\n`);

    const diagnosisCodeUISection = clearNewSection(
      diagnosisCodeResponse.section.code,
      ""
    );
    expect(diagnosisCodeUISection.id).toBe("diagnosis_codes");
    expect(
      (diagnosisCodeUISection as Section).rows[0].columns[0].value
    ).toEqual(`\n`);

    const diagnosisCodeSUmmaryUISection = clearNewSection(
      diagnosisCodeSummaryResponse.section.code,
      ""
    );
    expect(diagnosisCodeSUmmaryUISection.id).toBe("diagnosis_code_summary");
    expect(
      (diagnosisCodeSUmmaryUISection as Section).rows[0].columns[0].value
    ).toEqual(`\n`);

    const maximumFrequencyUISection = clearNewSection(
      maximumFrequencyResponse.section.code,
      ""
    );
    expect(maximumFrequencyUISection.id).toBe("maximum_frequency_(standard)");
    expect(
      (maximumFrequencyUISection as GroupedSection).groups[0].names[0].value
    ).toEqual(`\n`);

    const manifestationCodesUISection = clearNewSection(
      manifestationCodesResponse.section.code,
      ""
    );
    expect(manifestationCodesUISection.id).toBe("manifestation_codes");
    expect(
      (manifestationCodesUISection as Section).rows[0].columns[0].value
    ).toEqual(`\n`);

    const ageUISection = clearNewSection(ageResponse.section.code, "");
    expect(ageUISection.id).toBe("age");
    expect(
      (ageUISection as GroupedSection).groups[0].rows[0].columns[0].value
    ).toEqual(`\n`);

    const DailyMaxDoseUISection = clearNewSection(
      dailyMaximumDoseResponse.section.code,
      ""
    );
    expect(DailyMaxDoseUISection.id).toBe("daily_maximum_dose_(standard)");
    expect(
      (DailyMaxDoseUISection as GroupedSection).groups[0].names[0].value
    ).toEqual(`\n`);

    const genderUISection = clearNewSection(genderResponse.section.code, "");
    expect(genderUISection.id).toBe("gender");
    expect((genderUISection as Section).rows[0].columns[0].value).toEqual(`\n`);

    const unitsOverTimeUISection = clearNewSection(
      unitsOverTimeResponse.section.code,
      ""
    );
    expect(unitsOverTimeUISection.id).toBe("units_over_time_(standard)");
    expect(
      (unitsOverTimeUISection as GroupedSection).groups[0].names[0].value
    ).toEqual(`\n`);

    const globalReviewCodesUISection = clearNewSection(
      GlobalReviewCodesTemplate.section.code,
      ""
    );
    expect(globalReviewCodesUISection.id).toBe("global_review_-_icd-10_codes");
    expect(
      (globalReviewCodesUISection as Section).rows[0].columns[0].value
    ).toEqual(`\n`);

    const combinationTherapyUISection = clearNewSection(
      combinationTherapyResponse.section.code,
      ""
    );
    expect(combinationTherapyUISection.id).toBe("combination_therapy");
    expect(
      (combinationTherapyUISection as GroupedSection).groups[0].names[0].value
    ).toEqual(`\n`);

    const visitsUISection = clearNewSection(
      VisitOverTimeResponse.section.code,
      ""
    );
    expect(visitsUISection.id).toBe("visits_over_time_(standard)");
    expect(
      (visitsUISection as GroupedSection).groups[0].names[0].value
    ).toEqual(`\n`);

    const dosignPatternsUISection = clearNewSection(
      dosingPatternsResponse.section.code,
      ""
    );
    expect(dosignPatternsUISection.id).toBe("dosing_patterns");
    expect(
      (dosignPatternsUISection as GroupedSection).groups[0].names[0].value
    ).toEqual(`\n`);

    const diagnosisCodeverlapsUISection = clearNewSection(
      diagnosisCodeOverlapsResponse.section.code,
      ""
    );
    expect(diagnosisCodeverlapsUISection.id).toBe("diagnosis_code_overlaps_(standard)");
    expect(
      (diagnosisCodeverlapsUISection as GroupedSection).groups[0].names[0].value
    ).toEqual(`\n`);

    const globalReviewIndicationsUISection = clearNewSection(
      globalReviewIndicationResponse.section.code,
      ""
    );
    expect(globalReviewIndicationsUISection.id).toBe(
      "global_review_-_indications"
    );
    expect(
      (globalReviewIndicationsUISection as Section).rows[0].columns[0].value
    ).toEqual(`\n`);

    const rulesUISection = clearNewSection(rulesResponse.section.code, "rules");
    expect(rulesUISection.id).toBe("rules");
    expect((rulesUISection as Section).rows[0].columns[0].value).toEqual(`\n`);

    const secondaryUISection = clearNewSection(
      SecondaryMalignancyResponse.section.code,
      ""
    );
    expect(secondaryUISection.id).toBe(
      "secondary_malignancy_(c77-c79.9)_icd-10_codes_(standard)"
    );
    expect(
      (secondaryUISection as GroupedSection).groups[0].names[0].value
    ).toEqual(`\n`);
  });

  it("should create sections navigation", () => {
    const newSection = {
      drugVersionCode: "test",
      id: "test",
      section: {
        code: "test",
        name: "test",
      },
      headers: [],
      headersUIWidth: [],
      rows: [],
    };
    const sections: UISection[] = [
      {
        id: "1",
        current: newSection,
        new: newSection,
        hasRowHeading: false,
        grouped: false,
      },
      {
        id: "2",
        current: newSection,
        new: newSection,
        hasRowHeading: false,
        grouped: false,
      },
      {
        id: "3",
        current: newSection,
        new: newSection,
        hasRowHeading: false,
        grouped: false,
      },
      {
        id: "4",
        current: newSection,
        new: newSection,
        hasRowHeading: false,
        grouped: false,
      },
      {
        id: "5",
        current: newSection,
        new: newSection,
        hasRowHeading: false,
        grouped: false,
      },
      {
        id: "6",
        current: newSection,
        new: newSection,
        hasRowHeading: false,
        grouped: false,
      },
      {
        id: "7",
        current: newSection,
        new: newSection,
        hasRowHeading: false,
        grouped: false,
      },
      {
        id: "8",
        current: newSection,
        new: newSection,
        hasRowHeading: false,
        grouped: false,
      },
      {
        id: "9",
        current: newSection,
        new: newSection,
        hasRowHeading: false,
        grouped: false,
      },
      {
        id: "10",
        current: newSection,
        new: newSection,
        hasRowHeading: false,
        grouped: false,
      },
      {
        id: "11",
        current: newSection,
        new: newSection,
        hasRowHeading: false,
        grouped: false,
      },
    ];
    const navigation = createNavigation(sections);
    expect(navigation.length).toBe(11);
  });
});
