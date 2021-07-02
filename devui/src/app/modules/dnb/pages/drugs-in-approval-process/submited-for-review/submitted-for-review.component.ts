import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { dnbCodes } from "src/app/modules/dnb/models/constants/actionCodes.constants";
import {
  HeaderDialog,
  IconDialog,
} from "src/app/modules/dnb/models/constants/dialogConfig.constants";
import { DnBRoutes } from "src/app/modules/dnb/models/constants/dnb-routes.constants";
import { drugVersionStatus } from "src/app/modules/dnb/models/constants/drug.constants";
import { Messages } from "src/app/modules/dnb/models/constants/messages.constants";
import {
  apiMap,
  apiPath,
} from "src/app/modules/dnb/models/path/api-path.constant";
import { DnbRoleAuthService } from "src/app/modules/dnb/services/dnb-role-auth.service";
import { DnbService } from "src/app/modules/dnb/services/dnb.service";
import { StorageService } from "src/app/services/storage.service";
import { EclTableComponent } from "src/app/shared/components/ecl-table/ecl-table.component";
import { EclColumn } from "src/app/shared/components/ecl-table/model/ecl-column";
import { EclTableColumnManager } from "src/app/shared/components/ecl-table/model/ecl-table-manager";
import { EclTableModel } from "src/app/shared/components/ecl-table/model/ecl-table-model";
import { environment } from "src/environments/environment";
import { storageDrug } from "../../../models/constants/storage.constants";
const BASE_URL = environment.restServiceDnBUrl;
@Component({
  selector: "app-submitted-for-review",
  templateUrl: "./submitted-for-review.component.html",
  styleUrls: ["./submitted-for-review.component.css"],
})
export class SubmittedForReviewComponent implements OnInit {
  @ViewChild("submittedTable",{static: false}) submittedTable: EclTableComponent;
  objEclTableModel: EclTableModel = new EclTableModel();
  submittedReviewApproverUrl: string = `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.documents}${apiPath.approvalProcess}${apiPath.DNBA}${apiPath.submittedForReview}`;
  submittedReviewEditorUrl: string = `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.documents}${apiPath.approvalProcess}${apiPath.DNBE}${apiPath.submittedForReview}`;
  submittedReviewAdminUrl: string = `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.documents}${apiPath.approvalProcess}${apiPath.DNBADMIN}${apiPath.submittedForReview}`;
  isAdmin: boolean = true;
  isEditor: boolean = true;
  isApprover: boolean = true;
  constructor(
    private router: Router,
    private storageService: StorageService,
    private dnbService: DnbService,
    private roleAuthService: DnbRoleAuthService,
    private confirmationService: ConfirmationService
  ) {
    this.isAdmin = this.roleAuthService.isAuthorizedRole("ROLE_DNBADMIN");
    this.isEditor = this.roleAuthService.isAuthorizedRole("ROLE_DNBE");
    this.isApprover = this.roleAuthService.isAuthorizedRole("ROLE_DNBA");
  }

  ngOnInit() {
    this.setUpTable();
  }

  setUpTable() {
    const manager = new EclTableColumnManager();
    this.objEclTableModel = new EclTableModel();
    manager.addTextColumn(
      "drugName",
      "Drug Name",
      "20%",
      true,
      EclColumn.TEXT,
      true
    );
    manager.addTextColumn(
      "submittedBy.userName",
      "Submited By",
      "20%",
      true,
      EclColumn.TEXT,
      true
    );
    manager.addTextColumn(
      "daysOld",
      "Days Old",
      "20%",
      true,
      EclColumn.TEXT,
      true,
      null,
      "center"
    );

    manager.addDateColumn(
      "reviewDt",
      "Date",
      "20%",
      true,
      true,
      null,
      null,
      EclColumn.DATE_TIME_ZONE,
      null,
      new Date()
    );

    if (this.isApprover) {
      manager.addIconColumn("review", "Review", "13%", "fa fa-pencil-square-o");
    }

    manager.addIconColumn("view", "View", "13%", "fa fa-eye");

    this.objEclTableModel.columns = manager.getColumns();
    this.objEclTableModel.lazy = false;
    this.objEclTableModel.export = false;
    this.objEclTableModel.checkBoxSelection = false;
    this.objEclTableModel.filterGlobal = true;
    this.objEclTableModel.showPaginator = true;
    this.objEclTableModel.paginationSize = 10;
    this.objEclTableModel.isFullURL = true;
    this.objEclTableModel.storageFilterKey = storageDrug.filterInSubmitted;
    if ((this.isApprover && this.isEditor) || this.isAdmin) {
      this.objEclTableModel.url = this.submittedReviewAdminUrl;
    } else if (this.isEditor) {
      this.objEclTableModel.url = this.submittedReviewEditorUrl;
    } else if (this.isApprover) {
      this.objEclTableModel.url = this.submittedReviewApproverUrl;
    }
  }

