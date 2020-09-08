import { async, TestBed } from "@angular/core/testing";
import { SectionCode } from "../models/constants/sectioncode.constant";
import {
  AgeTemplate,
  DailyMaximumDoseTemplate,
  DailyMaxUnitsTemplate,
  DiagnosisCodeSummaryTemplate,
  GenderTemplate,
  GeneralInformationTemplate,
  GlobalReviewCodesTemplate,
  IndicationsTemplate,
  LCDTemplate,
  ManifestationCodesTemplate,
  MaximumFrequencyTemplate,
  MedicalJournalTemplate,
  NotesTemplate,
  ReferenceTemplate,
} from "../models/constants/templates.constant";
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
  aggregatorInformation,
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
    },
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
      comments: [],
      lcd: "None",
      macName: "LCD Details 2",
    },
  ],
};

const generalInformationResponse = {
  drugVersionCode: "d73cdb40-c206-4109-97d5-0aa7bb631eb8",
  section: {
    code: SectionCode.GeneralInformation,
    name: "General Information",
  },
  data: [
    {
      code: "111f6444-ce58-4b5b-b3d8-8285bb42e093",
      comments: ["Comment 01", "Comment 02", "Comment 03"],
      item: {
        code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
        name: "[HCPCS] (Descriptor)",
      },
      itemDetails: "9171 (Injection, docetaxel, 1 mg)",
    },
    {
      code: "c2a34103-db76-4e48-b392-7c5529bf0ce0",
      comments: [],
      item: {
        code: "e06dce9e-d5cc-4480-ad1c-5739fe33e72d",
        name: "Administration codes",
      },
      itemDetails: "96413, 96415, 96417",
    },
  ],
};

const referenceResponse: ReferencesTemplateResponse = {
  drugVersionCode: "58714459-c73a-4240-9847-ea358f9f0b5e",
  section: {
    code: SectionCode.References,
    name: "References",
  },
  data: [
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
      comments: ["Comment 1", "Comment 2"],
      referenceSourceDto: {
        code: "PI1",
        name: "Drug Label",
      },
      referenceDetails:
        "Drug Label, Docetaxel, (docetaxel injection, solution, concentrate), May 2019",
    },
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
      comments: [],
      referenceSourceDto: {
        code: "CP1",
        name: "Clinical Pharmacology",
      },
      referenceDetails: "Clinical Pharmacology, docetaxel, January 2019",
    },
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
      comments: [],
      referenceSourceDto: {
        code: "DD1",
        name: "Micromedex DrugDex",
      },
      referenceDetails: "Micromedex DrugDex, docetaxel, May 2019",
    },
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
      comments: [],
      referenceSourceDto: {
        code: "NCCN1",
        name: "NCCN",
      },
      referenceDetails: "NCCN, docetaxel, May 2019",
    },
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
      comments: [],
      referenceSourceDto: {
        code: "LEXI1",
        name: "Lexi-Drugs",
      },
      referenceDetails:
        "Lexi-Drugs, docetaxel, May 2019Drug Label, Docetaxel, (docetaxel injection, solution, concentrate), May 2019",
    },
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
      comments: [],
      referenceSourceDto: {
        code: "AHFS1",
        name: "AHFS-DI",
      },
      referenceDetails: "Lexi-Drugs, docetaxel, May 2019",
    },
  ],
};

const notesResponse: NotesTemplateResponse = {
  data: [
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
      comments: [],
      note:
        "Drug Label: Should not be given if neutrophil counts are <1500 cells/mm3. Obtain frequent blood counts to monitor for neutropenia.",
    },
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d63",
      comments: [],
      note:
        "Drug Label: Should not be given if bilirubin >ULN, or if AST and/or ALT >1.5 x ULN concomitant with alkaline phosphatase >2.5 x ULN. LFT elevations increase risk of severe or life-threatening complications. Obtain LFTs before each treatment cycle.",
    },
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d64",
      comments: [],
      note: "Drug Label: Premedicate with oral corticosteroids.",
    },
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d65",
      comments: [],
      note:
        "Drug Label: The safety and effectivness of Docetaxel Injection in pediatric patients have not been established.",
    },
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
      comments: [],
      note:
        "Clinical Pharmacology: The suggested maximum tolerated dose (MTD) for docetaxel is dependent on performance status, other chemotherapy agents or radiation given in combination, and disease state. The optimal dose or infusion duration of docetaxel has not been determined. Therefore, dosing may vary from protocol to protocol.",
    },
  ],
  drugVersionCode: "58714459-c73a-4240-9847-ea358f9f0b5e",
  section: {
    code: "UI-S-NOTE",
    name: "Notes",
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

      drugLabel: "drugLabel",
      clinicalPharmacology: "clinicalPharmacology",
      micromedexDrugDex: "micromedexDrugDex",
      nccn: "nccn",
      lexiDrugs: "lexiDrugs",
      ahfsDi: "ahfsDi",
      lcd: "lcd",
    },
  ],
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
      comments: ["comment1", "comment2"],
    },
  ],
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
      indication: "indication",
      comments: [],
      icd10Codes: ["C48.0", "C48.1-C48.8", "C49-C49.9"],
    },
  ],
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
      indication: "test",
      nccnIcdsCodes: [
        {
          icd10Code: "test",
          icd10CodeId: 0,
          description: "test",
        },
      ],
      lcdIcdsCodes: [
        {
          icd10Code: "test",
          icd10CodeId: 0,
          description: "test",
        },
      ],
    },
  ],
};

