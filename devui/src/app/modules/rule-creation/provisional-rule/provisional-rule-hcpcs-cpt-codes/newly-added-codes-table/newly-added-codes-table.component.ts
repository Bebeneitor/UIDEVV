import { element } from 'protractor';
import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { Constants } from 'src/app/shared/models/constants';
import { ConfirmationService } from 'primeng/api';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { RuleInfo } from 'src/app/shared/models/rule-info';
import { ProcedureCodesService } from 'src/app/services/procedure-codes.service';
import { EclColumnStyleCondition, EclColumnStyles } from 'src/app/shared/components/ecl-table/model/ecl-column-style';
import { OverlayPanel } from 'primeng/primeng';
import { AppUtils } from 'src/app/shared/services/utils';
import { BaseResponse } from 'src/app/shared/models/base-response';

@Component({
  selector: 'app-newly-added-codes-table',
  templateUrl: './newly-added-codes-table.component.html',
  styleUrls: ['./newly-added-codes-table.component.css']
})
export class NewlyAddedCodesTableComponent implements OnInit {

  private _ruleInfo: RuleInfo;
  dateRanges;
  @Input() set ruleInfo(ruleInfo: RuleInfo) {
    if (ruleInfo) {
      this._ruleInfo = ruleInfo;
      this.loadHcpcsData();
    }
  }

  @Input() disableFields: boolean = true;

  private _radioVal: any;
  @Input() set selectedRadioValue(selected) {
    this._radioVal = selected;
    if (this._radioVal) {
      this.clearEdit();
    }
  }

  @Output() editableRowEvent: EventEmitter<any> = new EventEmitter();

  previousRowData: any = null;
  @ViewChild('procedureCodesTable',{static: true}) procedureCodesTable: EclTableComponent;
  tableConfig: EclTableModel;

  constructor(private procedureCodesService: ProcedureCodesService,
     private toastMessage: ToastMessageService,
     private confirmationService: ConfirmationService, private utilService: AppUtils) {
  }

  ngOnInit() {
    this.dateRanges = `${Constants.PR_CODE_MIN_VALID_YEAR}:${Constants.PR_CODE_MAX_VALID_YEAR}`;
    this.tableConfig = new EclTableModel;
    this.initializeTableConfig(this.tableConfig);
  }

  /**
   * This method is to initialize table config.
   *
   */
  private initializeTableConfig(table: EclTableModel) {
    let eclTableParameters = this.getTableParameters();
    table.lazy = true;
    table.checkBoxSelection = !this.disableFields;
    table.columns = eclTableParameters.getColumns();
    table.excelFileName = 'HCPCS/CPT';
    table.toolBar = { trashButton : !this.disableFields, recoveryButton: false };
  }

  loadHcpcsData() {
    if (this._ruleInfo && this._ruleInfo.ruleId) {
      this.tableConfig.url = `${RoutingConstants.PROC_CODES_URL}?ruleId=${this._ruleInfo.ruleId}`;
      this.clearEdit();
    } else {
      this.procedureCodesTable.loading = false;
    }
  }
  /**
   * This method is to get the table parameters.
   */
  private getTableParameters() {
    const alignment = 'center';
    let manager = new EclTableColumnManager();
    let stylesCodeFrom: EclColumnStyles[] = [
      new EclColumnStyles({ 'color': 'orange' }, new EclColumnStyleCondition('isCodeRangeFromRetired', '=', 'Y')),
    ];

    let stylesCodeTo: EclColumnStyles[] = [
      new EclColumnStyles({ 'color': 'orange' }, new EclColumnStyleCondition('isCodeRangeToRetired', '=', 'Y'))
    ];

    manager.addTextColumn('codeRangeFrom'   ,'HCPCS/CPT From'  ,'8%',  true, EclColumn.TEXT, true, 0, alignment, stylesCodeFrom, 'longDescCodeRangeFrom');
    manager.addTextColumn('codeRangeTo'     ,'HCPCS/CPT To'    ,'8%',  true, EclColumn.TEXT, true, 0, alignment, stylesCodeTo, 'longDescCodeRangeTo');
    manager.addOverlayPanelTextColumn('modifierJoiner'  ,'Modifier'        ,'8%',  true, EclColumn.TEXT, true, 12, alignment, null, true);

    manager.addTextColumn('daysLo'          ,'Days Lo'         ,'5.5%',true, EclColumn.TEXT, true, 0, alignment);
    manager.addTextColumn('daysHi'          ,'Days Hi'         ,'5.5%',true, EclColumn.TEXT, true, 0, alignment);
    manager.addTextColumn('dateFrom'        ,'Date From'       ,'10%', true, EclColumn.TEXT, true, 0, alignment);
    manager.addTextColumn('dateTo'          ,'Date To'         ,'10%', true, EclColumn.TEXT, true, 0, alignment);
    manager.addTextColumn('categoryDescFromRuleProc','Category','10%', true, EclColumn.TEXT, true, 0, alignment, null, 'categoryDescFromRuleProc');

    manager.addTextColumn('revenueCodeFrom','Revenue From','6%', true, EclColumn.TEXT, true, 0, alignment, null, 'revenueCodeDescFrom');
    manager.addTextColumn('revenueCodeTo','Revenue To','6%', true, EclColumn.TEXT, true, 0, alignment, null, 'revenueCodeDescTo');

    manager.addOverlayPanelTextColumn('posJoiner'  ,     'POS'        ,     '8%', true, EclColumn.TEXT, true, 12, alignment, null, true);
    manager.addMultiCheckIconIndictorColumn('bwDeny'    ,'B/W Deny', '5.5%', true, EclColumn.CHECK_MULTI_ICON_IND, true, 2, true);
    manager.addMultiCheckIconIndictorColumn('override'  ,'Override', '5.5%', true, EclColumn.CHECK_MULTI_ICON_IND, true, 2, true);
    manager.addMultiCheckIconIndictorColumn('icd', 'ICD','5.5%', true, EclColumn.CHECK_MULTI_ICON_IND, true, 2, true);

    return manager;
  }


