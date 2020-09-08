import {Component, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, SortEvent} from 'primeng/api';
import {AppUtils} from '../../shared/services/utils';
import {ExcelService} from '../../services/excel.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {StorageService} from '../../services/storage.service';
import {ECLConstantsService} from '../../services/ecl-constants.service';
import {ReferenceDataAcquisitionService} from '../../services/reference-data-acquisition.service';
import {FileInfoDto} from '../../shared/models/dto/file-info-dto';
import {FileTypeDetailsDto} from '../../shared/models/dto/file-type-details-dto';
import {DatePipe} from '@angular/common';

const DEFAULT_COLOR = '#007AD9';
const CHANGED_COLOR = '#4E3586';
const CURRENT_FILE_NAME = 'currentFileName';
const NEW_FILE_NAME = 'newFileName';
const DELTA_FILE_NAME = 'deltaFileName';

@Component({
  selector: 'app-reference-data-acquisition',
  templateUrl: './reference-data-acquisition.component.html',
  styleUrls: ['./reference-data-acquisition.component.css'],
  providers: [ConfirmationService]
})
export class ReferenceDataAcquisitionComponent implements OnInit {

  @ViewChild('viewGrid') viewGrid: any;
  cols: any[];
  data: any[] = [];
  selectedData: any[] = [];
  filteredData: FileInfoDto[];
  ruleStatus: number;
  pageTitle: string;
  keywordSearch: string;
  userId: number;
  Message: string;
  loading: boolean;
  columnsToExport: any[] = [];
  rdaFileLogInfo: FileInfoDto[];
  referenceSources: FileTypeDetailsDto[];
  referenceTypes: any[];
  frequencies: any[];
  selectedFrequency: string;
  selectedReferenceSource: string;
  progressValue: number = 0;
  loadingData: boolean = false;
  downloadBarCompleted: boolean = false;
  selectedFile: boolean = false;


  filters: any = {
    filePeriod: '',
    sourceFileDate: '',
    deltaPerformedOn: '',
    deltaStatus: '',
    currentFile: '',
    newFile: '',
    deltaFile: ''
  }

  constructor(private util: AppUtils, private excelSrv: ExcelService, public route: ActivatedRoute, private http: HttpClient,
              private router: Router, private rdaService: ReferenceDataAcquisitionService, private storageService: StorageService,
              private eclConstantsService: ECLConstantsService, public datepipe: DatePipe) {
    this.cols = [
      {field: 'filePeriod', header: 'Period', width: '5%'},
      {field: 'sourceFileDate', header: 'New File Received Date', width: '8%'},
      {field: 'deltaPerformedOn', header: 'Delta Date', width: '8%'},
      {field: 'deltaStatus', header: 'Delta Status', width: '8%'},
      {field: 'currentFileName', header: 'Current File', width: '20%'},
      {field: 'newFileName', header: 'New File', width: '20%'},
      {field: 'deltaFileName', header: 'Delta File', width: '20%'},
    ];
  }

  ngOnInit() {
    this.route.data.subscribe(params => {
      this.pageTitle = params['pageTitle'];
      this.userId = this.util.getLoggedUserId();
    });

    this.keywordSearch = '';
    this.selectedReferenceSource = '';
    this.selectedFrequency = '';
    this.fetchAllRdaFileInfoDetails();
    this.loadAllReferenceSources();
    this.loadFrequencies();
  }

  private fetchAllRdaFileInfoDetails(): void {
    this.rdaService.getAllRdaFileInfoDetails().subscribe((response: any) => {
      if (response != null) {
        this.rdaFileLogInfo = response;
        this.filteredData = this.rdaFileLogInfo;
        this.rdaFileLogInfo.forEach(rda => {
          rda.cfColorLink = DEFAULT_COLOR;
          rda.nfColorLink = DEFAULT_COLOR;
          rda.dfColorLink = DEFAULT_COLOR;
        });
        this.loading = false;
        this.loadingData = false;
        setTimeout(() => {
          this.loadingData = true;
        }, 50);
        this.progressValue = this.progressValue === 100 ? 0 : this.progressValue;
      }
    });
    this.selectedData = null;
  }

