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
import {
  OktaAuthModule,
  OktaAuthService,
  OKTA_CONFIG,
} from "@okta/okta-angular";
import { DialogService, MessageService } from "primeng/api";
import { CheckboxModule } from "primeng/checkbox";
import { of } from "rxjs";
import { RuleManagerService } from "src/app/modules/industry-update/rule-process/services/rule-manager.service";
import { StorageService } from "src/app/services/storage.service";
import { Constants } from "src/app/shared/models/constants";
import { drugVersionStatus } from "../../models/constants/drug.constants";
import { storageGeneral } from "../../models/constants/storage.constants";
import { DrugVersionsUI } from "../../models/interfaces/drugversion";
import { DnbRoleAuthService } from "../../services/dnb-role-auth.service";
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
  totalRecords: number = 0;
  loadData: (value) => {};
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

@Component({ selector: "app-dnb-breadcrumb", template: "" })
class DnBBreadCrumbStubComponent {}

fdescribe("DrugVersionsListComponent", () => {
  let component: DrugVersionsListComponent;
  let fixture: ComponentFixture<DrugVersionsListComponent>;
  let router: Router;
  let storage: StorageService;
  let ruleManagerService: RuleManagerService;
  const oktaConfig = {
    issuer: "https://not-real.okta.com",
    clientId: "fake-client-id",
    redirectUri: "http://localhost:4200",
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DrugVersionsListComponent,
        DialogStubComponent,
        ECLTableStubComponent,
        DnBBreadCrumbStubComponent,
      ],
      providers: [
        DnbService,
        DialogService,
        DnbRoleAuthService,
        MessageService,
        RuleManagerService,
        OktaAuthService,
        { provide: OKTA_CONFIG, useValue: oktaConfig },
      ],
      imports: [
        CheckboxModule,
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        PipesModule,
        OktaAuthModule,
      ],
    }).compileComponents();
  }));

  beforeEach(inject([DnbService], (DnbService: DnbService) => {
    const dnbPermissions = {
      userId: 1,
      authorities: [
        "ROLE_DNBADMIN",
        "ROLE_CPEA",
        "ROLE_CVPE",
        "ROLE_EBR",
        "ROLE_DNBA",
        "ROLE_DNBE",
        "ROLE_PO",
        "ROLE_CVPA",
        "ROLE_MD",
        "ROLE_TA",
        "ROLE_CVPAP",
        "ROLE_OTH",
        "ROLE_BSC",
        "ROLE_EA",
        "ROLE_CCA",
        "ROLE_CVPU",
        "DNB_READ_MIDRULE_TEMPLATE",
        "DNB_REASSIGN_APPROVER",
        "DNB_EDIT_MIDRULE_TEMPLATE",
        "DNB_READ_DRDS",
        "DNB_EDIT_DRDS",
        "DNB_REVIEW_APPROVE_DRD",
        "DNB_LIST_DRUGS",
        "DNB_DOWNLOAD_DRAFT_DRD",
        "DNB_REASSIGN_EDITOR",
        "DNB_DOWNLOAD_APPROVED_DRD",
      ],
      actions: [
        "DNB_READ_MIDRULE_TEMPLATE",
        "DNB_REASSIGN_APPROVER",
        "DNB_EDIT_MIDRULE_TEMPLATE",
        "DNB_READ_DRDS",
        "DNB_EDIT_DRDS",
        "DNB_REVIEW_APPROVE_DRD",
        "DNB_LIST_DRUGS",
        "DNB_DOWNLOAD_DRAFT_DRD",
        "DNB_REASSIGN_EDITOR",
        "DNB_DOWNLOAD_APPROVED_DRD",
      ],
    };
    storage = TestBed.get(StorageService);
    storage.set(storageGeneral.dnbPermissions, dnbPermissions, true);
    storage.set("userSession", { userId: 1 }, true);
    fixture = TestBed.createComponent(DrugVersionsListComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    ruleManagerService = TestBed.get(RuleManagerService);
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
    let dataEvent = {
      drugCode: "1",
      version: "1",
      reviewDt: "01/25/2021 09:18:22 PM UTC",
      editorUser: "",
      drugVersionCode: "1",
      approverUser: "",
      versionStatus: {
        code: drugVersionStatus.Draft.code,
        description: "Draft",
      },
    };

    const event = {
      row: dataEvent,
    };
    component.selectDrug(event);
    expect(spy).toHaveBeenCalled();
  });

  it("should navigate to create new version", () => {
    const spy = spyOn(router, "navigate");
    component.createNewVersion();
    expect(spy).toHaveBeenCalled();
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

  it("should call midrule service", () => {
    const spy = spyOn(
      ruleManagerService,
      "showRuleIdDetailsScreen"
    ).and.returnValue(of({}));
    const midrule = {
      event: "5",
      row: {
        midRules: [
          {
            ruleCode: "5",
            ruleId: "2",
          },
        ],
      },
    };
    component.openDetails(midrule);
    expect(spy).toHaveBeenCalled();
  });

  it("should get the ecl table content", () => {
    component.versionTable.value = versions;
    component.serviceCall({ action: Constants.ECL_TABLE_END_SERVICE_CALL });
    expect(component.versions).toBe(versions);
  });
});
