import { Component, Input } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { Column, DropdownModule } from "primeng/primeng";
import { ChildCurrentDataIndications } from "../../../models/interfaces/autopopulate";
import { AutopopulateIndicationsComponent } from "./autopopulate-indications.component";

@Component({
  selector: "app-autopopulate-indications",
  template: "",
})
class AutopopulateIndicationsStubComponent {
  @Input() openDialog: boolean = false;
  @Input() newIndications: Column[];
  @Input() childsIndications: ChildCurrentDataIndications;
}

fdescribe("AutopopulateIndicationsComponent", () => {
  let component: AutopopulateIndicationsComponent;
  let fixture: ComponentFixture<AutopopulateIndicationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AutopopulateIndicationsComponent,
        AutopopulateIndicationsStubComponent,
      ],
      imports: [DialogModule, DropdownModule, FormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutopopulateIndicationsComponent);
    component = fixture.componentInstance;
    component.childsIndications = {
      diagnosisCodeSummary: [
        [
          { label: "10 ", value: "10", disabled: false },
          { label: "20 ", value: "20", disabled: false },
        ],
      ],
      globalReviewIndication: [
        [
          { label: "10 ", value: "10", disabled: false },
          { label: "20 ", value: "20", disabled: false },
        ],
      ],
    };
    component.dataIndicationUsed = ["20", "22", "12"];
    component.addIndicationDirectGlobal = [];
    component.dataIndicationOverride = [];
    component.addIndicationDirectFixed = [];
    component.dataIndicationOverrideGlobalReview = [];
    component.newIndications = [
      {
        value: "20",
        isReadOnly: false,
        feedbackData: [],
        feedbackLeft: 0,
      },
    ];
    component.dataIndicationUsedGlobalReview = ["10", "12", "32"];
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

  it("should get indication delete", () => {
    expect(component.getIndicationsToDelete()).toBeTruthy();
  });

  it("should get indication delete global review", () => {
    expect(component.getIndicationsToDeleteGlobalReview()).toBeTruthy();
  });

  xit("should get indication add", () => {
    expect(component.getIndicationsToAdd()).toBeTruthy();
  });

  xit("should get indication add for global review", () => {
    expect(component.getIndicationsToAddGlobalReview()).toBeTruthy();
  });

  xit("should indication disabled fixed indications", () => {
    let indication = "10";
    component.indicationEnabled = undefined;
    component.indicationCodeSummary.push({
      label: "10 ",
      value: "10",
      disabled: false,
    });
    component.changeIndication(indication);
    let indicationDisabled = component.indicationCodeSummary.find(
      (item) => item.value === indication
    );
    expect(indicationDisabled.disabled).toBe(true);
  });

  xit("should indication disabled global review indication", () => {
    let indication = "10";
    component.indicationEnabled = undefined;
    component.indicationGlobalReview.push({
      label: "10 ",
      value: "10",
      disabled: false,
    });
    component.changeIndication(indication);
    let indicationDisabled = component.indicationGlobalReview.find(
      (item) => item.value === indication
    );
    expect(indicationDisabled.disabled).toBe(true);
  });

  it("should delete indication", () => {
    component.indicationCodeSummary = [
      { label: "10 ", value: "10", disabled: false },
    ];
    component.deleteIndication("10");
    expect(component.indicationCodeSummary.length).toBe(0);
  });

  xit("should delete indication in Global Review Indication", () => {
    component.indicationGlobalReview = [
      { label: "10 ", value: "10", disabled: false },
    ];
    component.deleteIndicationGlobalReview("10");
    expect(component.indicationGlobalReview.length).toBe(0);
  });
});
