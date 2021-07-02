import { async, TestBed } from "@angular/core/testing";
import { drugVersionStatus } from "../models/constants/drug.constants";
import {
  Column,
  GroupRow,
  Row,
  Section,
  UISection,
} from "../models/interfaces/uibase";
import {
  backupSectionSearchData,
  calculatePercentage,
  clearIndication,
  copyIndication,
  createNewRow,
  eliminateUndefined,
  escapeRegExp,
  getDrugVersionId,
  groupExist,
  isEmptyGroup,
  isEmptyRow,
  pasteClipboardRows,
  prepareData,
  validateDataForAutopopulation,
} from "./tools.utils";

fdescribe("tools utils", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({}).compileComponents();
  }));

  it("should validate if a group exists in array of groups", () => {
    const names: Column[] = [
      {
        isReadOnly: true,
        value: "ColumGroup 1",
        feedbackData: [],
        feedbackLeft: 0,
      },
      {
        isReadOnly: true,
        value: "ColumGroup 2",
        feedbackData: [],
        feedbackLeft: 0,
      },
    ];

    const rows: Row[] = [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "ColumGroup 1",
            feedbackData: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "ColumGroup 2",
            feedbackData: [],
            feedbackLeft: 0,
          },
        ],
      },
    ];

    const group: GroupRow = { names, rows };
    const groupArray: GroupRow[] = [{ names, rows }];
    const result = groupExist(group, groupArray);

    expect(result).toBe(0);
  });

  it("should validate if an array of groupRow has some empty group", () => {
    const names: Column[] = [
      {
        isReadOnly: true,
        value: "ColumGroup 1",
        feedbackData: [],
        feedbackLeft: 0,
      },
      {
        isReadOnly: true,
        value: "ColumGroup 2",
        feedbackData: [],
        feedbackLeft: 0,
      },
    ];

    const rows: Row[] = [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "ColumGroup 1",
            feedbackData: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "ColumGroup 2",
            feedbackData: [],
            feedbackLeft: 0,
          },
        ],
      },
    ];

    const groupArray: GroupRow[] = [{ names, rows }];
    const result = isEmptyGroup(groupArray);

    expect(result).toBe(-1);
  });

  it("should validate if an array of columns has some empty column", () => {
    const cols: Column[] = [
      {
        isReadOnly: true,
        value: "ColumGroup 1",
        feedbackData: [],
        feedbackLeft: 0,
      },
      {
        isReadOnly: true,
        value: "ColumGroup 2",
        feedbackData: [],
        feedbackLeft: 0,
      },
    ];

    const result = isEmptyRow(cols);

    expect(result).toBe(false);
  });

  it("should add an enter (\n)", () => {
    const result = prepareData("Test");
    expect(result).toBe("Test\n");
  });

  it("should replace by reg exp", () => {
    const result = escapeRegExp("Test");
    expect(result).toBe("Test");
  });

  it("should returns a section backup", () => {
    const sectionTest: Section = {
      drugVersionCode: "DrugVersion test",
      id: "",
      section: {
        code: "",
        name: "",
      },
      codes: [],
      headers: [],
      headersUIWidth: [],
      rows: [],
    };
    const result = backupSectionSearchData(sectionTest, false);
    expect(result.drugVersionCode).toBe("DrugVersion test");
  });

  it("should return version number or draft", () => {
    const version = {
      versionStatus: drugVersionStatus.InProgress,
    };
    const result = getDrugVersionId(version);
    expect(result).toBe("Draft");
  });

  it("should create a new row", () => {
    const row: Row = {
      hasBorder: false,
      columns: [
        {
          value: "",
          maxLength: 0,
          isReadOnly: false,
          feedbackData: [],
          feedbackLeft: 0,
        },
      ],
    };
    const newrow = createNewRow([row]);
    expect(newrow.columns[0].value).toEqual("");
  });

  it("should calculate percentage", () => {
    const section: UISection[] = [
      {
        id: "",
        current: {
          drugVersionCode: "DrugVersion test",
          id: "",
          section: {
            code: "",
            name: "",
          },
          codes: [],
          headers: [],
          headersUIWidth: [],
          rows: [],
          completed: true,
          enabled: true,
        },
        new: {
          drugVersionCode: "DrugVersion test",
          id: "",
          section: {
            code: "",
            name: "",
          },
          codes: [],
          headers: [],
          headersUIWidth: [],
          rows: [],
          completed: true,
          enabled: true,
        },
        hasRowHeading: false,
        grouped: false,
      },
    ];
    const result = calculatePercentage(section);
    expect(result).toBe("1.00");
  });

  it("should validate data for autopopulate", () => {
    const row: Row[] = [
      {
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
      },
    ];
    const result = validateDataForAutopopulation(row);
    expect(result).toBe(true);
  });

  it("should eliminate undefinded data", () => {
    const section: UISection[] = [
      {
        id: "",
        current: {
          drugVersionCode: "DrugVersion test",
          id: "",
          section: {
            code: "",
            name: "",
          },
          codes: [],
          headers: [],
          headersUIWidth: [],
          rows: [],
          completed: true,
          enabled: true,
        },
        new: {
          drugVersionCode: "DrugVersion test",
          id: "",
          section: {
            code: "",
            name: "",
          },
          codes: [],
          headers: [],
          headersUIWidth: [],
          rows: [],
          completed: true,
          enabled: true,
        },
        hasRowHeading: false,
        grouped: false,
      },
    ];
    const result = eliminateUndefined(section);
    expect(result).toBe(undefined);
  });

  it("should clear indication", () => {
    const section: Section = {
      drugVersionCode: "DrugVersion test",
      id: "",
      section: {
        code: "",
        name: "",
      },
      codes: [],
      headers: [],
      headersUIWidth: [],
      rows: [
        {
          hasBorder: true,
          columns: [
            {
              isReadOnly: false,
              value: "5",
              feedbackData: [],
              feedbackLeft: 0,
            },
          ],
        },
      ],
      completed: true,
      enabled: true,
    };
    const result = clearIndication(section, 0);
    expect(result).toBeUndefined();
  });

  it("should copy data column", () => {
    const section: Section = {
      drugVersionCode: "DrugVersion test",
      id: "",
      section: {
        code: "",
        name: "",
      },
      codes: [],
      headers: [],
      headersUIWidth: [],
      rows: [
        {
          hasBorder: true,
          columns: [
            {
              isReadOnly: false,
              value: "5",
              feedbackData: [],
              feedbackLeft: 0,
            },
          ],
        },
      ],
      completed: true,
      enabled: true,
    };
    const dataInd = copyIndication(section, 1);
    expect(dataInd).toBeTruthy();
  });
  //pasteClipboardRows
  it("should paste rows", () => {
    const rows: Row[] = [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "ColumGroup 1",
            feedbackData: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "ColumGroup 2",
            feedbackData: [],
            feedbackLeft: 0,
          },
        ],
      },
    ];
    const rest = pasteClipboardRows(
      rows,
      { colIndex: 0, rowIndex: 0 },
      [],
      false
    );
    expect(rest.length).toBe(0);
  });
});
