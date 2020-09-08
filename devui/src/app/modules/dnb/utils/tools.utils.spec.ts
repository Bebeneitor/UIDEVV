import { async, TestBed } from "@angular/core/testing";
import {
  groupExist,
  isEmptyGroup,
  isEmptyRow,
  prepareData,
  escapeRegExp,
  backupSectionSearchData,
} from "./tools.utils";
import { GroupRow, Column, Row, Section } from "../models/interfaces/uibase";

fdescribe("tools utils", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({}).compileComponents();
  }));

  it("should validate if a group exists in array of groups", () => {
    const names: Column[] = [
      {
        isReadOnly: true,
        value: "ColumGroup 1",
      },
      {
        isReadOnly: true,
        value: "ColumGroup 2",
      },
    ];

    const rows: Row[] = [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "ColumGroup 1",
          },
          {
            isReadOnly: true,
            value: "ColumGroup 2",
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
      },
      {
        isReadOnly: true,
        value: "ColumGroup 2",
      },
    ];

    const rows: Row[] = [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "ColumGroup 1",
          },
          {
            isReadOnly: true,
            value: "ColumGroup 2",
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
      },
      {
        isReadOnly: true,
        value: "ColumGroup 2",
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
      rows: [],
    };
    const result = backupSectionSearchData(sectionTest, false);
    expect(result.drugVersionCode).toBe("DrugVersion test");
  });
});
