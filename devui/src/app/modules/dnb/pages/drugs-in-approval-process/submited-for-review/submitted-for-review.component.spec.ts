import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Component, Input } from "@angular/core";
import {
  async,
  ComponentFixture,
  inject,
  TestBed,
} from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ConfirmationService, MessageService } from "primeng/api";
import { ConfirmDialogModule } from "primeng/primeng";
import { of } from "rxjs";
import { StorageService } from "src/app/services/storage.service";
import { drugVersionStatus } from "../../../models/constants/drug.constants";
import {
  storageDrug,
  storageGeneral,
} from "../../../models/constants/storage.constants";
import { DrugVersionsInProcessResponse } from "../../../models/interfaces/drugversion";
import { DnbRoleAuthService } from "../../../services/dnb-role-auth.service";
import { DnbService } from "../../../services/dnb.service";
import { SubmittedForReviewComponent } from "./submitted-for-review.component";
import {
  OKTA_CONFIG,
  OktaAuthService,
  OktaAuthModule,
} from "@okta/okta-angular";
const mockDrugVersions = {
  dtoList: [
    {
      versionStatus: {
        code: drugVersionStatus.Approved.code,
      },
      majorVersion: 3,
    },
    {
      versionStatus: {
        code: drugVersionStatus.Approved.code,
      },
      majorVersion: 2,
    },
  ],
};

@Component({ selector: "ecl-table", template: "" })
class ECLTableStubComponent {
  @Input() tableModel: any;
  totalRecords: number = 0;
  loadData: (value) => {};
}

fdescribe("SubmittedForReviewComponent", () => {
  let component: SubmittedForReviewComponent;
  let fixture: ComponentFixture<SubmittedForReviewComponent>;
  let storage: StorageService;
  let router: Router;

  const item: DrugVersionsInProcessResponse = {
    drugCode: "555",
    drugName: "some drug",
    drugVersionCode: "1",
    minorVersion: 0,
    majorVersion: 3,
    revVersion: 0,
    reviewDt: "",
    versionStatus: drugVersionStatus.InProgress,
    daysOld: 0,
    submittedBy: { userId: 0, userName: "", firstName: "" },
    completionPercentage: "",
  };
  const oktaConfig = {
    issuer: "https://not-real.okta.com",
    clientId: "fake-client-id",
    redirectUri: "http://localhost:4200",
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubmittedForReviewComponent, ECLTableStubComponent],
      providers: [
        DnbService,
        StorageService,
        DnbRoleAuthService,
        MessageService,
        ConfirmationService,
        OktaAuthService,
        { provide: OKTA_CONFIG, useValue: oktaConfig },
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        ConfirmDialogModule,
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
    storage.set("userSession", { userId: 1 }, true);
    fixture = TestBed.createComponent(SubmittedForReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([DnbService], (DnbService: DnbService) => {
    spyOn(DnbService, "getDrugVersionsList").and.returnValue(
      of(mockDrugVersions)
    );

    fixture = TestBed.createComponent(SubmittedForReviewComponent);
    component = fixture.componentInstance;
    storage = TestBed.get(StorageService);
    router = TestBed.get(Router);
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should navigate to new version", () => {
    const item: any = {
      row: {
        drugCode: "555",
        drugName: "some drug",
        drugVersionCode: "1",
        minorVersion: 0,
        majorVersion: 3,
        revVersion: 0,
        reviewDt: "",
        versionStatus: { code: "", description: "" },
        daysOld: 0,
        submittedBy: { userId: 0, userName: "", firstName: "" },
        completionPercentage: "",
      },
    };

    component.iconColumAction(item);
    const version = storage.get(storageDrug.drugVersion, true);
    const approvedmajorv = storage.get(storageDrug.majorVersion, false);
    expect(version.versionId).toBe(item.row.drugVersionCode);
    expect(approvedmajorv).toBe("3");
  });

  it("should view a drug version", () => {
    const spy = spyOn(router, "navigate");
    const editingMode = {
      editingMode: false,
      showButtons: false,
    };
    component.viewDrugVersion({ row: item }, editingMode);

    const version = storage.get(storageDrug.drugVersion, true);
    const approvedmajorv = storage.get(storageDrug.majorVersion, false);
    expect(version.versionId).toBe(item.drugVersionCode);
    expect(approvedmajorv).toBe("3");
    expect(spy).toHaveBeenCalled();
  });
});
