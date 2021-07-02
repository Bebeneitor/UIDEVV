import { async, TestBed } from "@angular/core/testing";
import { SectionCode } from "../models/constants/sectioncode.constant";
import { GlobalReviewIndicationsHeaders } from "../models/constants/templates.constant";
import { Section } from "../models/interfaces/uibase";
import {
  clearSectionCurrentData,
  getSectionColumnData,
} from "./populate.utils";

const newSection: Section = {
  drugVersionCode: "",
  section: {
    code: SectionCode.GlobalReviewIndications,
    name: "Global Review Indications",
  },
  headers: GlobalReviewIndicationsHeaders,
  headersUIWidth: [30, 30, 30],
  id: "global_review_indication",
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
          value: "test",
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

fdescribe("populate utils", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({}).compileComponents();
  }));

  it("should get columns", () => {
    const data = getSectionColumnData(
      newSection,
      false,
      "Global review indication"
    );
    expect(data.length).toBe(1);
  });
  it("should clear columns", () => {
    const data = clearSectionCurrentData(
      newSection,
      false,
      "Global review indication"
    );
    expect(data.length).toBe(0);
  });
});
