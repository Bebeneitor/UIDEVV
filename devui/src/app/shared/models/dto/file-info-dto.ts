
export class FileInfoDto {

  fileInfoId: number;
  fileType: string;
  currentFileName: string;
  newFileName: string;
  deltaFileName: string;
  filePeriod: string;
  currentFilePath: string;
  newFilePath: string;
  deltaFilePath: string;
  deltaStatus: string;
  deltaPerformedOn: Date;
  sourceFileDate: Date;
  currentDate: Date;
  svnRevision: any;
  progress: number;
  showCurrentFileProgressBar: boolean;
  showNewFileProgressBar: boolean;
  showDeltaFileProgressBar: boolean;
  cfColorLink: string;
  nfColorLink: string;
  dfColorLink: string;

}
