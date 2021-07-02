import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from "@angular/core";
import { Dialog } from "primeng/dialog";
import { EclColumn } from "src/app/shared/components/ecl-table/model/ecl-column";
import { EclTableColumnManager } from "src/app/shared/components/ecl-table/model/ecl-table-manager";
import { EclTableModel } from "src/app/shared/components/ecl-table/model/ecl-table-model";
import { Constants } from "src/app/shared/models/constants";
import { environment } from "src/environments/environment";
import { apiMap, apiPath } from "../../../models/path/api-path.constant";
const BASE_URL = environment.restServiceDnBUrl;

@Component({
  selector: "app-mid-rule-history",
  templateUrl: "./mid-rule-history.component.html",
  styleUrls: ["./mid-rule-history.component.css"],
})
export class MidRuleHistoryComponent implements OnChanges {
  tableConfig: EclTableModel;
  @Input() midRuleId: number = null;
  @Input() openDialog: boolean = false;
  @Output() openDialogChange: EventEmitter<boolean> = new EventEmitter();
  @ViewChild("dialog",{static: false}) dialog: Dialog;

  ngOnChanges() {
    if (this.openDialog) {
      this.loadData();
    }
  }

  loadData() {
    const manager = new EclTableColumnManager();
    this.tableConfig = new EclTableModel();
    const url = `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.midRulesTemplates}/${this.midRuleId}/history`;

    manager.addTextColumn(
      "field",
      "Field",
      "20%",
      false,
      EclColumn.TEXT,
      false
    );

    manager.addTextColumn(
      "originalValue",
      "Original Value",
      "20%",
      false,
      EclColumn.TEXT,
      false
    );

    manager.addTextColumn(
      "newValue",
      "New Value",
      "20%",
      false,
      EclColumn.TEXT,
      false
    );

    manager.addTextColumn(
      "updatedBy",
      "Updated By",
      "20%",
      false,
      EclColumn.TEXT,
      false
    );

    manager.addDateColumn(
      "updatedOn",
      "Updated On",
      "20%",
      false,
      false,
      "date",
      "MM/dd/yyyy hh:mm a"
    );

    this.tableConfig.columns = manager.getColumns();
    this.tableConfig.export = false;
    this.tableConfig.lazy = true;
    this.tableConfig.showRecords = true;
    this.tableConfig.paginationSize = 10;
    this.tableConfig.isFullURL = true;
    this.tableConfig.filterGlobal = false;
    this.tableConfig.url = url;
  }

  dialogHidden() {
    this.openDialogChange.emit(false);
  }

  serviceCall(event) {
    if (event.action !== Constants.ECL_TABLE_END_SERVICE_CALL) {
      return;
    }
    setTimeout(() => {
      this.dialog.center();
    });
  }
}
