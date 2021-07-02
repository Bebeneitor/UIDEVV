import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { Dialog } from "primeng/dialog";
import { ToastMessageService } from "src/app/services/toast-message.service";
import { EclTableComponent } from "src/app/shared/components/ecl-table/ecl-table.component";
import { EclColumn } from "src/app/shared/components/ecl-table/model/ecl-column";
import { EclTableColumnManager } from "src/app/shared/components/ecl-table/model/ecl-table-manager";
import { EclTableModel } from "src/app/shared/components/ecl-table/model/ecl-table-model";
import { environment } from "src/environments/environment";
import { MidRuleExisting } from "../../../models/interfaces/midRule";
import { apiMap, apiPath } from "../../../models/path/api-path.constant";
import { DnBMidrulesService } from "../../../services/dnb-midrules.service";
const BASE_URL = environment.restServiceDnBUrl;
@Component({
  selector: "app-mid-rules-exist",
  templateUrl: "./mid-rules-exist.component.html",
  styleUrls: ["./mid-rules-exist.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MidRulesExistComponent implements OnChanges, OnInit {
  @ViewChild("midRulesTable",{static: true}) midRulesTable: EclTableComponent;
  @ViewChild("dialog",{static: false}) dialog: Dialog;
  @Input() openDialog: boolean = false;
  @Output() openDialogChange: EventEmitter<boolean> = new EventEmitter();
  @Output() selectionSet: EventEmitter<any> = new EventEmitter();
  filter: { midRuleFilter: string; ruleLogicFilter: string } = {
    midRuleFilter: "",
    ruleLogicFilter: "",
  };
  url = `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.drugListByPage}`;

  midRule: MidRuleExisting = {
    engineId: "",
    midRule: "",
    midRuleVersion: "",
    eclRuleId: "",
    eclRuleCode: "",
    eclRuleName: "",
    eclRuleLogicOriginal: "",
    selected: false,
  };
  midRulesExistingECL: EclTableModel = new EclTableModel();
  disableAdd: boolean = true;
  constructor(
    private toastService: ToastMessageService,
    private midRuleService: DnBMidrulesService,
    private dc: ChangeDetectorRef
  ) {}

  ngOnChanges() {
    if (this.openDialog) {
      this.clearData();
    }
  }

  ngOnInit() {
    this.setUpTable();
  }

  dialogHidden() {
    this.clearData(true);
    this.openDialogChange.emit(false);
  }

  filterData() {
    if (this.validateData()) {
      this.loadData();
    }
  }

  loadData() {
    this.midRuleService
      .searchMidRuleExisting(this.filter)
      .subscribe((result: any) => {
        this.midRulesExistingECL.data = result;
        this.midRulesExistingECL.sortOrder = 1;
        this.midRulesExistingECL.sortBy = "midRule";
        this.midRulesTable.totalRecords = result.length;
        this.midRulesTable.value = result;
        this.clearData(false);
        this.dc.detectChanges();
        this.dialog.onWindowResize();
      });
  }

  selectedMidRule(event) {
    this.midRule = event.row;
    this.disableAdd = false;
  }

  validateData(): boolean {
    let validated: boolean = true;

    if (this.filter.midRuleFilter === null) {
      this.filter.midRuleFilter = "";
    }

    if (this.filter.ruleLogicFilter === null) {
      this.filter.ruleLogicFilter = "";
    }

    if (
      (this.filter.midRuleFilter.length < 4 &&
        this.filter.midRuleFilter.length > 0) ||
      (this.filter.ruleLogicFilter.length < 4 &&
        this.filter.ruleLogicFilter.length > 0)
    ) {
      this.toastService.messageWarning(
        "Warning!",
        `Search Filter must contain at least 4 alphanumeric values.`,
        6000,
        true
      );
      validated = false;
    }
    if (this.filter.midRuleFilter.length === 0) {
      this.filter.midRuleFilter = null;
    }

    if (this.filter.ruleLogicFilter.length === 0) {
      this.filter.ruleLogicFilter = null;
    }
    return validated;
  }

  addExistingMidRule() {
    this.selectionSet.emit(this.midRule);
    this.clearData();
    this.dialogHidden();
  }

  setUpTable(data: any = []) {
    const manager = new EclTableColumnManager();
    this.midRulesExistingECL = new EclTableModel();
    manager.addLinkColumn("midRule", "Mid Rule", "10%", false, null, true);
    manager.addTextColumn(
      "midRuleVersion",
      "Version",
      "20%",
      false,
      null,
      true
    );
    manager.addTextColumn("eclRuleId", "ECL Rule ID", "20%", false, null, true);

    manager.addTextColumn(
      "eclRuleName",
      "ECL Rule Name",
      "50%",
      false,
      null,
      true
    );

    this.midRulesExistingECL.columns = manager.getColumns();
    this.midRulesExistingECL.lazy = false;
    this.midRulesExistingECL.export = false;
    this.midRulesExistingECL.checkBoxSelection = false;
    this.midRulesExistingECL.filterGlobal = false;
    this.midRulesExistingECL.showPaginator = true;
    this.midRulesExistingECL.paginationSize = 10;
    this.midRulesExistingECL.data = data;
  }

  clearData(clearAll: boolean = true) {
    this.midRule = {
      engineId: "",
      midRule: "",
      midRuleVersion: "",
      eclRuleId: "",
      eclRuleCode: "",
      eclRuleName: "",
      eclRuleLogicOriginal: "",
      selected: false,
    };
    if (clearAll) {
      this.filter = { midRuleFilter: "", ruleLogicFilter: "" };
      this.midRulesExistingECL.data = [];
      this.midRulesTable.totalRecords = 0;
      this.midRulesTable.value = [];
      this.disableAdd = true;
    }
  }
}
