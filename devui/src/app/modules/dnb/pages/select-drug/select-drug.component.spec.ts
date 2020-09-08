import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Component, Input } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { SelectDrugComponent } from "./select-drug.component";

@Component({ selector: "ecl-table", template: "" })
class ECLTableStubComponent {
  @Input() tableModel: any;
  totalRecords: number = 0;
  clearFilters: () => {};
  loadData: () => {};
}

@Component({ selector: "app-dnb-filter-list", template: "" })
class FilterListStubComponent {
  @Input() filter: any;
}

@Component({ selector: "dnb-app-dialog", template: "" })
class DialogStubComponent {
  @Input() openDialog: boolean;
  @Input() setUpDialog: {
    header: string;
    container: [];
    buttonCancel: boolean;
    valueDefault: string;
  };
}

fdescribe("SelectDrugComponent", () => {
  let component: SelectDrugComponent;
  let fixture: ComponentFixture<SelectDrugComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SelectDrugComponent,
        ECLTableStubComponent,
        FilterListStubComponent,
        DialogStubComponent,
      ],
      imports: [FormsModule, RouterTestingModule, HttpClientTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDrugComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should navigate", () => {
    const spy = spyOn(router, "navigate");
    const event = {
      row: {
        name: "Drug Name",
        drugCode: "1",
      },
    };
    component.selectDrug(event);
    expect(spy).toHaveBeenCalled();
  });

  it("should open format select dialog", () => {
    component.openSelectType({ row: { drugCode: " " } });
    expect(component.shouldOpenDownload).toBe(true);
  });

  it("should hide dialog on download start", () => {
    component.downloadSelected("");
    expect(component.shouldOpenDownload).toBe(false);
  });

  it("should filter the table", () => {
    const spy = spyOn(component, "updateResults");
    const url = "newurl";
    component.filter(url);
    expect(spy).toHaveBeenCalled();
  });
});
