import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ReferenceSourceService } from 'src/app/services/reference-source.service';
import { ReferenceSourceDto } from 'src/app/shared/models/dto/reference-source-dto';
import { AppUtils } from 'src/app/shared/services/utils';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { ConfirmationService } from 'primeng/api';

const WARN_MESSAGE = 'Please enter a new reference source';
const MESSAGE_HEADER = 'Reference Source Exists!';
const SAVE_MESSAGE = 'New reference source added successfully';

@Component({
  selector: 'app-reference-source',
  templateUrl: './reference-source.component.html',
  styleUrls: ['./reference-source.component.css']
})
export class ReferenceSourceComponent implements OnInit {

  @Input() fieldSaveButton: boolean;
  @Output() saveButtonChange = new EventEmitter();

  selectedReferenceSource: string;
  searchRefSourceName: string;
  refSourcesList: string[] = [];
  refSourcesOptions: string[] = [];
  addNewRefSource: boolean = false;
  newRefSourceObj: ReferenceSourceDto;
  userId: number;

  constructor(private refSourceService: ReferenceSourceService,
    private utils: AppUtils,
    private toastMessageService: ToastMessageService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.getAllReferenceSources();
    this.addNewRefSource = false;
    this.userId = this.utils.getLoggedUserId();
  }

  /* Method to show and hide the input text box in the list to enter new reference source */
  showReferenceInput() {
    if (this.addNewRefSource) {
      this.addNewRefSource = false;
    } else {
      this.addNewRefSource = true;
    }
  }

  /* Method to create referenceSourceDto Object and enable and disable the save button in parent component */
  checkRefSource() {
    this.newRefSourceObj = new ReferenceSourceDto();
    if (this.selectedReferenceSource.trim()) {
      this.newRefSourceObj.sourceDesc = this.selectedReferenceSource;
      this.newRefSourceObj.sourceShortDesc = this.selectedReferenceSource;
      this.newRefSourceObj.userId = this.userId;
      this.fieldSaveButton = false;
      this.saveButtonChange.emit(this.fieldSaveButton);

    } else {
      this.fieldSaveButton = true;
      this.saveButtonChange.emit(this.fieldSaveButton);
    }
  }

  /* Method to search and filter the available reference sources list and show the list based on the search criteria */
  searchRefList() {
    if (this.searchRefSourceName.trim()) {
      this.refSourcesList = this.refSourcesOptions.filter(refSource =>
        refSource.toLowerCase().includes(this.searchRefSourceName.toLowerCase()));
    } else {
      this.refSourcesList = this.refSourcesOptions;
    }
  }

  /* Method to fetch all the available reference sources and add them into refSources lists */
  getAllReferenceSources() {
    this.refSourceService.getAllReferenceSources().subscribe(response => {
      if (response.data !== null) {
        this.refSourcesList = [];
        this.refSourcesOptions = [];
        let refSourcesOptions: any[] = [];
        refSourcesOptions = response.data;
        refSourcesOptions.forEach(refSource => {
          this.refSourcesList.push(refSource.sourceDesc);
          this.refSourcesOptions.push(refSource.sourceDesc);
        });
      }
    });
  }

  /* Method to refresh the fields */
  refreshReferences() {
    this.selectedReferenceSource = '';
    this.checkRefSource();
  }
  
  /* Method to refresh and reset the entire page */
  refreshAddReferences() {
    this.getAllReferenceSources();
    this.addNewRefSource = false;
    this.selectedReferenceSource = '';
    this.checkRefSource();
  }

  /* Method to show a pop up message to accept or decline to save new reference source */
  saveRefValidation() {
    if (this.validateNewRefSave()) {
      this.confirmationService.confirm({
        message: 'Are you sure you would like to create a new reference source?',
        header: 'Save Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.fieldSaveButton = true;
          this.saveButtonChange.emit(this.fieldSaveButton);
          this.saveNewReferenceSource();
        },
        reject: () => {
          this.refreshReferences();
        }
      });
    } else {
      this.toastMessageService.messageWarning(MESSAGE_HEADER, WARN_MESSAGE);
      this.refreshReferences();
    }
  }

  /* Method to save the added new reference source if the user accepts*/
  saveNewReferenceSource() {
    this.refSourceService.saveRefSource(this.newRefSourceObj).subscribe(response => {
      if (response.data !== null && response.data !== undefined) {
        let newRef: boolean = response.data;
        if (newRef) {
          this.toastMessageService.messageSuccess(this.toastMessageService.SUCCESS, SAVE_MESSAGE);
          this.getAllReferenceSources();
          this.addNewRefSource = false;
          this.refreshReferences();
        } else {
          this.toastMessageService.messageWarning(MESSAGE_HEADER, WARN_MESSAGE);
          this.refreshReferences();
        }
      }

    });
  }

  /* Method to validate and return a boolean if the added reference is new or not */
  validateNewRefSave() {
    let res: boolean = true;
    if (this.selectedReferenceSource) {
      this.refSourcesOptions.forEach(refSourceName => {
        if (res) {
          if (refSourceName.toLowerCase().trim() === this.selectedReferenceSource.toLowerCase().trim()) {
            res = false;
            return res;
          }
        }
      });
      return res;
    } else {
      res = false;
      return res;
    }
  }

}