  private loadAllReferenceSources(): void {
    this.selectedFrequency = '';
    this.rdaService.getReferenceSources().then((response: any) => {
      if (response && response.length > 0) {
        this.referenceTypes = response;
      }
    });
  }

  loadFrequencies() {
    this.rdaService.getFrequencyByFileType(this.selectedFrequency).then((response: any) => {
      this.frequencies = [];
      if (response && response.length > 0) {
        this.frequencies = response;
      }
    });
  }

  getFilterData() {
    this.filteredData = this.rdaFileLogInfo;
    if (this.selectedReferenceSource !== '' && this.selectedFrequency !== '') {
      this.filteredData = this.filteredData.filter(data => {
        return ((data.fileType != null && data.fileType === this.selectedReferenceSource)
          && (data.filePeriod != null && data.filePeriod === this.selectedFrequency));
      });
    } else if (this.selectedReferenceSource !== '') {
      this.filteredData = this.filteredData.filter(data => {
        return (data.fileType != null && (data.fileType === this.selectedReferenceSource));
      });
    } else if (this.selectedFrequency !== '') {
      this.filteredData = this.filteredData.filter(data => {
          return (data.filePeriod != null && (data.filePeriod === this.selectedFrequency));
      });
    } else {
      return this.filteredData;
    }
  }

  getReferenceSource() {
    this.rdaService.getFilterReferenceSources(this.selectedFrequency).then((response: any) => {
      if (response && response.length > 0) {
        if (!this.selectedReferenceSource) {
          this.referenceTypes = response;
        }
      }
    });
    this.getFilterData();
  }

  private resetSelection() {
    this.selectedReferenceSource = this.referenceTypes[0].value;
    this.selectedFrequency = '';
  }

  refreshRdaData(viewGrid) {
    this.loading = true;
    this.keywordSearch = '';
    viewGrid.selection = [];
    this.resetSelection();
    this.filters = {
      filePeriod: '',
      sourceFileDate: '',
      deltaPerformedOn: '',
      deltaStatus: '',
      currentFileName: '',
      newFileName: '',
      deltaFileName: ''
    };
    this.ngOnInit();
    this.loading = false;
  }

  getDownloadFile(fileUrl: string, fileName: string, fileInfoId: number, fieldColumnName: string) {
    let filePath = '';
    this.downloadBarCompleted = false;
    this.loading = true;
    if (fileUrl !== null && fileUrl !== undefined && fileName !== null && fileName !== undefined) {
      filePath = fileUrl + fileName;
      this.rdaService.getFileDownload(filePath).subscribe(response => {
        this.loading = false;
        if (response !== null && response !== undefined) {
          this.loadProgressBar(fileInfoId, response, fileName, fieldColumnName);
        }
      });
    }
  }

