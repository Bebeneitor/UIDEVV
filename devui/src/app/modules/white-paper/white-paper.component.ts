import { Component, OnInit, OnDestroy, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType, GridsterConfigService } from 'angular-gridster2';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { AppUtils } from 'src/app/shared/services/utils';
import { LibraryViewService } from 'src/app/services/library-view.service';
import { StorageService } from 'src/app/services/storage.service';
import { Constants } from 'src/app/shared/models/constants';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { WhitePaperService } from 'src/app/services/white-paper.service';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { WhitePaperDto } from 'src/app/shared/models/dto/white-paper-dto';
import { DashboardService } from 'src/app/services/dashboard.service';
import { PageTitleConstants } from 'src/app/shared/models/page-title-constants';
import { ConfirmationService } from 'primeng/api';
import { UtilsService } from 'src/app/services/utils.service';


declare var $: any;
let whitePaper;

const TYPE_CHART = 'CHART';
const TYPE_TABLE = 'TABLE';
const MAX_ITEMS = 20;

@Component({
  selector: 'app-white-paper',
  templateUrl: './white-paper.component.html',
  styleUrls: ['./white-paper.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WhitePaperComponent implements OnInit, OnDestroy, AfterViewInit {

  myWhitePaperTitle = PageTitleConstants.MY_WHITE_PAPERS_TITLE;
  type: string = "";
  private sub: any;

  options: GridsterConfig;
  dashboard: Array<GridsterItem>;

  modes: any[] = [
    { value: 'Bold', title: 'Bold', icon: 'fa fa-fw fa-bold' },
    { value: 'Italic', title: 'Italic', icon: 'fa fa-fw fa-italic' },
    { value: 'Underline', title: 'Underline', icon: 'fa fa-fw fa-underline' }
  ];

  alignments: any[] = [
    { value: 'left', title: 'Left', icon: 'fa fa fa-fw fa-align-left' },
    { value: 'center', title: 'Center', icon: 'fa fa-fw fa-align-center' },
    { value: 'right', title: 'Right', icon: 'fa fa-fw fa-align-right' },
    { value: 'justify', title: 'Justify', icon: 'fa fa-fw fa-align-justify' },
  ];

  fonts: any[] = [
    { value: "Arial", label: "Arial" },
    { value: "fantasy", label: "Fantasy" },
    { value: "monospace", label: "Monospace" },
    { value: "cursive", label: "Sans-Serif" },
    { value: "serif", label: "Serif" }
  ];

  sizes: any[] = [8, 9, 10, 11, 12, 13, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

  selectedId: number = 0;
  selectedStyle: any = {}

  textObject: any = {
    color: "#1F004C",
    size: "14px",
    modes: [],
    family: "Arial",
    alignment: "",
    background: "#FFFFFF",
    "overflow-wrap": "break-word"
  }

  imageObject: any = {
    base64: ""
  }

  items: any[];
  typeChartSelected: string = "";
  activeIndex: number = 0;
  titleDialog: string = "";
  typeDialog: string = "";
  displayTableRules: boolean = false;

  sourceColumns: any[] = [
    { name: "Rule Name", value: "ruleName" },
    { name: "Rule Description", value: "ruleDescription" },
    { name: "Line Of Business", value: "lobName" },
    { name: "Category", value: "categoryName" },
    { name: "State", value: "stateName" },
    { name: "Jurisdiction", value: "jurisdictionName" }
  ];
  targetColumns: any[] = [];

  colsRulesAdd: any[];
  dataRulesAdd: any[] = [];
  selectedRulesAdd: any[] = [];

  //For filter search
  lobs: any[] = [];
  lobsTable: any[] = [{ label: "All", value: null }];
  selectedLobs: any[] = [];

  categories: any[] = [];
  categoriesTable: any[] = [{ label: "All", value: null }];
  selectedCategories: any[] = [];

  jurisdictions: any[] = [];
  jurisdictionsTable: any[] = [{ label: "All", value: null }];
  selectedJurisdictions: any[] = [];

  states: any[] = [];
  statesTable: any[] = [{ label: "All", value: null }];
  selectedStates: any[] = [];

  engines: any[] = [];
  notEngines: any[] = [];
  genericEngines: any[] = [];
  enginesTable: any[] = [{ label: "All", value: null }];
  selectedImplementeds: any = [];
  selectedNotImplementeds: any = [];

  references: any[] = [];
  selectedReferences: any[] = [];

  referenceDocument: string = "";
  ruleDescription: string = "";
  ruleLogic: string = "";
  startDate: Date = new Date(new Date().getFullYear(), 0, 1);
  endDate: Date = new Date();

  minDate: Date = Constants.MIN_VALID_DATE;;
  maxDate: Date = new Date();

  clientRationale: string = "";
  scriptRationale: string = "";
  opportunityValue: string = "";

  preloadedTables: any[] = [
    {
      tableClass: "table-default-ecl",
      title: "Default"
    },
    {
      tableClass: "table-dark-purple",
      title: "Dark Purple"
    },
    {
      tableClass: "table-light-purple",
      title: "Light Purple"
    },
    {
      tableClass: "table-pink",
      title: "Pink"
    },
    {
      tableClass: "table-gray",
      title: "Gray"
    }
  ];

  preloadedTexts: any[] = [
    {
      textClass: "text-default-ecl",
      title: "Default"
    },
    {
      textClass: "text-normal",
      title: "Normal"
    },
    {
      textClass: "title-dark-purple",
      title: "Title Dark Purple"
    },
    {
      textClass: "title-light-purple",
      title: "Title Light Purple"
    },
    {
      textClass: "title-pink",
      title: "Title Pink"
    },
    {
      textClass: "title-gray",
      title: "Title Gray"
    }
  ];

  preloadedImages: any[] = [
    {
      title: "Default",
      style: {
        "width": "100%",
        "height": "100%"
      },
      divStyle: {
        "height": "100%"
      }
    },
    {
      title: "Rounded Image",
      style: {
        "border-radius": "50%",
        "width": "100%",
        "height": "100%"
      },
      divStyle: {
        "height": "100%"
      }
    },
    {
      title: "Metal Frame",
      style: {
        "border": "7px solid lightgray",
        "width": "100%",
        "height": "100%"
      },
      divStyle: {
        "height": "100%"
      }
    },
    {
      title: "Opacity 50%",
      style: {
        "opacity": "0.5",
        "width": "100%",
        "height": "100%"
      },
      divStyle: {
        "height": "100%"
      }
    },
    {
      title: "Rotated, White",
      style: {
        "transform": "rotate(15deg)",
        "border": "7px solid lightgrey",
        "min-height": "unset",
        "position": "unset",
        "width": "70%",
        "height": "100%"
      },
      divStyle: {
        "padding-left": "15%",
        "padding-right": "15%",
        "padding-top": "8%",
        "padding-bottom": "8%",
        "text-align": "center",
        "height": "100%"
      }
    }
  ];

  selectedIndex: number = -1;
  itemSelected: any = null;
  copySelection: any = null;

  preview: any = [];

  scrollPosition: number = 0;
  blockedDocument: boolean = false;

  selectedAxisX: string = "category";
  selectedAxisY: string = "amount";

  messageError: string = "";

  maxSlider: number = 1000000;
  rangeValues: number[] = [0, 500000];
  showSlider: boolean = true;
  addSavings: boolean = false;

  dataChart: any;

  showSavedWhitePapers: boolean = false;

  originalWhitePaper: WhitePaperDto = new WhitePaperDto();
  currentWhitePaper: WhitePaperDto = new WhitePaperDto();
  whitePapers: WhitePaperDto[] = [
  ];
  whitePapersShared: WhitePaperDto[] = [
  ];

  editable: boolean = true;

  yearValidRange = `${Constants.MIN_VALID_YEAR}:${Constants.MAX_VALID_YEAR}`;

  //Share functionality
  displaySharedModal: boolean = false;
  whitePaperToShare: number = 0;
  usersToShare: any = [];
  userSuggestions: any = [];
  userSuggestionsFiltered: any = [];
  whitePapersTab: string = "MY";

  constructor(private route: ActivatedRoute, private utils: AppUtils,
    private libraryViewService: LibraryViewService,
    private storageService: StorageService, private toastService: ToastMessageService,
    private whitePaperService: WhitePaperService, private dashboardService: DashboardService,
    private confirmationService: ConfirmationService,
    private utilService: UtilsService) {
    this.sub = this.route.params.subscribe(params => {
      //Inernal or external
      this.type = params['type'];

      this.init();
    });

    let is = this;

    window.onscroll = () => {
      is.scrollPosition = $(document).scrollTop().valueOf();
    }

    whitePaper = this;
  }

  ngOnInit() {
  }

  init() {

    //Initialize gridster options
    this.options = {
      gridType: GridType.VerticalFixed,
      compactType: CompactType.CompactUp,
      fixedRowHeight: 50,
      margin: 5,
      outerMargin: true,
      outerMarginTop: null,
      outerMarginRight: null,
      outerMarginBottom: null,
      outerMarginLeft: null,
      useTransformPositioning: true,
      mobileBreakpoint: 0,
      minCols: 6,
      maxCols: 6,
      minRows: 12,
      maxRows: 10000,
      maxItemCols: 10000,
      minItemCols: 1,
      maxItemRows: 10000,
      minItemRows: 1,
      maxItemArea: 10000,
      minItemArea: 1,
      defaultItemCols: 1,
      defaultItemRows: 1,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      scrollSensitivity: 10,
      scrollSpeed: 20,
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: false,
      enableEmptyCellDrag: false,
      enableOccupiedCellDrop: false,
      emptyCellDragMaxCols: 50,
      emptyCellDragMaxRows: 50,
      ignoreMarginInRow: true,
      draggable: {
        enabled: true,
        ignoreContent: true,
        dragHandleClass: "drag-icon"
      },
      resizable: {
        enabled: this.editable,
      },
      swap: false,
      pushItems: true,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushDirections: { north: true, east: true, south: true, west: true },
      pushResizeItems: false,
      displayGrid: DisplayGrid.None,
      disableWindowResize: false,
      disableWarnings: true,
      scrollToNewItems: false,
      keepFixedHeight: true,
      itemResizeCallback: this.itemResizeCallback
    };

    this.dashboard = [];

    //Initialize columns for rules table
    this.colsRulesAdd = [
      { field: 'ruleCode', header: 'Rule ID' },
      { field: 'ruleName', header: 'Rule Name' },
      { field: 'ruleDescription', header: 'Rule Description' },
      { field: 'lobName', header: 'LOB' },
      { field: 'stateName', header: 'State' },
      { field: 'jurisdictionName', header: 'Jurisdiction' },
      { field: 'categoryName', header: 'Category' },
      { header: "Client Rationale", field: "clientRationale" },
      { header: "Opportunity Value", field: "opportunityValue" },
      { header: "Rule Logic", field: "ruleLogic" },
      { header: "Savings", field: "revenue" },
    ];

    if (this.type == 'internal') {
      this.colsRulesAdd.push({ header: "Internal Rationale", field: "scriptRationale" });
    }

    window["html2canvas"] = html2canvas;

    $("body").css("overflow-x", "hidden");
    $("#router-outlet").css("padding-top", "0px");
    $("#router-outlet").css("background", "#EDEBE9");
  }

  public itemResizeCallback(item, itemComponent) {
    if (item && item.style) {
      item.style.height = itemComponent.height + 'px';
      whitePaper.saveDashboardInMemory();
    }
  }

  ngAfterViewInit() {
    window.scroll(0, 0);
  }

  /**
   * Unsubscribe from router navigation
   */
  ngOnDestroy() {

    this.sub.unsubscribe();

    $("body").css("overflow-x", "auto");
    $("#router-outlet").css("padding-top", "15px");
    $("#router-outlet").css("background", "#F0F1F5");
  }

  /**
   * Remove item from gridster
   * @param $event 
   * @param index
   */
  removeItem($event, index) {
    $event.preventDefault();
    $event.stopPropagation();

    this.dashboard.splice(index, 1);
    this.unselect();

    $("gridster-preview").remove();

    this.saveDashboardInMemory();
  }

  /**
   * Convert file to base64 String
   * @param file 
   */
  getBase64(file) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function (error) {
        resolve(null);
      };
    });
  }

  /**
   * Fired when change the file for add automatically
   * @param event 
   */
  onFileChange(event) {
    this.getBase64(event.target.files[0]).then(res => {
      this.imageObject.base64 = res;

      this.addImage();
    });
  }

  /**
   * Reset gridster document
   */
  reset() {
    this.confirmationService.confirm({
      message: 'All unsaved changes will be lost, do you want to continue?',
      header: 'White Papers',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.dashboard = [];

        this.unselect();

        this.selectedIndex = -1;
        this.selectedStyle = {};
        this.preview = [];

        this.currentWhitePaper = new WhitePaperDto();
        this.originalWhitePaper = new WhitePaperDto();

        this.editable = true;
        this.options.resizable.enabled = true;
        this.changedOptionsGridster();

        this.saveDashboardInMemory();
      }
    });

  }

  /**
   * Convert the girdster page to PDF and download it
   */
  pdf() {

    if (this.dashboard.length == 0) {
      return;
    }

    window.scroll(0, 0);

    this.blockedDocument = true;

    let is = this;

    let arrPreview = Object.assign([], this.dashboard);//JSON.parse(JSON.stringify(this.dashboard));

    arrPreview.sort(function (a, b) {
      return a.y - b.y || a.x - b.x;
    });

    let y = -1;
    let realPreview = [];

    arrPreview.forEach(element => {


      if (y == -1 || y != element.y) {

        if (y > -1 && realPreview.length > 0) {
          //Check last position to add spaces
          realPreview[realPreview.length - 1] = is.addSpaces(realPreview[realPreview.length - 1]);
        }

        realPreview.push([]);
      }

      realPreview[realPreview.length - 1].push(element);

      y = element.y;
    });

    //Check last position to add spaces
    if (realPreview.length > 0) {
      //Check last position to add spaces
      realPreview[realPreview.length - 1] = is.addSpaces(realPreview[realPreview.length - 1]);
    }

    this.preview = realPreview;

    setTimeout(function () {
      is.makePDF();
    }, 1000);
  }

  addSpaces(rowPreview) {
    let start = 0;
    let count = 0;
    let added = [];


    for (let i = 0; i < rowPreview.length; i++) {
      if (rowPreview[i].x > start) {
        //Add space between 0 and x
        added.push({
          id: new Date().getTime(),
          x: start,
          y: rowPreview[i].y,
          cols: rowPreview[i].x - start,
          rows: rowPreview[i].rows,
          selected: false,
          type: "SPACE"
        });
      }

      count = rowPreview[i].x + 1;
      start = start + rowPreview[i].cols;
    }

    rowPreview = rowPreview.concat(added);

    rowPreview.sort(function (a, b) {
      return a.x - b.x;
    });

    return rowPreview;
  }

  makePDF() {
    let quotes = document.getElementById('containerPreview');

    let pdf = new jspdf('p', 'mm', 'a4');
    let is = this;

    let options: any = {
      scale: 1,
      pagesplit: true
    };

    $("html").addClass("hide-scrollbar");

    html2canvas(quotes, options).then(canvas => {

      for (let i = 0; i <= quotes.clientHeight / 980; i++) {

        let srcImg = canvas;

        let width = $(srcImg).width(); // 974
        let height = 1420;

        let sX = 0;
        let sY = height * i;
        let sWidth = width;
        let sHeight = height;
        let dX = 0;
        let dY = 0;
        let dWidth = width;
        let dHeight = height;

        let onePageCanvas: any = document.createElement("canvas");
        onePageCanvas.setAttribute('width', width);
        onePageCanvas.setAttribute('height', height);
        let ctx = onePageCanvas.getContext('2d');

        ctx.drawImage(srcImg, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);

        let canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);

        let imgWidth = 180; //210
        let imgHeight = onePageCanvas.height * imgWidth / onePageCanvas.width;

        if (i > 0) {
          pdf.addPage();
        }

        pdf.setPage(i + 1);

        pdf.addImage(canvasDataURL, 'PNG', 15, 15, (imgWidth), (imgHeight));

      }

      $("html").removeClass("hide-scrollbar");
      this.blockedDocument = false;

      pdf.save('white-paper-' + is.type + '.pdf');
    });
  }

  /**
   * Add text box to gridster document
   */
  addText() {
    this.dashboard.push({
      id: (new Date().getTime()),
      x: 0,
      y: 0,
      cols: 3,
      rows: 1,
      type: "TEXT",
      text: "",
      preloadedClass: "text-default-ecl",
      style: {
        "color": "#1F004C",
        "font-size": "14px",
        "font-family": "Arial",
        "background-color": "#FFFFFF",
        "height": "40px",
        "overflow-wrap": "break-word"
      },
      selected: false
    });

    this.saveDashboardInMemory();
  }

  openImageSelector() {
    $("#fileImage").click();
  }

  //EVENTS FOR CHANGE STYLE OF ITEMS IN THE WITHE PAPER

  getItem(id) {
    let item = null;

    for (let i = 0; i < this.dashboard.length; i++) {
      if (this.dashboard[i].id == id) {
        item = this.dashboard[i];
        break;
      }
    }

    return item;
  }

  clearSelectedItems(id) {
    for (let i = 0; i < this.dashboard.length; i++) {
      this.dashboard[i].selected = false;

      if (id != null) {
        if (this.dashboard[i].id == id) {
          this.dashboard[i].selected = true;
        }
      }
    }

    this.saveDashboardInMemory();
  }

  selectItem(id, type, index) {

    if (!this.editable) {
      return;
    }

    this.itemSelected = this.getItem(id);
    this.selectedIndex = index;

    if (this.itemSelected != null) {
      this.clearSelectedItems(id);
      this.selectedStyle = this.itemSelected.style;
      this.selectedId = id;

      switch (type) {
        case "TEXT":
          //Update text option in bais style
          this.textObject.family = this.selectedStyle["font-family"];
          this.textObject.size = this.selectedStyle["font-size"];
          this.textObject.color = this.selectedStyle["color"];
          this.textObject.background = this.selectedStyle["background-color"];

          //Modes
          this.textObject.modes = [];

          if (this.selectedStyle["font-weight"] != undefined) {
            this.textObject.modes.push("Bold");
          }

          if (this.selectedStyle["font-style"] != undefined) {
            this.textObject.modes.push("Italic");
          }

          if (this.selectedStyle["text-decoration"] != undefined) {
            this.textObject.modes.push("Underline");
          }
          break;
      }
    }
  }

  unselect() {
    this.textObject = {
      color: "#1F004C",
      size: "14px",
      modes: [],
      family: "Arial",
      alignment: "",
      background: "#FFFFFF",
      "overflow-wrap": "break-word"
    }

    this.selectedId = 0;
    this.selectedStyle = {};

    this.clearSelectedItems(null);
  }

  setSelectedStyle() {
    for (let i = 0; i < this.dashboard.length; i++) {
      if (this.dashboard[i].id == this.selectedId) {
        this.dashboard[i].style = JSON.parse(JSON.stringify(this.selectedStyle));
        break;
      }
    }

    this.saveDashboardInMemory();
  }

  changeText(event, item) {
    item.text = event.target.innerHTML;
    item.style.height = event.target.offsetHeight + 'px';
    this.saveDashboardInMemory();
  }

  changeTextTable(event, data, column) {
    data[column.value] = event.target.innerHTML;

    this.saveDashboardInMemory();
  }

  changeFontFamily() {
    this.selectedStyle["font-family"] = this.textObject.family;

    this.setSelectedStyle();
  }

  changeFontSize() {
    this.selectedStyle["font-size"] = this.textObject.size;

    this.setSelectedStyle();
  }

  changeFontColor(event) {
    this.textObject["color"] = event.value;
    this.selectedStyle["color"] = event.value;

    this.setSelectedStyle();
  }

  changeBackgroundColor(event) {
    this.textObject["background"] = event.value;
    this.selectedStyle["background-color"] = event.value;

    this.setSelectedStyle();
  }

  changeFontModes(event) {

    delete this.selectedStyle["font-weight"];
    delete this.selectedStyle["font-style"];
    delete this.selectedStyle["text-decoration"];

    for (let i = 0; i < this.textObject.modes.length; i++) {
      switch (this.textObject.modes[i]) {
        case "Bold":
          this.selectedStyle["font-weight"] = "bold";
          break;
        case "Italic":
          this.selectedStyle["font-style"] = "italic";
          break;
        case "Underline":
          this.selectedStyle["text-decoration"] = "underline";
          break;
      }
    }

    this.setSelectedStyle();
  }

  changeFontAlignment(event) {
    this.selectedStyle["text-align"] = this.textObject.alignment;
    this.setSelectedStyle();
  }

  increaseFontSize() {
    let currentSize = Number(this.textObject.size.replace("px", ""));
    currentSize = currentSize + 2;

    if (currentSize > 72) {
      return;
    }

    this.textObject.size = currentSize + "px";
    this.selectedStyle["font-size"] = currentSize + "px";

    this.setSelectedStyle();
  }

  decreaseFontSize() {
    let currentSize = Number(this.textObject.size.replace("px", ""));
    currentSize = currentSize - 2;

    if (currentSize < 8) {
      return;
    }

    this.textObject.size = currentSize + "px";
    this.selectedStyle["font-size"] = currentSize + "px";

    this.setSelectedStyle();
  }

  addImage() {
    this.dashboard.push({
      id: (new Date().getTime()),
      x: 0,
      y: 0,
      cols: 2,
      rows: 2,
      type: "IMAGE",
      source: this.imageObject.base64,
      style: {
      },
      divStyle: {

      }
    });

    this.imageObject = {
      base64: ""
    }

    $("#fileImage").val("");

    this.saveDashboardInMemory();
  }

  openModalTableRules() {

    this.clearModalRules();

    //Initialize steps to add rule table
    this.items = [
      {
        label: 'Search Rules',
        command: (event: any) => {
          this.activeIndex = 0;
        }
      },
      {
        label: 'Select Rules',
        command: (event: any) => {
          this.activeIndex = 1;
        }
      },
      {
        label: 'Select Columns',
        command: (event: any) => {
          this.activeIndex = 2;
        }
      },
      {
        label: 'Finish',
        command: (event: any) => {
          this.activeIndex = 3;
        }
      }
    ];

    this.displayTableRules = true;

    this.typeDialog = TYPE_TABLE;
    this.titleDialog = "Add Rules (Table)";

    this.loadCatalogues();
  }

  openModalChartRules() {

    this.clearModalRules();

    //Initialize steps to add rule table
    this.items = [
      {
        label: 'Search Rules',
        command: (event: any) => {
          this.activeIndex = 0;
        }
      },
      {
        label: 'Select Type Chart',
        command: (event: any) => {
          this.activeIndex = 1;
        }
      },
      {
        label: 'Select Group',
        command: (event: any) => {
          this.activeIndex = 2;
        }
      },
      {
        label: 'Finish',
        command: (event: any) => {
          this.activeIndex = 3;
        }
      }
    ];

    this.displayTableRules = true;

    this.typeDialog = TYPE_CHART;
    this.titleDialog = "Add Rules (Chart)";

    this.loadCatalogues();
  }

  /**
   * Define how much elements can be selected
   * in multiselect dropdown
   */
  getSelectionLimit() {
    if (this.typeDialog === TYPE_CHART) {
      return MAX_ITEMS;
    } else {
      return null;
    }
  }

  clearModalRules() {
    this.typeChartSelected = "";
    this.referenceDocument = "";
    this.selectedLobs = [];
    this.selectedCategories = [];
    this.selectedJurisdictions = [];
    this.selectedStates = [];
    this.selectedImplementeds = [];
    this.selectedNotImplementeds = [];
    this.selectedReferences = [];
    this.ruleDescription = "";
    this.ruleLogic = ""
    this.startDate = new Date(new Date().getFullYear(), 0, 1);
    this.endDate = new Date();

    this.selectedAxisX = "category";
    this.selectedAxisY = "amount";

    this.clientRationale = "";
    this.scriptRationale = "";
    this.opportunityValue = "";

    this.activeIndex = 0;
    this.messageError = "";
    this.dataChart = undefined;

    this.targetColumns = [];
    this.sourceColumns = [
      { name: "Rule Code", value: "ruleCode" },
      { name: "Rule Name", value: "ruleName" },
      { name: "Rule Description", value: "ruleDescription" },
      { name: "Line Of Business", value: "lobName" },
      { name: "Category", value: "categoryName" },
      { name: "State", value: "stateName" },
      { name: "Jurisdiction", value: "jurisdictionName" },
      { name: "Savings", value: "revenue" },
      { name: "Client Rationale", value: "clientRationale" },
      { name: "Opportunity Value", value: "opportunityValue" },
      { name: "Rule Logic", value: "ruleLogic" },
    ];

    if (this.type == 'internal') {
      this.sourceColumns.push({ name: "Internal Rationale", value: "scriptRationale" });
    }
  }

  changeTypeChart(chart) {
    this.typeChartSelected = chart;
  }

  /**
   * Initialize catalogues 
   */
  loadCatalogues() {

    this.categories = [];
    this.jurisdictions = [];
    this.states = [];
    this.lobs = [];

    this.utils.getAllCategoriesValue(this.categories, false);
    this.utils.getAllJurisdictionsValue(this.jurisdictions, false);
    this.utils.getAllStatesValue(this.states, false);
    this.utils.getAllLobsValue(this.lobs, false);

    this.genericEngines = [];
    this.utils.getAllEngines(this.genericEngines, false).then((response) => {
      this.engines = JSON.parse(JSON.stringify(this.genericEngines));
      this.notEngines = JSON.parse(JSON.stringify(this.genericEngines));
    });

    this.references = [];
    this.utils.getAllReferencesValue(this.references, false);
  }

  /**
   * When user changes implemented checkboxes, this function is for disable
   * the same value in not implemented array
   * @param event 
   */
  changeImplemented(event) {
    //If item is selected this disable the same item in not implemented array
    //and remove from not implemented selected array

    for (let i = 0; i < this.notEngines.length; i++) {
      this.notEngines[i]["disabled"] = false;
    }

    for (let i = 0; i < this.notEngines.length; i++) {
      for (let j = 0; j < this.selectedImplementeds.length; j++) {
        if (this.selectedImplementeds[j] == this.notEngines[i].value) {
          this.notEngines[i]["disabled"] = true;
          break;
        }
      }
    }
  }

  /**
   * When user changes not implemented checkboxes, this function is for disable
   * the same value in implemented array
   * @param event 
   */
  changeNotImplemented(event) {
    //If item is selected this disable the same item in implemented array
    //and remove from implemented selected array

    for (let i = 0; i < this.engines.length; i++) {
      this.engines[i]["disabled"] = false;
    }

    for (let i = 0; i < this.engines.length; i++) {
      for (let j = 0; j < this.selectedNotImplementeds.length; j++) {
        if (this.selectedNotImplementeds[j] == this.engines[i].value) {
          this.engines[i]["disabled"] = true;
          break;
        }
      }
    }
  }

  getJsonRequest() {
    let json = {};

    json["lobs"] = this.selectedLobs.length == 0 ? [] : this.selectedLobs;
    json["states"] = this.selectedStates.length == 0 ? [] : this.selectedStates;
    json["jurisdictions"] = this.selectedJurisdictions.length == 0 ? [] : this.selectedJurisdictions;
    json["categories"] = this.selectedCategories.length == 0 ? [] : this.selectedCategories;
    json["references"] = this.selectedReferences.length == 0 ? [] : this.selectedReferences;

    if (this.addSavings) {
      json["rulesBySavings"] = [{ "min": this.rangeValues[0], "max": this.rangeValues[1] }];
    } else {
      json["rulesBySavings"] = [];
    }

    json["implemented"] = this.selectedImplementeds.length == 0 ? [] : this.selectedImplementeds;
    json["notImplemented"] = this.selectedNotImplementeds.length == 0 ? [] : this.selectedNotImplementeds;
    json["referenceDocument"] = this.referenceDocument == '' ? null : this.referenceDocument;
    json["ruleDescription"] = this.ruleDescription == '' ? null : this.ruleDescription;
    json["ruleLogic"] = this.ruleLogic == '' ? null : this.ruleLogic;
    json["logicEffectiveDate"] = {
      "initialDate": this.startDate,
      "finalDate": this.endDate
    };
    json["referenceSources"] = this.selectedReferences.length == 0 ? [] : this.selectedReferences;
    json["clientRationale"] = this.clientRationale == '' ? null : this.clientRationale;
    json["scriptRationale"] = this.scriptRationale == '' ? null : this.scriptRationale;
    json["opportunityValue"] = this.opportunityValue == '' ? null : this.opportunityValue;

    return json;
  }

  /**
   * Load from backend the rules that match with filters 
   */
  loadRulesToAdd() {
    try {
      this.messageError = "";
      this.dataRulesAdd = [];
      this.selectedRulesAdd = [];

      let request: any = this.getJsonRequest();
      let uiTableOptions = new EclTableModel();
      uiTableOptions.criteriaFilters = request;
      uiTableOptions.lazy = false;

      this.libraryViewService.getRulesByFilters(uiTableOptions).then((response: any) => {
        for (let i = 0; i < response.length; i++) {

          this.dataRulesAdd.push({
            "index": i,
            "ruleCode": response[i].ruleCode,
            "ruleName": response[i].ruleName,
            "ruleDescription": response[i].ruleDescription,
            "lobName": response[i].lob,
            "stateName": response[i].state,
            "jurisdictionName": response[i].jurisdiction,
            "categoryName": response[i].category,
            "revenue": response[i].saving,
            "clientRationale": response[i].clientRationale == undefined ? '' : response[i].clientRationale,
            "scriptRationale": response[i].internalRationale == undefined ? '' : response[i].internalRationale,
            "opportunityValue": response[i].opportunityValue == undefined ? '' : response[i].opportunityValue,
            "ruleLogic": response[i].ruleLogic == undefined ? '' : response[i].ruleLogic
          });
        }

        this.dataRulesAdd = JSON.parse(JSON.stringify(this.dataRulesAdd));

        if (this.dataRulesAdd.length > 0) {
          this.activeIndex = 1;
        } else {
          this.messageError = "No rules were found using the selected filters, verify and try again.";
        }
      });
    } catch (e) {
      this.messageError = "No rules were found using the selected filters, verify and try again.";
    }
  }

  /**
   * Add table item into gridster document
   */
  finishRulesAdd() {

    this.displayTableRules = false;

    this.dashboard.push({
      id: (new Date().getTime()),
      x: 0,
      y: 0,
      cols: 6,
      rows: 5,
      type: TYPE_TABLE,
      preloadedClass: "table-default-ecl",
      columns: JSON.parse(JSON.stringify(this.targetColumns)),
      data: JSON.parse(JSON.stringify(this.selectedRulesAdd)),
      headerStyle: {},
      bodyStyle: {},
      selected: false
    });

    this.saveDashboardInMemory();
  }

  /**
   * Create a random color for the charts
   */
  getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  /**
   * Parse selected data to array data
   */
  parseSelectedData(selectedData, data) {

    let parseData = [];

    data.forEach(item => {
      selectedData.forEach(selectedItem => {
        if (selectedItem === item.value) {
          parseData.push(item);
        }
      });
    });

    return parseData;
  }

  selectGroupPrev() {
    this.activeIndex = 1;
    this.messageError = "";
  }

  selectGroupNext() {
    let noDataMessage = true;
    this.fillDataChart();

    this.dataChart.data.forEach(item => {
      if (item > 0) {
        noDataMessage = false;
      }
    });

    if (noDataMessage) {
      this.messageError = "No data was found using the selected configuration, verify and try again.";
    } else {
      this.messageError = "";
      this.activeIndex = 3;
    }
  }

  private fillDataChart() {
    let labels = [];
    let data = [];
    let colors = [];

    let axisx = [];
    let attrSelected = "";

    switch (this.selectedAxisX) {
      case "category":
        axisx = this.selectedCategories.length > 0 ? this.parseSelectedData(this.selectedCategories, this.categories) : this.categories;
        attrSelected = "categoryName";
        break;
      case "jurisdiction":
        axisx = this.selectedJurisdictions.length > 0 ? this.parseSelectedData(this.jurisdictions, this.categories) : this.jurisdictions;
        attrSelected = "jurisdictionName";
        break;
      case "lob":
        axisx = this.selectedLobs.length > 0 ? this.parseSelectedData(this.selectedLobs, this.lobs) : this.lobs;
        attrSelected = "lobName";
        break;
      case "state":
        axisx = this.selectedStates.length > 0 ? this.parseSelectedData(this.selectedStates, this.states) : this.states;
        attrSelected = "stateName";
        break;
    }

    let auxLabels = [];

    for (let i = 0; i < axisx.length; i++) {
      auxLabels.push(axisx[i].label);
    }

    //For each axis check
    for (let i = 0; i < auxLabels.length; i++) {
      let count = 0;

      for (let j = 0; j < this.dataRulesAdd.length; j++) {

        let strCompare = this.dataRulesAdd[j][attrSelected];

        if (strCompare && strCompare.includes(auxLabels[i])) {
          if (this.selectedAxisY == "revenue") {
            count = count + this.dataRulesAdd[j].revenue;
          } else {
            count++;
          }
        }
      }

      if (count >= 0) {
        labels.push(auxLabels[i]);
        data.push(count);
        colors.push(this.getRandomColor());
      }

    }
    this.dataChart = {
      labels,
      data,
      colors
    }
  }

  finishChartRulesAdd() {
    this.displayTableRules = false;

    let finalType = "";

    if (!this.dataChart) {
      this.fillDataChart();
    }
    let labels = this.dataChart.labels;
    let data = this.dataChart.data;
    let colors = this.dataChart.colors;

    let options = {
      legend: {
        display: false,
        position: 'left'
      },
      animation: {
        duration: 0
      }
    };

    let rows = 9;

    switch (this.typeChartSelected) {
      case "LINE":
        finalType = "line";
        break;
      case "PIE":
        finalType = "pie";
        options.legend.display = false;
        rows = 14;
        break;
      case "DONUT":
        finalType = "doughnut";
        options.legend.display = false;
        rows = 14;
        break;
      case "BAR":
        finalType = "bar";
        break;
    }

    let objChart = {
      labels: labels,
      colors: colors,
      datasets: [
        {
          backgroundColor: colors,
          borderColor: colors,
          data: data,
          fill: false
        }
      ]
    }

    let noDataMessage = true;

    data.forEach(item => {
      if (item > 0) {
        noDataMessage = false;
      }
    });

    let classColumn = '';

    switch (labels.length) {
      case 0:
      case 1:
        classColumn = 'col-12 text-center';
        break;
      case 2:
        classColumn = 'col-6 text-center';
        break;
      case 3:
        classColumn = 'col-4 text-center';
        break;
      default:
        classColumn = 'col-3';
        break;
    }

    if (noDataMessage) {
      rows = 3;
    }

    let json = {
      id: (new Date().getTime()),
      x: 0,
      y: 0,
      cols: 6,
      rows: rows,
      type: TYPE_CHART,
      options: options,
      strData: JSON.stringify(objChart),
      data: objChart,
      typeChart: finalType,
      selected: false,
      classColumnLabels: classColumn,
      noDataMessage: noDataMessage
    };

    this.dashboard.push(json);

    this.saveDashboardInMemory();
  }

  changePreloadImageStyle(style, divStyle) {
    if (this.selectedId == 0 || !this.editable) {
      return;
    }

    for (let i = 0; i < this.dashboard.length; i++) {
      if (this.dashboard[i].id == this.selectedId) {

        if (this.dashboard[i].type != "IMAGE") {
          break;
        }

        this.dashboard[i].style = style;
        this.dashboard[i].divStyle = divStyle;
        break;
      }
    }

    this.saveDashboardInMemory();
  }

  changePreloadTableStyle(newClass) {

    if (this.selectedId == 0 || !this.editable) {
      return;
    }

    for (let i = 0; i < this.dashboard.length; i++) {
      if (this.dashboard[i].id == this.selectedId) {

        if (this.dashboard[i].type != TYPE_TABLE) {
          break;
        }

        this.dashboard[i].preloadedClass = newClass;
        break;
      }
    }

    this.saveDashboardInMemory();
  }

  changePreloadTextStyle(newClass) {

    if (this.selectedId == 0 || !this.editable) {
      return;
    }

    for (let i = 0; i < this.dashboard.length; i++) {
      if (this.dashboard[i].id == this.selectedId) {

        if (this.dashboard[i].type != "TEXT") {
          break;
        }

        this.dashboard[i].preloadedClass = newClass;
        this.dashboard[i].style = {};
        this.selectedStyle = {};

        this.textObject = {
          color: "#1F004C",
          size: "14px",
          modes: [],
          family: "Arial",
          alignment: "",
          background: "#FFFFFF",
          "overflow-wrap": "break-word"
        }

        break;
      }
    }

    this.saveDashboardInMemory();
  }

  /**
   * Copy item in memory variable
   */
  copy() {
    if (this.itemSelected != null) {
      this.copySelection = JSON.parse(JSON.stringify(this.itemSelected));
      this.copySelection.id = (new Date().getTime());
      this.copySelection.selected = false;
    }
  }

  /**
   * Paste the item copied
   */
  paste() {
    if (this.copySelection != null) {
      this.dashboard.push(this.copySelection);
      this.copySelection = null;

      this.saveDashboardInMemory();
    }
  }

  /**
   * Remove item from gridster document when select an item and click in button
   * trash from text tab
   */
  trash() {
    if (this.selectedIndex >= 0) {
      this.dashboard.splice(this.selectedIndex, 1);
      this.selectedIndex = -1;
      this.unselect();

      this.saveDashboardInMemory();
    }
  }

  /**
   * Save whitepaper in session
   */
  saveDashboardInMemory() {
    this.storageService.set("WHITEPAPER_DASHBOARD_" + this.type.toUpperCase(), this.getDashboardForMemory(), true);
  }

  getDashboardForMemory() {
    let arrDashboard = [];

    this.dashboard.forEach(element => {

      element.selected = false;

      if (element.type == TYPE_CHART) {
        element.data = JSON.parse(element.strData);
      }

      arrDashboard.push(element);
    });

    return arrDashboard;
  }

  /**
   * Check if need to enable states (Only if select medicaid in lobs)
   */
  checkMedicaid() {
    let check = false;
    //Enable state
    for (let i = 0; i < this.selectedLobs.length; i++) {
      if (this.selectedLobs[i] == 1) {
        check = true;
        break;
      }
    }
    return !check;
  }

  /**
   * Check if need to enable jurisdiction (Only if select medicare in lobs)
   */
  checkMedicare() {
    let check = false;
    //Enable jurisdiction
    for (let i = 0; i < this.selectedLobs.length; i++) {
      if (this.selectedLobs[i] == 2) {
        check = true;
        break;
      }
    }
    return !check;
  }

  /**
   * Event when change values in lob multiselect
   * Method to check and clear states or jurisdiction arrays
   * if Medicaid or medicare are not selected in new values
   */
  changeLob() {
    let isMedicare = false;
    let isMedicaid = false;

    for (let i = 0; i < this.selectedLobs.length; i++) {
      if (this.selectedLobs[i] == 1) {
        isMedicaid = true;
      }
      if (this.selectedLobs[i] == 2) {
        isMedicare = true;
      }
    }

    if (!isMedicaid) {
      this.selectedStates = [];
    }

    if (!isMedicare) {
      this.selectedJurisdictions = [];
    }
  }

  /**
   * Save white paper in data base
   */
  save(saveSection) {
    this.blockedDocument = true;

    let data = this.getDashboardForMemory();

    //Save json file in data base
    this.whitePaperService.uploadWhitePaper(data, this.currentWhitePaper).then((fileId: number) => {

      this.currentWhitePaper.fileId = fileId;
      
      if (this.originalWhitePaper.draft && this.currentWhitePaper.whitePaperId > 0) {
        //Update white paper 
        this.whitePaperService.update(this.currentWhitePaper).subscribe((response: BaseResponse) => {
          this.saveEvent(response, saveSection);
        }, () => {
          this.blockedDocument = false;
        });
      } else {
        this.whitePaperService.save(this.currentWhitePaper.whitePaperName, fileId, this.currentWhitePaper.draft).subscribe((response: BaseResponse) => {
          this.saveEvent(response, saveSection);
        }, () => {
          this.blockedDocument = false;
        });
      }

    });

  }

  /**
   * Event when save finish
   * @param response 
   * @param saveSection 
   */
  saveEvent(response, saveSection) {
    if (response) {
      saveSection.hide();

      if (this.currentWhitePaper.draft) {
        this.toastService.messageSuccess("Success!", "Draft successfully saved.");
        this.currentWhitePaper.whitePaperId = response.data.whitePaperId;
        this.originalWhitePaper = JSON.parse(JSON.stringify(this.currentWhitePaper));
      } else {
        this.toastService.messageSuccess("Success!", "White paper was saved successfully.");
        this.currentWhitePaper = new WhitePaperDto();
        this.originalWhitePaper = new WhitePaperDto();
      }

      this.editable = true;
      this.options.resizable.enabled = true;
      this.changedOptionsGridster();
      this.blockedDocument = false;
    }
  }

  /**
   * Show saved white papers
   */
  showSaved() {
    this.changeTabWhitePapers('MY');
  }

  /**
   * Open modal to share white paper
   * @param whitePaperId 
   */
  openSharedModal(whitePaperId: number) {
    this.usersToShare = [];

    this.utilService.getAllUsers().subscribe(response => {
      this.whitePaperService.getSharedUsers(whitePaperId).subscribe((responseUsers: BaseResponse) => {
        
        this.usersToShare = responseUsers.data;

        this.showSavedWhitePapers = false;
        this.whitePaperToShare = whitePaperId;
        this.displaySharedModal = true;
        this.userSuggestions = response;
      });      
    });
  }

  /**
   * Fire share event
   */
  shareWhitePaper() {
    this.displaySharedModal = false;
    this.blockedDocument = true;

    let users: number[] = [];

    this.usersToShare.forEach(item => {
      users.push(item.userId);
    });

    this.whitePaperService.share(this.whitePaperToShare, users).subscribe((response: BaseResponse) => {
      this.toastService.messageSuccess('White Papers', 'White paper shared sucessfully.');
      this.blockedDocument = false;
    });
  }

  /**
   * Change tab in sidebar (my white papers and shared documents)
   * @param tab 
   */
  changeTabWhitePapers(tab) {
    this.whitePapersTab = tab;

    switch (this.whitePapersTab) {
      case 'MY':
        this.whitePaperService.loadByUser().subscribe((response: BaseResponse) => {
          if (response) {
            this.whitePapers = response.data;
            this.showSavedWhitePapers = true;
          }
        });
        break;
      case 'SHARED':
        this.whitePaperService.loadSharedWithMe(this.utils.getLoggedUserId()).subscribe((response: BaseResponse) => {
          if (response) {
            this.whitePapersShared = response.data;
            this.showSavedWhitePapers = true;
          }
        });
        break;
    }
  }

  /**
   * Filter users in share modal
   * @param event 
   */
  filterUsersToShare(event) {
    this.userSuggestionsFiltered = JSON.parse(JSON.stringify(this.userSuggestions));
    this.userSuggestionsFiltered = this.userSuggestions.filter((user)=>{
      return user.userName.toLowerCase().indexOf(event.query.toLowerCase()) >= 0 ||
      user.firstName.toLowerCase().indexOf(event.query.toLowerCase()) >= 0 ||
      (user.email == null ? '' : user.email).toLowerCase().indexOf(event.query.toLowerCase()) >= 0; 
    })
  }

  /**
   * Open white saved white papers by user
   * @param whitePaper 
   */
  openWhitePaper(whitePaper) {
    this.showSavedWhitePapers = false;

    this.blockedDocument = true;

    this.originalWhitePaper = JSON.parse(JSON.stringify(whitePaper));
    this.currentWhitePaper = whitePaper;

    this.whitePaperService.downloadWhitePaper(this.currentWhitePaper.fileId).then((response: any) => {
      this.dashboard = response; //Assign json content file
      this.editable = this.currentWhitePaper.draft;
      this.options.resizable.enabled = this.currentWhitePaper.draft;
      this.changedOptionsGridster();
      this.blockedDocument = false;
    });
  }

  /**
   * Open shared document in the template
   * @param whitePaper 
   */
  openSharedWhitePaper(whitePaper) {
    this.showSavedWhitePapers = false;

    this.blockedDocument = true;

    this.originalWhitePaper = JSON.parse(JSON.stringify(whitePaper));
    this.currentWhitePaper = whitePaper;

    this.whitePaperService.downloadWhitePaper(this.currentWhitePaper.fileId).then((response: any) => {
      this.dashboard = response;
      this.editable = false;
      this.options.resizable.enabled = false;
      this.changedOptionsGridster();
      this.blockedDocument = false;
    });
  }

  /**
   * Check if the options changed
   */
  changedOptionsGridster() {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  checkSavings(index, value) {

    let auxRange = JSON.parse(JSON.stringify(this.rangeValues));

    this.showSlider = false;
    this.rangeValues = [Number(auxRange[0]), Number(auxRange[1])];
    this.showSlider = true;
  }
}