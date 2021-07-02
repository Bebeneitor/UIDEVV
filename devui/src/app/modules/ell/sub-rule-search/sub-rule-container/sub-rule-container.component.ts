import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { DialogService } from 'primeng/api';
import { SubRuleDetailComponent } from '../sub-rule-detail/sub-rule-detail.component';
import { SubRuleTableInfoService } from 'src/app/services/sub-rule-table-info.service';
import { EllSearchDto } from 'src/app/shared/models/dto/ell-search-dto';

@Component({
  selector: 'app-sub-rule-container',
  templateUrl: './sub-rule-container.component.html'
})
export class SubRuleContainerComponent implements OnInit {

  @Input('currentOption') currentOption: string;
  @ViewChild('localTableConf',{static: true}) localTableConf: EclTableComponent;
  localTable : EclTableModel;
  pdfTitle : string;

  constructor(private ellSubRuleTableInfo : SubRuleTableInfoService,private dialogService: DialogService) {}

  ngOnInit() {      
    this.localTable=this.ellSubRuleTableInfo.getTableInfo(this.currentOption);
    this.pdfTitle = this.localTable.excelFileName;
  }

  /**
   * This method is for show the result search.
   * @param ellSearchDto.
   */
  showResultSearch(ellSearchDto: EllSearchDto) {    
    this.localTable=this.ellSubRuleTableInfo.getTableInfo(this.currentOption,ellSearchDto); 
    setTimeout(()=>{
      this.localTableConf.refreshTable();    
    }, 1000); 
  }

  /**
  * This method is used to show Rule detail modal.
  *
  * @param $event.
  */
  viewRuleDetailModal(rowData: any) {
    const ref = this.dialogService.open(SubRuleDetailComponent, {

      data: {
        header: this.pdfTitle,
        tableDetailDto: this.ellSubRuleTableInfo.getDataForDetail(rowData,this.currentOption),
        pdfFileName: this.pdfTitle+' Detail',
        visibleCloseButton: false
      }
      ,
      header: this.pdfTitle+' Detail',
      width: '60%',
      contentStyle: {
        'padding-top': '20px',
        'padding-bottom': '40px',
        'border': 'none',
        'max-height' : '500px',
        'min-height' : '200px',
        'overflow-x' : 'hidden',
        'overflow-y' : 'auto'
      }

    });

  }

}