  downloadReferenceFileData(data, fileName) {
    let a = document.createElement("a");
    document.body.appendChild(a);
    let blob = new Blob([data]),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);

  }

  resethDataTable(viewGrid) {
    this.loading = true;
    this.keywordSearch = '';
    this.loading = false;
  }

  loadProgressBar(fileInfoId: number, response: any, fileName: string, fieldColumnName: string) {
    let progressValue = 0;
    let interval = setInterval(() => {
      progressValue = progressValue + Math.floor(Math.random() * 10) + 1;
      this.rdaFileLogInfo.forEach((data: any, index: number) => {
        if (data.fileInfoId === fileInfoId) {
          let selectedRdaData = this.checkSelectedRdaFileLogInfo(data, fileName, progressValue, fieldColumnName);
          if (progressValue >= 100) {
            selectedRdaData.progress = 100;
            clearInterval(interval);
            this.downloadReferenceFileData(response, fileName);
            this.resetSelectedProgressBar(selectedRdaData, fileName, fieldColumnName);
          }
        }
      });
    }, 500);
  }

  private checkSelectedRdaFileLogInfo(fileInfoObj: FileInfoDto, fileName: string,
                                      progressValue: number, fieldColumnName: string): FileInfoDto {
    if (fileInfoObj.currentFileName === fileName && fieldColumnName === CURRENT_FILE_NAME) {
      fileInfoObj.progress = progressValue;
      fileInfoObj.showCurrentFileProgressBar = false;
      return fileInfoObj;
    } else if (fileInfoObj.newFileName === fileName && fieldColumnName === NEW_FILE_NAME) {
      fileInfoObj.progress = progressValue;
      fileInfoObj.showNewFileProgressBar = false;
      return fileInfoObj;
    } else if (fileInfoObj.deltaFileName === fileName && fieldColumnName === DELTA_FILE_NAME) {
      fileInfoObj.progress = progressValue;
      fileInfoObj.showDeltaFileProgressBar = false;
      return fileInfoObj;
    }
  }

  private resetSelectedProgressBar(selectedFileInfoObj: FileInfoDto, fileName: string, fieldColumnName: string) {
    if (selectedFileInfoObj.currentFileName === fileName && fieldColumnName === CURRENT_FILE_NAME) {
      selectedFileInfoObj.showCurrentFileProgressBar = true;
      selectedFileInfoObj.progress = 0;
      selectedFileInfoObj.cfColorLink = CHANGED_COLOR;
    } else if (selectedFileInfoObj.newFileName === fileName && fieldColumnName === NEW_FILE_NAME) {
      selectedFileInfoObj.showNewFileProgressBar = true;
      selectedFileInfoObj.progress = 0;
      selectedFileInfoObj.nfColorLink = CHANGED_COLOR;
    } else if (selectedFileInfoObj.deltaFileName === fileName && fieldColumnName === DELTA_FILE_NAME) {
      selectedFileInfoObj.showDeltaFileProgressBar = true;
      selectedFileInfoObj.progress = 0;
      selectedFileInfoObj.dfColorLink = CHANGED_COLOR;
    }
  }

  customFilter(event, field) {
    let strDate = '';
    this.getFilterData();
    this.filteredData = this.filteredData.filter(value => {
      switch (field) {
        case 'filePeriod':
          if (event === '') {
            return true;
          } else {
            if (value.filePeriod != null && value.filePeriod !== undefined) {
              return value.filePeriod.includes(event);
            } else {
              return false;
            }
          }
          break;
        case 'sourceFileDate':
          if (event === '') {
            return true;
          } else {
            if (value.sourceFileDate != null && value.sourceFileDate !== undefined) {
              strDate = this.convertDate(value.sourceFileDate);
              return (strDate.includes(event));
            } else {
              return false;
            }
          }
          break;
        case 'deltaPerformedOn':
          if (event === '') {
            return true;
          } else {
            if (value.deltaPerformedOn != null && value.deltaPerformedOn !== undefined) {
              strDate = this.convertDate(value.deltaPerformedOn);
              return (strDate.includes(event));
            } else {
              return false;
            }
          }
          break;
        case 'deltaStatus':
          if (event === '') {
            return true;
          } else {
            if (value.deltaStatus != null && value.deltaStatus !== undefined) {
              return value.deltaStatus.toLowerCase().includes(event.toLowerCase());
            } else {
              return false;
            }
          }
          break;
        case 'currentFileName':
          if (event === '') {
            return true;
          } else {
            if (value.currentFileName != null && value.currentFileName !== undefined) {
              return value.currentFileName.toLowerCase().includes(event.toLowerCase());
            } else {
              return false;
            }
          }
          break;
        case 'newFileName':
          if (event === '') {
            return true;
          } else {
            if (value.newFileName != null && value.newFileName !== undefined) {
              return value.newFileName.toLowerCase().includes(event.toLowerCase());
            } else {
              return false;
            }
          }
          break;
        case 'deltaFileName':
          if (event === '') {
            return true;
          } else {
            if (value.deltaFileName != null && value.deltaFileName !== undefined) {
              return value.deltaFileName.toLowerCase().includes(event.toLowerCase());
            } else {
              return false;
            }
          }
          break;
      }
    });
  }

  private convertDate(date: Date): string {
    return this.datepipe.transform(date, 'MM/dd/yyyy');
  }

}
