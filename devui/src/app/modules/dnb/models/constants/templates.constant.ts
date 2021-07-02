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
} from "../interfaces/section";
import { SectionCode } from "./sectioncode.constant";

export const GeneralInformationTemplate: GeneralInformationTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.GeneralInformation,
    name: "General Information",
  },
  data: [
    {
      item: {
        code: "",
        name: "[HCPCS] (Descriptor)",
      },
      data: [
        {
          code: "",
          itemDetails: "",
          comments: [],
          order: 0,
          feedbackItemsList: [],
          documentNoteList: [],
        },
        {
          code: "",
          itemDetails: "",
          comments: [],
          order: 0,
          feedbackItemsList: [],
          documentNoteList: [],
        },
      ],
    },
    {
      item: {
        code: "",
        name: "Route of administration",
      },
      data: [
        {
          code: "",
          itemDetails: "",
          comments: [],
          order: 0,
          feedbackItemsList: [],
          documentNoteList: [],
        },
        {
          code: "",
          itemDetails: "",
          comments: [],
          order: 0,
          feedbackItemsList: [],
          documentNoteList: [],
        },
      ],
    },
    {
      item: {
        code: "",
        name: "Time of administration",
      },
      data: [
        {
          code: "",
          itemDetails: "",
          comments: [],
          order: 0,
          feedbackItemsList: [],
          documentNoteList: [],
        },
        {
          code: "",
          itemDetails: "",
          comments: [],
          order: 0,
          feedbackItemsList: [],
          documentNoteList: [],
        },
      ],
    },
    {
      item: {
        code: "",
        name: "Administration codes",
      },
      data: [
        {
          code: "",
          itemDetails: "",
          comments: [],
          order: 0,
          feedbackItemsList: [],
          documentNoteList: [],
        },
        {
          code: "",
          itemDetails: "",
          comments: [],
          order: 0,
          feedbackItemsList: [],
          documentNoteList: [],
        },
      ],
    },

    {
      item: {
        code: "",
        name: "How supplied",
      },
      data: [
        {
          code: "",
          itemDetails: "",
          comments: [],
          order: 0,
          feedbackItemsList: [],
          documentNoteList: [],
        },
        {
          code: "",
          itemDetails: "",
          comments: [],
          order: 0,
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

export const GeneralInformationHeaders = ["Item", "Item Details", "Comments"];

export const LCDTemplate: LCDTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.LCD,
    name: "LCDs",
  },
  data: [
    {
      code: "",
      comments: [],
      lcd: "",
      macName: "",
    },
    {
      code: "",
      comments: [],
      lcd: "",
      macName: "",
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [],
  },
};

export const LCDHeaders = ["LCD", "MAC Name", "Comment"];

export const ReferenceTemplate: ReferencesTemplateResponse = {
  drugVersionCode: "",
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
          code: "",
          comments: [],
          referenceSourceDto: {
            code: "",
            name: "Drug Label",
          },
          referenceDetails: "",
        },
        {
          code: "",
          comments: [],
          referenceSourceDto: {
            code: "",
            name: "Drug Label",
          },
          referenceDetails: "",
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
          code: "",
          comments: [],
          referenceSourceDto: {
            code: "",
            name: "Clinical Pharmacology",
          },
          referenceDetails: "",
        },
        {
          code: "",
          comments: [],
          referenceSourceDto: {
            code: "",
            name: "Clinical Pharmacology",
          },
          referenceDetails: "",
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
          code: "",
          comments: [],
          referenceSourceDto: {
            code: "",
            name: "Micromedex DrugDex",
          },
          referenceDetails: "",
        },
        {
          code: "",
          comments: [],
          referenceSourceDto: {
            code: "",
            name: "Micromedex DrugDex",
          },
          referenceDetails: "",
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
          code: "",
          comments: [],
          referenceSourceDto: {
            code: "",
            name: "NCCN",
          },
          referenceDetails: "",
        },
        {
          code: "",
          comments: [],
          referenceSourceDto: {
            code: "",
            name: "NCCN",
          },
          referenceDetails: "",
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
          code: "",
          comments: [],
          referenceSourceDto: {
            code: "",
            name: "Lexi-Drugs",
          },
          referenceDetails: "",
        },
        {
          code: "",
          comments: [],
          referenceSourceDto: {
            code: "",
            name: "Lexi-Drugs",
          },
          referenceDetails: "",
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
          code: "",
          comments: [],
          referenceSourceDto: {
            code: "",
            name: "AHFS-DI",
          },
          referenceDetails: "",
        },
        {
          code: "",
          comments: [],
          referenceSourceDto: {
            code: "",
            name: "AHFS-DI",
          },
          referenceDetails: "",
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

export const ReferenceHeaders = [
  "Reference Type",
  "Reference Details",
  "Comment",
];

export const MedicalJournalTemplate: MedicalJournalTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.MedicalJournal,
    name: "Medical Journal",
  },
  data: [
    { code: "", citation: "", comments: [] },
    { code: "", citation: "", comments: [] },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [],
  },
};

export const MedicalJournalHeaders = ["Citation", "Comment"];

export const IndicationsTemplate: IndicationsTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.Indications,
    name: "Indications",
  },
  data: [
    {
      code: "",

      drugLabel: "",
      clinicalPharmacology: "",
      micromedexDrugDex: "",
      nccn: "",
      lexiDrugs: "",
      ahfsDi: "",
      lcd: "",
    },
    {
      code: "",
      drugLabel: "",
      clinicalPharmacology: "",
      micromedexDrugDex: "",
      nccn: "",
      lexiDrugs: "",
      ahfsDi: "",
      lcd: "",
    },
    {
      code: "",
      drugLabel: "",
      clinicalPharmacology: "",
      micromedexDrugDex: "",
      nccn: "",
      lexiDrugs: "",
      ahfsDi: "",
      lcd: "",
    },
    {
      code: "",
      drugLabel: "",
      clinicalPharmacology: "",
      micromedexDrugDex: "",
      nccn: "",
      lexiDrugs: "",
      ahfsDi: "",
      lcd: "",
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [],
  },
};

export const IndicationsHeaders = [
  "Drug Label",
  "Clinical Pharmacology",
  "Micromedex DrugDex",
  "NCCN",
  "Lexi-Drugs",
  "AHFS-DI",
  "LCD",
];

export const NotesHeaders = ["Note", "Comments"];

export const NotesTemplate: NotesTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.Notes,
    name: "Notes",
  },
  data: [
    {
      code: "",
      comments: [],
      note: "",
    },
    {
      code: "",
      comments: [],
      note: "",
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [],
  },
};
export const DailyMaxUnitsHeaders = [
  "Source",
  "Current Value",
  "New Value",
  "Comment",
];

