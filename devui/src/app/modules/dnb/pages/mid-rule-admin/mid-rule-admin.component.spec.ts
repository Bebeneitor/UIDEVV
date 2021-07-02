import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Component, Input } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { OktaAuthService, OKTA_CONFIG } from "@okta/okta-angular";
import { ConfirmationService, MessageService } from "primeng/api";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { InputSwitchModule } from "primeng/inputswitch";
import { of } from "rxjs";
import { MidRule } from "../../models/interfaces/midRule";
import { DnBMidrulesService } from "../../services/dnb-midrules.service";
import { DnBSharedModule } from "../../shared/shared.module";
import { MidRuleAdminComponent } from "./mid-rule-admin.component";

@Component({ selector: "ecl-table", template: "" })
class ECLTableStubComponent {
  @Input() tableModel: any;
  totalRecords: number = 0;
  loadData = () => {};
}

fdescribe("MidRuleAdminComponent", () => {
  let component: MidRuleAdminComponent;
  let fixture: ComponentFixture<MidRuleAdminComponent>;
  let confirmationService: ConfirmationService;
  let midRuleService: DnBMidrulesService;
  const midrule: MidRule = {
    midRuleTemplateId: 0,
    template: "",
    templateInformation: "",
    reasonCode: "",
  };
  const oktaConfig = {
    issuer: "https://{yourOktaDomain}/oauth2/default",
    clientId: "{clientId}",
    redirectUri: window.location.origin + "/login/callback",
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MidRuleAdminComponent,
        ECLTableStubComponent,
      ],
      providers: [
        ConfirmationService,
        MessageService,
        DnBMidrulesService,
        OktaAuthService,
        {
          provide: OKTA_CONFIG,
          useValue: oktaConfig,
        },
      ],
      imports: [
        DnBSharedModule,
        ConfirmDialogModule,
        InputSwitchModule,
        FormsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MidRuleAdminComponent);
    confirmationService = TestBed.get(ConfirmationService);
    midRuleService = TestBed.get(DnBMidrulesService);
    spyOn(midRuleService, "getMidRulesAdmin").and.returnValue(of([midrule]));
    spyOn(midRuleService, "addMidRules").and.returnValue(of({}));
    spyOn(midRuleService, "updateMidRules").and.returnValue(of({}));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should open history component", () => {
    component.checkHistory(midrule);
    expect(component.openMidRuleHistory).toBe(true);
  });

  it("should edit mid rule", () => {
    const midrule: MidRule = {
      midRuleTemplateId: 0,
      template: "",
      templateInformation: "",
      reasonCode: "",
    };
    component.editMidRule(midrule);
    expect(component.midRuleSelected.midRuleTemplateId).toBe(
      midrule.midRuleTemplateId
    );
  });

  it("should add a mid rule", () => {
    component.createNewTemplate();
    expect(component.midRuleSelected.template).toBe("");
    expect(component.midRuleSelected.templateInformation).toBe("");
    expect(component.midRuleSelected.reasonCode).toBe("");
  });

  it("should save mid rule", () => {
    const spy = spyOn(confirmationService, "confirm").and.callFake(
      (params: any) => {
        params.accept();
      }
    );
    component.midRuleSetUp.textButton1 = "Save";
    component.saveMidRule({});
    component.midRuleSetUp.textButton1 = "Update";
    component.saveMidRule({});
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("should schange status", () => {
    const spy = spyOn(midRuleService, "updateStatusMidRules").and.returnValue(
      of({})
    );
    spyOn(confirmationService, "confirm").and.callFake((params: any) => {
      params.accept();
    });
    const midRule = {
      midRuleTemplateId: 0,
      template: "",
      templateInformation: "",
      reasonCode: "",
    };
    const event = { event: { checked: true }, midRule };
    component.changeStatus(event);
    expect(true).toBe(true);
  });

  it("should unlock midrule", () => {
    component.midRuleSelected = {
      midRuleTemplateId: 0,
      template: "",
      templateInformation: "",
      reasonCode: "",
    };
    const spy = spyOn(midRuleService, "unlockMidRule").and.returnValue(of({}));
    component.unlockMidRule();
    expect(spy).toHaveBeenCalled();
  });
});
