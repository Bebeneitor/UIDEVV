import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Component, Input } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import {
  OktaAuthModule,
  OktaAuthService,
  OKTA_CONFIG,
} from "@okta/okta-angular";
import { NgxPermissionsModule } from "ngx-permissions";
import { MessageService } from "primeng/api";
import { StorageService } from "src/app/services/storage.service";
import { storageGeneral } from "../../models/constants/storage.constants";
import { DnbRoleAuthService } from "../../services/dnb-role-auth.service";
import { DnbService } from "../../services/dnb.service";
import { SelectDrugComponent } from "./select-drug.component";

@Component({ selector: "ecl-table", template: "" })
class ECLTableStubComponent {
  @Input() tableModel: any;
  totalRecords: number = 0;
  loadData = () => {};
}

@Component({ selector: "dnb-app-topic-mapping", template: "" })
class topicStubComponent {
  @Input() openDialog: boolean;
  @Input() ellTopic: string;
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
@Component({ selector: "app-dnb-breadcrumb", template: "" })
class DnBBreadCrumbStubComponent {}

fdescribe("SelectDrugComponent", () => {
  let component: SelectDrugComponent;
  let fixture: ComponentFixture<SelectDrugComponent>;
  let router: Router;
  let storage: StorageService;
  const oktaConfig = {
    issuer: "https://not-real.okta.com",
    clientId: "fake-client-id",
    redirectUri: "http://localhost:4200",
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SelectDrugComponent,
        ECLTableStubComponent,
        FilterListStubComponent,
        DialogStubComponent,
        topicStubComponent,
        DnBBreadCrumbStubComponent,
      ],
      providers: [
        DnbService,
        DnbRoleAuthService,
        MessageService,
        StorageService,
        OktaAuthService,
        { provide: OKTA_CONFIG, useValue: oktaConfig },
      ],
      imports: [
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        NgxPermissionsModule.forRoot(),
        OktaAuthModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
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
        version: "1",
      },
    };
    component.selectDrug(event);
    expect(spy).toHaveBeenCalled();
  });

  it("should navigate to create new drug", () => {
    const spy = spyOn(router, "navigate");
    component.createNewDrug();
    expect(spy).toHaveBeenCalled();
  });

  it("should filter the table", () => {
    const spy = spyOn(component, "updateResults");
    const url = "newurl";
    component.filter(url);
    expect(spy).toHaveBeenCalled();
  });

  it("should filter the table", () => {
    const spy = spyOn(component, "navigateWebCrawling");
    component.actionIcon({ field: "referencesCompare", row: { name: "" } });
    expect(spy).toHaveBeenCalled();
  });

  it("should open ell dialog", () => {
    const spy = spyOn(component, "navigateWebCrawling");
    component.actionIcon({
      field: "ellMapping",
      row: { name: "", drugCode: "", version: "", ellTopicName: "" },
    });
    expect(component.openEllMapping).toBe(true);
  });
});