const dailyMaxUnitsResponse: DailyMaxUnitsTemplateResponse = {
  drugVersionCode: "58714459-c73a-4240-9847-ea358f9f0b5e",
  section: {
    code: SectionCode.DailyMaxUnits,
    name: "Daily Maximum Units Values For HCPCS",
  },
  codes: ["code"],
  data: [
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
      comments: [],
      dmuvItemDto: {
        code: "cmsprofmue",
        name: "",
      },
      currentValues: "test nccn",
      newValues: "test lcd",
    },
  ],
};

const maximumFrequencyResponse: MaximumFrequencyTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.MaximumFrequency,
    name: "Maximum Frequency",
  },
  data: [
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
      indication: "indication",
      maximumFrequency: "maximumFrequency",
      comments: [],
    },
  ],
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
      indication: "indeictaion",
      comments: [],
    },
  ],
};

const ageResponse: AgeTemplateResponse = {
  drugVersionCode: "02760dff-dae3-47c7-92c3-a12eb8618623",
  section: {
    code: SectionCode.Age,
    name: "Age",
  },
  data: [
    {
      code: "3338b688-6e91-47dd-9dbf-51079e721c97",
      comments: ["Lexi-Drugs"],
      indication: {
        code: "49d2b743-dc8b-4fc6-b6bc-c3d0d5112018",
        label: "angiosarcoma",
      },
      age: "Infants, children and adults",
    },
    {
      code: "bbc41bfc-65b9-4d79-96de-bf2efe436b79",
      comments: [],
      indication: {
        code: "87dfe534-4598-4759-b4b3-9c36e1313a33",
        label: "bladder cancer",
      },
      age: "18 years of age and older",
    },
    {
      code: "d86518d6-1be6-4a72-95b2-c8ed5eadeafa",
      comments: [],
      indication: {
        code: "097cbaff-620c-4eb1-bfe0-c791dece38b3",
        label: "breast cancer",
      },
      age: "18 years of age and older",
    },
    {
      code: "88daecb7-8c10-4c0e-afb4-d1d98c487d71",
      comments: [],
      indication: {
        code: "c51e3810-b336-441f-b85e-e83d22c91557",
        label: "endometrial carcinoma",
      },
      age: "18 years of age and older",
    },
    {
      code: "4645d184-045a-4b1e-9653-3cf2f6c8be6e",
      comments: [],
      indication: {
        code: "d55c12f2-6f2d-4192-aedd-7403413fbf14",
        label: "esophageal cancer",
      },
      age: "18 years of age and older",
    },
    {
      code: "69dd704a-80ed-4458-98e0-1d21bf1b762a",
      comments: [],
      indication: {
        code: "d513e9a7-fef0-4836-868c-032623944ea9",
        label: "esophagogastric junction cancers",
      },
      age: "18 years of age and older",
    },
    {
      code: "e2094d43-863d-4d06-b271-e1a7c4179391",
      comments: ["Lexi-Drugs\nInfants (1 month-2 years)"],
      indication: {
        code: "4f4b61d0-0fd9-4f4f-a937-bde5d6531bd0",
        label: "Ewingâ€™s sarcoma",
      },
      age: "Infants, children and adults",
    },
    {
      code: "5c2a0dd3-3ee4-4a01-aad7-ba0ee20b11b9",
      comments: [],
      indication: {
        code: "c959bbe2-88bf-4416-a98f-70f0c5f9d585",
        label: "gastric cancer",
      },
      age: "18 years of age and older",
    },
    {
      code: "10dc04f2-8495-408a-b702-7acf89f00f63",
      comments: [],
      indication: {
        code: "05703116-7733-48e4-9404-2678cdf73e73",
        label: "harvesting of peripheral blood stem cells, mobilization",
      },
      age: "18 years of age and older",
    },
    {
      code: "b3603094-0dfd-4b86-af1b-fa4f7f7ea4f4",
      comments: [],
      indication: {
        code: "c01c494a-6cbc-46c1-be6f-f366e3f87866",
        label: "head and neck cancer",
      },
      age: "18 years of age and older",
    },
    {
      code: "bae57d13-a100-4098-b489-328ae2dc9d21",
      comments: [],
      indication: {
        code: "b101423d-8825-4a39-8f6e-67aa6802e415",
        label: "melanoma",
      },
      age: "18 years of age and older",
    },
    {
      code: "8727adb4-6373-4293-af1d-48f388e91697",
      comments: [],
      indication: {
        code: "bc6ceb4d-8c9d-4c4b-8dad-620bf18c8882",
        label: "non-small cell lung cancer",
      },
      age: "18 years of age and older",
    },
    {
      code: "8da3b7b8-62cc-4f05-9bc3-f4532d9034a2",
      comments: [],
      indication: {
        code: "ce1c76dd-b605-4340-a325-2144c4808231",
        label: "occult primary",
      },
      age: "18 years of age and older",
    },
    {
      code: "fee1006a-b99b-4eb7-a55f-6bf2933f78a6",
      comments: ["Lexi-Drugs"],
      indication: {
        code: "2c768c67-3d8c-4eb2-ad44-f76ecc205f23",
        label: "osteosarcoma",
      },
      age: "Infants, children and adults",
    },
    {
      code: "02a10a5f-5ada-4b2d-9912-362cddfa88bd",
      comments: [],
      indication: {
        code: "88acc301-592c-4278-957d-222eea68f2c8",
        label: "ovarian cancer/fallopian tube cancer/primary peritoneal cancer",
      },
      age: "18 years of age and older",
    },
    {
      code: "dbf08df9-7f72-4fba-85a9-8806a25995c2",
      comments: [],
      indication: {
        code: "7da5b228-d037-455f-b214-1b7ea213736b",
        label: "prostate cancer",
      },
      age: "18 years of age and older",
    },
    {
      code: "98942dc7-f2b0-40a4-a72a-62d817e531d9",
      comments: ["Lexi-Drugs"],
      indication: {
        code: "3b618cc3-e723-4baf-81dd-5240ef03e779",
        label: "rhabdomyosarcoma",
      },
      age: "Infants, children and adults",
    },
    {
      code: "892281fa-2ace-42d9-9d66-5735f261e1bf",
      comments: [],
      indication: {
        code: "95e0d850-7903-41dc-a373-89adf91ab13b",
        label: "small cell lung cancer",
      },
      age: "18 years of age and older",
    },
    {
      code: "a8ac3e0e-a759-41da-8285-7700bb202658",
      comments: ["Lexi-Drugs"],
      indication: {
        code: "cd214c5c-ac26-4480-9bc6-7abe7d4dedf9",
        label:
          "soft tissue sarcoma (extremity/superficial trunk, head/neck) (retroperitoneal/intra-abdominal)",
      },
      age: "Infants, children and adults",
    },
    {
      code: "0e8f7321-cd15-4baa-9db5-ae76bb0f5a78",
      comments: [],
      indication: {
        code: "f52dff11-715a-42a1-a2f6-f0ddd884ce5c",
        label: "thyroid carcinoma- anaplastic carcinoma",
      },
      age: "18 years of age and older",
    },
    {
      code: "6edb8d01-3050-4fa7-ae04-0a781301fdca",
      comments: [],
      indication: {
        code: "3d8c6ea6-075c-42a1-b137-4add792bffee",
        label: "urothelial carcinoma",
      },
      age: "18 years of age and older",
    },
    {
      code: "8b6ede9a-bab5-4e96-8be7-16f02a8d388e",
      comments: [],
      indication: {
        code: "f526858a-29cc-4b9c-9b8c-a41e9233558d",
        label: "uterine sarcoma",
      },
      age: "18 years of age and older",
    },
  ],
};

