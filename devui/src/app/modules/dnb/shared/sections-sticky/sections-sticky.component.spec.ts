import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Column, GroupRow } from "../../models/interfaces/uibase";
import { SectionsStickyComponent } from "./sections-sticky.component";

fdescribe("SectionsStickyComponent", () => {
  let component: SectionsStickyComponent;
  let fixture: ComponentFixture<SectionsStickyComponent>;
  let group: GroupRow;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SectionsStickyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionsStickyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const column: Column = {
      isReadOnly: false,
      value: "",
      feedbackData: [],
      feedbackLeft: 0,
    };
    group = {
      names: [column],
      rows: [
        {
          hasBorder: false,
          columns: [column],
        },
        {
          hasBorder: true,
          columns: [column],
        },
      ],
    };
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should emit undo sticky section", () => {
    const event = spyOn(component.behaviorEvnt, "emit");
    component.undoStickySection(0);
    expect(event).toHaveBeenCalled();
  });

  it("should return false if last row of group does not have a border", () => {
    group.rows[1].hasBorder = false;
    const hasBorder = component.groupHasBorder(group);
    expect(hasBorder).toBe(false);
  });
});
