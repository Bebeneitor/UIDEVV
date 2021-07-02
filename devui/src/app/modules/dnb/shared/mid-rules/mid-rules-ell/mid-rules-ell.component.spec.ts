import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Component, Input } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ConfirmationService, MessageService } from "primeng/primeng";
import { of } from "rxjs";
import { DnBMidrulesService } from "../../../services/dnb-midrules.service";
import { MidRulesEllComponent } from "./mid-rules-ell.component";
@Component({ selector: "p-dialog", template: "<div #dialog></div>" })
class DialogStub {
  @Input() header: string = "";
  @Input() visible: boolean = false;
  center() {}
}
@Component({ selector: "p-footer", template: "" })
class FooterStub {}
fdescribe("MidRulesEllComponent", () => {
  let component: MidRulesEllComponent;
  let fixture: ComponentFixture<MidRulesEllComponent>;
  let confirmationService: ConfirmationService;
  let dnbMidruleService: DnBMidrulesService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MidRulesEllComponent, DialogStub, FooterStub],
      imports: [HttpClientTestingModule],
      providers: [DnBMidrulesService, ConfirmationService, MessageService],
    }).compileComponents();
  }));

  beforeEach(() => {
    const response = [
      {
        midRuleKey: 0,
        ruleVersion: 0,
        topicTitle: "",
        unresolvedDesc: "",
        vtopicKey: 0,
      },
    ];
    fixture = TestBed.createComponent(MidRulesEllComponent);
    confirmationService = TestBed.get(ConfirmationService);
    dnbMidruleService = TestBed.get(DnBMidrulesService);
    spyOn(dnbMidruleService, "getRulesDrugCode").and.returnValue(of(response));
    spyOn(dnbMidruleService, "getRulesTopicName").and.returnValue(of(response));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    component.openDialog = true;
    component.ngOnChanges();
    expect(component).toBeTruthy();
  });

  it("should display review data", () => {
    component.openDialog = true;
    component.readOnlyDialog = true;
    component.ngOnChanges();
    expect(component).toBeTruthy();
  });

  it("should emit selection set", () => {
    const spy = spyOn(confirmationService, "confirm");
    component.addRules();
    expect(spy).toHaveBeenCalled();
  });

  it("should emit dialog hidden", () => {
    const event = spyOn(component.openDialogChange, "emit");
    component.dialogHidden();
    expect(event).toHaveBeenCalled();
  });
});
