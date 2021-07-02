import { SimpleChange } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SimpleCellComponent } from "./simple-cell.component";

fdescribe("SimpleCellComponent", () => {
  let component: SimpleCellComponent;
  let fixture: ComponentFixture<SimpleCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SimpleCellComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display feedback", () => {
    const column = {
      value: "text",
      isReadOnly: false,
      feedbackData: [],
      feedbackLeft: 0,
    };
    component.column = column;
    const feedbackData = [
      {
        beginIndex: 0,
        endIndex: 3,
        feedback: "feedback",
        itemId: 0,
        instanceId: 0,
        drugVersionUuid: "0",
        sectionRowUuid: "0",
        sourceText: "text",
        uiColumnAttribute: "column",
        uiSectionCode: "section",
        createdOn: "",
        createdBy: "",
        createdById: 0,
      },
    ];
    component.feedbackData = feedbackData;
    const changes = {
      column: new SimpleChange(null, column, true),
      feedbackData: new SimpleChange(null, feedbackData, true),
    };
    component.ngOnChanges(changes);
    fixture.detectChanges();
    expect(component.feedbackData[0].elementId).toBe("feed0");
  });

  it("should emit select text", () => {
    const selectionEvent = spyOn(component.selectionSet, "emit");
    spyOn(window, "getSelection").and.returnValue({
      getRangeAt: () => {
        return {
          startContainer: null,
          endContainer: null,
          startOffset: 0,
          endOffset: 0,
        };
      },
    });

    component.column = {
      value: "text",
      isReadOnly: false,
      feedbackData: [],
      feedbackLeft: 0,
    };
    component.feedbackData = [];

    const event = {
      target: {
        className: "feedback feedback1",
      },
    };
    component.selectedText(event);
    expect(selectionEvent).toHaveBeenCalled();
  });

  it("should emit click", () => {
    const clickEvent = spyOn(component.feedbackClick, "emit");
    component.feedbackClicked(null);
    expect(clickEvent).toHaveBeenCalled();
  });

  it("should emit click", () => {
    const clickEvent = spyOn(component.feedbackClick, "emit");
    const feedbackData = [
      {
        beginIndex: 0,
        endIndex: 3,
        feedback: "feedback",
        itemId: 0,
        instanceId: 0,
        drugVersionUuid: "0",
        sectionRowUuid: "0",
        sourceText: "text",
        uiColumnAttribute: "column",
        uiSectionCode: "section",
        createdOn: "",
        createdBy: "",
        createdById: 0,
        elementId: "1",
      },
    ];
    component.feedbackData = feedbackData;
    component.checkClick({ target: { className: "feedback 1" }, which: 1 });
    expect(clickEvent).toHaveBeenCalled();
  });
});