export const DailyMaxUnitsGroupedTemplate: DailyMaxUnitsGroupedTemplateResponse =
  {
    drugVersionCode: "",
    section: {
      code: SectionCode.DailyMaxUnits,
      name: "Daily Maximum Units Values For HCPCS",
    },
    data: [
      {
        dmuvItemDto: {
          code: "cmsprofmue",
          name: "CMS Prof MUE",
        },
        data: [
          {
            code: "",
            comments: [],
            feedbackItemsList: [],
            documentNoteList: [],
            order: 0,
            hasBorder: false,
            currentValues: "",
            newValues: "",
          },
          {
            code: "",
            comments: [],
            feedbackItemsList: [],
            documentNoteList: [],
            order: 1,
            hasBorder: false,
            currentValues: "",
            newValues: "",
          },
        ],
      },
      {
        dmuvItemDto: {
          code: "cotivitiprofdmu",
          name: "Cotiviti Prof DMU",
        },
        data: [
          {
            code: "",
            comments: [],
            feedbackItemsList: [],
            documentNoteList: [],
            order: 0,
            hasBorder: false,
            currentValues: "",
            newValues: "",
          },
          {
            code: "",
            comments: [],
            feedbackItemsList: [],
            documentNoteList: [],
            order: 1,
            hasBorder: false,
            currentValues: "",
            newValues: "",
          },
        ],
      },
      {
        dmuvItemDto: {
          code: "cmsopmue",
          name: "CMS OP MUE",
        },
        data: [
          {
            code: "",
            comments: [],
            feedbackItemsList: [],
            documentNoteList: [],
            order: 0,
            hasBorder: false,
            currentValues: "",
            newValues: "",
          },
          {
            code: "",
            comments: [],
            feedbackItemsList: [],
            documentNoteList: [],
            order: 1,
            hasBorder: false,
            currentValues: "",
            newValues: "",
          },
        ],
      },
      {
        dmuvItemDto: {
          code: "cotivitiopdmu",
          name: "Cotiviti OP DMU",
        },
        data: [
          {
            code: "",
            comments: [],
            feedbackItemsList: [],
            documentNoteList: [],
            order: 0,
            hasBorder: false,
            currentValues: "",
            newValues: "",
          },
          {
            code: "",
            comments: [],
            feedbackItemsList: [],
            documentNoteList: [],
            order: 1,
            hasBorder: false,
            currentValues: "",
            newValues: "",
          },
        ],
      },
    ],
    uiDecorator: {
      sectionActive: true,
      sectionComplete: false,
      deletedRowFeedbackItemList: [],
    },
    codes: ["HCPCS"],
  };

