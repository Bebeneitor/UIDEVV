import { async, TestBed } from "@angular/core/testing";
import {
  GroupedSection,
  Row,
  Section,
  UISection,
} from "../models/interfaces/uibase";
import { copyCurrentToNewSection, copyRowUtil } from "./copyrow.utils";

fdescribe("copyRow", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({}).compileComponents();
  }));

  it("should return valid data in copy row", () => {
    const newRows: Row[] = [
      {
        hasBorder: false,
        columns: [
          {
            value: "row 1",
            isReadOnly: false,
            feedbackData: [],
            feedbackLeft: 0,
            diff: [[0, "row 1"]],
          },
        ],
      },
      {
        hasBorder: false,
        columns: [
          {
            value: "row 2",
            isReadOnly: false,
            feedbackData: [],
            feedbackLeft: 0,
            diff: [[0, "row 2"]],
          },
        ],
      },
      {
        hasBorder: false,
        columns: [
          {
            value: "row 3",
            isReadOnly: false,
            feedbackData: [],
            feedbackLeft: 0,
            diff: [[0, "row 3"]],
          },
        ],
      },
    ];
    const copyRow: Row = {
      hasBorder: false,
      columns: [
        {
          value: "row 2",
          isReadOnly: false,
          diff: [[0, "row 2"]],
          feedbackData: [],
          feedbackLeft: 0,
        },
      ],
    };

    const result = copyRowUtil(copyRow, newRows);
    const expectedIndex = 1;
    expect(result.lastCopyIndex).toBe(expectedIndex);
    expect(result.lastCopyWasAdded).toBe(false);
    expect(result.backUpCopyRow).toEqual(newRows[expectedIndex]);
    const copyRow2: Row = {
      hasBorder: false,
      columns: [
        {
          value: "new value",
          isReadOnly: false,
          feedbackData: [],
          feedbackLeft: 0,
          diff: [[0, "new value"]],
        },
      ],
    };

    const result2 = copyRowUtil(copyRow2, newRows);
    const expectedIndex2 = 3;
    expect(result2.lastCopyIndex).toBe(expectedIndex2);
    expect(result2.lastCopyWasAdded).toBe(true);
    expect(result2.backUpCopyRow).toEqual(newRows[expectedIndex2]);
  });

  it("should copy from current section to new section", () => {
    const section: Section = {
      drugVersionCode: "",
      id: "",
      section: {
        code: "",
        name: "",
      },
      headers: [],
      headersUIWidth: [],
      rows: [
        {
          hasBorder: false,
          columns: [
            {
              isReadOnly: true,
              value: "original value",
              feedbackData: [],
              feedbackLeft: 0,
            },
          ],
        },
      ],
    };
    const sectionNew: Section = {
      ...section,
      rows: [
        {
          hasBorder: false,
          columns: [
            {
              isReadOnly: false,
              value: "",
              feedbackData: [],
              feedbackLeft: 0,
            },
          ],
        },
      ],
    };
    const sections: UISection = {
      id: "sections",
      current: section,
      new: sectionNew,
      hasRowHeading: false,
      grouped: false,
    };

    copyCurrentToNewSection(sections, sections.new, false);

    expect((sections.current as Section).rows[0].columns[0].value).toEqual(
      (sections.current as Section).rows[0].columns[0].value
    );
  });

  it("should copy from current grouped section to new grouped section", () => {
    const section: GroupedSection = {
      drugVersionCode: "",
      id: "",
      section: {
        code: "",
        name: "",
      },
      headers: [],
      headersUIWidth: [],
      groups: [
        {
          names: [
            {
              isReadOnly: true,
              value: "original group",
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
                  value: "original value",
                  feedbackData: [],
                  feedbackLeft: 0,
                },
              ],
            },
          ],
        },
      ],
    };
    const sectionNew: GroupedSection = {
      ...section,
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
                  isReadOnly: false,
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
    const sections: UISection = {
      id: "sections",
      current: section,
      new: sectionNew,
      hasRowHeading: false,
      grouped: true,
    };

    copyCurrentToNewSection(sections, sections.new, true);

    expect(
      (sections.current as GroupedSection).groups[0].rows[0].columns[0].value
    ).toEqual(
      (sections.current as GroupedSection).groups[0].rows[0].columns[0].value
    );

    expect(
      (sections.current as GroupedSection).groups[0].names[0].value
    ).toEqual((sections.current as GroupedSection).groups[0].names[0].value);
  });
});
