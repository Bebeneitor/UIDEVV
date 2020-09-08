import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/api";
import { TableDetailDto } from 'src/app/shared/models/dto/table-detail-dto';
import { JsPdfService } from 'src/app/services/js-pdf.service';

@Component({
  selector: 'app-sub-rule-detail',
  templateUrl: './sub-rule-detail.component.html',
  styleUrls: ['./sub-rule-detail.component.css']
})
export class SubRuleDetailComponent implements OnInit {

  header             : String;
  tableDetailDto     : TableDetailDto[];
  pdfFileName        : String;
  
  constructor(public config: DynamicDialogConfig, public ref: DynamicDialogRef, private jsPdfService: JsPdfService) {                
  }

  ngOnInit() {    
    this.header = this.config.data.header;   
    this.pdfFileName = this.config.data.pdfFileName;  
    this.tableDetailDto = this.config.data.tableDetailDto;  
  } 

  exportPdf() {
    this.jsPdfService.exportToPdf(this.header, this.pdfFileName);
  }

}