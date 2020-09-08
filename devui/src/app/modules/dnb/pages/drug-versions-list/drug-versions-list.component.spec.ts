import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Component, Input } from "@angular/core";
import {
  async,
  ComponentFixture,
  inject,
  TestBed,
} from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { DialogService } from "primeng/api";
import { CheckboxModule } from "primeng/checkbox";
import { drugVersionStatus } from "../../models/constants/drug.constants";
import { DrugVersionsUI } from "../../models/interfaces/drugversion";
import { DnbService } from "../../services/dnb.service";
import { PipesModule } from "../../utils/pipes/pipes.module";
import { DrugVersionsListComponent } from "./drug-versions-list.component";
const versionOne: DrugVersionsUI = {
  drugVersionCode: "1",
  drugCode: "1",
  version: "1",
  majorVersion: 0,
  minorVersion: 0,
  createdBy: 0,
  creationDT: 0,
  updatedBy: 0,
  updatedOn: 0,
  midRules: [],
  checked: false,
  revVersion: 0,
  versionStatus: { code: drugVersionStatus.Draft.code, description: "Draft" },
};

const versionTwo: DrugVersionsUI = {
  drugVersionCode: "2",
  drugCode: "2",
  version: "2",
  majorVersion: 2,
  minorVersion: 0,
  createdBy: 0,
  creationDT: 0,
  updatedBy: 0,
  updatedOn: 0,
  midRules: [],
  checked: false,
  revVersion: 0,
  versionStatus: {
    code: drugVersionStatus.Approved.code,
    description: "Approved",
  },
};

const versionThree: DrugVersionsUI = {
  drugVersionCode: "3",
  drugCode: "3",
  version: "3",
  majorVersion: 3,
  minorVersion: 0,
  createdBy: 0,
  creationDT: 0,
  updatedBy: 0,
  updatedOn: 0,
  midRules: [],
  checked: false,
  revVersion: 0,
  versionStatus: {
    code: drugVersionStatus.Approved.code,
    description: "Approved",
  },
};
const versions: DrugVersionsUI[] = [versionOne, versionTwo, versionThree];

@Component({ selector: "ecl-table", template: "" })
class ECLTableStubComponent {
  @Input() tableModel: any;
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
fdescribe("DrugVersionsListComponent", () => {
  let component: DrugVersionsListComponent;
  let fixture: ComponentFixture<DrugVersionsListComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DrugVersionsListComponent,
        DialogStubComponent,
        ECLTableStubComponent,
      ],
      providers: [DnbService, DialogService],
      imports: [
        CheckboxModule,
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        PipesModule,
      ],
    }).compileComponents();
  }));

  beforeEach(inject([DnbService], (DnbService: DnbService) => {
    fixture = TestBed.createComponent(DrugVersionsListComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    component.versions = versions;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display correct drug name", () => {
    component.drugName = "Drug Test";
    fixture.detectChanges();
    const policyReleaseHTML = fixture.debugElement
      .query(By.css("h1"))
      .nativeElement.textContent.trim();
    expect(policyReleaseHTML).toBe("Review Drug Versions Drug Test");
  });

  it("should navigate", () => {
    const spy = spyOn(router, "navigate");
    const event = {
      row: versionOne,
    };
    component.selectDrug(event);
    expect(spy).toHaveBeenCalled();
  });

  it("should open format select dialog", () => {
    const event = {
      row: versionOne,
    };
    component.openSelectType(event);
    expect(component.shouldOpenDownload).toBe(true);
  });

  it("should hide dialog on download start", () => {
    component.downloadSelected("");
    expect(component.shouldOpenDownload).toBe(false);
  });

  it("should display two versions only even after selecting 3 versions", () => {
    versionOne.checked = true;
    component.toggledVersion({ row: versionOne, event: true });
    expect(component.versionOne).toEqual(versionOne);

    versionTwo.checked = true;
    component.toggledVersion({ row: versionTwo, event: true });
    expect(component.versionTwo).toEqual(versionTwo);

    versionThree.checked = true;
    component.toggledVersion({ row: versionThree, event: true });
    expect(component.versionOne).toEqual(versionThree);
    expect(component.versionTwo).toEqual(versionOne);
    expect(component.shouldEnableCompare).toBe(true);
  });

  it("should not let user compare if only one version is selected", () => {
    versionOne.checked = true;
    component.toggledVersion({ row: versionOne, event: true });
    expect(component.shouldEnableCompare).toBe(false);
    versionTwo.checked = true;
    component.toggledVersion({ row: versionTwo, event: true });
    expect(component.shouldEnableCompare).toBe(true);
    versionTwo.checked = false;
    component.toggledVersion({ row: versionTwo, event: false });
    expect(component.shouldEnableCompare).toBe(false);
  });

  it("should save compare version and navigate", () => {
    const spy = spyOn(router, "navigate");
    versionOne.checked = true;
    component.toggledVersion({ row: versionTwo, event: true });
    versionTwo.checked = true;
    component.toggledVersion({ row: versionOne, event: true });
    component.compare();
    expect(component.versionOne.majorVersion).toBeLessThan(
      component.versionTwo.majorVersion
    );
    expect(spy).toHaveBeenCalled();
  });
});
