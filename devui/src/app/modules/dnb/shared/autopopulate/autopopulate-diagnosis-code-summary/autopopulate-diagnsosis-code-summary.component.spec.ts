import { Component, Input } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { Column, DropdownModule } from "primeng/primeng";
import { ChildCurrentDataIndications } from "../../../models/interfaces/autopopulate";
import { AutopopulateDiagnosisCodeSummaryComponent } from "./autopopulate-diagnosis-code-summary.component";

@Component({
  selector: "app-autopopulate-diagnosis-code-summary",
  template: "",
})
class AutopopulateDiagnosisCodeSummaryComponentStubComponent {
  @Input() openDialog: boolean = false;
  @Input() newIndications: Column[];
  @Input() childsIndications: ChildCurrentDataIndications;
}

fdescribe("AutopopulateDiagnosisCodeSummaryComponent", () => {
  let component: AutopopulateDiagnosisCodeSummaryComponent;
  let fixture: ComponentFixture<AutopopulateDiagnosisCodeSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AutopopulateDiagnosisCodeSummaryComponent,
        AutopopulateDiagnosisCodeSummaryComponentStubComponent,
      ],
      imports: [DialogModule, DropdownModule, FormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      AutopopulateDiagnosisCodeSummaryComponent
    );
    component = fixture.componentInstance;
    component.childsIcdCodes = {
      globalReviewIcd10Codes: [
        [
          { label: "10 ", value: "10", disabled: false },
          { label: "20 ", value: "20", disabled: false },
        ],
      ],
    };
    (component.childsGlobalReviewicd10Code = [
      { label: "11 ", value: "11", disabled: false },
      { label: "21 ", value: "21", disabled: false },
    ]),
      (component.dataIcd10CodesUsed = ["10", "12", "32"]);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should emit dialog hidden", () => {
    const event = spyOn(component.openDialogChange, "emit");
    component.dialogHidden();
    expect(event).toHaveBeenCalled();
  });

  it("should get icd10 codes delete", () => {
    component.deleteIcdCode("11");
    expect(component.childsGlobalReviewicd10Code.length).toBe(1);
  });

  xit("should delete icd10 code", () => {
    component.deleteParentIcdCodePivot("10");
  });

  xit("should get icd10 codes add", () => {
    expect(component.getIcdCodesToAdd()).toBeTruthy();
  });
});
