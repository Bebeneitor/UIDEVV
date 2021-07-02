import { Component, OnInit, ViewChild } from '@angular/core';
import { EclLookupsService } from 'src/app/services/ecl-lookups.service';
import { LazyLoadEvent } from 'primeng/api';
import { DashboardService } from 'src/app/services/dashboard.service';
import { EclLookupsDto } from 'src/app/shared/models/dto/ecl-lookups-dto';
import { ToastMessageService } from 'src/app/services/toast-message.service';

@Component({
  selector: 'app-ecl-lookups',
  templateUrl: './ecl-lookups.component.html',
  styleUrls: ['./ecl-lookups.component.css']
})
export class EclLookupsComponent implements OnInit {

  @ViewChild('viewGrid',{static: true}) viewGrid;

  cols: any = [];
  data: any = [];

  type: string = '';
  code: string = '';
  description: string = '';

  datasource: any = undefined;
  loading: boolean = true;
  totalRecords: number;

  first: number = 0;
  last: number = 5;

  showDialog: boolean = false;

  editMode: boolean = false;
  lookup: EclLookupsDto = null;

  constructor(private eclLookupService: EclLookupsService, private dashboardService: DashboardService, private toastService: ToastMessageService) { }

  ngOnInit() {
    this.lookup = new EclLookupsDto();
    this.cols = this.eclLookupService.getColumns();
  }

  create() {
    this.editMode = false;
    this.lookup = new EclLookupsDto();
    this.lookup.lookupId = -1;
    this.showDialog = true;
  }

  search() {
    return new Promise(resolve => {
      this.eclLookupService.search(this.type, this.code, this.description, this.first, this.last).then((response: any) => {
        this.datasource = response.data.lookups;
        this.totalRecords = response.data.totalRecords;

        this.data = response.data.lookups;
        this.loading = false;

        resolve(this.data);
      });
    });
  }

  edit(data) {
    this.editMode = true;
    this.lookup = data;
    this.showDialog = true;
  }

  remove(data) {
    this.eclLookupService.deactivate(data).then((response: any) => {
      if (response.code == 200 && response.data) {
        this.toastService.messageSuccess("Success!", "Lookup was deactivated successfully.");

        this.loading = true;
        this.search();
      } else {
        this.toastService.messageError("Error!", "Lookup was not deactivated, try again.");
      }
    });
  }

  activate(data) {
    this.eclLookupService.activate(data).then((response: any) => {
      if (response.code == 200 && response.data) {
        this.toastService.messageSuccess("Success!", "Lookup was activated successfully.");

        this.loading = true;
        this.search();
      } else {
        this.toastService.messageError("Error!", "Lookup was not activated, try again.");
      }
    });
  }

  save() {

    if (!this.lookup.lookupType || this.lookup.lookupType.trim() == '') {
      this.toastService.messageWarning("Warning!", "Please enter a lookup type to continue.");
      return;
    }

    if (!this.lookup.lookupCode || this.lookup.lookupCode.trim() == '') {
      this.toastService.messageWarning("Warning!", "Please enter a lookup code to continue.");
      return;
    }

    if (!this.lookup.lookupDesc || this.lookup.lookupDesc.trim() == '') {
      this.toastService.messageWarning("Warning!", "Please enter a lookup description to continue.");
      return;
    }

    if (this.editMode) {
      this.eclLookupService.update(this.lookup).then((response: any) => {
        if (response.code == 200 && response.data) {
          this.toastService.messageSuccess("Success!", "Lookup was updated successfully.");

          this.loading = true;
          this.search();
        } else {
          this.toastService.messageError("Error!", "Lookup was not updated, try again.");
        }

        this.showDialog = false;
      });
    } else {
      this.eclLookupService.save(this.lookup).then((response: any) => {
        if (response.code == 200 && response.data) {
          this.toastService.messageSuccess("Success!", "Lookup was saved successfully.");

          this.loading = true;
          this.search();
        } else {
          this.toastService.messageError("Error!", "Lookup was not saved, try again.");
        }

        this.showDialog = false;
      });
    }
  }

  closeDialog() {
    this.showDialog = false;
  }

  loadLazy(event: LazyLoadEvent) {
    this.loading = true;

    this.first = event.first;
    this.last = this.viewGrid.rows;

    this.search();
  }

  parseDate(date) {
    return this.dashboardService.parseDate(new Date(date));
  }
}
