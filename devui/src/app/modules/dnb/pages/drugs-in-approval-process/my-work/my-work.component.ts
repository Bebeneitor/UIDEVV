import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
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
import {
  HeaderDialog,
  IconDialog,
} from "../../../models/constants/dialogConfig.constants";
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
  selector: "app-my-work",
  templateUrl: "./my-work.component.html",
  styleUrls: ["./my-work.component.css"],
})
export class MyWorkComponent implements OnInit {
  @ViewChild("editorTable",{static: false}) editorTable: EclTableComponent;
  @ViewChild("approverTable",{static: false}) approverTable: EclTableComponent;
  @ViewChild("dropListEditor",{static: false}) dropListEditor: Dropdown;
  @ViewChild("dropListApprover",{static: false}) dropListApprover: Dropdown;
  dnbCodes = dnbCodes;
  myWorkEditorConfig: EclTableModel = null;
  myWorkApproverConfig: EclTableModel = null;
  selectedEditor: string = null;
  selectedApprover: string = null;
  editors$: Observable<UserOption[]>;
  approvers$: Observable<UserOption[]>;
  selectedEditorVersions: DrugVersionsInProcessResponse[] = [];
  selectedApproverVersions: DrugVersionsInProcessResponse[] = [];
  isEditor: boolean = true;
  isApprover: boolean = true;
  isAdmin: boolean = true;
  currentUser = null;
  constructor(
    private router: Router,
    private storageService: StorageService,
    private dnbService: DnbService,
    private roleAuthService: DnbRoleAuthService,
    private confirmationService: ConfirmationService,
    private toastService: ToastMessageService
  ) {
    this.isEditor = this.roleAuthService.isAuthorizedRole("ROLE_DNBE");
    this.isApprover = this.roleAuthService.isAuthorizedRole("ROLE_DNBA");
    this.isAdmin = this.roleAuthService.isAuthorizedRole("ROLE_DNBADMIN");
    this.currentUser = this.storageService.get("userSession", true);
  }

  ngOnInit() {
    this.myWorkEditorConfig = new EclTableModel();
    this.initializeTableConfig(this.myWorkEditorConfig, true);
    this.myWorkApproverConfig = new EclTableModel();
    this.initializeTableConfig(this.myWorkApproverConfig, false);
    this.getUsers();
  }

  setSelectedEditor(rows: DrugVersionsInProcessResponse[]) {
    this.selectedEditorVersions = rows;
  }

  setSelectedApprover(rows: DrugVersionsInProcessResponse[]) {
    this.selectedApproverVersions = rows;
  }

  initializeTableConfig(table: EclTableModel, isEditor: boolean) {
    table.url = isEditor
      ? `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.documents}${apiPath.approvalProcess}${apiPath.DNBE}${apiPath.myWork}`
      : `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.documents}${apiPath.approvalProcess}${apiPath.DNBA}${apiPath.myWork}`;
    table.isFullURL = true;
    table.columns = this.initializeTableColumns(isEditor);
    table.lazy = false;
    table.customSort = true;
    table.sortOrder = 1;
    table.sortBy = "drugName";
    table.export = false;
    table.checkBoxSelection = false;
    table.filterGlobal = true;
    table.storageFilterKey = isEditor
      ? storageDrug.filterMyWorkEditor
      : storageDrug.filterMyWorkApprover;
    table.checkBoxSelection = true;
    table.checkBoxSelectAll = true;
  }

  initializeTableColumns(isEditor: boolean): EclColumn[] {
    let manager = new EclTableColumnManager();
    manager.addTextColumn(
      "drugName",
      "Drug Name",
      null,
      true,
      EclColumn.TEXT,
      true
    );

    if (!isEditor) {
      manager.addTextColumn(
        "submittedBy.userName",
        "Submitted By",
        null,
        true,
        EclColumn.TEXT,
        true
      );
    }

    if (isEditor) {
      manager.addTextColumn(
        "versionStatus.description",
        "Status",
        null,
        true,
        EclColumn.TEXT,
        true
      );

      manager.addTextWithCounter(
        "approvedBy.userName",
        "Approver",
        null,
        true,
        EclColumn.TEXT,
        true
      );
    }

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

    if (isEditor) {
      manager.addTextColumn(
        "completionPercentage",
        "Percentage Completed",
        "13%",
        true,
        EclColumn.TEXT,
        true,
        null,
        "center"
      );
    }

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

    let checkVisible = null;
    if (isEditor) {
      checkVisible = (row: DrugVersionsInProcessResponse) => {
        return (
          row.versionStatus &&
          row.versionStatus.code !== drugVersionStatus.inReview.code
        );
      };
    }
    if (!isEditor) {
      checkVisible = (row: DrugVersionsInProcessResponse) => {
        return this.isApprover;
      };
    }

    if (isEditor && (this.isEditor || (this.isEditor && !this.isAdmin))) {
      manager.addIconColumn(
        "edit",
        "Edit",
        "13%",
        "fa fa-pencil-square-o",
        [],
        checkVisible
      );
    }
    if (!isEditor && (this.isApprover || (this.isApprover && !this.isAdmin))) {
      manager.addIconColumn(
        "edit",
        "Review",
        "13%",
        "fa fa-pencil-square-o",
        [],
        checkVisible
      );
    }
    return manager.getColumns();
  }

