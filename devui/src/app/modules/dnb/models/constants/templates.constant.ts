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
      code: "",
      comments: [],
      item: {
        code: "",
        name: "[HCPCS] (Descriptor)",
      },
      itemDetails: "",
    },
    {
      code: "",
      comments: [],
      item: {
        code: "",
        name: "Route of administration",
      },
      itemDetails: "",
    },
    {
      code: "",
      comments: [],
      item: {
        code: "",
        name: "Time of administration",
      },
      itemDetails: "",
    },
    {
      code: "",
      comments: [],
      item: {
        code: "",
        name: "Administration codes",
      },
      itemDetails: "",
    },
    {
      code: "",
      comments: [],
      item: {
        code: "",
        name: "How supplied",
      },
      itemDetails: "",
    },
  ],
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
        name: "Clinical Pharmacology",
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
        name: "Lexi-Drugs",
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
};
export const DailyMaxUnitsHeaders = [
  "Source",
  "Current Value",
  "New Value",
  "Comment",
];

export const DailyMaxUnitsTemplate: DailyMaxUnitsTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.DailyMaxUnits,
    name: "Daily Maximum Units Values For HCPCS",
  },
  data: [
    {
      code: "",
      comments: [],
      dmuvItemDto: {
        code: "cmsprofmue",
        name: "CMS Prof MUE",
      },
      currentValues: "",
      newValues: "",
    },
    {
      code: "",
      comments: [],
      dmuvItemDto: {
        code: "cotivitiprofdmu",
        name: "Cotiviti Prof DMU",
      },
      currentValues: "",
      newValues: "",
    },
    {
      code: "",
      comments: [],
      dmuvItemDto: {
        code: "cmsopmue",
        name: "CMS OP MUE",
      },
      currentValues: "",
      newValues: "",
    },
    {
      code: "",
      comments: [],
      dmuvItemDto: {
        code: "cotivitiopdmu",
        name: "Cotiviti OP DMU",
      },
      currentValues: "",
      newValues: "",
    },
  ],
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
      lcdIcdsCodes: [
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
      lcdIcdsCodes: [
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
      lcdIcdsCodes: [
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
      lcdIcdsCodes: [
        {
          icd10Code: "",
          icd10CodeId: 0,
          description: "",
        },
      ],
    },
  ],
};

export const DiagnosisCodeSummaryHeaders = [
  "Indication",
  "ICD-10 Codes",
  "Comment",
];

export const DiagnosisCodeSummaryTemplate: DiagnosisCodeSummaryTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.DiagnosticCodeSummary,
    name: "Diagnosis Code Summary",
  },
  data: [
    {
      code: "",
      indication: "",
      icd10Codes: [],
      comments: [],
    },
    {
      code: "",
      indication: "",
      icd10Codes: [],
      comments: [],
    },
    {
      code: "",
      indication: "",
      icd10Codes: [],
      comments: [],
    },
    {
      code: "",
      indication: "",
      icd10Codes: [],
      comments: [],
    },
  ],
};

export const ManifestationCodesHeaders = [
  "ICD-10 Codes",
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
      indication: "",
      comments: [],
    },
    {
      code: "",
      icd10Code: {
        icd10CodeId: 0,
        icd10Code: "",
        description: "",
      },
      indication: "",
      comments: [],
    },
    {
      code: "",
      icd10Code: {
        icd10CodeId: 0,
        icd10Code: "",
        description: "",
      },
      indication: "",
      comments: [],
    },
    {
      code: "",
      icd10Code: {
        icd10CodeId: 0,
        icd10Code: "",
        description: "",
      },
      indication: "",
      comments: [],
    },
  ],
};

