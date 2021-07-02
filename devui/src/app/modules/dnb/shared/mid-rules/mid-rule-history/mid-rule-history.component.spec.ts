import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Component, Input } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MessageService } from "primeng/api";
import { DialogModule } from "primeng/dialog";
import { MidRuleHistoryComponent } from "./mid-rule-history.component";

@Component({ selector: "p-dialog", template: "" })
class DialogStubComponent {
  @Input() visible: any;
}

@Component({ selector: "ecl-table", template: "" })
class ECLTableStubComponent {
  @Input() tableModel: any;
  totalRecords: number = 0;
  loadData: (value) => {};
}

fdescribe("MidRuleHistoryComponent", () => {
  let component: MidRuleHistoryComponent;
  let fixture: ComponentFixture<MidRuleHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MidRuleHistoryComponent,
        ECLTableStubComponent,
        DialogStubComponent,
      ],
      providers: [MessageService],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MidRuleHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    component.loadData();
    expect(component).toBeTruthy();
  });

  it("should create the table", () => {
    component.openDialog = true;
    const spy = spyOn(component, "loadData");
    component.ngOnChanges();
    expect(spy).toHaveBeenCalled();
  });
});
