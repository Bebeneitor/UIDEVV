import { Component, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';
import { Constants } from 'src/app/shared/models/constants';
import { DashboardService } from 'src/app/services/dashboard.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { SameSimService } from 'src/app/services/same-sim.service';
import { AppUtils } from 'src/app/shared/services/utils';
import { count, ignoreElements } from 'rxjs/operators';
import { Router } from '@angular/router';

const CARD_TYPE = 'card';
const PATH_BASE = 'industry-updates/rule-process/'

@Component({
  selector: 'app-same-sim-analysis',
  templateUrl: './same-sim-analysis.component.html',
  styleUrls: ['./same-sim-analysis.component.css']
})
export class SameSimAnalysisComponent implements OnInit, AfterViewInit {

  @Input('title') title: string;

  typeView: string = CARD_TYPE;
  pageLoad: boolean = true;

  dropdownFlag: boolean = false;

  cardsFlag: boolean = false;

  selectedInstance: any = null;
  instances: any [] =[];

  countCCA: number[];
  countPO: number[];
  countPR: number[];
  cards: any[] = [];
  options: any;
  activeIndex: number = -1;

  constructor(private dashboardService: DashboardService, private permissionService: NgxPermissionsService, 
    private sameSimService: SameSimService,private util: AppUtils,private router: Router) { }

  ngOnInit() {

    this.activeIndex = 0; 

    //loading all instances    
    this.getInstancesByUser(this.util.getLoggedUserId());    

  }

  createChartData() {

    let labels = [];
    let data = [];
    let colors = [];

    let card = this.cards[this.cards.length - 1];

    card.badges.forEach(item => {
      labels.push(item.name);
      data.push(item.count);
      colors.push(item.color);
    });

    this.cards[this.cards.length - 1].data = {
      labels: labels,
      datasets: [
        {
          label: '',
          backgroundColor: colors,
          borderColor: colors,
          data: data
        }
      ]
    }
  }

  ngAfterViewInit() {
    if (this.cards.length > 0) {
      this.loadData(this.cards[0].role);    
    }     
  }

  changeView(typeView: string) {

  }

  paginate(event) {
    this.activeIndex = event.page;

    //Get active role index
    let role = this.cards[this.activeIndex].role;

    if (role != '') {
      this.loadData(role);
    }
  }

  loadData(role: string) {    
    this.pageLoad = true;
  }

  onInstanceChange(event){      
    this.selectedInstance=event.value;
    this.getAccountByUserAndInstance(this.util.getLoggedUserId(), this.selectedInstance.code);
  }

  refreshData(){
    this.getAccountByUserAndInstance(this.util.getLoggedUserId(), this.selectedInstance.code);
  }
  
  /**
   * This method is to get all instances asociated to one specific user.
   * @param userId 
   */
  getInstancesByUser(userId: number){    
       
    this.sameSimService.getInstancesByUser(userId).subscribe((response: any)=> {
         
      if(response.code == 200){                        

        Array.from(Object.entries(response.data)).forEach(entry => this.instances.push({ name: entry[1], code: entry[0] }));

        this.dropdownFlag=true;//Enable instances in droplist.
        this.selectedInstance = this.instances[0];       

        if(this.selectedInstance != undefined){
          this.getAccountByUserAndInstance(this.util.getLoggedUserId(),this.selectedInstance.code);      
        }
        else{
          this.activeIndex=-1;
        }

      }

    });

  }

  getAccountByUserAndInstance(userId: number, instanceId: number){
  
    this.sameSimService.getCountsSameSimWidget(userId,instanceId).subscribe((response: any)=>{

      if(response.code == 200){       
        for (let [key, value] of Object.entries(response.data)) {

          switch (key) {
            case 'CCA':
              this.countCCA = <[]>value;
              break;

            case 'PO':
              this.countPO = <[]>value;
              break;

            case 'MD':
              this.countPR = <[]>value;
              break;
            default:
              break;

          }//close switch          
        }//close for

        this.loadOptions();
      }

    });

  }

  private loadOptions() {
           
    this.cards=[];    

    this.options = {
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          display: false, //this will remove all the x-axis grid lines
          ticks: {
            beginAtZero: true
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            precision:0
          }
        }]
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.yLabel;
          }
        }
      }
    };

    //CCA
    if (this.permissionService.getPermission("ROLE_" + Constants.CCA_ROLE) != undefined) {      
      this.cards.push({
        'role': Constants.CCA_ROLE,
        'classColumn': 'col-12',
        'title': 'CCA SAME SIM TASKS',
        'data': null,
        'badges': [
          {
            'name': 'Library rules pending analysis',//,Rules Reassigned for Analysis
            'count': this.countCCA[0],
            'path': 0,//Constants.SAME_SIM_NAV_INITIATE_ANALYSIS,
            'color': Constants.AVAILABLE_COLORS[0]
          }
        ]
      });

      this.createChartData();
    }

    //PO
    if (this.permissionService.getPermission("ROLE_" + Constants.PO_ROLE) != undefined) {
      this.cards.push({
        'role': Constants.PO_ROLE,
        'classColumn': 'col-4',
        'title': 'PO SAME SIM TASKS',
        'data': null,
        'badges': [
          {
            'name': 'Library rules pending approval',
            'count': this.countPO[0],
            'path': 1,//Constants.SAME_SIM_NAV_POLICY_OWNER_APPROVAL,
            'color': Constants.AVAILABLE_COLORS[0]
          },
          {
            'name': 'Library rules reassigned for analysis',//(RETURN TAB?)  
            'count': this.countPO[1] ,
            'path': 2,   //Constants.SAME_SIM_NAV_REASSIGNMENT_PO
            'color': Constants.AVAILABLE_COLORS[1]
          },
          {
            'name': 'Library rules reassigned for CCA analysis',
            'count': this.countPO[2],
            'path': 3,//Constants.SAMESIM_NAV_REASSIGNMENT_CCA,
            'color': Constants.AVAILABLE_COLORS[2]
          }
        ]
      });

      this.createChartData();
    }


    //MD
    if (this.permissionService.getPermission("ROLE_" + Constants.MD_ROLE) != undefined) {
      this.cards.push({
        'role': 'PR',
        'classColumn': 'col-6',
        'title': 'PR SAME SIM TASKS',
        'data': null,
        'badges': [
          {
            'name': 'Library rules reassigned for peer review',//(RETURN TAB?)  
            'count': this.countPR[0],
            'path': 4,//Constants.SAME_SIM_NAV_FOR_MEDICAL_DIRECTOR_APPROVAL,
            'color': Constants.AVAILABLE_COLORS[0]
          },
          {
            'name': 'Library rules pending for approval',
            'count': this.countPR[1],
            'path': 5,//Constants.SAME_SIM_NAV_MEDICAL_DIRECTOR_APPROVAL,
            'color': Constants.AVAILABLE_COLORS[1]
          }
        ]
      });
      this.createChartData();
    }

    this.cardsFlag=true;
  }

  clickItem(id) {

    switch (id) {      
      case 0:         
        this.router.navigateByUrl(PATH_BASE+Constants.SAME_SIM_NAV_INITIATE_ANALYSIS);
        break; 
      case 1:         
        this.router.navigateByUrl(PATH_BASE+Constants.SAME_SIM_NAV_POLICY_OWNER_APPROVAL);
        break;         
      case 2: 
        this.router.navigateByUrl(PATH_BASE+Constants.SAME_SIM_NAV_REASSIGNMENT_PO+"?tab="+ Constants.RETURNED_TAB);
        break; 
      case 3: 
        this.router.navigateByUrl(PATH_BASE+Constants.SAMESIM_NAV_REASSIGNMENT_CCA);
        break; 
      case 4: 
        this.router.navigateByUrl(PATH_BASE+Constants.SAME_SIM_NAV_FOR_MEDICAL_DIRECTOR_APPROVAL+"?tab="+ Constants.RETURNED_TAB);
        break; 
      case 5: 
        this.router.navigateByUrl(PATH_BASE+Constants.SAME_SIM_NAV_MEDICAL_DIRECTOR_APPROVAL);
        break;               
    }
  
  }

}