export const MaximumFrequencyTemplate: MaximumFrequencyTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.MaximumFrequency,
    name: "Maximum Frequency",
  },
  data: [
    {
      code: "",
      indication: "",
      maximumFrequency: "",
      comments: [],
    },
    {
      code: "",
      indication: "",
      maximumFrequency: "",
      comments: [],
    },
    {
      code: "",
      indication: "",
      maximumFrequency: "",
      comments: [],
    },
    {
      code: "",
      indication: "",
      maximumFrequency: "",
      comments: [],
    },
  ],
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
      code: "",
      comments: [],
      indication: {
        code: "",
        label: "",
      },
      age: "",
    },
    {
      code: "",
      comments: [],
      indication: {
        code: "",
        label: "",
      },
      age: "",
    },
  ],
};

export const AgeHeaders = ["Indication", "Age", "Comment"];

export const DailyMaximumDoseTemplate: DailyMaximumDoseTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.DailyMaximumDose,
    name: "Daily Maximum Dose",
  },
  data: [
    {
      code: "",
      indication: {
        code: "",
        label: "",
      },
      maximumDosingPattern: "",
      maximumDose: "",
      maximumUnits: "",
      comments: [],
    },
    {
      code: "",
      indication: {
        code: "",
        label: "",
      },
      maximumDosingPattern: "",
      maximumDose: "",
      maximumUnits: "",
      comments: [],
    },
    {
      code: "",
      indication: {
        code: "",
        label: "",
      },
      maximumDosingPattern: "",
      maximumDose: "",
      maximumUnits: "",
      comments: [],
    },
    {
      code: "",
      indication: {
        code: "",
        label: "",
      },
      maximumDosingPattern: "",
      maximumDose: "",
      maximumUnits: "",
      comments: [],
    },
  ],
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
};

export const GenderHeaders = ["Indication", "Gender", "Comment"];

export const UnitsOverTimeTemplate: UnitsOverTimeTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.UnitsOverTime,
    name: "Units Over Time",
  },
  data: [
    {
      code: "",
      indication: {
        code: "",
        label: "",
      },
      units: "",
      interval: "",
      comments: [],
    },
    {
      code: "",
      indication: {
        code: "",
        label: "",
      },
      units: "",
      interval: "",
      comments: [],
    },
    {
      code: "",
      indication: {
        code: "",
        label: "",
      },
      units: "",
      interval: "",
      comments: [],
    },
    {
      code: "",
      indication: {
        code: "",
        label: "",
      },
      units: "",
      interval: "",
      comments: [],
    },
  ],
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
    name: "Visits Over Time",
  },
  data: [
    {
      code: "",
      indication: {
        code: "",
        label: "",
      },
      visits: "",
      interval: "",
      comments: [],
    },
    {
      code: "",
      indication: {
        code: "",
        label: "",
      },
      visits: "",
      interval: "",
      comments: [],
    },
    {
      code: "",
      indication: {
        code: "",
        label: "",
      },
      visits: "",
      interval: "",
      comments: [],
    },
    {
      code: "",
      indication: {
        code: "",
        label: "",
      },
      visits: "",
      interval: "",
      comments: [],
    },
  ],
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
      ],
    },
  ],
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
    name: "Diagnosis Code Overlaps",
  },

  data: [
    {
      order: 0,
      hasBorder: false,
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
      comments: [],
    },
    {
      order: 1,
      hasBorder: true,
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
      comments: [],
    },
    {
      order: 2,
      hasBorder: false,
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
      comments: [],
    },
    {
      order: 3,
      hasBorder: true,
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
      comments: [],
    },
    {
      order: 4,
      hasBorder: false,
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
      comments: [],
    },
    {
      order: 5,
      hasBorder: true,
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
      comments: [],
    },
    {
      order: 6,
      hasBorder: false,
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
      comments: [],
    },
    {
      order: 7,
      hasBorder: true,
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
      comments: [],
    },
    {
      order: 8,
      hasBorder: false,
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
      comments: [],
    },
    {
      order: 9,
      hasBorder: true,
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
      comments: [],
    },
  ],
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

export const GlobalReviewIndicationsTemplate: GlobalReviewIndicationsResponse = {
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
    name: "Secondary Malignancy (C77-C79.9) ICD-10 Codes",
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
  codes: ["(C77-C79.9)"],
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
};

export const RulesHeaders = ["Mid Rule", "Description", "Comments"];
