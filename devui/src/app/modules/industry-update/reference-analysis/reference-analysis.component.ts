import { Component, Input, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { flatMap } from 'rxjs/operators';
import { DashboardService } from 'src/app/services/dashboard.service';
import { EclLookupsService } from 'src/app/services/ecl-lookups.service';
import { SameSimService } from 'src/app/services/same-sim.service';
import { Constants } from 'src/app/shared/models/constants';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';
import { RuleManagerService } from '../rule-process/services/rule-manager.service';

@Component({
  selector: 'app-reference-analysis',
  templateUrl: './reference-analysis.component.html',
  styleUrls: ['./reference-analysis.component.css']
})
export class ReferenceAnalysisComponent implements OnInit {
  @Input() editMode;
  @Input() instanceId;
  frozenCols = [
    { field: 'ruleCode', header: 'Rule ID' }, { field: 'ruleName', header: 'Rule Name' },
    { field: 'ruleLogic', header: 'Rule Logic' }, { field: 'logicEffectiveDate', header: 'Effective Date' }
  ];

  nameReport;
  dateReport;
  cols = [];
  eclFileId;
  fileName;
  selectedColumns;
  data;

  constructor(public config: DynamicDialogConfig, public ref: DynamicDialogRef,
    private lookupService: EclLookupsService, private sameSimService: SameSimService,
    private dashboardService: DashboardService, private fileManagerService: FileManagerService,
    private ruleManagerService: RuleManagerService) { }

  /**
   * When the component is created.
   */
  ngOnInit() {
    // If we get the instance id from the modal config object we set editMode true.
    if (this.config && this.config.data) {
      this.instanceId = this.config.data.instanceId;
      this.editMode = true;
    }

    // If there is no instance id then throw error.
    if (!this.instanceId) {
      throw new Error(`${Constants.MOST_PROVIDE_INPUT_PROPERTY}instanceId`);
    }

    // Gets the lookup types then we geth the instance id detail.
    this.lookupService.searchNoPromise(Constants.SAME_SIM_LOOKUP_TYPE, Constants.EMPTY_STRING, Constants.EMPTY_STRING, 0, 100, true).pipe(flatMap((response: any) => {
      const elements = response.map(ele => { return { field: ele.lookupDesc, header: ele.lookupDesc + ' Codes Implemented' } });
      this.cols = [...elements];
      this.selectedColumns = this.cols;

      return this.sameSimService.getDetail(this.instanceId, response);
    })).subscribe((response) => {
      this.data = response.data.sameSimInstanceDetailList;
      this.eclFileId = response.data.sameSimInstance.fileId;
      this.fileName = response.data.sameSimInstance.fileName;
      this.nameReport = response.data.sameSimInstance.instanceName;
      this.dateReport = this.dashboardService.parseDate(response.data.sameSimInstance.creationDt);
    }, error => {
      this.ref.close();
    });
  }

  /**
   * Redirect to detail page
   * @param ruleId 
   * @param type 
   */
  redirect(ruleId, type) {
    this.ruleManagerService.showRuleDetailsScreen(ruleId, true);
  }

  /**
   * Download same sim file (xlsx)
   * @param eclFileId 
   */
  download() {
    this.fileManagerService.downloadFile(this.eclFileId).subscribe(response => {
      this.fileManagerService.createDownloadFileElement(response, this.fileName);
    });
  }
}
