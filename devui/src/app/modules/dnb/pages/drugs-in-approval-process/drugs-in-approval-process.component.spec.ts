import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { DrugsInApprovalProcessComponent } from "./drugs-in-approval-process.component";

fdescribe("DrugsInApprovalProcessComponent", () => {
  let component: DrugsInApprovalProcessComponent;
  let fixture: ComponentFixture<DrugsInApprovalProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DrugsInApprovalProcessComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugsInApprovalProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