const dailyMaximumDoseResponse: DailyMaximumDoseTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.DailyMaximumDose,
    name: "Daily Maximum Dose",
  },
  data: [
    {
      code: "",

      indication: {
        code: "code",
        label: "label",
      },
      maximumDosingPattern: "maximumDosingPattern",
      maximumDose: "maximumDose",
      maximumUnits: "maximumUnits",
      comments: [],
    },
  ],
};
const genderResponse: GenderTemplateResponse = {
  drugVersionCode: "02760dff-dae3-47c7-92c3-a12eb8618623",
  section: {
    code: SectionCode.Gender,
    name: "Gender",
  },
  data: [
    {
      code: "3338b688-6e91-47dd-9dbf-51079e721c97",
      comments: ["Lexi-Drugs"],
      indication: {
        code: "49d2b743-dc8b-4fc6-b6bc-c3d0d5112018",
        label: "angiosarcoma",
      },
      gender: "Male",
    },
    {
      code: "bbc41bfc-65b9-4d79-96de-bf2efe436b79",
      comments: [],
      indication: {
        code: "87dfe534-4598-4759-b4b3-9c36e1313a33",
        label: "bladder cancer",
      },
      gender: "Female",
    },
  ],
};

const unitsOverTimeResponse: UnitsOverTimeTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.UnitsOverTime,
    name: "Units over time",
  },
  data: [
    {
      code: "code",
      indication: {
        code: "code",
        label: "",
      },
      units: "units",
      interval: "interval",
      comments: [],
    },
    {
      code: "code",
      indication: {
        code: "code",
        label: "label",
      },
      units: "units",
      interval: "interval",
      comments: [],
    },
    {
      code: "code",
      indication: {
        code: "code",
        label: "label",
      },
      units: "units",
      interval: "interval",
      comments: [],
    },
    {
      code: "code",
      indication: {
        code: "code",
        label: "label",
      },
      units: "units",
      interval: "interval",
      comments: [],
    },
  ],
};

