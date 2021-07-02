import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Dropdown } from "primeng/primeng";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { StorageService } from "src/app/services/storage.service";
import { ToastMessageService } from "src/app/services/toast-message.service";
import { EclTableComponent } from "src/app/shared/components/ecl-table/ecl-table.component";
import { EclColumn } from "src/app/shared/components/ecl-table/model/ecl-column";
import { EclTableColumnManager } from "src/app/shared/components/ecl-table/model/ecl-table-manager";
import { EclTableModel } from "src/app/shared/components/ecl-table/model/ecl-table-model";
import { environment } from "src/environments/environment";
import { dnbCodes } from "../../../models/constants/actionCodes.constants";
import { DnBRoutes } from "../../../models/constants/dnb-routes.constants";
import { drugVersionStatus } from "../../../models/constants/drug.constants";
import { Messages } from "../../../models/constants/messages.constants";
import { storageDrug } from "../../../models/constants/storage.constants";
import {
  DrugVersionsInProcessResponse,
  ReAssignPayload,
} from "../../../models/interfaces/drugversion";
import { apiMap, apiPath } from "../../../models/path/api-path.constant";
import { DnbRoleAuthService } from "../../../services/dnb-role-auth.service";
import { DnbService } from "../../../services/dnb.service";
import { filterCurrentrUser } from "../../../utils/tools.utils";

const BASE_URL = environment.restServiceDnBUrl;
interface UserOption {
  label: string;
  value: number;
}
@Component({
  selector: "app-in-review",
  templateUrl: "./in-review.component.html",
  styleUrls: ["./in-review.component.css"],
})
export class InReviewComponent implements OnInit {
  @ViewChild("versionTable",{static: false}) versionTable: EclTableComponent;
  @ViewChild("dropList",{static: false}) dropList: Dropdown;
  drugsInReviewProcessConfig: EclTableModel = null;
  selectedApprover: string = null;
  approvers$: Observable<UserOption[]>;
  selectedApproverVersions: DrugVersionsInProcessResponse[] = [];
  currentUser = null;
  approverSelected: number = null;
  drugsSelected: any = [];
  isEditor: boolean = true;
  isApprover: boolean = true;
  isAdmin: boolean = true;
  constructor(
    private roleAuthService: DnbRoleAuthService,
    private storageService: StorageService,
    private dnbService: DnbService,
    private router: Router,
    private toastService: ToastMessageService
  ) {
    this.isEditor = this.roleAuthService.isAuthorizedRole("ROLE_DNBE");
    this.isApprover = this.roleAuthService.isAuthorizedRole("ROLE_DNBA");
    this.isAdmin = this.roleAuthService.isAuthorizedRole("ROLE_DNBADMIN");
    this.currentUser = this.storageService.get("userSession", true);
  }

  ngOnInit() {
    this.drugsInReviewProcessConfig = new EclTableModel();
    this.initializeTableConfig(this.drugsInReviewProcessConfig);
    this.getUsers();
  }

  initializeTableConfig(table: EclTableModel) {
    if (this.isApprover && !this.isEditor && !this.isAdmin) {
      table.url = `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.documents}${apiPath.approvalProcess}${apiPath.DNBA}${apiPath.inReview}`;
    } else if ((this.isApprover && this.isEditor) || this.isAdmin) {
      table.url = `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.documents}${apiPath.approvalProcess}${apiPath.DNBEA}${apiPath.inReview}`;
    }
    table.isFullURL = true;
    table.columns = this.setUpTable();
    table.lazy = false;
    table.sortOrder = 1;
    table.sortBy = "drugName";
    table.export = false;
    table.checkBoxSelection = false;
    table.filterGlobal = true;
    table.storageFilterKey = storageDrug.filterInReview;
    table.checkBoxSelection = true;
    table.checkBoxSelectAll = true;
  }

  setUpTable() {
    let manager = new EclTableColumnManager();
    manager.addTextColumn(
      "drugName",
      "Drug Name",
      null,
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
      "approvedBy.userName",
      "Approver",
      null,
      true,
      EclColumn.TEXT,
      true
    );

    manager.addTextColumn(
      "daysOld",
      "Days Old",
      "13%",
      true,
      EclColumn.TEXT,
      true,
      null,
      "center"
    );

    manager.addDateColumn(
      "reviewDt",
      "Date",
      "13%",
      true,
      true,
      null,
      null,
      EclColumn.DATE_TIME_ZONE,
      null,
      new Date()
    );

    manager.addIconColumn("view", "View", "13%", "fa fa-eye");

    return manager.getColumns();
  }

  iconColumAction(event) {
    this.viewDrugVersion(event, {
      editingMode: false,
      showButtons: false,
    });
  }

  viewDrugVersion(rowSelected, editingMode) {
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
            editingMode,
            true
          );
          this.router.navigate([DnBRoutes.newVersion]);
        });
    } else {
      this.storageService.set(
        storageDrug.newDrugEditingMode,
        editingMode,
        true
      );
      this.router.navigate([DnBRoutes.newDrug]);
    }
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler() {
    this.storageService.remove(storageDrug.filterInReview);
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

  reassignApproverSelected() {
    let message = "";
    if (this.selectedApproverVersions.length === 0) {
      message = "Please select the Drug(s) to be reassigned";
    }
    if (this.selectedApprover === null) {
      message = "Please select the the user to be assigned";
    }
    if (message !== "") {
      this.toastService.messageWarning("Warning!", message, 6000, true);
      return;
    }
    const payloadReassing: ReAssignPayload = {
      userId: this.approverSelected,
      drugList: this.drugsSelected,
    };
    this.isAdmin
      ? this.reassingDrugsApproverEditor(payloadReassing)
      : this.reassingDrugsApprover(payloadReassing);

    this.dropList.filterValue = null;
  }

  reassingDrugsApproverEditor(payloadReassing) {
    this.dnbService
      .reassignAdminToApprover(payloadReassing)
      .subscribe((result) => {
        this.toastService.messageSuccess(
          "Success!",
          "The reassign was successful.",
          6000,
          true
        );
        if (result.details && result.details.length > 0) {
          this.toastService.messageWarning(
            "Warning!",
            result.details,
            6000,
            true
          );
        }
        this.versionTable.loadData(null);
        this.removeDrugsSelected();
        this.selectedApprover = null;
        this.drugsSelected = [];
      });
  }

  reassingDrugsApprover(payloadReassing) {
    this.dnbService.reassignApprover(payloadReassing).subscribe((result) => {
      this.toastService.messageSuccess(
        "Success!",
        "The reassign was successful.",
        6000,
        true
      );
      if (result.details && result.details.length > 0) {
        this.toastService.messageWarning(
          "Warning!",
          result.details,
          6000,
          true
        );
      }
      this.versionTable.loadData(null);
      this.removeDrugsSelected();
      this.selectedApprover = null;
      this.drugsSelected = [];
    });
  }

  removeDrugsSelected() {
    this.selectedApproverVersions.forEach((element) => {
      this.versionTable.removeRecords(element);
    });
    this.setSelectedApprover();
  }

  reassignSelectedApprover(event: any) {
    this.approverSelected = event.value;
    this.selectedApproverVersions.forEach((element) => {
      this.drugsSelected.push(element.drugCode);
    });
  }

  setSelectedApprover(rows: DrugVersionsInProcessResponse[] = []) {
    this.selectedApproverVersions = rows;
  }

  getUsers(): void {
    this.approvers$ = this.dnbService
      .getListUsersApprovers()
      .pipe(map((response) => filterCurrentrUser(response, this.currentUser)));
  }
}
