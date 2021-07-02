import { async, TestBed } from "@angular/core/testing";
import { SectionCode } from "../models/constants/sectioncode.constant";
import {
  AgeHeaders,
  CombinationTherapyHeaders,
  DailyMaximumDoseHeaders,
  DiagnosisCodeOverlapsHeaders,
  DiagnosisCodesHeaders,
  DiagnosisCodeSummaryHeaders,
  DosingPatternsHeaders,
  GenderHeaders,
  GeneralInformationHeaders,
  GlobalReviewCodesHeaders,
  GlobalReviewIndicationsHeaders,
  IndicationsHeaders,
  LCDHeaders,
  ManifestationCodesHeaders,
  MaximumFrquencyHeaders,
  MedicalJournalHeaders,
  NotesHeaders,
  ReferenceHeaders,
  RulesHeaders,
  UnistOverTimeHeaders,
  VisitOverTimeHeaders,
} from "../models/constants/templates.constant";
import { GroupedSection, Section } from "../models/interfaces/uibase";
import { convertIUtoAPI } from "./convertUIToAPI.utils";

fdescribe("convertAPIToUI", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({}).compileComponents();
  }));
  // #region 'Const'
  const maxLengthDefault: number = 4000;
  const maxLengthFourhundred: number = 400;
  const GeneralInformationUI: GroupedSection = {
    drugVersionCode: "",
    section: {
      code: SectionCode.GeneralInformation,
      name: "General Information",
    },
    headers: GeneralInformationHeaders,
    headersUIWidth: [],
    id: "general_information",
    groups: [
      {
        names: [
          {
            isReadOnly: true,
            value: "[HCPCS] (Descriptor)",
            maxLength: maxLengthDefault,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
        ],
        rows: [
          {
            hasBorder: false,
            columns: [
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthDefault,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthDefault,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
            ],
          },
        ],
      },
    ],
  };

  const ReferencesUI: GroupedSection = {
    drugVersionCode: "",
    section: {
      code: SectionCode.References,
      name: "References",
    },
    headers: ReferenceHeaders,
    headersUIWidth: [],
    id: "references",
    groups: [
      {
        names: [
          {
            isReadOnly: true,
            value: "test",
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
        ],
        rows: [
          {
            hasBorder: false,
            columns: [
              {
                isReadOnly: true,
                value: "Drug Label",
                maxLength: maxLengthDefault,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthDefault,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthDefault,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
            ],
          },
        ],
      },
    ],
  };

  const MedicalJournalUI: Section = {
    drugVersionCode: "",
    section: {
      code: SectionCode.MedicalJournal,
      name: "Medical Journal",
    },
    headers: MedicalJournalHeaders,
    headersUIWidth: [],
    id: "medical_journal",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthDefault,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
        ],
      },
    ],
  };

  const ManifestationCodesUI: Section = {
    drugVersionCode: "",
    section: {
      code: SectionCode.ManifestationCodes,
      name: "Manifestation Codes",
    },
    headers: ManifestationCodesHeaders,
    headersUIWidth: [],
    id: "manifestation_codes",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthDefault,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
        ],
      },
    ],
  };

  const DiagnosisCodeSummaryUI: Section = {
    drugVersionCode: "",
    section: {
      code: SectionCode.DiagnosticCodeSummary,
      name: "Diagnosis Code Summary",
    },
    headers: DiagnosisCodeSummaryHeaders,
    headersUIWidth: [],
    id: "diagnosis_code_summary",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthDefault,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
        ],
      },
    ],
  };

  const DiagnosisCodeUI: Section = {
    drugVersionCode: "",
    section: {
      code: SectionCode.DiagnosisCodes,
      name: "Diagnosis Codes",
    },
    headers: DiagnosisCodesHeaders,
    headersUIWidth: [],
    id: "diagnosis_code",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthDefault,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
        ],
      },
    ],
  };

  const NotesCodeUI: Section = {
    drugVersionCode: "",
    section: {
      code: SectionCode.Notes,
      name: "Notes",
    },
    headers: NotesHeaders,
    headersUIWidth: [],
    id: "notes",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthDefault,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
        ],
      },
    ],
  };
  const LCDCodeUI: Section = {
    drugVersionCode: "",
    section: {
      code: SectionCode.LCD,
      name: "LCD",
    },
    headers: LCDHeaders,
    headersUIWidth: [],
    id: "LCDs",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthDefault,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
        ],
      },
    ],
  };

  const DialyMaxDoseUI: GroupedSection = {
    drugVersionCode: "",
    section: {
      code: SectionCode.DailyMaximumDose,
      name: "Daily Maximum Dose",
    },
    headers: DailyMaximumDoseHeaders,
    headersUIWidth: [],
    id: "daily_maximum_dose",
    groups: [
      {
        names: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthDefault,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
        ],
        rows: [
          {
            hasBorder: false,
            columns: [
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthDefault,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthDefault,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthDefault,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthDefault,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
            ],
          },
        ],
      },
    ],
  };
  const IndicationsCodeUI: Section = {
    drugVersionCode: "",
    section: {
      code: SectionCode.Indications,
      name: "Indications",
    },
    headers: IndicationsHeaders,
    headersUIWidth: [],
    id: "Indications",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthFourhundred,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
        ],
      },
    ],
  };
  const maximumFrequencyUI: GroupedSection = {
    drugVersionCode: "",
    section: {
      code: SectionCode.MaximumFrequency,
      name: "Maximum frequency (Standard)",
    },
    headers: MaximumFrquencyHeaders,
    headersUIWidth: [],
    id: "maximum_frequency",
    groups: [
      {
        names: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthFourhundred,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
        ],
        rows: [
          {
            hasBorder: false,
            columns: [
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthFourhundred,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthFourhundred,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
            ],
          },
        ],
      },
    ],
  };

  const UnitsOverTimeUI: GroupedSection = {
    drugVersionCode: "",
    section: {
      code: SectionCode.UnitsOverTime,
      name: "Units Over Time (Standard)",
    },
    headers: UnistOverTimeHeaders,
    headersUIWidth: [],
    id: "units_over_time",
    groups: [
      {
        names: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthFourhundred,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
        ],
        rows: [
          {
            hasBorder: false,
            columns: [
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthFourhundred,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthFourhundred,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthFourhundred,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
            ],
          },
        ],
      },
    ],
  };

  const VisitsOverTimeUI: GroupedSection = {
    drugVersionCode: "",
    section: {
      code: SectionCode.VisitOverTime,
      name: "Visits over time",
    },
    headers: VisitOverTimeHeaders,
    headersUIWidth: [],
    id: "visit_over_time",
    groups: [
      {
        names: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthFourhundred,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
        ],
        rows: [
          {
            hasBorder: false,
            columns: [
              {
                isReadOnly: true,
                value: "",
                maxLength: 100,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: 100,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthDefault,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
            ],
          },
        ],
      },
    ],
  };

  const GlobalReviewCodesUI: Section = {
    drugVersionCode: "",
    section: {
      code: SectionCode.GlobalReviewCodes,
      name: "Global Review Codes",
    },
    headers: GlobalReviewCodesHeaders,
    headersUIWidth: [],
    id: "global_review_codes",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthFourhundred,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: 100,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: 100,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
        ],
      },
    ],
  };
  const GlobalReviewIndicationUI: Section = {
    drugVersionCode: "",
    section: {
      code: SectionCode.GlobalReviewIndications,
      name: "Global Review Indications",
    },
    headers: GlobalReviewIndicationsHeaders,
    headersUIWidth: [],
    id: "global_review_indication",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthFourhundred,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
        ],
      },
    ],
  };

  const CombinationTherapyUI: GroupedSection = {
    drugVersionCode: "",
    section: {
      code: SectionCode.CombinationTherapy,
      name: "Combination Therapy",
    },
    headers: CombinationTherapyHeaders,
    headersUIWidth: [],
    id: "combination_therapy",
    groups: [
      {
        names: [
          {
            isReadOnly: true,
            value: "test",
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
        ],
        rows: [
          {
            hasBorder: false,
            columns: [
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthDefault,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthDefault,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthDefault,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
            ],
          },
        ],
      },
    ],
  };

  const AgeUI: GroupedSection = {
    drugVersionCode: "",
    section: {
      code: SectionCode.Age,
      name: "Age",
    },
    headers: AgeHeaders,
    headersUIWidth: [],
    id: "age",
    groups: [
      {
        names: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthFourhundred,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
        ],
        rows: [
          {
            hasBorder: false,
            columns: [
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthFourhundred,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthFourhundred,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
            ],
          },
        ],
      },
    ],
  };
  const dailyMaxUnits: GroupedSection = {
    drugVersionCode: "",
    section: {
      code: SectionCode.DailyMaxUnits,
      name: "Daily Maximum Units Values For HCPCS ",
    },
    headers: GlobalReviewIndicationsHeaders,
    headersUIWidth: [],
    id: "daily_maximum_units_values_for_hcpcs ",
    codesColumn: {
      isReadOnly: false,
      value: "",
      feedbackData: [],
      comments: [],
      feedbackLeft: 0,
    },
    groups: [
      {
        names: [
          {
            isReadOnly: true,
            value: "test",
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
        ],
        rows: [
          {
            hasBorder: false,
            columns: [
              {
                isReadOnly: true,
                value: "some value",
                maxLength: maxLengthDefault,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
              {
                isReadOnly: true,
                value: "value",
                maxLength: maxLengthDefault,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
              {
                isReadOnly: true,
                value: "info",
                maxLength: maxLengthDefault,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
              {
                isReadOnly: true,
                value: "comment",
                maxLength: maxLengthDefault,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
            ],
          },
        ],
      },
    ],
  };
  const DosingPatternsUI: GroupedSection = {
    drugVersionCode: "",
    section: {
      code: SectionCode.DosingPatterns,
      name: "Dosing Patterns",
    },
    headers: DosingPatternsHeaders,
    headersUIWidth: [],
    id: "dosing_patterns",
    groups: [
      {
        names: [
          {
            isReadOnly: true,
            value: "test",
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
        ],
        rows: [
          {
            hasBorder: false,
            columns: [
              {
                isReadOnly: true,
                value: "test",
                maxLength: maxLengthDefault,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthDefault,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthDefault,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthDefault,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthDefault,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthDefault,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthDefault,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
            ],
          },
        ],
      },
    ],
  };

  const GenderUI: Section = {
    drugVersionCode: "",
    section: {
      code: SectionCode.Gender,
      name: "Gender",
    },
    headers: GenderHeaders,
    headersUIWidth: [],
    id: "gender",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthFourhundred,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
        ],
      },
    ],
  };

  const DiagnosisCodeOverlapsUI: GroupedSection = {
    drugVersionCode: "",
    section: {
      code: SectionCode.DiagnosisCodeOverlaps,
      name: "Diagnosis code overlaps",
    },
    headers: DiagnosisCodeOverlapsHeaders,
    headersUIWidth: [],
    id: "diagnosis_code_overlaps",
    groups: [
      {
        names: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthFourhundred,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
        ],
        rows: [
          {
            hasBorder: false,
            columns: [
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthFourhundred,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthFourhundred,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthFourhundred,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthFourhundred,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthFourhundred,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthFourhundred,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthFourhundred,
                feedbackData: [],
                comments: [],
                feedbackLeft: 0,
              },
            ],
          },
        ],
      },
    ],
  };

  const RuleUI: Section = {
    drugVersionCode: "",
    section: {
      code: SectionCode.Rules,
      name: "Rules",
    },
    headers: RulesHeaders,
    headersUIWidth: [],
    id: "rule",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthFourhundred,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
            feedbackData: [],
            comments: [],
            feedbackLeft: 0,
          },
        ],
      },
    ],
  };
  // #endregion "Const"

  it("should convert UI General information data to API request", () => {
    const section = convertIUtoAPI(GeneralInformationUI);
    expect(section.data[0].item.name).toBe(
      GeneralInformationUI.groups[0].names[0].value
    );
  });

  it("should convert UI References data to API request", () => {
    const section = convertIUtoAPI(ReferencesUI);
    expect(section.data[0].referenceSourceDto.name).toBe(
      ReferencesUI.groups[0].names[0].value
    );
  });

  it("should convert UI Medical Journal data to API request", () => {
    const section = convertIUtoAPI(MedicalJournalUI);
    expect(section.data[0].citation).toBe(
      MedicalJournalUI.rows[0].columns[0].value
    );
  });

  it("should convert UI Manifestation codes data to API request", () => {
    const section = convertIUtoAPI(ManifestationCodesUI);
    expect(section.data[0].icd10Code.icd10Code).toBe(
      ManifestationCodesUI.rows[0].columns[0].value
    );
  });

  it("should convert UI diagnosis code summary  data to API request", () => {
    const section = convertIUtoAPI(DiagnosisCodeSummaryUI);
    expect(section.data[0].indication.label).toBe(
      DiagnosisCodeSummaryUI.rows[0].columns[0].value
    );
  });

  it("should convert UI diagnosis codes data to API request", () => {
    const section = convertIUtoAPI(DiagnosisCodeUI);
    expect(section.data[0].indication).toBe(
      DiagnosisCodeUI.rows[0].columns[0].value
    );
  });

  it("should convert UI notes data to API request", () => {
    const section = convertIUtoAPI(NotesCodeUI);
    expect(section.data[0].note).toBe(NotesCodeUI.rows[0].columns[0].value);
  });

  it("should convert UI LCD data to API request", () => {
    const section = convertIUtoAPI(LCDCodeUI);
    expect(section.data[0].lcd).toBe(LCDCodeUI.rows[0].columns[0].value);
  });

  it("should convert UI Daily maximum dose data to API request", () => {
    const section = convertIUtoAPI(DialyMaxDoseUI);
    expect(section.data[0].indication.label).toBe(
      DialyMaxDoseUI.groups[0].names[0].value
    );
  });

  it("should convert UI Indications data to API request", () => {
    const section = convertIUtoAPI(IndicationsCodeUI);
    expect(section.data[0].drugLabel).toBe(
      IndicationsCodeUI.rows[0].columns[0].value
    );
  });

  it("should convert UI maximum frequency data to API request", () => {
    const section = convertIUtoAPI(maximumFrequencyUI);
    expect(section.data[0].indication).toBe(
      maximumFrequencyUI.groups[0].names[0].value
    );
  });

  it("should convert UI UnitsOverTime data to API request", () => {
    const section = convertIUtoAPI(UnitsOverTimeUI);
    expect(section.data[0].indication.label).toBe(
      UnitsOverTimeUI.groups[0].names[0].value
    );
  });

  it("should convert UI VisitsOverTime data to API request", () => {
    const section = convertIUtoAPI(VisitsOverTimeUI);
    expect(section.data[0].indication.label).toBe(
      VisitsOverTimeUI.groups[0].names[0].value
    );
  });

  it("should convert UI Global review codes data to API request", () => {
    const section = convertIUtoAPI(GlobalReviewCodesUI);
    expect(section.data[0].currentIcd10CodeRange.icd10Code).toBe(
      GlobalReviewCodesUI.rows[0].columns[0].value
    );
  });

  it("should convert UI Global review indication data to API request", () => {
    const section = convertIUtoAPI(GlobalReviewIndicationUI);
    expect(section.data[0].indication.label).toBe(
      GlobalReviewIndicationUI.rows[0].columns[0].value
    );
  });

  it("should convert UI Combination therapy data to API request", () => {
    const section = convertIUtoAPI(CombinationTherapyUI);
    expect(section.data[0].indication.label).toBe(
      CombinationTherapyUI.groups[0].names[0].value
    );
  });

  it("should convert UI AGE data to API request", () => {
    const section = convertIUtoAPI(AgeUI);
    expect(section.data[0].indication.label).toBe(
      AgeUI.groups[0].names[0].value
    );
  });

  it("should convert Daily max units  data to API request", () => {
    const section = convertIUtoAPI(dailyMaxUnits);
    expect(section.data[0].dmuvItemDto.name).toBe(
      dailyMaxUnits.groups[0].names[0].value
    );
  });

  it("should convert UI Dosing Pattern data to API request", () => {
    const section = convertIUtoAPI(DosingPatternsUI);
    expect(section.data[0].indication.label).toBe(
      DosingPatternsUI.groups[0].rows[0].columns[0].value
    );
  });

  it("should convert UI Gender data to API request", () => {
    const section = convertIUtoAPI(GenderUI);
    expect(section.data[0].indication.label).toBe(
      GenderUI.rows[0].columns[0].value
    );
  });

  it("should convert UI diagnosis code overlaps data to API request", () => {
    const section = convertIUtoAPI(DiagnosisCodeOverlapsUI);
    expect(section.data[0].icd10Code.icd10Code).toBe(
      DiagnosisCodeOverlapsUI.groups[0].names[0].value
    );
  });

  it("should convert UI rule  data to API request", () => {
    const section = convertIUtoAPI(RuleUI);
    expect(section.data[0].rule).toBe(RuleUI.rows[0].columns[0].value);
  });
});
