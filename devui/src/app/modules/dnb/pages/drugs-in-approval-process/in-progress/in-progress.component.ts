import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { EclTableColumnManager } from "src/app/shared/components/ecl-table/model/ecl-table-manager";
import { EclTableModel } from "src/app/shared/components/ecl-table/model/ecl-table-model";
import { environment } from "src/environments/environment";
import { apiMap, apiPath } from "../../../models/path/api-path.constant";
import { EclColumn } from "../../../../../shared/components/ecl-table/model/ecl-column";
import { Router } from "@angular/router";
import { StorageService } from "src/app/services/storage.service";
import { DnbService } from "../../../services/dnb.service";
import { DnbRoleAuthService } from "../../../services/dnb-role-auth.service";
import { storageDrug } from "../../../models/constants/storage.constants";
import { drugVersionStatus } from "../../../models/constants/drug.constants";
import { DnBRoutes } from "../../../models/constants/dnb-routes.constants";
import { dnbCodes } from "../../../models/constants/actionCodes.constants";
import { Messages } from "../../../models/constants/messages.constants";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { filterCurrentrUser } from "../../../utils/tools.utils";
import {
  DrugVersionsInProcessResponse,
  ReAssignPayload,
} from "../../../models/interfaces/drugversion";
import { ToastMessageService } from "src/app/services/toast-message.service";
import { EclTableComponent } from "src/app/shared/components/ecl-table/ecl-table.component";
import { Dropdown } from "primeng/primeng";
const BASE_URL = environment.restServiceDnBUrl;
interface UserOption {
  label: string;
  value: number;
}
@Component({
  selector: "app-in-progress",
  templateUrl: "./in-progress.component.html",
  styleUrls: ["./in-progress.component.css"],
})
export class InProgressComponent implements OnInit {
  @ViewChild("editorTable",{static: false}) editorTable: EclTableComponent;
  @ViewChild("dropList",{static: false}) dropList: Dropdown;
  objEclTableModel: EclTableModel = new EclTableModel();
  inProgressUrl: string = `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.documents}${apiPath.approvalProcess}${apiPath.DNBE}${apiPath.tabInProgress}`;
  inProgressAdminUrl: string = `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.documents}${apiPath.approvalProcess}${apiPath.DNBEDNBA}${apiPath.tabInProgress}`;
  selectedEditor: string = null;
  selectedEditorVersions: DrugVersionsInProcessResponse[] = [];
  editors$: Observable<UserOption[]>;
  currentUser = null;
  isAdmin: boolean = true;
  isEditor: boolean = true;
  isApprover: boolean = true;
  constructor(
    private router: Router,
    private storageService: StorageService,
    private dnbService: DnbService,
    private roleAuthService: DnbRoleAuthService,
    private toastService: ToastMessageService
  ) {
    this.isAdmin = this.roleAuthService.isAuthorizedRole("ROLE_DNBADMIN");
    this.isEditor = this.roleAuthService.isAuthorizedRole("ROLE_DNBE");
    this.isApprover = this.roleAuthService.isAuthorizedRole("ROLE_DNBA");
    this.currentUser = this.storageService.get("userSession", true);
  }

  ngOnInit() {
    this.setUpTable();
    this.getUsers();
  }

  getUsers(): void {
    if (this.isAdmin || (this.isEditor && this.isApprover)) {
      this.editors$ = this.dnbService
        .getListUsersEditors()
        .pipe(
          map((response) => filterCurrentrUser(response, this.currentUser))
        );
    }
  }

  setSelectedEditor(rows: DrugVersionsInProcessResponse[]) {
    this.selectedEditorVersions = rows;
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
      "approvedBy.userName",
      "Approver",
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

    manager.addTextColumn(
      "completionPercentage",
      "Percentage Completed",
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

    manager.addIconColumn("view", "View", "13%", "fa fa-eye");

    this.objEclTableModel.columns = manager.getColumns();
    this.objEclTableModel.lazy = false;
    this.objEclTableModel.export = false;
    this.objEclTableModel.customSort = true;
    this.objEclTableModel.checkBoxSelection = false;
    this.objEclTableModel.filterGlobal = true;
    this.objEclTableModel.showPaginator = true;
    this.objEclTableModel.paginationSize = 10;
    this.objEclTableModel.storageFilterKey = storageDrug.filterInProgress;
    this.objEclTableModel.isFullURL = true;
    if (this.isAdmin || (this.isEditor && this.isApprover)) {
      this.objEclTableModel.url = this.inProgressAdminUrl;
    } else if (this.isEditor) {
      this.objEclTableModel.url = this.inProgressUrl;
    }

    if (this.isAdmin || (this.isEditor && this.isApprover)) {
      this.objEclTableModel.checkBoxSelection = true;
      this.objEclTableModel.checkBoxSelectAll = true;
    }
  }

  navigateToEditScreen(rowSelected) {
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
            {
              editingMode: false,
              showButtons: false,
            },
            true
          );
          this.router.navigate([DnBRoutes.newVersion]);
        });
    } else {
      this.storageService.set(
        storageDrug.newDrugEditingMode,
        {
          editingMode: false,
          showButtons: false,
        },
        true
      );
      this.router.navigate([DnBRoutes.newDrug]);
    }
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler() {
    this.storageService.remove(storageDrug.filterInProgress);
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

  reassignEditorSelected() {
    let message = "";
    if (this.selectedEditorVersions.length === 0) {
      message = "Please select the Drug(s) to be reassigned";
    }
    if (this.selectedEditor === null) {
      message = "Please select the the user to be assigned";
    }
    if (message !== "") {
      this.toastService.messageWarning("Warning!", message, 6000, true);
      return;
    }
    const reAssignPayload: ReAssignPayload = {
      drugList: [
        ...this.selectedEditorVersions.map((version) => version.drugCode),
      ],
      userId: +this.selectedEditor,
    };
    this.dnbService
      .reassignAdminToEditor(reAssignPayload)
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

        this.editorTable.loadData(null);
        this.editorTable.savedSelRecords = [];
        this.editorTable.selectedRecords = [];
        this.selectedEditorVersions = [];
        this.selectedEditor = null;
        this.dropList.filterValue = null;
      });
  }
}
