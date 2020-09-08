import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SectionsStickyComponent } from "./sections-sticky.component";

fdescribe("SectionsStickyComponent", () => {
  let component: SectionsStickyComponent;
  let fixture: ComponentFixture<SectionsStickyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SectionsStickyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionsStickyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should emit undo sticky section", () => {
    const event = spyOn(component.behaviorEvnt, "emit");
    component.undoStickySection(0);
    expect(event).toHaveBeenCalled();
  });
});
