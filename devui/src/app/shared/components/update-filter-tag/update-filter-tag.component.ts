import { Component, OnInit } from '@angular/core';
import { TagDto } from '../../models/dto/tag-dto';
import { FilterDto } from '../../models/dto/filter-dto';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { MetadataCacheService } from 'src/app/services/metadata-cache.service';
import { Constants } from '../../models/constants';
import * as _ from 'underscore';

const FILTER_ASSOCATION_ERROR = 'Selected filter has association to another tag';
const NO_CHANGES_MESSAGE = 'There are no changes to be saved';
const UPDATE_SUCCESS = 'Updated Successfully';

@Component({
  selector: 'app-update-filter-tag',
  templateUrl: './update-filter-tag.component.html',
  styleUrls: ['./update-filter-tag.component.css']
})


export class UpdateFilterTagComponent implements OnInit {

  createNewTagRequest: TagDto = new TagDto();
  createNewFilterRequest: FilterDto = new FilterDto();
  filterValidationMessage: any;
  showFilterErrorMessage: boolean;
  showTagErrorMessage: boolean;
  duplicateTagMessage: any;
  validationMessage: string;
  constructor(public ref: DynamicDialogRef, private config: DynamicDialogConfig, 
    private metaCacheService: MetadataCacheService) { }

  ngOnInit() {
    if (this.config.data.filter !== null) {
      this.createNewFilterRequest = _.clone(this.config.data.filter);
    }

    if (this.config.data.tag !== null) {
      this.createNewTagRequest = _.clone(this.config.data.tag);
    }

    if (this.config.data.filter !== null && !this.config.data.filter.isEditDeleteAllowed) {
      this.showFilterErrorMessage = true;
      this.filterValidationMessage = FILTER_ASSOCATION_ERROR;
    }
  }

  saveFilterTag() {
    this.showFilterErrorMessage = false;
    this.showTagErrorMessage = false;
    this.filterValidationMessage = '';
    this.duplicateTagMessage = '';
    this.validationMessage = '';
    
    let request: any = {filter: null, tag: null};
    if (this.config.data.filter !== null && JSON.stringify(this.config.data.filter) !== JSON.stringify(this.createNewFilterRequest) && this.config.data.filter.isEditDeleteAllowed) {
      request.filter = this.createNewFilterRequest
    }
    if (this.config.data.tag !== null && JSON.stringify(this.config.data.tag) !== JSON.stringify(this.createNewTagRequest)) {
      request.tag = this.createNewTagRequest;
    }
    if (request.filter !== null || request.tag !== null) {
      this.metaCacheService.updateFilterTag(request).subscribe((response: any) => {
        if (response.code === Constants.VALIDATION_ERROR) {
          response.data.forEach(responseMessage => {
            if (Constants.DUPLICATE_FILTER_NAME === responseMessage.code) {
              this.filterValidationMessage = responseMessage.message;
              this.showFilterErrorMessage = true;
            }
            if (Constants.DUPLICATE_TAG_NAME === responseMessage.code) {
              this.duplicateTagMessage = responseMessage.message;
              this.showTagErrorMessage = true;
            }
          });
        } else {
          if (response.message === Constants.FILTER_UPDATE_ERROR) {
            this.filterValidationMessage = response.message;
            this.showFilterErrorMessage = true;
          }
          else {
            this.ref.close(UPDATE_SUCCESS);
          }
        }
      });
    } else {
      this.validationMessage = NO_CHANGES_MESSAGE;
    }
  }

  cancelFilterTagDialog() {
    this.ref.close();
  }

}
