import { async, TestBed } from "@angular/core/testing";
import { SectionAutopopulateOverlaps } from "../../models/constants/sectionAutopopulation.constants";
import {
  GroupedSection,
  GroupRow,
  Row,
  Section,
  UISection
} from "../../models/interfaces/uibase";
import { CopyToNew } from "./copytonew";

fdescribe("CopyToNew", () => {
  let service: CopyToNew;
  let currentGroup: GroupedSection;
  let newGroup: GroupedSection;
  let currentSection: Section;
  let newSection: Section;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [CopyToNew],
    }).compileComponents();
    service = TestBed.get(CopyToNew);
    currentGroup = {
      drugVersionCode: "test",
      id: "test",
      section: {
        code: "test",
        name: "test",
      },
      feedbackData: [],
      feedbackLeft: 0,
      headers: ["test header one", "test header two"],
      headersUIWidth: [10, 10],
      groups: [
        {
          names: [
            {
              isReadOnly: true,
              value: "group name",
              feedbackData: [],
              feedbackLeft: 0,
            },
          ],
          rows: [
            {
              hasBorder: false,
              columns: [
                {
                  isReadOnly: true,
                  value: "row column one",
                  feedbackData: [],
                  feedbackLeft: 0,
                },
                {
                  isReadOnly: true,
                  value: "row column two",
                  feedbackData: [],
                  feedbackLeft: 0,
                },
              ],
            },
          ],
        },
      ],
    };

    newGroup = {
      drugVersionCode: "test",
      id: "test",
      section: {
        code: "UI-S-DIAGC",
        name: "test",
      },
      feedbackData: [],
      feedbackLeft: 0,
      headers: [],
      headersUIWidth: [],
      groups: [
        {
          names: [
            {
              isReadOnly: true,
              value: "",
              feedbackData: [],
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
                  feedbackData: [],
                  feedbackLeft: 0,
                },
                {
                  isReadOnly: true,
                  value: "",
                  feedbackData: [],
                  feedbackLeft: 0,
                },
              ],
            },
          ],
        },
      ],
    };

    currentSection = {
      drugVersionCode: "test",
      id: "test",
      section: {
        code: "UI-S-DIAGC",
        name: "test",
      },
      feedbackData: [],
      feedbackLeft: 0,
      headers: ["test header one", "test header two"],
      headersUIWidth: [10, 10],
      rows: [
        {
          hasBorder: false,
          columns: [
            {
              isReadOnly: true,
              value: "row column one",
              feedbackData: [],
              feedbackLeft: 0,
            },
            {
              isReadOnly: true,
              value: "row column two",
              feedbackData: [],
              feedbackLeft: 0,
            },
          ],
        },
      ],
    };

    newSection = {
      drugVersionCode: "test",
      id: "test",
      section: {
        code: "UI-S-DIAGC",
        name: "test",
      },
      feedbackData: [],
      feedbackLeft: 0,
      headers: ["test header one", "test header two"],
      headersUIWidth: [10, 10],
      rows: [
        {
          hasBorder: false,
          columns: [
            {
              isReadOnly: true,
              value: "",
              feedbackData: [],
              feedbackLeft: 0,
            },
            {
              isReadOnly: true,
              value: "",
              feedbackData: [],
              feedbackLeft: 0,
            },
          ],
        },
      ],
    };
  }));

  xit("should copy section group", () => {
    service.copySectionGroup(newGroup, currentGroup);
    expect(currentGroup.groups[0].names[0].value).toBe(
      newGroup.groups[1].names[0].value
    );
    expect(currentGroup.groups[0].rows[0].columns[0].value).toBe(
      newGroup.groups[1].rows[0].columns[0].value
    );
  });

  it("should return feedbacks from backup", () => {
    const feedbackData = {
      itemId: 0,
      sectionRowUuid: "",
      feedback: "",
      sourceText: "",
      beginIndex: 0,
      endIndex: 0,
      uiColumnAttribute: "",
      uiSectionCode: "",
      createdBy: "",
      createdById: 0,
      createdOn: "",
    };
    const groups = [...currentGroup.groups, ...currentGroup.groups];
    groups[0].rows = groups[0].rows.concat([...currentSection.rows]);
    groups[1].names = [
      {
        isReadOnly: true,
        value: "group name",
        feedbackData: [],
        feedbackLeft: 0,
      },
    ];
    groups[0].rows[0].columns[0].feedbackData = [feedbackData];
    service.checkGroupedSectionsFeedbacks(groups, newGroup);
    expect(newGroup.groups[0].rows[0].columns[0].feedbackData[0]).toEqual(
      feedbackData
    );
  });

  xit("should undo copy section group", () => {
    service.copySectionGroup(newGroup, currentGroup);
    expect(currentGroup.groups[0].names[0].value).toBe(
      newGroup.groups[1].names[0].value
    );
    expect(currentGroup.groups[0].rows[0].columns[0].value).toBe(
      newGroup.groups[1].rows[0].columns[0].value
    );
    newGroup.codesColumn = {
      isReadOnly: false,
      value: "",
      feedbackLeft: 0,
      feedbackData: [],
    };
    service.isSecondaryMalignancy = true;
    service.backUpCodes = "1";
    service.undoCopySectionGroup(newGroup, currentGroup, false);
    expect(newGroup.groups).toBe(service.backUpSectionRowsGrouped);
  });

  it("should know if a row exists in a group", () => {
    const row: Row = {
      hasBorder: false,
      columns: [
        {
          isReadOnly: false,
          value: "column one",
          feedbackData: [],
          feedbackLeft: 0,
        },
        {
          isReadOnly: false,
          value: "column two",
          feedbackData: [],
          feedbackLeft: 0,
        },
      ],
    };
    let result = service.rowExistInNewVersion(newGroup, row, 0, 0);
    expect(result).toBe(undefined);
    row.columns[0].value = "";
    row.columns[1].value = "";
    result = service.rowExistInNewVersion(newGroup, row, 0, 0);
    expect(result).toBe(true);
  });

  it("should copy from current to new", () => {
    newGroup.codesColumn = {
      isReadOnly: false,
      value: "",
      feedbackLeft: 0,
      feedbackData: [],
    };
    newGroup.codes = ["1"];
    service.copyDataCurrentToNew(newSection, currentSection);
    expect(newSection.rows[0].columns[0].value).toBe(
      currentSection.rows[0].columns[0].value
    );
  });

  it("should redo copy section", () => {
    service.redoCopySection(newSection, currentSection, true);
    expect(newSection.rows).toBe(service.backUpRedoSectionRows);
  });

  it("should undo copy section", () => {
    service.undoCopySection(newSection, currentSection, true);
    expect(newSection.rows).toBe(service.backUpSectionRows);
  });

  it("should copy process for undo", () => {
    service.processUndoCopySection(newSection, currentSection);
    expect(service.backUpRedoSectionRows.values).toBe(
      service.dataNewVersion(newSection).values
    );
  });

  it("should back up copy section", () => {
    expect(service.backUpSectionRows[0]).toBe(undefined);
  });

  it("copy current version to new version", () => {
    service.isDailyMaxUnits = true;
    newSection.codesColumn = {
      isReadOnly: false,
      value: "",
      feedbackLeft: 0,
      feedbackData: [],
    };
    newSection.codes = ["1"];
    service.copySection(newSection, currentSection);
    expect(currentSection.rows[0].columns[0].value).toBe(
      newSection.rows[0].columns[0].value
    );
  });

  it("copy current version to new version and extra rows", () => {
    const newSectionExtraRows = {
      ...newSection,
      rows: [...newSection.rows, ...newSection.rows],
    };
    service.copySection(newSectionExtraRows, currentSection);
    expect(currentSection.rows.length).toBe(newSectionExtraRows.rows.length);
  });

  it("should undo copy current version to new version", () => {
    service.copySection(newSection, currentSection);
    expect(currentSection.rows[0].columns[0].value).toBe(
      newSection.rows[0].columns[0].value
    );
    newSection.codesColumn = {
      isReadOnly: false,
      value: "",
      feedbackLeft: 0,
      feedbackData: [],
    };
    service.isDailyMaxUnits = true;
    service.backUpCodes = "1";
    service.undoCopySection(newSection, currentSection, false);
    expect(newSection.rows).toBe(service.backUpSectionRows);
  });

  it("should redo a copied section group", () => {
    service.isSecondaryMalignancy = true;
    newGroup.codesColumn = {
      isReadOnly: false,
      value: "555",
      feedbackData: [],
      feedbackLeft: 0,
    };
    service.redoCopySectionGroup(newGroup, currentGroup, false);
    expect(service.undoCopySectionGroupFlag).toBe(true);
    expect(service.backUpCodes).toBe("555");
  });
  it("should copy data column for autopopulate", () => {
    expect(service.copyColumnSection(newSection, 0)).toBeTruthy();
  });
 

  it("should not readonly section", () => {
    service.exceptionReadOnly(newSection);
    const columnClear = {
      ...newSection.rows[0].columns[0],
      isReadOnly: false,
    };
    expect(newSection.rows[0].columns[0].isReadOnly).toBe(
      !columnClear.isReadOnly
    );
  });

 it("should copy data from current grouped section", () => {
    service.copySectionGroup(newGroup, currentGroup);
    expect(service.backUpSectionRowsGrouped.values).toBe(
      service.dataNewVersionGroup(newGroup).values
    );
    newGroup.codesColumn = {
      isReadOnly: false,
      value: "",
      feedbackLeft: 0,
      feedbackData: [],
    };
    newGroup.codes = ["1"];
    service.copyDataCurrentToNewGroup(newGroup, currentGroup);
    expect(newGroup.groups.values).toBe(currentGroup.groups.values);
  });

  it("should know if a group exists in a section", () => {
    const rowBack: GroupRow = {
      names: [
        {
          isReadOnly: false,
          value: "column one",
          feedbackData: [],
          feedbackLeft: 0,
        },
      ],
      rows: [
        {
          hasBorder: false,
          code: "",
          columns: [
            {
              isReadOnly: true,
              value: "1",
              feedbackData: [],
              feedbackLeft: 0,
            },
          ],
        },
      ],
    };
    let result = service.checkIfGroupExist(rowBack, currentGroup);
    expect(result).toBe(-1);
    rowBack.names[0].value = "group name";
    result = service.checkIfGroupExist(rowBack, currentGroup);
    expect(result).toBe(0);
  });

  it("should persist new group in the section", () => {
    const rowBack: GroupRow = {
      names: [
        {
          isReadOnly: false,
          value: "column one",
          feedbackData: [],
          feedbackLeft: 0,
        },
      ],
      rows: [
        {
          hasBorder: false,
          code: "",
          columns: [
            {
              isReadOnly: true,
              value: "1",
              feedbackData: [],
              feedbackLeft: 0,
            },
          ],
        },
      ],
    };
    let newRowGroup: GroupRow = { names: [], rows: [] };
    service.persistNewGroup(newGroup, newRowGroup, rowBack, 0);
    expect(newRowGroup.rows.values).toBe(rowBack.rows.values);
  });

  it("should persist new group in the section", () => {
    const rowBack: GroupRow = {
      names: [
        {
          isReadOnly: false,
          value: "column one",
          feedbackData: [],
          feedbackLeft: 0,
        },
      ],
      rows: [
        {
          hasBorder: false,
          code: "",
          columns: [
            {
              isReadOnly: true,
              value: "1",
              feedbackData: [],
              feedbackLeft: 0,
            },
          ],
        },
      ],
    };
    let newRowGroup: GroupRow = { names: [], rows: [] };
    service.persistRowsExistGroup(newGroup.groups, rowBack, 0);
    expect(newGroup.groups[0].rows[0].columns[0].value).toBe("1");
  });

  it("should copy column section", () => {
    let section: UISection = {
      current: {
        drugVersionCode: "",
        headers: [],
        headersUIWidth: [],
        id: "diagnosis_code_summary",
        section: { code: "UI-S-DIAGCS", name: "Diagnosis Code Summary" },
        codes: [],
        rows: [],
      },
      grouped: false,
      hasRowHeading: false,
      id: "diagnosis_code_summary",
      new: {
        drugVersionCode: "",
        feedbackData: [],
        feedbackLeft: 0,
        id: "diagnosis_code_summary",
        focusType: null,
        headers: [],
        headersUIWidth: [],
        rows: [
          {
            code: "",
            codeUI: "c4c66237-75ed-4998-b1a7-bae5115528f4",
            columns: [],
            hasBorder: false,
          },
        ],
        section: { code: "UI-S-DIAGCS", name: "Diagnosis Code Summary" },
      },
    };
    let columnSource = SectionAutopopulateOverlaps.find(
      (o) => o.section === section.id
    );
    service.copySourceColumn(section, columnSource);
    expect(
      service.copyColumnSection(section.new as Section, columnSource[0])
    ).toBeTruthy();
    service.getDuplicateDataSection(service.dataCopy);
    expect(service.dataCopy).not.toBeNull();
  });

  it("should get data section", () => {
    let section: UISection = {
      current: {
        drugVersionCode: "",
        headers: [],
        headersUIWidth: [],
        id: "diagnosis_code_summary",
        section: { code: "UI-S-DIAGCS", name: "Diagnosis Code Summary" },
        codes: [],
        rows: [],
      },
      grouped: false,
      hasRowHeading: false,
      id: "diagnosis_code_summary",
      new: {
        drugVersionCode: "",
        feedbackData: [],
        feedbackLeft: 0,
        id: "diagnosis_code_summary",
        focusType: null,
        headers: [],
        headersUIWidth: [],
        rows: [
          {
            code: "",
            codeUI: "c4c66237-75ed-4998-b1a7-bae5115528f4",
            columns: [],
            hasBorder: false,
          },
        ],
        section: { code: "UI-S-DIAGCS", name: "Diagnosis Code Summary" },
      },
    };
    let columnSource = SectionAutopopulateOverlaps.find(
      (o) => o.section === section.id
    );

    let dataColum = service.copyColumnSection(
      section.new as Section,
      columnSource[0]
    );
    expect(service.addColumn(dataColum)).toBeUndefined();
  });

  
  it("should get duplicates from section", () => {
    const datacopy: Row[] = [
      {
        hasBorder: false,
        code: "",
        columns: [
          {
            isReadOnly: true,
            value: "C21",
            feedbackData: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "C22",
            feedbackData: [],
            feedbackLeft: 0,
          },
        ],
      },
      {
        hasBorder: false,
        code: "",
        columns: [
          {
            isReadOnly: true,
            value: "C21",
            feedbackData: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "C22",
            feedbackData: [],
            feedbackLeft: 0,
          },
        ],
      },
    ];
    expect(service.getDuplicateDataSection(datacopy)).toContain("c21");
  });


  it("should return null if no autopoppulate sections are found", () => {
    let section: UISection = {
      current: {
        drugVersionCode: "",
        headers: [],
        headersUIWidth: [],
        id: "diagnosis_code_summary",
        section: { code: "UI-S-DIAGCS", name: "Diagnosis Code Summary" },
        codes: [],
        rows: [],
      },
      grouped: false,
      hasRowHeading: false,
      id: "diagnosis_code_summary",
      new: {
        drugVersionCode: "",
        feedbackData: [],
        feedbackLeft: 0,
        id: "diagnosis_code_summary",
        focusType: null,
        headers: [],
        headersUIWidth: [],
        rows: [
          {
            code: "",
            codeUI: "c4c66237-75ed-4998-b1a7-bae5115528f4",
            columns: [],
            hasBorder: false,
          },
        ],
        section: { code: "UI-S-DIAGCS", name: "Diagnosis Code Summary" },
      },
    };
    const copy = service.copyColumnsMultiSource([section]);
    expect(copy.dataCopy).toBe(null);
  });
});