export const DiagnosisCodesHeaders = [
  "Indication",
  "NCCN ICD-10",
  "LCD ICD-10",
  "Comment",
];

export const DiagnosisCodesTemplate: DiagnosisCodesTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.DiagnosisCodes,
    name: "Diagnosis Codes",
  },
  data: [
    {
      code: "",
      comments: [],
      indication: "",
      nccnIcdsCodes: [
        {
          icd10Code: "",
          icd10CodeId: 0,
          description: "",
        },
      ],
      nccnIcdsCodesInvalid: [],
      lcdIcdsCodes: [
        {
          icd10Code: "",
          icd10CodeId: 0,
          description: "",
        },
      ],
      lcdIcdsCodesInvalid: [],
    },
    {
      code: "",
      comments: [],
      indication: "",
      nccnIcdsCodes: [
        {
          icd10Code: "",
          icd10CodeId: 0,
          description: "",
        },
      ],
      nccnIcdsCodesInvalid: [
        {
          icd10Code: "",
          icd10CodeId: 0,
          description: "",
        },
      ],
      lcdIcdsCodes: [
        {
          icd10Code: "",
          icd10CodeId: 0,
          description: "",
        },
      ],
      lcdIcdsCodesInvalid: [
        {
          icd10Code: "",
          icd10CodeId: 0,
          description: "",
        },
      ],
    },
    {
      code: "",
      comments: [],
      indication: "",
      nccnIcdsCodes: [
        {
          icd10Code: "",
          icd10CodeId: 0,
          description: "",
        },
      ],
      nccnIcdsCodesInvalid: [
        {
          icd10Code: "",
          icd10CodeId: 0,
          description: "",
        },
      ],
      lcdIcdsCodes: [
        {
          icd10Code: "",
          icd10CodeId: 0,
          description: "",
        },
      ],
      lcdIcdsCodesInvalid: [
        {
          icd10Code: "",
          icd10CodeId: 0,
          description: "",
        },
      ],
    },
    {
      code: "",
      comments: [],
      indication: "",
      nccnIcdsCodes: [
        {
          icd10Code: "",
          icd10CodeId: 0,
          description: "",
        },
      ],
      nccnIcdsCodesInvalid: [
        {
          icd10Code: "",
          icd10CodeId: 0,
          description: "",
        },
      ],
      lcdIcdsCodes: [
        {
          icd10Code: "",
          icd10CodeId: 0,
          description: "",
        },
      ],
      lcdIcdsCodesInvalid: [
        {
          icd10Code: "",
          icd10CodeId: 0,
          description: "",
        },
      ],
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [],
    warningMessagesList: [],
  },
};

export const DiagnosisCodeSummaryHeaders = [
  "Indication",
  "ICD-10 Codes",
  "Comment",
];

export const DiagnosisCodeSummaryTemplate: DiagnosisCodeSummaryTemplateResponse =
  {
    drugVersionCode: "",
    section: {
      code: SectionCode.DiagnosticCodeSummary,
      name: "Diagnosis Code Summary",
    },
    data: [
      {
        code: "",
        indication: {
          code: "",
          label: "",
        },
        icd10Codes: [],
        invalidIcd10Codes: [],
        comments: [],
      },
      {
        code: "",
        indication: {
          code: "",
          label: "",
        },
        icd10Codes: [],
        invalidIcd10Codes: [],
        comments: [],
      },
      {
        code: "",
        indication: {
          code: "",
          label: "",
        },
        icd10Codes: [],
        invalidIcd10Codes: [],
        comments: [],
      },
      {
        code: "",
        indication: {
          code: "",
          label: "",
        },
        icd10Codes: [],
        invalidIcd10Codes: [],
        comments: [],
      },
    ],
    uiDecorator: {
      sectionActive: true,
      sectionComplete: false,
      deletedRowFeedbackItemList: [],
      warningMessagesList: [],
    },
  };

