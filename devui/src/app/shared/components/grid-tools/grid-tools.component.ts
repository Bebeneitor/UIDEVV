import { Component, Input } from '@angular/core';
import { Table } from 'primeng/table';
import { ExcelService } from 'src/app/services/excel.service';
import { PrintService } from 'src/app/services/print.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';

/**
 * @author Jeffrey King
 * @author Jose Fuente
 */
const EXCEL = 'excel';

@Component({
  selector: 'app-grid-tools',
  templateUrl: './grid-tools.component.html',
  styleUrls: ['./grid-tools.component.css']
})
export class GridToolsComponent {

  @Input() primeTableLocalReference: Table;
  @Input() columnsToExport: string[] = [];
  @Input() pageTitle: string;
  @Input() ref: boolean;

  constructor(private excelService: ExcelService, private printService: PrintService, private toast: ToastMessageService) { }

  /**
   * ExportData function will grab information and do the null checking
   * @param type determines if Excel or Print
   */
  exportData(type: string) {
    let source = this.primeTableLocalReference.value,
      filter = this.primeTableLocalReference.filteredValue,
      select = this.primeTableLocalReference.selection,
      trimPageTitle = this.pageTitle.replace(/\s/g, ''),
      columns = this.primeTableLocalReference.columns;
    if (this.nullCheck(source)) {
      type === EXCEL
        ? this.excelService.exportAsExcelFile(this.checkSourceValues(source, filter, select), trimPageTitle, columns, this.columnsToExport)
        : this.printService.ReceivePrint(this.checkSourceValues(source, filter, select), this.pageTitle, columns, this.ref);
    } else {
      this.toast.messageWarning('No Data', 'Data Table is Empty', 3000, false);
    }
  }

  /**
   * Checking and override of 'source'
   * @param source Main Data.
   * @param filter Override source if exist.
   * @param select Override both 'source' & 'filter' if exist.
   */
  private checkSourceValues(source, filter, select) {
    this.nullCheck(filter) ? source = filter : source;
    this.nullCheck(select) ? source = select : source;
    return source;
  }

  private nullCheck(array) {
    return (array !== undefined && array !== null && array.length > 0)
  }

}
