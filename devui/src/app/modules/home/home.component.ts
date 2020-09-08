import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MessageService, DialogService } from 'primeng/api';
import { DashboardService } from 'src/app/services/dashboard.service';
import { AppUtils } from 'src/app/shared/services/utils';
import { SettingsDasbhoardComponent } from 'src/app/shared/components/settings-dasbhoard/settings-dasbhoard.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  widgets: any = [];

  //By cols
  widgets1: any = [];
  widgets2: any = [];

  videos: any = [];

  lastTimeMessage = 0;

  interests: any[] = [];

  pageTitle: string = '';

  suscriptionDashboards : any = undefined;

  constructor(private dashboardService: DashboardService, private messageService: MessageService,
    private utils: AppUtils, private dialogService: DialogService,
    private cdr : ChangeDetectorRef) { }

  ngOnDestroy() {
    this.suscriptionDashboards.unsubscribe();
  }

  ngOnInit() {
    if(this.suscriptionDashboards == undefined) {
      this.suscriptionDashboards = this.dashboardService.observableSave$.subscribe((response: any) => {
        let currentTimestamp = new Date().getTime();
        if (currentTimestamp - this.lastTimeMessage >= 3000) {
          this.lastTimeMessage = currentTimestamp;

          this.messageService.add({ key: 'settingsDash', severity: 'success', summary: 'Success!', detail: 'Your configuration was successfully stored.' });

          this.loadAll();
        }
      });
    }

    this.loadAll();

    this.videos = [{
      url: "https://link1.est.cotiviti.com",
      title: "Functionality #1",
      image: "https://multimedia.europarl.europa.eu/o/europarltv-theme/images/europarltv/media-default-thumbnail-url-video.png",
      description: "This is a test description for the video tutorial."
    },
    {
      url: "https://link2.est.cotiviti.com",
      title: "Functionality #2",
      image: "https://multimedia.europarl.europa.eu/o/europarltv-theme/images/europarltv/media-default-thumbnail-url-video.png",
      description: "This is a test description for the video tutorial."
    },
    {
      url: "https://link1.est.cotiviti.com",
      title: "Functionality #2",
      image: "https://multimedia.europarl.europa.eu/o/europarltv-theme/images/europarltv/media-default-thumbnail-url-video.png",
      description: "This is a test description for the video tutorial."
    }];
  }

  loadAll() {
    this.dashboardService.getParameters(this.utils.getLoggedUserId()).then((response: any) => {
      this.pageTitle = '';

      this.cdr.detectChanges();

      this.pageTitle = response.title;      

      this.loadWidgets().then(res => {
        this.checkInterests();
      });
    });
  }

  /**
   * Open modal and show the user interests
   */
  openInterests() {
    const ref = this.dialogService.open(SettingsDasbhoardComponent, {
      header: 'Dashboard Settings',
      width: '70%',
      closable: false,
      data: {
        tab: 'interests'
      }
    });
  }

  /**
   * Load the interests to indicate user that the widgets will filter the
   * data response in bais of the interests entered
   */
  checkInterests() {
    this.dashboardService.getInterests(this.utils.getLoggedUserId()).then((response: any) => {
      this.interests = response.favoritesLst == null ? [] : response.favoritesLst;
    });
  }

  /**
   * Load widgets to show in the home screen, separate widgets 
   * in columns
   */
  loadWidgets() {
    return new Promise((resolve, reject) => {
      this.dashboardService.getWidgets().then((response: any) => {
        this.widgets = response;

        this.widgets1 = [];
        this.widgets2 = [];

        for (let i = 0; i < this.widgets.length; i++) {
          //Separation
          switch (this.widgets[i].positions.col) {
            case 1:
              this.widgets1.push(this.widgets[i]);
              break;
            case 2:
              this.widgets2.push(this.widgets[i]);
              break;
          }
        }

        //Column 1
        this.widgets1.sort(function (a, b) {
          return parseFloat(a.positions.row) - parseFloat(b.positions.row);
        });

        //Column 2
        this.widgets2.sort(function (a, b) {
          return parseFloat(a.positions.row) - parseFloat(b.positions.row);
        });

        resolve();

      });
    });
  }

}
