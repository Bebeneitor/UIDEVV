export class FileUploaderOptions {
    inputPlaceHolder?: string;
    uploadIcon?: string;
    selectFileIcon?: string;
    allowExtensions?: string;
    fileLimit?: number;
    multipleFiles?: boolean;
    uploadFiles?: boolean;
    confirmOnDeleteMultipleFile?: boolean;

    constructor() {
        this.inputPlaceHolder = 'Select a File...';
        this.selectFileIcon = 'fa fa-file';
        this.uploadIcon = 'fa fa-upload';
        this.allowExtensions = '';
        this.fileLimit = 1;
        this.multipleFiles = false;
        this.uploadFiles = false;
        this.confirmOnDeleteMultipleFile = false;
    }
}