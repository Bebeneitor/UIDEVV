import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { FilterDto } from '../../models/dto/filter-dto';
import { MetadataCacheService } from 'src/app/services/metadata-cache.service';
import { AppUtils } from 'src/app/shared/services/utils';
import { Constants } from 'src/app/shared/models/constants';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-filter',
  templateUrl: './create-filter.component.html',
  styleUrls: ['./create-filter.component.css']
})
export class CreateFilterComponent implements OnInit {

  createNewFilterRequest: FilterDto = new FilterDto();
  fieldSaveButton: boolean = true;
  showErrorMessage: boolean = false;
  duplicateMessage: string;
  savedFilterDto: FilterDto;
  displayFilterCondition: string;

  constructor(public ref: DynamicDialogRef, private config: DynamicDialogConfig,  
    private metaCacheService: MetadataCacheService,
    private util: AppUtils, private router: Router) { }

  ngOnInit() {
    this.createNewFilterRequest.filterType = 'Private';
    this.createNewFilterRequest.screenName = this.config.data.screenName;
    this.createNewFilterRequest.filterCondition = this.config.data.filterCondition;
    this.displayFilterCondition = this.config.data.displayFilterCondition;
    this.fieldSaveButton = true;
    this.showErrorMessage = false;
  } 

  cancelNewFilterDialog()  {
    this.ref.close();
  }

  saveNewFilter() {
    this.metaCacheService.saveFilter(this.createNewFilterRequest).subscribe((response: any) => {
       if (Constants.DUPLICATE_FILTER_NAME === response.code) {
        this.duplicateMessage = response.message;
        this.showErrorMessage = true;
      } else {
        this.savedFilterDto = response.data;
        this.ref.close(this.savedFilterDto);
      }
    });  
  }

  onTypeNewFilterName() {
    this.fieldSaveButton = !this.util.checkStringNotNull(this.createNewFilterRequest.filterName);
    this.createNewFilterRequest.filterName = this.util.capitalize(this.createNewFilterRequest.filterName);
  }

}
