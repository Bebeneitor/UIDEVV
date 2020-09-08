import { async, TestBed } from "@angular/core/testing";
import { GroupedSection, Row, Section } from "../../models/interfaces/uibase";
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
      headers: ["test header one", "test header two"],
      groups: [
        {
          names: [
            {
              isReadOnly: true,
              value: "group name",
            },
          ],
          rows: [
            {
              hasBorder: false,
              columns: [
                {
                  isReadOnly: true,
                  value: "row column one",
                },
                {
                  isReadOnly: true,
                  value: "row column two",
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
        code: "test",
        name: "test",
      },
      headers: [],
      groups: [
        {
          names: [
            {
              isReadOnly: true,
              value: "",
            },
          ],
          rows: [
            {
              hasBorder: false,
              columns: [
                {
                  isReadOnly: true,
                  value: "",
                },
                {
                  isReadOnly: true,
                  value: "",
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
        code: "test",
        name: "test",
      },
      headers: ["test header one", "test header two"],
      rows: [
        {
          hasBorder: false,
          columns: [
            {
              isReadOnly: true,
              value: "row column one",
            },
            {
              isReadOnly: true,
              value: "row column two",
            },
          ],
        },
      ],
    };

    newSection = {
      drugVersionCode: "test",
      id: "test",
      section: {
        code: "test",
        name: "test",
      },
      headers: ["test header one", "test header two"],
      rows: [
        {
          hasBorder: false,
          columns: [
            {
              isReadOnly: true,
              value: "",
            },
            {
              isReadOnly: true,
              value: "",
            },
          ],
        },
      ],
    };
  }));

  it("should copy section group", () => {
    service.copySectionGroup(newGroup, currentGroup);
    expect(currentGroup.groups[0].names[0].value).toBe(
      newGroup.groups[0].names[0].value
    );
    expect(currentGroup.groups[0].rows[0].columns[0].value).toBe(
      newGroup.groups[0].rows[0].columns[0].value
    );
  });

  it("should undo copy section group", () => {
    service.copySectionGroup(newGroup, currentGroup);
    expect(currentGroup.groups[0].names[0].value).toBe(
      newGroup.groups[0].names[0].value
    );
    expect(currentGroup.groups[0].rows[0].columns[0].value).toBe(
      newGroup.groups[0].rows[0].columns[0].value
    );
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
        },
        {
          isReadOnly: false,
          value: "column two",
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
    service.copyDataCurrentToNew(newSection, currentSection);
    expect(newSection.rows[0].columns[0].value).toBe(
      currentSection.rows[0].columns[0].value
    );
  });

  it("should back up copy section", () => {
    expect(service.backUpSectionRows[0]).toBe(
       newSection.rows[0]
    );
  });

  it("should undo copy section", () => {
    service.undoCopySection(newSection, currentSection, true);
    expect(newSection.rows[0].columns[0].value).toBe("");
  });

  it("copy current version to new version", () => {
    service.copySection(newSection, currentSection);
    expect(currentSection.rows[0].columns[0].value).toBe(
      newSection.rows[0].columns[0].value
    );
  });

  it("should undo copy current version to new version", () => {
    service.copySection(newSection, currentSection);
    expect(currentSection.rows[0].columns[0].value).toBe(
      newSection.rows[0].columns[0].value
    );

    service.undoCopySection(newSection, currentSection, false);
    expect(newSection.rows).toBe(service.backUpSectionRows);
  });
});
