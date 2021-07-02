import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { MessageService } from "primeng/api";
import { DialogModule } from "primeng/dialog";
import { ToastMessageService } from "src/app/services/toast-message.service";
import { MidRulesComponent } from "./mid-rules.component";

fdescribe("MidRulesComponent", () => {
  let component: MidRulesComponent;
  let fixture: ComponentFixture<MidRulesComponent>;
  let toast: ToastMessageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MidRulesComponent],
      imports: [DialogModule, FormsModule],
      providers: [MessageService, ToastMessageService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MidRulesComponent);
    toast = TestBed.get(ToastMessageService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should emit mid rule data", () => {
    const event = spyOn(component.midRuleData, "emit");
    component.midRule = {
      midRuleTemplateId: 0,
      template: "test",
      templateInformation: "test",
      reasonCode: "test",
    };
    component.addMidRule();
    expect(event).toHaveBeenCalled();
  });

  it("should display error on empty midrule title", () => {
    const event = spyOn(toast, "messageWarning");
    component.midRuleSetUp.requiredText1 = true;
    component.midRule = {
      midRuleTemplateId: 0,
      template: "",
      templateInformation: "",
      reasonCode: "test",
    };
    component.addMidRule();
    expect(event).toHaveBeenCalled();
  });

  it("should display error on empty midrule reason code", () => {
    const event = spyOn(toast, "messageWarning");
    component.midRuleSetUp.requiredText2 = true;
    component.midRule = {
      midRuleTemplateId: 0,
      template: "",
      templateInformation: "",
      reasonCode: "",
    };
    component.addMidRule();
    expect(event).toHaveBeenCalled();
  });

  it("should emit backMidRule", () => {
    const event = spyOn(component.openDialogChange, "emit");
    component.close();
    expect(event).toHaveBeenCalled();
  });

  it("should emit dialog hidden", () => {
    const event = spyOn(component.backMidRuleList, "emit");
    component.dialogHidden();
    expect(event).toHaveBeenCalled();
  });
});
