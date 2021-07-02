import {Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core'
import { InitiateImpactService } from 'src/app/services/initiate-impact-service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { PreImpactAnalysisDto } from 'src/app/shared/models/dto/pre-impact-analysis-dto';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';

@Component( {
    selector: 'app-impact-bo-report',
    templateUrl: './impact-bo-report.component.html',
    styleUrls: ['./impact-bo-report.component.css']
})

export class ImpactBoReportComponent implements OnInit, OnDestroy {
    @ViewChild('fileInput',{static: true}) fileInputElement: ElementRef;
    @ViewChild('viewTable',{static: true}) viewTable:EclTableComponent;

    @Output() onRuleDetails = new EventEmitter<any>();
    @Output() onInitiateImpact = new EventEmitter<any>();

    validFileExtenstions = ['xlsx', 'xls'];

    preview: boolean = false;
    file: File = null;
    tableConfig: EclTableModel = new EclTableModel();
    selectedRules: any[] = [];
    preImpactAnalysisDto: PreImpactAnalysisDto = new PreImpactAnalysisDto();
    disableInitiateBtn = true;
  
    
    constructor(private toastService:ToastMessageService, private impactService: InitiateImpactService,
        ) {
    }

    ngOnInit(): void {
        this.initTableConfig();
    }

    initTableConfig() {
        this.tableConfig.columns = this.initTableColumns();
        this.tableConfig.lazy = true;
        this.tableConfig.checkBoxRestriction = true;
        this.tableConfig.sortOrder = 1;
        this.tableConfig.excelFileName = 'Initiate Impact Analysis - BO';
        this.tableConfig.checkBoxSelection = true;
        this.tableConfig.checkBoxSelectAll = true;
        this.tableConfig.scrollable = true;
        this.tableConfig.horizontalScrollable = true;
        this.tableConfig.verticalScrollable = false;
        this.tableConfig.scrollHeight = '30px';
    }
    initTableColumns(): EclColumn[] {
        let manager = new EclTableColumnManager();
        manager.addTextColumn('triggerType', 'Trigger Type', '70px', true, EclColumn.TEXT, true);
        manager.addTextColumn('decisionPointKey', 'Decision Point Key', '60px', true, EclColumn.TEXT, true);
        manager.addTextColumn('decisionPointDesc', 'Decision Point Desc', '150px', true, EclColumn.TEXT, true, 50,null,null,'decisionPointDesc');
        manager.addLinkColumn("ruleCode", "Rule ID", '100px', true, EclColumn.TEXT, true);
        manager.addTextColumn('midRule', 'Mid Rule', '100px', true, EclColumn.TEXT, true);
        manager.addTextColumn('ruleVersion', 'Rule Version', '50px', true, EclColumn.TEXT, true);
        manager.addTextColumn('payerList', 'Payer List', '150px', true, EclColumn.TEXT, true, 50);
        manager.addTextColumn('libraryStatus', 'Library Status', '75px', true, EclColumn.TEXT, true);
        manager.addTextColumn('medicalPolicy', 'Medical Policy', '150px', true, EclColumn.TEXT, true);
        manager.addTextColumn('subruleDescription', 'Sub Rule Desc', '250px', true, EclColumn.TEXT, true, 100);
        manager.addTextColumn('subruleNotes', 'Sub Rule Notes', '250px', true, EclColumn.TEXT, true, 100);
        manager.addTextColumn('subruleScript', 'Sub Rule Script', '250px', true, EclColumn.TEXT, true, 100);
        manager.addTextColumn('subruleRationale', 'Sub Rule Rationale', '250px', true, EclColumn.TEXT, true, 100);
        manager.addTextColumn('triggerDesc', 'Trigger Description', '150px', true, EclColumn.TEXT, true, 100);
        manager.addTextColumn('deactivatedYn', 'Deactivated','80px', true, EclColumn.TEXT, true);
        manager.addTextColumn('reference', 'Reference', '150px', true, EclColumn.TEXT, true,100);
        manager.addTextColumn('ruleImpactStatus', 'Review Status', '100px', false, EclColumn.TEXT, true,100);
        manager.addTextColumn('firstName', 'Assigned To', '100px', true, EclColumn.TEXT, false,100);
    
        return manager.getColumns();
    }

    fileChange(newFile: FileList):void {
        if (this.validateFileExtension(newFile[0])) {
            this.file = newFile[0];
        } else {
            this.clear();
            this.toastService.messageError('Error', 'The file format must be .xls or .xlsx');
        }
    }

    validateFileExtension(file: File):boolean {
        const fileExtension = this.getFileExtension(file);
        return (this.validFileExtenstions.indexOf(fileExtension) >= 0);
    }

    getFileExtension(file:File): string {
        return file.name.split('.').pop().toLowerCase();
    }

    showPreview(): void {
        this.preview = false;
        this.viewTable.resetDataTable();
        if (this.preImpactAnalysisDto.preImpactAnalysisId > 0) {
            this.impactService.deletePreImpact(this.preImpactAnalysisDto.preImpactAnalysisId)
            .subscribe(() => {});
        }
        this.impactService.registerPreImpactAnalysis(this.file)
        .subscribe(response => {
            if (response.data) {
                this.preImpactAnalysisDto = response.data;
                this.preview = true;
                this.showRecords();
            }
        });
    }

    showRecords(clearSelected:boolean = false) {
        if (clearSelected) {
            this.selectedRules = [];
            this.viewTable.selectedRecords = [];
            this.viewTable.savedSelRecords = [];
        }
        if (this.preImpactAnalysisDto && this.preImpactAnalysisDto.preImpactAnalysisId > 0) {
            this.tableConfig.criteriaFilters = this.preImpactAnalysisDto;
            this.tableConfig.url = 
            `${RoutingConstants.PRE_IMPACT_ANALYSIS}/${RoutingConstants.SEARCH}`;
            this.viewTable.loadData(null);
        }
    }

    setSelectRules(event: any) {
        this.selectedRules = this.viewTable.selectedRecords.filter(r => !r.checkBoxDisabled);
        this.disableInitiateBtn = this.selectedRules.length == 0;
      }
    
    clear() : void {
        this.preview = false;
        this.file = null;
        this.fileInputElement.nativeElement.value = ''
    }

    onActionLink(rowEvent: any) {
        this.onRuleDetails.emit(rowEvent);
    }

    initateImpact() {
        this.onInitiateImpact.emit(this.selectedRules);
    }

    ngOnDestroy(): void {
        if (this.preImpactAnalysisDto.preImpactAnalysisId > 0) {
            this.impactService.deletePreImpact(this.preImpactAnalysisDto.preImpactAnalysisId)
            .subscribe(()=>{})
        }
    }
}