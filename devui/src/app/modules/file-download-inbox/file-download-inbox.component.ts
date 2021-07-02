import { OnInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { environment } from 'src/environments/environment';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { FileDownloadInboxService } from './file-download-inbox.service';
import { FileManagerService} from 'src/app/shared/services/file-manager.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';

@Component({
    selector: 'file-download-inbox',
    templateUrl: './file-download-inbox.component.html',
    styleUrls: ['./file-download-inbox.component.css']
})
export class FileDownloadInboxComponent implements OnInit{
    @ViewChild('fileInboxTable',{static: true}) fileInboxTable: EclTableComponent;

    fileInboxTableModel: EclTableModel;

    blocked: boolean = false;
    blockedMessage = '';
    title = 'Downloads';

    constructor(private activatedRoute: ActivatedRoute, private router: Router, 
        private fileInboxService : FileDownloadInboxService,
        private fileManagerService: FileManagerService,
         private messageService: ToastMessageService) { }
    
    ngOnInit(): void {
        this.fileInboxTableModelInit();
    }
    
    fileInboxTableModelInit(){
        this.fileInboxTableModel = new EclTableModel();
        let manager = new EclTableColumnManager();

        manager.addTextColumn("fileName", "File Name", '20%', false, EclColumn.TEXT, true);
        manager.addTextColumn("failureReason", "Failure Reason", '12%', false, EclColumn.TEXT, true);
        manager.addTextColumn('userName', 'Created By', '13%', false, EclColumn.TEXT, true);
        manager.addDateColumn('creationDt', 'Creation Date', '15%', false, true, 'date', 'MM/dd/yyyy hh:mm:ss aa');
        manager.addTextColumn('processName', 'Creator Process', '13%', false, EclColumn.TEXT, true);
        manager.addTextColumn('processStatus', 'Status', '13%', false, EclColumn.TEXT, true);
        manager.addIconColumn('download', 'Download', '6%', 'fa fa-download');
        manager.addIconColumn('tags', 'Tags', '4%', 'fa fa-tags');
        manager.addIconColumn('delete', 'Delete', '4%', 'fa fa-trash');

        this.fileInboxTableModel.lazy = true;
        this.fileInboxTableModel.url = `${RoutingConstants.FILE_MANAGER_URL}/${RoutingConstants.FILE_INBOX}`
        this.fileInboxTableModel.columns = manager.getColumns();
        this.fileInboxTableModel.export = false;
        this.fileInboxTableModel.filterGlobal = false;
        this.fileInboxTableModel.showPaginatorOptions = true;
        this.fileInboxTableModel.showPaginator = true;
    }

    onClickActions(event){
        const {row, field} = event;
        switch(field){
            case 'download':
                if(row.fileId && row.fileId !== 0)
                    this.downloadFile(row);
                break;
            case 'tags':
                break;
            case 'delete':
                this.deleteFile(row);
                break;
        }
        
    }

    downloadFile(row){
        this.fileManagerService.downloadFile(row.fileId).subscribe(response => {
            this.fileManagerService.createDownloadFileElement(response, row.fileName);
            this.messageService.messageSuccess('Info', 'File downloaded.');
            this.toggleUiBlock(false);
          }, this.responseErrorCallBack);
    }

    deleteFile(row){
        this.fileInboxService.markAsDeleted(row.fileInboxId).subscribe((response: any) => {
            if(response.code == 200){
                this.messageService.messageSuccess('Info', 'File Deleted');
                this.refreshTable();
            } else {
                this.messageService.messageError('Error', 'Error at file deletion');
            }
        });
    }
    /**
     * Unlocks the screen every time there is a response error.
     * @param error that the request throws.
     */
    responseErrorCallBack = (error) => {
        this.toggleUiBlock(false);
    }
    /**
     * Toggle the ui component block.
     * @param blocked boolean that indicates if the ui will bi blocked or not.
     * @param message for the blocked ui.
     */
    toggleUiBlock(blocked: boolean, message?: string) {
        this.blocked = blocked;
        this.blockedMessage = message;
    }

    refreshTable(){
        this.fileInboxTable.refreshTable();
    }
}