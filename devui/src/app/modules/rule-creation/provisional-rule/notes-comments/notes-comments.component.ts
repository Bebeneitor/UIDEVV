import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { RuleInfo } from 'src/app/shared/models/rule-info';
import { DatePipe } from '@angular/common';
import { RuleNoteTabDto } from 'src/app/shared/models/dto/rule-notetab-dto';
import { RuleNoteAttachmentsDto } from 'src/app/shared/models/rule-note-attachments';
import { RuleNotes } from 'src/app/shared/models/rule-notes';
import { EclComments } from 'src/app/shared/models/ecl-comments';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { Constants } from 'src/app/shared/models/constants';
import { RuleNotesService } from 'src/app/services/rule-notes.service';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';
import { AppUtils } from 'src/app/shared/services/utils';
import { flatMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';


@Component({
  selector: 'app-notes-comments',
  templateUrl: './notes-comments.component.html',
  styleUrls: ['./notes-comments.component.css']
})


export class NotesCommentsComponent implements OnInit {
  currRuleInfo: RuleInfo;
  @ViewChild('fileUpload',{static: true}) fileUpload: ElementRef;
  @ViewChild('markpupEd',{static: false}) markupEd;

  loading: boolean = false;
  @Output() messageSend = new EventEmitter<any>();
  @Input() provDialogDisable: boolean;
  @Input() fromMaintenanceProcess: boolean;
  @Input() set ruleInfo(rule: RuleInfo) {
    if (rule && rule.ruleId) {
      this.currRuleInfo = rule;
      this.loadNotesTabData(rule.ruleId, rule.parentRuleId);
    }
  }

  fileLoaded = null;
  filesAttached: File[] = null;
  currentNote: string = null;
  currentComment: string = null;
  commentList: EclComments[] = [];
  ruleNoteTabData: RuleNoteTabDto;
  originalNotesTabData: RuleNoteTabDto;

  attachments: RuleNoteAttachmentsDto[] = [];
  isSavedFileExist: boolean = false;
  isAddedFileExist: boolean = false;
  maxLength: number = 4000;
  showDragging: boolean = false;
  acceptFileTypes = Constants.ACCEPT_FILE_TYPES;
  finalNotes: string = '';
  /***For displaying warning before attachment delete***/
  removeAttachmentDisplay: boolean = false;
  file: any;

  noteLabel: string = 'Notes';

  constructor(private datePipe: DatePipe, private toastService: ToastMessageService,
    private fileManagerService: FileManagerService,
    private ruleNoteService: RuleNotesService,
    private utils: AppUtils) { }

  ngOnInit() {
    this.originalNotesTabData = new RuleNoteTabDto();
    this.originalNotesTabData.ruleNotesDto = new RuleNotes();
    this.ruleNoteTabData = new RuleNoteTabDto();
    this.ruleNoteTabData.ruleNotesDto = new RuleNotes();
    this.ruleNoteTabData.newCommentsDto = new EclComments();
    this.filesAttached = [];
  }

  /**
 * loadClaimsTabData - Load entire Notes tab data.
 * @param rule - RuleInfo Object to load the Notes and Comments Data with
 */
  loadNotesTabData(ruleId: number, parentRuleId?: number) {
    this.loading = true;
    if (!this.fromMaintenanceProcess) {
      this.ruleNoteTabData = new RuleNoteTabDto();
      this.ruleNoteTabData.ruleNotesDto = new RuleNotes();
      this.ruleNoteTabData.newCommentsDto = new EclComments();
    }
    if (this.fromMaintenanceProcess) {
      this.noteLabel = "Original Notes";
      this.ruleNoteService.getRuleNotes(parentRuleId).pipe(
        flatMap(notes => {
          if (notes && notes.data) {
            this.originalNotesTabData = notes.data;
            if (this.originalNotesTabData.ruleNotesDto == null) {
              this.originalNotesTabData.ruleNotesDto = new RuleNotes();
              this.originalNotesTabData.ruleNotesDto.ruleId = parentRuleId;
            }
            this.originalNotesTabData.newCommentsDto = new EclComments();
            if (this.originalNotesTabData.activeAttachmentList &&
              this.originalNotesTabData.activeAttachmentList.length > 0) {
              this.isSavedFileExist = true;
            }
          }
          if (ruleId) {
            return this.ruleNoteService.getRuleNotes(ruleId);
          } else {
            this.loading = false;
            return EMPTY;
          }
        })
      ).subscribe((notes: any) => {
        if (notes && notes.data) {
          this.ruleNoteTabData = notes.data;
          if (this.ruleNoteTabData.ruleNotesDto == null) {
            this.ruleNoteTabData.ruleNotesDto = new RuleNotes();
            this.ruleNoteTabData.ruleNotesDto.ruleId = this.currRuleInfo.ruleId;
          }
          if (this.fromMaintenanceProcess && !this.ruleNoteTabData.ruleNotesDto.notesModified) {
            this.ruleNoteTabData.ruleNotesDto.notesModified = this.ruleNoteTabData.ruleNotesDto.notes
          }
          this.ruleNoteTabData.newCommentsDto = new EclComments();
          this.filesAttached = [];
          if (this.ruleNoteTabData.activeAttachmentList &&
            this.ruleNoteTabData.activeAttachmentList.length > 0) {
            this.isSavedFileExist = true;
          }
        }
        this.loading = false;
      });
    } else {
      this.ruleNoteService.getRuleNotes(ruleId).subscribe((notes: any) => {
        if (notes && notes.data) {
          this.ruleNoteTabData = notes.data;
          if (this.ruleNoteTabData.ruleNotesDto == null) {
            this.ruleNoteTabData.ruleNotesDto = new RuleNotes();
            this.ruleNoteTabData.ruleNotesDto.ruleId = this.currRuleInfo.ruleId;
          }
          if (this.fromMaintenanceProcess && !this.ruleNoteTabData.ruleNotesDto.notesModified) {
            this.ruleNoteTabData.ruleNotesDto.notesModified = this.ruleNoteTabData.ruleNotesDto.notes
          }
          this.ruleNoteTabData.newCommentsDto = new EclComments();
          this.filesAttached = [];
          if (this.ruleNoteTabData.activeAttachmentList &&
            this.ruleNoteTabData.activeAttachmentList.length > 0) {
            this.isSavedFileExist = true;
          }    
        }
        this.loading = false;
      });
    }
  }

  /* Method invoked when files are dragged and dropped */
  dropFileHandler(event) {
    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();
    if (!this.provDialogDisable) {
      this.updateFilesList(this.utils.dropFileHandler(event));
    }
    this.fileUpload.nativeElement.value = '';
  }


  /* Method to click the file input by using the id of the input*/
  clickFileUpload() {
    this.fileUpload.nativeElement.click();
  }

  /* Method to add files into the */
  addFiles(event: any) {
    let fileList: FileList = event.target.files;
    this.updateFilesList(fileList);
    this.fileUpload.nativeElement.value = '';
  }

  /**
   * Update the File List while checking File Size and Naming duplicates
   * @param fileList Newly added files to be validated before adding
   */
  updateFilesList(fileList: any) {
    let activeAttachments: RuleNoteAttachmentsDto[] =
      (this.ruleNoteTabData.activeAttachmentList && this.ruleNoteTabData.activeAttachmentList.length > 0) ?
        this.ruleNoteTabData.activeAttachmentList.filter(attachment => attachment.isRemoved === false) : [];
    const { addedFiles, addedBool, warnMsg } = this.utils.updateFilesList(fileList, this.filesAttached, activeAttachments);
    if (warnMsg) {
      this.isAddedFileExist = this.filesAttached.length > 0 ? true : false;
      this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, warnMsg, 4000, true);
    } else {
      this.filesAttached = addedFiles;
      this.isAddedFileExist = addedBool;
    }
  }

  /* Method to remove the selected file from the selected files list based on the name of the file
   @input : file object
   reseting the file input if the length of the files list if empty
   */
  removeSelectedFile(fileObj: any) {
    this.filesAttached = this.filesAttached.filter(file => file.name !== fileObj.name);
    if (this.filesAttached.length < 1) {
      this.fileUpload.nativeElement.value = '';
    }
    if (this.filesAttached.length > 0) {
      this.isAddedFileExist = true;
    } else {
      this.isAddedFileExist = false;
    }

  }

  /**
  * Removes the file from the list, but the deletion is until user clicks save or submit.
  * @param file to be removed.
  */
  removeFile(file) {
    this.file = file;
    this.removeAttachmentDisplay = true;
  }

  /***Activated when user clicks Cancel on File Deletion dialog***/
  removeAttachmentCancel() {
    this.removeAttachmentDisplay = false;
  }

  /* Method to delete a file attached to research request Object
  setting the deletedstatus value of the list index object to true,
  to pass the entire update list when the save or submit event occurs.
  */
  removeSavedFile() {
    this.removeAttachmentDisplay = false;
    this.ruleNoteTabData.activeAttachmentList.forEach(fileObj => {
      if (fileObj.fileId === this.file) {
        fileObj.isRemoved = true;
      }
    });
    if (this.ruleNoteTabData.activeAttachmentList.length > 0) {
      this.isSavedFileExist = false;
      this.ruleNoteTabData.activeAttachmentList.forEach(fileObj => {
        if (fileObj.isRemoved == false) {
          this.isSavedFileExist = true;
        }
      });

    } else {
      this.isSavedFileExist = false;
    }
  }

  /* Header got comment accordion */
  getCommentHeader(comment: EclComments) {
    const datePipeString = this.datePipe.transform(comment.creationDate, 'MM/dd/yyyy hh:mm a');
    return (`${comment.createdUser} added a comment - ${datePipeString} `);
  }

  /**
  * Shows an icon according to the extension.
  * @param file to get the extension,
  */
  getFileIcon(fileName) {
    return this.utils.getFileIcon(fileName);
  }

  /**
  * Gets the file from the service.
  * @param file that we want to download.
  */
  downloadAddedFile(file: any) {
    if (!this.provDialogDisable) {
      this.fileManagerService.createDownloadFileElement(file, file.name);
    }
  }

  downloadSavedFile(file: any) {
    this.fileManagerService.downloadFile(file.fileId).subscribe(response => {
      this.fileManagerService.createDownloadFileElement(response, file.fileName);
    });
  }

  checkMultiValidation(setup: number, textAreaId: string, e?: ClipboardEvent, note?: string) {
    if (setup === Constants.INPUT) {
      if (textAreaId === 'taComments') {
        this.ruleNoteTabData.newCommentsDto.comments = this.utils.checkInputLengthTextArea(this.ruleNoteTabData.newCommentsDto.comments, this.maxLength)
      } else {
        this.ruleNoteTabData.ruleNotesDto.notes = this.utils.checkInputLengthTextArea(this.ruleNoteTabData.ruleNotesDto.notes, this.maxLength)
      }
    } else if (setup === Constants.KEYPRESS) {
      if (textAreaId === 'taComments') {
        this.utils.checkMultiLineMaxLength(e, this.ruleNoteTabData.newCommentsDto.comments, document.getElementById(textAreaId), this.maxLength)
      } else {
        this.utils.checkMultiLineMaxLength(e, this.ruleNoteTabData.ruleNotesDto.notes, document.getElementById(textAreaId), this.maxLength)
      }
    } else {
      this.messageSend.emit(this.utils.checkPasteLength(e, 'Notes', this.maxLength, note));
    }
  }

  getUpdatedNote() {
    this.ruleNoteTabData.ruleNotesDto.notes = this.markupEd.updatedText;
  }

}



