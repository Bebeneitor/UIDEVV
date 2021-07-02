import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { TagDto } from '../../models/dto/tag-dto';
import { MetadataCacheService } from 'src/app/services/metadata-cache.service';
import { AppUtils } from 'src/app/shared/services/utils';
import { Constants } from 'src/app/shared/models/constants';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-tag',
  templateUrl: './create-tag.component.html',
  styleUrls: ['./create-tag.component.css']
})
export class CreateTagComponent implements OnInit {

  createNewTagRequest: TagDto = new TagDto();
  tagList: string[] = [];
  showErrorMessage: boolean = false;
  duplicateMessage: string;
  savedTagDto: TagDto;
  fieldSaveButton: boolean = true;

  constructor(public ref: DynamicDialogRef, private config: DynamicDialogConfig, private metaDataCacheService: MetadataCacheService,
    private util: AppUtils, private router: Router) { }

  ngOnInit() {
    this.fieldSaveButton = true;
    this.showErrorMessage = false;
  }

  cancelNewTagDialog() {
    this.ref.close();
  }

  saveTag() {

    this.createNewTagRequest.filterId = Number(this.config.data.filter);
    this.createNewTagRequest.ruleIds = this.config.data.ruleIds;
    this.createNewTagRequest.action = "create";

    this.metaDataCacheService.saveTags(this.createNewTagRequest).subscribe(
      (response: any) => {
        if (Constants.DUPLICATE_TAG_NAME === response.code) {
          this.duplicateMessage = response.message;
          this.showErrorMessage = true;
        } else {
          this.savedTagDto = response.data;
          this.ref.close(this.savedTagDto);
        }
      }
    );
  }

  onTypeNewTagName() {
    this.fieldSaveButton = !this.util.checkStringNotNull(this.createNewTagRequest.tagName);
    this.createNewTagRequest.tagName = this.util.capitalize(this.createNewTagRequest.tagName);
  }
}