const VisitOverTimeResponse: VisitOverTimeTemplateResponse = {
  drugVersionCode: "02760dff-dae3-47c7-92c3-a12eb8618623",
  section: {
    code: SectionCode.VisitOverTime,
    name: "Visits over time",
  },
  data: [
    {
      code: "3338b688-6e91-47dd-9dbf-51079e721c97",
      indication: {
        code: "49d2b743-dc8b-4fc6-b6bc-c3d0d5112018",
        label: "breast cancer",
      },
      visits: "13",
      interval: "26 weeks",
      comments: [],
    },
  ],
};

const diagnosisCodeOverlapsResponse: DiagnosisCodeOverlapsResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.DiagnosisCodeOverlaps,
    name: "Diagnosis Code Overlaps",
  },

  data: [
    {
      order: 0,
      code: "",
      icd10Code: {
        description: "",
        icd10Code: "",
      },
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
    {
      order: 0,
      code: "",
      icd10Code: {
        description: "",
        icd10Code: "",
      },
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
    {
      order: 0,
      code: "",
      icd10Code: {
        description: "",
        icd10Code: "",
      },
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
    {
      order: 0,
      code: "",
      icd10Code: {
        description: "",
        icd10Code: "",
      },
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
    {
      order: 0,
      code: "",
      icd10Code: {
        description: "",
        icd10Code: "",
      },
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
    {
      order: 0,
      code: "",
      icd10Code: {
        description: "",
        icd10Code: "",
      },
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
    {
      order: 0,
      code: "",
      icd10Code: {
        description: "",
        icd10Code: "",
      },
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
    {
      order: 0,
      code: "",
      icd10Code: {
        description: "",
        icd10Code: "",
      },
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
    {
      order: 0,
      code: "",
      icd10Code: {
        description: "",
        icd10Code: "",
      },
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
    {
      order: 0,
      code: "",
      icd10Code: {
        description: "",
        icd10Code: "",
      },
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
          comments: [],
          combination: "",
          codes: [],
        },
      ],
    },
  ],
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
      indication: { code: "", label: "" },
      globalReviewIndication: "",
      comments: [],
    },
  ],
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
};

const diangosiCodesOverlapsResponse: DiagnosisCodeOverlapsResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.DiagnosisCodeOverlaps,
    name: "Diagnosis Codes Overlaps",
  },
  data: [
    {
      code: "text",
      icd10Code: { description: "text", icd10Code: "code" },
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
      indication: { code: "text", label: "code" },
      globalReviewIndication: "text",
      comments: [],
    },
  ],
};

const rulesResponse: RulesTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.Rules,
    name: "Rules",
  },
  data: [
    {
      code: "text",
      description: "text",
      rule: "text",
      comments: [],
    },
  ],
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

    expect(section.rows.length).toBe(generalInformationResponse.data.length);
    expect(section.rows[0].columns[0].value).toBe(
      `${generalInformationResponse.data[0].item.name}\n`
    );
  });

  it("should convert reference API response to UI elements", () => {
    const section = referencesConvertAPIToUI(referenceResponse);
    expect(section.rows.length).toBe(referenceResponse.data.length);

    expect(section.rows[0].columns[0].value).toBe(
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
    const section = DailyMaxUnitsConvertAPItoUI(dailyMaxUnitsResponse);

    expect(section.rows.length).toBe(dailyMaxUnitsResponse.data.length);

    expect(section.rows[0].columns[0].value).toBe(
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
      `${diagnosisCodeSummaryResponse.data[0].indication}\n`
    );
  });

  it("should convert Maximum frequency API response to UI elements", () => {
    const section = MaximumFrecuencyConvertAPItoUI(maximumFrequencyResponse);

    expect(section.rows.length).toBe(maximumFrequencyResponse.data.length);

    expect(section.rows[0].columns[0].value).toBe(
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

    expect(section.rows.length).toBe(ageResponse.data.length);

    expect(section.rows[0].columns[0].value).toBe(
      `${ageResponse.data[0].indication.label}\n`
    );
  });

  it("should convert Daily Maximum Dose API response to UI elements", () => {
    const section = DailyMaximumDoseConvertAPItoUI(dailyMaximumDoseResponse);

    expect(section.rows.length).toBe(dailyMaximumDoseResponse.data.length);

    expect(section.rows[0].columns[0].value).toBe(
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

    expect(section.rows.length).toBe(unitsOverTimeResponse.data.length);

    expect(section.rows[0].columns[0].value).toBe(
      `${unitsOverTimeResponse.data[0].indication.label}\n`
    );
  });

  it("should convert Visit Over time API response to UI elements", () => {
    const section = VisitOverTimeConvertAPItoUI(VisitOverTimeResponse);

    expect(section.rows.length).toBe(VisitOverTimeResponse.data.length);

    expect(section.rows[0].columns[0].value).toBe(
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
    expect(section.rows.length).toBe(diangosiCodesOverlapsResponse.data.length);
    expect(section.rows[0].columns[0].value).toBe(
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

  it("should create sections from aggregator", () => {
    const LCDUISection = aggregatorInformation(LCDResponse);
    expect(LCDUISection.id).toBe("lcds");
    expect((LCDUISection.current as Section).rows[0].columns[0].value).toEqual(
      `${LCDResponse.data[0].lcd}\n`
    );
    expect((LCDUISection.new as Section).rows[0].columns[0].value).toEqual(
      `${LCDTemplate.data[0].lcd}\n`
    );

    const GISection = aggregatorInformation(generalInformationResponse);
    expect(GISection.id).toBe("general_information");
    expect((GISection.current as Section).rows[0].columns[0].value).toEqual(
      `${generalInformationResponse.data[0].item.name}\n`
    );
    expect((GISection.new as Section).rows[0].columns[0].value).toEqual(
      `${GeneralInformationTemplate.data[0].item.name}\n`
    );

    const RefUISection = aggregatorInformation(referenceResponse);
    expect(RefUISection.id).toBe("references");
    expect((RefUISection.current as Section).rows[0].columns[0].value).toEqual(
      `${referenceResponse.data[0].referenceSourceDto.name}\n`
    );
    expect((RefUISection.new as Section).rows[0].columns[0].value).toEqual(
      `${ReferenceTemplate.data[0].referenceSourceDto.name}\n`
    );

    const NotesUISection = aggregatorInformation(notesResponse);
    expect(NotesUISection.id).toBe("notes");
    expect(
      (NotesUISection.current as Section).rows[0].columns[0].value
    ).toEqual(`${notesResponse.data[0].note}\n`);
    expect((NotesUISection.new as Section).rows[0].columns[0].value).toEqual(
      `${NotesTemplate.data[0].note}\n`
    );

    const IndicationsUISection = aggregatorInformation(indicationsResponse);
    expect(IndicationsUISection.id).toBe("indications");
    expect(
      (IndicationsUISection.current as Section).rows[0].columns[0].value
    ).toEqual(`${indicationsResponse.data[0].drugLabel}\n`);
    expect(
      (IndicationsUISection.new as Section).rows[0].columns[0].value
    ).toEqual(`${IndicationsTemplate.data[0].drugLabel}\n`);

    const medicalJournalUISection = aggregatorInformation(
      medicalJournalResponse
    );

    expect(medicalJournalUISection.id).toBe("medical_journal");
    expect(
      (medicalJournalUISection.current as Section).rows[0].columns[0].value
    ).toEqual(`${medicalJournalResponse.data[0].citation}\n`);

    expect(
      (medicalJournalUISection.new as Section).rows[0].columns[0].value
    ).toEqual(`${MedicalJournalTemplate.data[0].citation}\n`);

    const dailyMaxUnitsUISection = aggregatorInformation(dailyMaxUnitsResponse);
    expect(dailyMaxUnitsUISection.id).toBe(
      "daily_maximum_units_values_for_hcpcs"
    );

    expect(
      (dailyMaxUnitsUISection.current as Section).rows[0].columns[0].value
    ).toEqual(`${dailyMaxUnitsResponse.data[0].dmuvItemDto.name}\n`);

    expect(
      (dailyMaxUnitsUISection.new as Section).rows[0].columns[0].value
    ).toEqual(`${DailyMaxUnitsTemplate.data[0].dmuvItemDto.name}\n`);

    const diagnosisCodeUISection = aggregatorInformation(diagnosisCodeResponse);
    expect(diagnosisCodeUISection.id).toBe("diagnosis_codes");
    expect(
      (diagnosisCodeUISection.current as Section).rows[0].columns[0].value
    ).toEqual(`${diagnosisCodeResponse.data[0].indication}\n`);

    expect(
      (diagnosisCodeUISection.new as Section).rows[0].columns[0].value
    ).toEqual(`\n`);

    const diagnosisCodeSUmmaryUISection = aggregatorInformation(
      diagnosisCodeSummaryResponse
    );
    expect(diagnosisCodeSUmmaryUISection.id).toBe("diagnosis_code_summary");
    expect(
      (diagnosisCodeSUmmaryUISection.current as Section).rows[0].columns[0]
        .value
    ).toEqual(`${diagnosisCodeSummaryResponse.data[0].indication}\n`);

    expect(
      (diagnosisCodeSUmmaryUISection.new as Section).rows[0].columns[0].value
    ).toEqual(`${DiagnosisCodeSummaryTemplate.data[0].indication}\n`);

    const maximumFrequencyUISection = aggregatorInformation(
      maximumFrequencyResponse
    );
    expect(maximumFrequencyUISection.id).toBe("maximum_frequency");
    expect(
      (maximumFrequencyUISection.current as Section).rows[0].columns[0].value
    ).toEqual(`${maximumFrequencyResponse.data[0].indication}\n`);

    expect(
      (maximumFrequencyUISection.new as Section).rows[0].columns[0].value
    ).toEqual(`${MaximumFrequencyTemplate.data[0].indication}\n`);

    const manifestationCodesUISection = aggregatorInformation(
      manifestationCodesResponse
    );
    expect(manifestationCodesUISection.id).toBe("manifestation_codes");
    expect(
      (manifestationCodesUISection.current as Section).rows[0].columns[0].value
    ).toEqual(`${manifestationCodesResponse.data[0].icd10Code.icd10Code}\n`);

    expect(
      (manifestationCodesUISection.new as Section).rows[0].columns[0].value
    ).toEqual(`${ManifestationCodesTemplate.data[0].icd10Code.icd10Code}\n`);

    const ageUISection = aggregatorInformation(ageResponse);
    expect(ageUISection.id).toBe("age");
    expect((ageUISection.current as Section).rows[0].columns[0].value).toEqual(
      `${ageResponse.data[0].indication.label}\n`
    );

    expect((ageUISection.new as Section).rows[0].columns[0].value).toEqual(
      `${AgeTemplate.data[0].indication.label}\n`
    );

    const DailyMaxDoseUISection = aggregatorInformation(
      dailyMaximumDoseResponse
    );
    expect(DailyMaxDoseUISection.id).toBe("daily_maximum_dose");
    expect(
      (DailyMaxDoseUISection.current as Section).rows[0].columns[0].value
    ).toEqual(`${dailyMaximumDoseResponse.data[0].indication.label}\n`);

    expect(
      (DailyMaxDoseUISection.new as Section).rows[0].columns[0].value
    ).toEqual(`${DailyMaximumDoseTemplate.data[0].indication.label}\n`);

    const genderUISection = aggregatorInformation(genderResponse);
    expect(genderUISection.id).toBe("gender");
    expect(
      (genderUISection.current as Section).rows[0].columns[0].value
    ).toEqual(`${genderResponse.data[0].indication.label}\n`);

    expect((genderUISection.new as Section).rows[0].columns[0].value).toEqual(
      `${GenderTemplate.data[0].indication.label}\n`
    );

    const unitsOverTimeUISection = aggregatorInformation(unitsOverTimeResponse);
    expect(unitsOverTimeUISection.id).toBe("units_over_time");
    expect(
      (unitsOverTimeUISection.current as Section).rows[0].columns[0].value
    ).toEqual(`${unitsOverTimeResponse.data[0].indication.label}\n`);

    expect((genderUISection.new as Section).rows[0].columns[0].value).toEqual(
      `${unitsOverTimeResponse.data[0].indication.label}\n`
    );

    const globalReviewCodesUISection = aggregatorInformation(
      GlobalReviewCodesTemplate
    );
    expect(globalReviewCodesUISection.id).toBe("global_review_-_icd-10_codes");
    expect(
      (globalReviewCodesUISection.current as Section).rows[0].columns[0].value
    ).toEqual(
      `${GlobalReviewCodesTemplate.data[0].currentIcd10CodeRange.icd10Code}\n`
    );

    expect(
      (globalReviewCodesUISection.new as Section).rows[0].columns[0].value
    ).toEqual(
      `${GlobalReviewCodesTemplate.data[0].globalReviewIcd10Code.icd10Code}\n`
    );

    const combinationTherapyUISection = aggregatorInformation(
      combinationTherapyResponse
    );
    expect(combinationTherapyUISection.id).toBe("combination_therapy");
    expect(
      (combinationTherapyUISection.current as GroupedSection).groups[0].names[0]
        .value
    ).toEqual(`${combinationTherapyResponse.data[0].indication.label}\n`);

    const visitsUISection = aggregatorInformation(VisitOverTimeResponse);
    expect(visitsUISection.id).toBe("visits_over_time");
    expect(
      (visitsUISection.current as Section).rows[0].columns[0].value
    ).toEqual(`${VisitOverTimeResponse.data[0].indication.label}\n`);

    const dosignPatternsUISection = aggregatorInformation(
      dosingPatternsResponse
    );
    expect(dosignPatternsUISection.id).toBe("dosing_patterns");
    expect(
      (dosignPatternsUISection.current as GroupedSection).groups[0].names[0]
        .value
    ).toEqual(`${dosingPatternsResponse.data[0].indication.label}\n`);

    const diagnosisCodeverlapsUISection = aggregatorInformation(
      diagnosisCodeOverlapsResponse
    );
    expect(diagnosisCodeverlapsUISection.id).toBe("diagnosis_code_overlaps");
    expect(
      (diagnosisCodeverlapsUISection.current as Section).rows[0].columns[0]
        .value
    ).toEqual(`${diagnosisCodeOverlapsResponse.data[0].icd10Code.icd10Code}\n`);

    const globalReviewIndicationsUISection = aggregatorInformation(
      globalReviewIndicationResponse
    );
    expect(globalReviewIndicationsUISection.id).toBe(
      "global_review_indications"
    );
    expect(
      (globalReviewIndicationsUISection.current as Section).rows[0].columns[0]
        .value
    ).toEqual(`${globalReviewIndicationResponse.data[0].indication.label}\n`);

    const rulesUISection = aggregatorInformation(rulesResponse);
    expect(rulesUISection.id).toBe("rules");
    expect(
      (rulesUISection.current as Section).rows[0].columns[0].value
    ).toEqual(`${rulesResponse.data[0].rule}\n`);

    const secondaryUISection = aggregatorInformation(
      SecondaryMalignancyResponse
    );
    expect(secondaryUISection.id).toBe(
      "secondary_malignancy(c77-c79.9)_icd-10_codes"
    );
    expect(
      (secondaryUISection.current as GroupedSection).groups[0].names[0].value
    ).toEqual(
      `${SecondaryMalignancyResponse.data[0].malignancyIcdsCodes[0].icd10Code}\n`
    );
  });

  it("should create only one version section", () => {
    const LCDUISection = versionInformation(LCDResponse);
    expect(LCDUISection.id).toBe("lcds");
    expect((LCDUISection as Section).rows[0].columns[0].value).toEqual(
      `${LCDResponse.data[0].lcd}\n`
    );

    const GISection = versionInformation(generalInformationResponse);
    expect(GISection.id).toBe("general_information");
    expect((GISection as Section).rows[0].columns[0].value).toEqual(
      `${generalInformationResponse.data[0].item.name}\n`
    );

    const RefUISection = versionInformation(referenceResponse);
    expect(RefUISection.id).toBe("references");
    expect((RefUISection as Section).rows[0].columns[0].value).toEqual(
      `${referenceResponse.data[0].referenceSourceDto.name}\n`
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
      (dailyMaxUnitsUISection as Section).rows[0].columns[0].value
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
    ).toEqual(`${diagnosisCodeSummaryResponse.data[0].indication}\n`);

    const maximumFrequencyUISection = versionInformation(
      maximumFrequencyResponse
    );
    expect(maximumFrequencyUISection.id).toBe("maximum_frequency");
    expect(
      (maximumFrequencyUISection as Section).rows[0].columns[0].value
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
    expect((ageUISection as Section).rows[0].columns[0].value).toEqual(
      `${ageResponse.data[0].indication.label}\n`
    );

    const DailyMaxDoseUISection = versionInformation(dailyMaximumDoseResponse);
    expect(DailyMaxDoseUISection.id).toBe("daily_maximum_dose");
    expect((DailyMaxDoseUISection as Section).rows[0].columns[0].value).toEqual(
      `${dailyMaximumDoseResponse.data[0].indication.label}\n`
    );

    const genderUISection = versionInformation(genderResponse);
    expect(genderUISection.id).toBe("gender");
    expect((genderUISection as Section).rows[0].columns[0].value).toEqual(
      `${genderResponse.data[0].indication.label}\n`
    );

    const unitsOverTimeUISection = versionInformation(unitsOverTimeResponse);
    expect(unitsOverTimeUISection.id).toBe("units_over_time");
    expect(
      (unitsOverTimeUISection as Section).rows[0].columns[0].value
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
    expect((visitsUISection as Section).rows[0].columns[0].value).toEqual(
      `${VisitOverTimeResponse.data[0].indication.label}\n`
    );

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
      (diagnosisCodeverlapsUISection as Section).rows[0].columns[0].value
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
    expect((GISection as Section).rows[0].columns[0].value).toEqual(
      `[HCPCS] (Descriptor)\n`
    );

    const RefUISection = clearNewSection(referenceResponse.section.code, "");
    expect(RefUISection.id).toBe("references");
    expect((RefUISection as Section).rows[0].columns[0].value).toEqual(
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
      (dailyMaxUnitsUISection as Section).rows[0].columns[0].value
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
    expect(maximumFrequencyUISection.id).toBe("maximum_frequency");
    expect(
      (maximumFrequencyUISection as Section).rows[0].columns[0].value
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
    expect((ageUISection as Section).rows[0].columns[0].value).toEqual(`\n`);

    const DailyMaxDoseUISection = clearNewSection(
      dailyMaximumDoseResponse.section.code,
      ""
    );
    expect(DailyMaxDoseUISection.id).toBe("daily_maximum_dose");
    expect((DailyMaxDoseUISection as Section).rows[0].columns[0].value).toEqual(
      `\n`
    );

    const genderUISection = clearNewSection(genderResponse.section.code, "");
    expect(genderUISection.id).toBe("gender");
    expect((genderUISection as Section).rows[0].columns[0].value).toEqual(`\n`);

    const unitsOverTimeUISection = clearNewSection(
      unitsOverTimeResponse.section.code,
      ""
    );
    expect(unitsOverTimeUISection.id).toBe("units_over_time");
    expect(
      (unitsOverTimeUISection as Section).rows[0].columns[0].value
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
    expect(visitsUISection.id).toBe("visits_over_time");
    expect((visitsUISection as Section).rows[0].columns[0].value).toEqual(`\n`);

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
    expect(diagnosisCodeverlapsUISection.id).toBe("diagnosis_code_overlaps");
    expect(
      (diagnosisCodeverlapsUISection as Section).rows[0].columns[0].value
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
      "secondary_malignancy_(c77-c79.9)_icd-10_codes"
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