  iconColumAction(event) {
    switch (event.field) {
      case "review":
        this.confirmReviewDrugVersion(event);
        break;
      case "view":
        this.viewDrugVersion(event, {
          editingMode: false,
          showButtons: false,
        });
        break;
      default:
        break;
    }
  }

  viewDrugVersion(rowSelected, edditingMode) {
    if (
      !this.roleAuthService.isAuthorized(
        dnbCodes.LIST_DRUGS,
        Messages.guardMessageNoAllowed
      )
    ) {
      return;
    }

    const drugCode: string = rowSelected.row.drugCode;

    this.storageService.set(
      storageDrug.drugName,
      rowSelected.row.drugName,
      false
    );
    this.storageService.set(storageDrug.drugCode, drugCode, false);

    const versionId = rowSelected.row.drugVersionCode;
    const versionStatus = rowSelected.row.versionStatus.code;
    const versionStatusDescription = rowSelected.row.versionStatus.description;

    this.storageService.set(
      storageDrug.drugVersion,
      { versionId, versionStatus, versionStatusDescription },
      true
    );

    if (rowSelected.row.majorVersion > 0) {
      this.dnbService
        .getDrugVersionsList(drugCode, this.getPayload())
        .subscribe((response: any) => {
          const approvedVersions = response.dtoList
            .filter(
              (version) =>
                version.versionStatus.code == drugVersionStatus.Approved.code
            )
            .sort((versionA, versionB) => {
              return versionA.majorVersion > versionB.majorVersion ? -1 : 1;
            });

          let approvedVersion = approvedVersions[0];
          const approvedVersionId = approvedVersion.drugVersionCode;
          const approvedVersionStatus = approvedVersion.versionStatus.code;
          const approvedVersionMajorVersion = approvedVersion.majorVersion;

          this.storageService.set(
            storageDrug.approvedDrugVersion,
            {
              versionId: approvedVersionId,
              versionStatus: approvedVersionStatus,
            },
            true
          );

          this.storageService.set(
            storageDrug.majorVersion,
            approvedVersionMajorVersion,
            false
          );
          this.storageService.set(
            storageDrug.newVersionEditingMode,
            edditingMode,
            true
          );
          this.router.navigate([DnBRoutes.newVersion]);
        });
    } else {
      this.storageService.set(
        storageDrug.newDrugEditingMode,
        edditingMode,
        true
      );
      this.router.navigate([DnBRoutes.newDrug]);
    }
  }

  reviewDrugVersion(event) {
    this.dnbService
      .claimDrugVersion(event.row.drugVersionCode)
      .subscribe((response) => {
        this.viewDrugVersion(event, {
          editingMode: false,
          showButtons: true,
          approvalMode: true,
        });
      });
  }

  confirmReviewDrugVersion(event) {
    this.confirmationService.confirm({
      message: "Are you sure you want to review this Drug version?",
      header: HeaderDialog.confirm,
      icon: IconDialog.question,
      key: "forreview",
      accept: () => {
        this.reviewDrugVersion(event);
      },
      reject: () => {},
    });
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler() {
    this.storageService.remove(storageDrug.filterInSubmitted);
  }

  getPayload(): any {
    return {
      columns: [
        "majorVersion",
        "versionStatus.description",
        "midRules?midRule",
        "midRules?ruleCode",
        "midRules?ruleId",
        "reviewDt",
        "",
        "",
      ],
      pagination: null,
      globalFilter: null,
      sorting: [],
      filters: [],
      criteriaFilters: null,
    };
  }
}