export const ManifestationCodesHeaders = [
  "ICD-10 Code",
  "Indication",
  "Comment",
];
export const ManifestationCodesTemplate: ManifestationCodesTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.ManifestationCodes,
    name: "Manifestation Codes",
  },
  data: [
    {
      code: "",
      icd10Code: {
        icd10CodeId: 0,
        icd10Code: "",
        description: "",
      },
      indication: { code: "", label: "" },
      comments: [],
    },
    {
      code: "",
      icd10Code: {
        icd10CodeId: 0,
        icd10Code: "",
        description: "",
      },
      indication: { code: "", label: "" },
      comments: [],
    },
    {
      code: "",
      icd10Code: {
        icd10CodeId: 0,
        icd10Code: "",
        description: "",
      },
      indication: { code: "", label: "" },
      comments: [],
    },
    {
      code: "",
      icd10Code: {
        icd10CodeId: 0,
        icd10Code: "",
        description: "",
      },
      indication: { code: "", label: "" },
      comments: [],
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [],
  },
};

export const MaximumFrequencyTemplate: MaximumFrequencyTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.MaximumFrequency,
    name: "Maximum Frequency (Standard)",
  },
  data: [
    {
      indication: "",
      data: [
        {
          code: "",
          maximumFrequency: "",
          comments: [],
        },
        {
          code: "",
          maximumFrequency: "",
          comments: [],
        },
      ],
    },
    {
      indication: "",
      data: [
        {
          code: "",
          maximumFrequency: "",
          comments: [],
        },
        {
          code: "",
          maximumFrequency: "",
          comments: [],
        },
      ],
    },
    {
      indication: "",
      data: [
        {
          code: "",
          maximumFrequency: "",
          comments: [],
        },
        {
          code: "",
          maximumFrequency: "",
          comments: [],
        },
      ],
    },
    {
      indication: "",
      data: [
        {
          code: "",
          maximumFrequency: "",
          comments: [],
        },
        {
          code: "",
          maximumFrequency: "",
          comments: [],
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

export const MaximumFrquencyHeaders = [
  "Indication",
  "Maximum frequency",
  "Comment",
];

export const AgeTemplate: AgeTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.Age,
    name: "Age",
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

          age: "",
        },
        {
          code: "",
          comments: [],

          age: "",
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

          age: "",
        },
        {
          code: "",
          comments: [],

          age: "",
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

          age: "",
        },
        {
          code: "",
          comments: [],

          age: "",
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

          age: "",
        },
        {
          code: "",
          comments: [],

          age: "",
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

export const AgeHeaders = ["Indication", "Age", "Comment"];

export const DailyMaximumDoseTemplate: DailyMaximumDoseTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.DailyMaximumDose,
    name: "Daily Maximum Dose (Standard)",
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
          maximumDosingPattern: "",
          maximumDose: "",
          maximumUnits: "",
          comments: [],
        },
        {
          code: "",
          maximumDosingPattern: "",
          maximumDose: "",
          maximumUnits: "",
          comments: [],
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
          maximumDosingPattern: "",
          maximumDose: "",
          maximumUnits: "",
          comments: [],
        },
        {
          code: "",
          maximumDosingPattern: "",
          maximumDose: "",
          maximumUnits: "",
          comments: [],
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
          maximumDosingPattern: "",
          maximumDose: "",
          maximumUnits: "",
          comments: [],
        },
        {
          code: "",
          maximumDosingPattern: "",
          maximumDose: "",
          maximumUnits: "",
          comments: [],
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
          maximumDosingPattern: "",
          maximumDose: "",
          maximumUnits: "",
          comments: [],
        },
        {
          code: "",
          maximumDosingPattern: "",
          maximumDose: "",
          maximumUnits: "",
          comments: [],
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

export const DailyMaximumDoseHeaders = [
  "Indication",
  "Maximum dosing pattern",
  "Maximum dose",
  "Maximum units",
  "Comment",
];

export const GenderTemplate: GenderTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.Gender,
    name: "Gender",
  },
  data: [
    {
      code: "",
      comments: [],
      indication: {
        code: "",
        label: "",
      },
      gender: "",
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [],
  },
};

export const GenderHeaders = ["Indication", "Gender", "Comment"];

export const UnitsOverTimeTemplate: UnitsOverTimeTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.UnitsOverTime,
    name: "Units Over Time (Standard)",
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

          units: "",
          interval: "",
          comments: [],
        },
        {
          code: "",

          units: "",
          interval: "",
          comments: [],
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

          units: "",
          interval: "",
          comments: [],
        },
        {
          code: "",

          units: "",
          interval: "",
          comments: [],
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

          units: "",
          interval: "",
          comments: [],
        },
        {
          code: "",

          units: "",
          interval: "",
          comments: [],
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

          units: "",
          interval: "",
          comments: [],
        },
        {
          code: "",

          units: "",
          interval: "",
          comments: [],
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

export const UnistOverTimeHeaders = [
  "Indication",
  "Units",
  "Interval",
  "Comment",
];

export const VisitOverTimeTemplate: VisitOverTimeTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.VisitOverTime,
    name: "Visits Over Time (Standard)",
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
          visits: "",
          interval: "",
          comments: [],
        },
        {
          code: "",
          visits: "",
          interval: "",
          comments: [],
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
          visits: "",
          interval: "",
          comments: [],
        },
        {
          code: "",
          visits: "",
          interval: "",
          comments: [],
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
          visits: "",
          interval: "",
          comments: [],
        },
        {
          code: "",
          visits: "",
          interval: "",
          comments: [],
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
          visits: "",
          interval: "",
          comments: [],
        },
        {
          code: "",
          visits: "",
          interval: "",
          comments: [],
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

export const VisitOverTimeHeaders = [
  "Indication",
  "Visits",
  "Interval",
  "Comment",
];

export const CombinationTherapyTemplate: CombinationTherapyResponse = {
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
        {
          code: "",
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
    deletedRowFeedbackItemList: [],
  },
};

export const CombinationTherapyHeaders = [
  "Indication",
  "Combination",
  "HCPCS",
  "Comment",
];

export const DosingPatternsTemplate: DosingPatternsResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.DosingPatterns,
    name: "Dosing Patterns",
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
          drugLabel: "",
          clinicalPharma: "",
          micromedex: "",
          nccn: "",
          lexiDrugs: "",
          ahfsDi: "",
          other: "",
        },
        {
          code: "",
          drugLabel: "",
          clinicalPharma: "",
          micromedex: "",
          nccn: "",
          lexiDrugs: "",
          ahfsDi: "",
          other: "",
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
          drugLabel: "",
          clinicalPharma: "",
          micromedex: "",
          nccn: "",
          lexiDrugs: "",
          ahfsDi: "",
          other: "",
        },
        {
          code: "",
          drugLabel: "",
          clinicalPharma: "",
          micromedex: "",
          nccn: "",
          lexiDrugs: "",
          ahfsDi: "",
          other: "",
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
          drugLabel: "",
          clinicalPharma: "",
          micromedex: "",
          nccn: "",
          lexiDrugs: "",
          ahfsDi: "",
          other: "",
        },
        {
          code: "",
          drugLabel: "",
          clinicalPharma: "",
          micromedex: "",
          nccn: "",
          lexiDrugs: "",
          ahfsDi: "",
          other: "",
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
          drugLabel: "",
          clinicalPharma: "",
          micromedex: "",
          nccn: "",
          lexiDrugs: "",
          ahfsDi: "",
          other: "",
        },
        {
          code: "",
          drugLabel: "",
          clinicalPharma: "",
          micromedex: "",
          nccn: "",
          lexiDrugs: "",
          ahfsDi: "",
          other: "",
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

export const DosingPatternsHeaders = [
  "Indication",
  "Drug Label",
  "Clinical Pharmacology",
  "Micromedex DrugDex",
  "NCCN",
  "Lexi-Drugs",
  "AHFS-DI",
  "Other",
];

export const DiagnosisCodeOverlapsTemplate: DiagnosisCodeOverlapsResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.DiagnosisCodeOverlaps,
    name: "Diagnosis Code Overlaps (Standard)",
  },
  data: [
    {
      icd10Code: { icd10Code: "" },
      hasBorder: true,
      data: [
        {
          order: 0,
          hasBorder: true,
          code: "",
          indication: {
            code: "",
            label: "",
          },
          units: "",
          frequency: "",
          unitsOverTime: "",
          visitsOverTime: "",
          age: "",
          comments: [],
        },
        {
          order: 0,
          hasBorder: true,
          code: "",
          indication: {
            code: "",
            label: "",
          },
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
      icd10Code: { icd10Code: "" },
      hasBorder: true,
      data: [
        {
          order: 0,
          hasBorder: true,
          code: "",
          indication: {
            code: "",
            label: "",
          },
          units: "",
          frequency: "",
          unitsOverTime: "",
          visitsOverTime: "",
          age: "",
          comments: [],
        },
        {
          order: 0,
          hasBorder: true,
          code: "",
          indication: {
            code: "",
            label: "",
          },
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
      icd10Code: { icd10Code: "" },
      hasBorder: true,
      data: [
        {
          order: 0,
          hasBorder: true,
          code: "",
          indication: {
            code: "",
            label: "",
          },
          units: "",
          frequency: "",
          unitsOverTime: "",
          visitsOverTime: "",
          age: "",
          comments: [],
        },
        {
          order: 0,
          hasBorder: true,
          code: "",
          indication: {
            code: "",
            label: "",
          },
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
      icd10Code: { icd10Code: "" },
      hasBorder: true,
      data: [
        {
          order: 0,
          hasBorder: true,
          code: "",
          indication: {
            code: "",
            label: "",
          },
          units: "",
          frequency: "",
          unitsOverTime: "",
          visitsOverTime: "",
          age: "",
          comments: [],
        },
        {
          order: 0,
          hasBorder: true,
          code: "",
          indication: {
            code: "",
            label: "",
          },
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
      icd10Code: { icd10Code: "" },
      hasBorder: true,
      data: [
        {
          order: 0,
          hasBorder: true,
          code: "",
          indication: {
            code: "",
            label: "",
          },
          units: "",
          frequency: "",
          unitsOverTime: "",
          visitsOverTime: "",
          age: "",
          comments: [],
        },
        {
          order: 0,
          hasBorder: true,
          code: "",
          indication: {
            code: "",
            label: "",
          },
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
    deletedRowFeedbackItemList: [],
  },
};

export const DiagnosisCodeOverlapsHeaders = [
  "ICD-10 code",
  "Indication",
  "Units",
  "Frequency",
  "Units over time",
  "Visits over time",
  "Age",
  "Comment",
];

export const GlobalReviewIndicationsTemplate: GlobalReviewIndicationsResponse =
  {
    drugVersionCode: "",
    section: {
      code: SectionCode.GlobalReviewIndications,
      name: "Global Review - Indications",
    },

    data: [
      {
        code: "",
        order: 0,
        indication: {
          code: "",
          label: "",
        },
        globalReviewIndication: "",
        comments: [],
      },
      {
        code: "",
        order: 0,
        indication: {
          code: "",
          label: "",
        },
        globalReviewIndication: "",
        comments: [],
      },
      {
        code: "",
        order: 0,
        indication: {
          code: "",
          label: "",
        },
        globalReviewIndication: "",
        comments: [],
      },
      {
        code: "",
        order: 0,
        indication: {
          code: "",
          label: "",
        },
        globalReviewIndication: "",
        comments: [],
      },
    ],
    uiDecorator: {
      sectionActive: true,
      sectionComplete: false,
      deletedRowFeedbackItemList: [],
    },
  };

export const GlobalReviewIndicationsHeaders = [
  "Current indication",
  "Global review indication",
  "Comment",
];

export const SecondaryMalignancyTemplate: SecondaryMalignancyResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.SecondaryMalignancy,
    name: "Secondary Malignancy (C77-C79.9) ICD-10 Codes (Standard)",
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
          hasBorder: true,
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
  codes: ["C77-C79.9"],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [],
  },
};

export const SecondaryMalignancyHeaders = [
  "ICD-10 code",
  "Secondary site",
  "Primary malignancy",
  "Units",
  "Frequency",
  "Units over time",
  "Visits over time",
  "Age",
  "Comment",
];

export const GlobalReviewCodesTemplate: GlobalReviewCodesResponse = {
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
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [],
  },
};

export const GlobalReviewCodesHeaders = [
  "Current ICD 10 codes",
  "Global review ICD 10 codes",
  "Comment",
];

export const RulesTemplate: RulesTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.Rules,
    name: "Rules",
  },
  data: [
    {
      code: "",
      rule: "",
      description: "",
      comments: [],
    },
    {
      code: "",
      rule: "",
      description: "",
      comments: [],
    },
    {
      code: "",
      rule: "",
      description: "",
      comments: [],
    },
    {
      code: "",
      rule: "",
      description: "",
      comments: [],
    },
    {
      code: "",
      rule: "",
      description: "",
      comments: [],
    },
    {
      code: "",
      rule: "",
      description: "",
      comments: [],
    },
    {
      code: "",
      rule: "",
      description: "",
      comments: [],
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [],
  },
};

export const RulesHeaders = ["Mid Rule", "Description", "Comments"];
