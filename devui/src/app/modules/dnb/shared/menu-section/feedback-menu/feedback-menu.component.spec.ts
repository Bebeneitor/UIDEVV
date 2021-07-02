import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FeedbackMenuComponent } from "./feedback-menu.component";

fdescribe("FeedbackMenuComponent", () => {
  let component: FeedbackMenuComponent;
  let fixture: ComponentFixture<FeedbackMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackMenuComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
