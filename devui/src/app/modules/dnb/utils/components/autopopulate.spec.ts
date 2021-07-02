import { async, TestBed } from "@angular/core/testing";
import { StorageService } from "src/app/services/storage.service";
import { storageDrug } from "../../models/constants/storage.constants";
import { GroupedSection, GroupRow, Row, Section } from "../../models/interfaces/uibase";
import { CopyToNew } from "../../utils/utils.index";
import { AutopopulateUtils } from "./autopopulate";

fdescribe("Autopopulate", () => {
  let service: AutopopulateUtils;
  let newSection: Section;
  let newGroup: GroupedSection;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [AutopopulateUtils, CopyToNew],
    }).compileComponents();
    service = TestBed.get(AutopopulateUtils);

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
              value: "space",
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
        {
          hasBorder: false,
          columns: [
            {
              isReadOnly: true,
              value: "1",
              feedbackData: [],
              feedbackLeft: 0,
            },
            {
              isReadOnly: true,
              value: "3",
              feedbackData: [],
              feedbackLeft: 0,
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
  }));

  it("should clear data section", () => {
    service.clearDataAutopopulation(newSection);
    expect(newSection.rows[0].columns[0].value).toBe("space");
  });

  it("should add rows section", () => {
    let rowAdd = 2;
    const backUpDiagCode: Row[] = [
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
    ];
    service.addRowsAutopopulateSections(newSection, backUpDiagCode, rowAdd, 0);
    expect(newSection.rows.length).toBe(rowAdd);
  });

  xit("should populate grouped section", () => {
    const backUpDiagCode = {
      dataCopy: [
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
      activeSection: newGroup.section.code,
      indicationOverride: [],
      indicationAdd: [],
      dataAdd: [],
      dataDelete: [],
      processAddIndication: false,
      processDeleteIndication: false,
    };
    service.populateSectionGrouped(newGroup, backUpDiagCode, newSection, 0);
    expect(backUpDiagCode.dataCopy[0].columns[0].value).toBe("1");
    expect(newGroup.groups[0].rows[0].columns[0].isReadOnly).toBe(true);
  });


  it("should add rows grouped section", () => {
    let rowAdd = 2;
    const backUpDiagCode: Row[] = [
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
    ];
    service.addRowsAutopopulateSectionsGrouped(
      newGroup,
      backUpDiagCode,
      rowAdd,
      0
    );
    expect(newGroup.groups.length).toBe(rowAdd);
  });

  it("should populate normal section", () => {
    const backUpDiagCode = {
      dataCopy: [
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
      activeSection: newSection.section.code,
      indicationOverride: [],
      indicationAdd: [],
      dataAdd: [],
      dataDelete: [],
      processAddIndication: false,
      processDeleteIndication: false,
    };
    service.populateFixedSections(newSection, backUpDiagCode, newSection, 0);
    expect(backUpDiagCode.dataCopy[0].columns[0].value).toBe("1");
    expect(newSection.rows[0].columns[0].isReadOnly).toBe(true);
  });

  it("should duplicate data section", () => {
    const data: Row[] = [
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
          {
            isReadOnly: true,
            value: "1",
            feedbackData: [],
            feedbackLeft: 0,
          },
        ],
      },
    ];
    expect(service.verifyArrayDuplicateData(data)).toBeTruthy();
  });

  it("should indication exist in the section", () => {
    let indication = "3";
    expect(
      service.indicationExistSection(newSection, indication, 0, false)
    ).toBe(false);
  });

  it("should indication exist in the source", () => {
    let indication = "1";
    const data: Row[] = [
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
          {
            isReadOnly: true,
            value: "1",
            feedbackData: [],
            feedbackLeft: 0,
          },
        ],
      },
    ];
    expect(service.indicationExistInSource(data, indication, 0)).toBe(true);
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

  it("should get empties on section", () => {
    expect(service.getIndexForEmpty(newSection)).toBeTruthy();
  });

  it("should indication override grouped section", () => {
    const backUpCopyRow = {
      indicationOverride: [
        {
          oldIndication: "1",
          newIndication: "2",
        },
      ],
    };
    service.dataOverrideGrouped(newGroup, backUpCopyRow, 0);
    expect(newGroup.groups[0].rows[0].columns[0].value).toEqual("");
  });

  it("should add indication", () => {
    const backUpDiagCode = {
      dataCopy: [
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
      activeSection: newGroup.section.code,
      indicationOverride: [],
      indicationAdd: [],
      dataAdd: [],
      dataDelete: [],
      processAddIndication: false,
      processDeleteIndication: false,
    };
    service.addIndication(["a", "b"], backUpDiagCode, false);
    expect(newSection.rows[0].columns[0].value).toEqual("space");
  });

  it("should indication override section", () => {
    const backUpCopyRow = {
      indicationOverride: [
        {
          oldIndication: "1",
          newIndication: "2",
        },
      ],
    };
    service.dataOverrideGlobal(newSection, backUpCopyRow, 0);
    expect(newSection.rows[1].columns[0].value).toEqual("2");
  });


  xit("should autopopulte global review", () => {
    const backUpDiagCode = {
      dataCopyGlobal: [
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
      activeSection: newGroup.section.code,
      indicationOverride: [],
      indicationAdd: [],
      dataDeleteGlobalReview: [],
      dataAdd: [],
      dataDelete: [],
      processAddIndication: false,
      processDeleteIndication: false,
    };
    service.autopopulateGlobalReview(
      newSection,
      backUpDiagCode,
      newSection,
      0,
    );
    expect(service.sectionTempGlobalReviewIndication).not.toBeUndefined();
  });

  it("should populate global review", () => {
    const backUpDiagCode = {
      dataCopy: [
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
      dataAddGlobal: [
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
      dataCopyGlobal: [
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
      activeSection: newGroup.section.code,
      indicationOverride: [],
      indicationAdd: [],
      dataDeleteGlobalReview: [],
      dataAdd: [],
      dataDelete: [],
      processAddIndication: false,
      processDeleteIndication: false,
    };
    service.populateGlobalReview(newSection, backUpDiagCode, newSection, 0);
    expect(service.sectionTempGlobalReviewIndication).not.toBeUndefined();
  });

  it("should delete normal group indication", () => {
    service.deleteNormalGroupedIndication(
      newGroup,
      [{ value: "a" }, { value: "b" }],
      0,
      true
    );
    expect(service.sectionTempGlobalReviewIndication).toBeUndefined();
  });
  
  it("should autopopulate section", () => {
    const rowBack: GroupRow[] = [{
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
              value: "21",
              feedbackData: [],
              feedbackLeft: 0,
            },
          ],
        },
      ],
    }];
    service.populateOverlapsGroupedSection(newGroup, rowBack);
    expect(newGroup.groups[0].rows[0].columns[0].value).toEqual("21");
  });

});



