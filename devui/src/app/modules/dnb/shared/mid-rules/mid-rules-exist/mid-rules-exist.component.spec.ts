import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Component, Input } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { MessageService } from "primeng/api";
import { DialogModule } from "primeng/dialog";
import { of } from "rxjs";
import { ToastMessageService } from "src/app/services/toast-message.service";
import { DnBMidrulesService } from "../../../services/dnb-midrules.service";
import { MidRulesExistComponent } from "./mid-rules-exist.component";

@Component({ selector: "ecl-table", template: "" })
class ECLTableStubComponent {
  @Input() tableModel: any;
  totalRecords: number = 0;
  loadData: (value) => {};
}

fdescribe("MidRulesExistComponent", () => {
  let component: MidRulesExistComponent;
  let fixture: ComponentFixture<MidRulesExistComponent>;
  let toast: ToastMessageService;
  let midRule: DnBMidrulesService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MidRulesExistComponent, ECLTableStubComponent],
      providers: [MessageService, ToastMessageService, DnBMidrulesService],
      imports: [HttpClientTestingModule, DialogModule, FormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MidRulesExistComponent);
    component = fixture.componentInstance;
    toast = TestBed.get(ToastMessageService);
    midRule = TestBed.get(DnBMidrulesService);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should emit selection set", () => {
    const event = spyOn(component.selectionSet, "emit");
    component.addExistingMidRule();
    expect(event).toHaveBeenCalled();
  });

  it("should emit dialog hidden", () => {
    const event = spyOn(component.openDialogChange, "emit");
    component.dialogHidden();
    expect(event).toHaveBeenCalled();
  });

  it("should display error on empty midrule filter", () => {
    const event = spyOn(toast, "messageWarning");
    component.filter.ruleLogicFilter = "tes";
    component.filter.midRuleFilter = "tes";
    component.filterData();
    expect(event).toHaveBeenCalled();
  });

  it("should validate data", () => {
    component.filter.ruleLogicFilter = null;
    component.filter.midRuleFilter = null;
    expect(component.validateData()).toBe(true);
  });
});
