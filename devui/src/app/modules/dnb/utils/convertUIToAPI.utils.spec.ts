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
  const GeneralInformationUI: Section = {
    drugVersionCode: "",
    section: {
      code: SectionCode.GeneralInformation,
      name: "General Information",
    },
    headers: GeneralInformationHeaders,
    id: "general_information",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "[HCPCS] (Descriptor)",
            maxLength: maxLengthDefault,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
          },
        ],
      },
    ],
  };

  const ReferencesUI: Section = {
    drugVersionCode: "",
    section: {
      code: SectionCode.References,
      name: "References",
    },
    headers: ReferenceHeaders,
    id: "references",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "Drug Label",
            maxLength: maxLengthDefault,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
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
    id: "medical_journal",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthDefault,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
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
    id: "manifestation_codes",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthDefault,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
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
    id: "diagnosis_code_summary",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthDefault,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
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
    id: "diagnosis_code",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthDefault,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
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
    id: "notes",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthDefault,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
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
    id: "LCDs",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthDefault,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
          },
        ],
      },
    ],
  };

  const DialyMaxDoseUI: Section = {
    drugVersionCode: "",
    section: {
      code: SectionCode.DailyMaximumDose,
      name: "Daily Maximum Dose",
    },
    headers: DailyMaximumDoseHeaders,
    id: "daily_maximum_dose",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthDefault,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
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
    id: "Indications",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthFourhundred,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
          },
        ],
      },
    ],
  };
  const maximumFrequencyUI: Section = {
    drugVersionCode: "",
    section: {
      code: SectionCode.MaximumFrequency,
      name: "Maximum frequency",
    },
    headers: MaximumFrquencyHeaders,
    id: "maximum_frequency",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthFourhundred,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
          },
        ],
      },
    ],
  };

  const UnitsOverTimeUI: Section = {
    drugVersionCode: "",
    section: {
      code: SectionCode.UnitsOverTime,
      name: "Units over time",
    },
    headers: UnistOverTimeHeaders,
    id: "units_over_time",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthFourhundred,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
          },
        ],
      },
    ],
  };

  const VisitsOverTimeUI: Section = {
    drugVersionCode: "",
    section: {
      code: SectionCode.VisitOverTime,
      name: "Visits over time",
    },
    headers: VisitOverTimeHeaders,
    id: "visit_over_time",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthFourhundred,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: 100,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: 100,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthDefault,
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
    id: "global_review_codes",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthFourhundred,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: 100,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: 100,
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
    id: "global_review_indication",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthFourhundred,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
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
    id: "combination_therapy",
    groups: [
      {
        names: [
          {
            isReadOnly: true,
            value: "test",
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
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthDefault,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthDefault,
              },
            ],
          },
        ],
      },
    ],
  };

  const AgeUI: Section = {
    drugVersionCode: "",
    section: {
      code: SectionCode.Age,
      name: "Age",
    },
    headers: AgeHeaders,
    id: "age",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthFourhundred,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
          },
        ],
      },
    ],
  };

  const dailyMaxUnits: Section = {
    drugVersionCode: "",
    section: {
      code: SectionCode.DailyMaxUnits,
      name: "Daily Maximum Units Values For HCPCS ",
    },
    headers: GlobalReviewIndicationsHeaders,
    id: "daily_maximum_units_values_for_hcpcs ",
    codesColumn: {
      isReadOnly: false,
      value: "",
    },
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "some value",
            maxLength: maxLengthDefault,
          },
          {
            isReadOnly: true,
            value: "value",
            maxLength: maxLengthDefault,
          },
          {
            isReadOnly: true,
            value: "info",
            maxLength: maxLengthDefault,
          },
          {
            isReadOnly: true,
            value: "comment",
            maxLength: maxLengthDefault,
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
    id: "dosing_patterns",
    groups: [
      {
        names: [
          {
            isReadOnly: true,
            value: "test",
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
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthDefault,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthDefault,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthDefault,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthDefault,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthDefault,
              },
              {
                isReadOnly: true,
                value: "",
                maxLength: maxLengthDefault,
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
    id: "gender",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthFourhundred,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
          },
        ],
      },
    ],
  };

  const DiagnosisCodeOverlapsUI: Section = {
    drugVersionCode: "",
    section: {
      code: SectionCode.DiagnosisCodeOverlaps,
      name: "Diagnosis code overlaps",
    },
    headers: DiagnosisCodeOverlapsHeaders,
    id: "diagnosis_code_overlaps",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthFourhundred,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
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
    id: "rule",
    rows: [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "test",
            maxLength: maxLengthFourhundred,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
          },
          {
            isReadOnly: true,
            value: "",
            maxLength: maxLengthFourhundred,
          },
        ],
      },
    ],
  };
  // #endregion "Const"

  it("should convert UI General information data to API request", () => {
    const section = convertIUtoAPI(GeneralInformationUI);
    expect(section.data[0].item.name).toBe(
      GeneralInformationUI.rows[0].columns[0].value
    );
  });

  it("should convert UI References data to API request", () => {
    const section = convertIUtoAPI(ReferencesUI);
    expect(section.data[0].referenceSourceDto.name).toBe(
      ReferencesUI.rows[0].columns[0].value
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
    expect(section.data[0].indication).toBe(
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
    expect(section.data[0].maximumDose).toBe(
      DialyMaxDoseUI.rows[0].columns[2].value
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
      maximumFrequencyUI.rows[0].columns[0].value
    );
  });

  it("should convert UI UnitsOverTime data to API request", () => {
    const section = convertIUtoAPI(UnitsOverTimeUI);
    expect(section.data[0].indication.label).toBe(
      UnitsOverTimeUI.rows[0].columns[0].value
    );
  });

  it("should convert UI VisitsOverTime data to API request", () => {
    const section = convertIUtoAPI(VisitsOverTimeUI);
    expect(section.data[0].indication.label).toBe(
      VisitsOverTimeUI.rows[0].columns[0].value
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
      AgeUI.rows[0].columns[0].value
    );
  });

  it("should convert Daily max units  data to API request", () => {
    const section = convertIUtoAPI(dailyMaxUnits);
    expect(section.data[0].currentValues).toBe(
      dailyMaxUnits.rows[0].columns[1].value
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
      DiagnosisCodeOverlapsUI.rows[0].columns[0].value
    );
  });

  it("should convert UI rule  data to API request", () => {
    const section = convertIUtoAPI(RuleUI);
    expect(section.data[0].rule).toBe(RuleUI.rows[0].columns[0].value);
  });
});
