import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { StorageService } from "src/app/services/storage.service";
import { ToastMessageService } from "src/app/services/toast-message.service";
import { EclTableComponent } from "src/app/shared/components/ecl-table/ecl-table.component";
import { EclColumn } from "src/app/shared/components/ecl-table/model/ecl-column";
import { EclTableColumnManager } from "src/app/shared/components/ecl-table/model/ecl-table-manager";
import { EclTableModel } from "src/app/shared/components/ecl-table/model/ecl-table-model";
import { environment } from "src/environments/environment";
import {
  HeaderDialog,
  IconDialog,
} from "../../models/constants/dialogConfig.constants";
import { storageDrug } from "../../models/constants/storage.constants";
import {
  MidRule,
  MidRuleHistory,
  MidRuleSetUp,
} from "../../models/interfaces/midRule";
import { apiMap, apiPath } from "../../models/path/api-path.constant";
import { DnBMidrulesService } from "../../services/dnb-midrules.service";

const BASE_URL = environment.restServiceDnBUrl;
@Component({
  selector: "app-mid-rule-admin",
  templateUrl: "./mid-rule-admin.component.html",
  styleUrls: ["./mid-rule-admin.component.css"],
})
export class MidRuleAdminComponent implements OnInit {
  @ViewChild("rulesTable",{static: true}) rulesTable: EclTableComponent;
  tableConfig: EclTableModel;
  midRulesUrl: string = `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.midRulesAdmin}`;
  midRules: MidRule[] = [];
  midRuleSelected: MidRule = {
    midRuleTemplateId: 0,
    template: "",
    templateInformation: "",
    reasonCode: "",
  };

  midRuleSetUp: MidRuleSetUp = {
    headerDialog: "",
    midRuleTitle1: "Name",
    disableTitle1: false,
    requiredTitle1: true,
    midRuleText1: "Information",
    disableText1: false,
    requiredText1: true,
    midRuleText2: "Reason Code",
    disableText2: false,
    requiredText2: true,
    showButton1: true,
    textButton1: "Save",
    showButton2: true,
    textButton2: "Cancel",
    showLockedBy: false,
    saveMessage: "Are you sure you want to save?",
  };

  openMidRuleEdit: boolean = false;
  openMidRuleHistory: boolean = false;
  history: MidRuleHistory[];
  constructor(
    private midRuleService: DnBMidrulesService,
    private toastService: ToastMessageService,
    private confirmationService: ConfirmationService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.setUpTable();
    this.loadData(this.midRulesUrl);
  }

  setUpTable() {
    const manager = new EclTableColumnManager();
    this.tableConfig = new EclTableModel();
    const url = `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.midRulesAdmin}`;

    manager.addSimpleTextColumn(
      "template",
      "Template",
      "28%",
      true,
      EclColumn.TEXT,
      true
    );
    manager.addSimpleTextColumn(
      "templateInformation",
      "Template Information",
      "28%",
      true,
      EclColumn.TEXT,
      true
    );
    manager.addSimpleTextColumn(
      "reasonCode",
      "Reason Code",
      "28%",
      true,
      EclColumn.TEXT,
      true
    );

    manager.addIconColumn("edit", "Edit", "5%", "fa fa-edit");

    manager.addSwitch("status", "Status", "5%");

    manager.addIconColumn("history", "History", "6%", "fa fa-search");

    this.tableConfig.columns = manager.getColumns();
    this.tableConfig.export = false;
    this.tableConfig.lazy = true;
    this.tableConfig.storageFilterKey = storageDrug.midRulesAdmin;
    this.tableConfig.showRecords = true;
    this.tableConfig.paginationSize = 10;
    this.tableConfig.isFullURL = true;
  }

  actionIcon(event: any) {
    switch (event.field) {
      case "edit":
        this.editMidRule(event.row);
        break;
      case "history":
        this.checkHistory(event.row);
        break;
      default:
        break;
    }
  }

  loadData(url: string) {
    return new Promise((resolve, reject) => {
      this.tableConfig.criteriaFilters = null;
      this.tableConfig.url = url;
      this.tableConfig.sortBy = "template";
      resolve(true);
    });
  }

  editMidRule(event: MidRule) {
    this.midRuleService
      .lockMidRule(event.midRuleTemplateId)
      .subscribe(() => {});

    this.midRuleSetUp.headerDialog = "Edit Mid Rule";
    this.midRuleSetUp.textButton1 = "Update";
    this.midRuleSelected = {
      midRuleTemplateId: event.midRuleTemplateId,
      template: event.template,
      templateInformation: event.templateInformation,
      reasonCode: event.reasonCode,
      lockDetail: event.lockDetail,
    };
    this.openMidRuleEdit = true;
  }

  createNewTemplate() {
    this.midRuleSelected = {
      midRuleTemplateId: 0,
      template: "",
      templateInformation: "",
      reasonCode: "",
      lockDetail: { locked: false, lockedBy: "" },
    };
    this.midRuleSetUp.headerDialog = "New Mid Rule";
    this.midRuleSetUp.textButton1 = "Save";
    this.openMidRuleEdit = true;
  }

  saveMidRule(event) {
    if (this.midRuleSetUp.textButton1 === "Save") {
      this.confirmationService.confirm({
        message: "Are you sure you want to save?",
        header: HeaderDialog.confirm,
        key: "midruleconfirm",
        icon: IconDialog.question,
        accept: () => {
          this.midRuleService
            .addMidRules(this.midRuleSelected)
            .subscribe(() => {
              this.openMidRuleEdit = false;
              this.loadData(this.midRulesUrl);
              this.toastService.messageSuccess(
                "Success!",
                `Template saved successfully.`,
                6000,
                true
              );
            });
        },
      });
    } else if (this.midRuleSetUp.textButton1 === "Update") {
      this.confirmationService.confirm({
        message: "Are you sure you want to update?",
        header: HeaderDialog.confirm,
        key: "midruleconfirm",
        icon: IconDialog.question,
        accept: () => {
          this.midRuleService
            .updateMidRules(this.midRuleSelected)
            .subscribe(() => {
              this.openMidRuleEdit = false;
              this.loadData(this.midRulesUrl);
              this.toastService.messageSuccess(
                "Success!",
                `Template updated successfully.`,
                6000,
                true
              );
            });
        },
      });
    }
  }

  changeStatus(event) {
    const switchEvent = event.event;
    const midR = event.midRow;
    const isActive = switchEvent.checked;
    const midRule: MidRule = {
      ...midR,
      template: "",
      templateInformation: "",
      reasonCode: "",
    };
    this.confirmationService.confirm({
      message: "Are you sure you want to change the status?",
      header: HeaderDialog.confirm,
      key: "midruleconfirm",
      icon: IconDialog.question,
      accept: () => {
        this.midRuleService.updateStatusMidRules(midRule).subscribe(() => {
          this.toastService.messageSuccess(
            "Success!",
            `Status updated successfully.`,
            6000,
            true
          );
        });
      },
      reject: () => {
        midR.isActive = !isActive;
      },
    });
  }

  unlockMidRule() {
    this.midRuleService
      .unlockMidRule(this.midRuleSelected.midRuleTemplateId)
      .subscribe(() => {});
  }

  checkHistory(midRuleSelected: MidRule) {
    this.midRuleSelected = {
      ...midRuleSelected,
    };
    this.openMidRuleHistory = true;
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    this.storageService.remove(storageDrug.midRulesAdmin);
  }
}