  /**
   * This method is to select one row in ecl table.
   * @Param event
   */
  onRowSelect(event: any) {
    if (event != null && this._radioVal != null && !this.disableFields) {
      if (this.previousRowData) {
        this.previousRowData.action = null;
      }
      this.tableConfig.toolBar = {trashButton: !this.disableFields, recoveryButton: true};
      this.previousRowData = {...event[event.length -1]};
      this.editableRowEvent.emit({ data: {...this.utilService.removeMarkups(this.previousRowData)} });
    } else {
      this.tableConfig.toolBar = {trashButton: !this.disableFields, recoveryButton: false};
    }
  }

  /**
   * This method is to unselect one row in ecl table.
   * @Param event
   */
  onRowUnselect(event: any) {
    if (event && event.length) {
      this.previousRowData = Object.assign({}, event[event.length - 1]);
      this.tableConfig.toolBar = {trashButton: !this.disableFields, recoveryButton: true};
    } else {
      this.previousRowData = null;
      this.tableConfig.toolBar = {trashButton: !this.disableFields, recoveryButton: false};
    }
    this.editableRowEvent.emit({ data: {...this.utilService.removeMarkups(this.previousRowData)} });
  }

  /**
  * Method to show a confirmation dialog and remove the selected codes.
  * @Param event
  */
  deleteSelection(event: any) {
    if (!this.disableFields && event && event.length) {
      let codeIds: number[] = [];
      event.forEach(element => {
        codeIds.push(element.codeId);
      });
      this.confirmationService.confirm({
        message: Constants.ARE_YOU_WANT_TO_REMOVE_CODES,
        header: Constants.CONFIRM_DELETION,
        icon: 'pi pi-exclamation-triangle',
        key: 'confimDelete',
        accept: () => {
          this.procedureCodesService.deleteProcedureRule(codeIds).then(resolveData => {
            if (resolveData) {
              this.toastMessage.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, Constants.CPT_REMOVED_SUCCESSFULLY);
              this.clearEdit();
            }
          }).catch(rejectData => {
            this.toastMessage.messageError(Constants.TOAST_SUMMARY_ERROR, rejectData);
          });
        }
      });
    }
  }

  /**
   * Recovers the elements of the selection.
   */
  recoverSelection(event : any) {
    if(event && event.length) {
      let codeIds : number[] = [];
      event.forEach(element => {
        codeIds.push(element.codeId);
      });
      this.procedureCodesService.recoverCodes(this.utilService.removeMarkups(codeIds)).subscribe((response: BaseResponse) => {
        this.toastMessage.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, response.message);
        this.clearEdit();
      });
    }
  }

  /**
   * This method is to clean and uptable ecl-table
   *
   */
  clearEdit() {
    if (this.procedureCodesTable && (typeof this.procedureCodesTable.refreshTable === 'function')) {
      this.procedureCodesTable.resetDataTable();
    }
    this.editableRowEvent.emit({ data: null });
  }


  showOverlayPanel(event) {
    const overlaypanel: OverlayPanel = event.overlaypanel;
    const elementsToShow = this.utilService.getMarkups(event.row[event.field].toString());

    let arrDescription = [];
    elementsToShow.forEach((elementWithAddedDeleted: string) => {
      const isDeleted = elementWithAddedDeleted.includes('<deleted>') ? true : false;
      const isAdded = elementWithAddedDeleted.includes('<added>') ? true : false;

      let arrFields = this.utilService.onlyRemoveMarkups(elementWithAddedDeleted).split(',');

      arrFields.forEach(item => {

        if (isDeleted) {
          item = `<deleted>${item}</deleted>`;
        }
        if (isAdded) {
          item = `<added>${item}</added>`;
        }
        arrDescription.push({
          'description': this.utilService.getElementWithMarkups(item)
        });
      })

    });





    this.procedureCodesTable.popUpOverlayInfo = { data: arrDescription, isLink: false, isList: true };
    overlaypanel.toggle(event.overlayEvent);
  }
}
