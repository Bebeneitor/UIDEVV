import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Component } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import {
  OktaAuthModule,
  OktaAuthService,
  OKTA_CONFIG,
} from "@okta/okta-angular";
import { MessageService } from "primeng/api";
import { ConfirmDialogModule } from "primeng/primeng";
import { TabViewModule } from "primeng/tabview";
import { StorageService } from "src/app/services/storage.service";
import { storageGeneral } from "../../models/constants/storage.constants";
import { DnbRoleAuthService } from "../../services/dnb-role-auth.service";
import { DnbService } from "../../services/dnb.service";
import { DrugsInApprovalProcessComponent } from "./drugs-in-approval-process.component";
@Component({ selector: "app-my-work", template: "" })
class MyWorkStubComponent {
  editorTable = {
    loadData() {},
  };
  approverTable = {
    loadData() {},
  };
}

@Component({ selector: "app-in-progress", template: "" })
class InProgressStubComponent {
  editorTable = {
    loadData() {},
  };
}

@Component({
  selector: "app-submitted-for-review",
  template: "",
})
class SubmittedForReviewStubComponent {
  submittedTable = {
    loadData() {},
  };
}

@Component({ selector: "app-in-review", template: "" })
class InReviewStubComponent {
  versionTable = {
    loadData() {},
  };
}

@Component({ selector: "app-dnb-breadcrumb", template: "" })
class DnBBreadCrumbStubComponent {}

fdescribe("DrugsInApprovalProcessComponent", () => {
  let component: DrugsInApprovalProcessComponent;
  let fixture: ComponentFixture<DrugsInApprovalProcessComponent>;
  let storage: StorageService;
  const oktaConfig = {
    issuer: "https://not-real.okta.com",
    clientId: "fake-client-id",
    redirectUri: "http://localhost:4200",
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DrugsInApprovalProcessComponent,
        MyWorkStubComponent,
        InProgressStubComponent,
        SubmittedForReviewStubComponent,
        InReviewStubComponent,
        DnBBreadCrumbStubComponent,
      ],
      providers: [
        DnbService,
        StorageService,
        DnbRoleAuthService,
        MessageService,
        OktaAuthService,
        { provide: OKTA_CONFIG, useValue: oktaConfig },
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        TabViewModule,
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
    fixture = TestBed.createComponent(DrugsInApprovalProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should reload page", () => {
    const submittedSpy = spyOn(
      component.submittedForReview.submittedTable,
      "loadData"
    );
    const reviewSpy = spyOn(component.inReview.versionTable, "loadData");
    const myWorkSpy = spyOn(component.myWork.editorTable, "loadData");
    const myWorkSpy2 = spyOn(component.myWork.approverTable, "loadData");
    const inProgressSpy = spyOn(component.inProgress.editorTable, "loadData");
    component.reloadData({ index: 0 });
    component.reloadData({ index: 1 });
    component.reloadData({ index: 2 });
    component.reloadData({ index: 3 });
    expect(submittedSpy).toHaveBeenCalled();
    expect(reviewSpy).toHaveBeenCalled();
    expect(myWorkSpy).toHaveBeenCalled();
    expect(myWorkSpy2).toHaveBeenCalled();
    expect(inProgressSpy).toHaveBeenCalled();
  });
});