  versionEditClick({ row }: { row: DrugVersionsInProcessResponse }) {
    const status = row.versionStatus.code;
    switch (status) {
      case drugVersionStatus.submitedReview.code: {
        this.confirmationService.confirm({
          message: "Are you sure you want to reclaim this drug version",
          key: "mywork",
          header: HeaderDialog.confirm,
          icon: IconDialog.question,
          accept: () => {
            const drugCode: string = row.drugCode;
            this.dnbService.reclaimDrugVersion(drugCode).subscribe(() => {
              this.editVersion(row, true, false);
            });
          },
        });
        break;
      }
      case drugVersionStatus.InProgress.code: {
        this.editVersion(row, true, false);
        break;
      }
      case drugVersionStatus.inReview.code: {
        this.editVersion(row, false, true);
        break;
      }
    }
  }

  editVersion(
    row: DrugVersionsInProcessResponse,
    isEditable: boolean,
    isAprovalMode: boolean
  ) {
    if (
      !this.roleAuthService.isAuthorized(
        dnbCodes.LIST_DRUGS,
        Messages.guardMessageNoAllowed
      )
    ) {
      return;
    }
    const drugCode: string = row.drugCode;
    this.storageService.set(storageDrug.drugDate, row.reviewDt, false);
    this.storageService.set(storageDrug.drugName, row.drugName, false);
    this.storageService.set(storageDrug.drugCode, drugCode, false);
    const versionId = row.drugVersionCode;
    const versionStatus = drugVersionStatus.InProgress.code;
    const versionStatusDescription = drugVersionStatus.InProgress.description;

    this.storageService.set(
      storageDrug.drugVersion,
      { versionId, versionStatus, versionStatusDescription },
      true
    );
    if (row.majorVersion > 0) {
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
              editingMode: isEditable,
              showButtons: isEditable || isAprovalMode,
              approvalMode: isAprovalMode,
            },
            true
          );
          this.router.navigate([DnBRoutes.newVersion]);
        });
    } else {
      this.storageService.set(
        storageDrug.newDrugEditingMode,
        {
          editingMode: isEditable,
          showButtons: isEditable || isAprovalMode,
          approvalMode: isAprovalMode,
        },
        true
      );
      this.router.navigate([DnBRoutes.newDrug]);
    }
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
    this.dnbService.reassignEditor(reAssignPayload).subscribe((result) => {
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
      this.dropListEditor.filterValue = null;
    });
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
    const reAssignPayload: ReAssignPayload = {
      drugList: this.selectedApproverVersions.map(
        (version) => version.drugCode
      ),
      userId: +this.selectedApprover,
    };
    this.dnbService.reassignApprover(reAssignPayload).subscribe((result) => {
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

      this.approverTable.loadData(null);
      this.approverTable.savedSelRecords = [];
      this.approverTable.selectedRecords = [];
      this.selectedApproverVersions = [];
      this.selectedApprover = null;
      this.dropListApprover.filterValue = null;
    });
  }

  getUsers(): void {
    if (this.isEditor || this.isAdmin) {
      this.editors$ = this.dnbService
        .getListUsersEditors()
        .pipe(
          map((response) => filterCurrentrUser(response, this.currentUser))
        );
    }
    if (this.isApprover || this.isAdmin) {
      this.approvers$ = this.dnbService
        .getListUsersApprovers()
        .pipe(
          map((response) => filterCurrentrUser(response, this.currentUser))
        );
    }
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler() {
    this.storageService.remove(storageDrug.filterMyWorkEditor);
    this.storageService.remove(storageDrug.filterMyWorkApprover);
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
