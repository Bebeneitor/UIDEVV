import { EclButtonTable } from './ecl-button';
import { EclColumnStyles } from './ecl-column-style';
import { EclTableCommentsConfig } from './ecl-comments-config';

export class EclColumn {

    public static ICON = 'icon';
    public static DROPDOWN = 'dropdown';
    public static INPUT = 'input';
    public static TEXT = 'text';
    public static LINK = 'link';
    public static OVERLAY_PANEL = 'overlayPanel';
    public static DATE = 'date';
    public static CATEGORY = 'category';
    public static LOB = 'lob';
    public static JURISDICTION = 'jurisdiction';
    public static STATE = 'state';
    public static LOOKUP = 'lookup';
    public static STATUS = 'status';
    public static BUTTONS = 'buttons';
    public static CALENDAR = 'calendar';
    public static CHECK = 'check';
    public static MULTI_LINE_LINK = 'multiLineLink';
    public static MULTI_LINE_TEXT = 'multiLineText';
    public static DNB_LINK = 'DNB_LINK';
    public static LINK_WITH_ICON = 'linkWithIcon';
    public static TEXT_WITH_ICON = 'textWithIcon';
    public static DATE_TEXT = 'datetext';
    public static TEXT_WITH_NUMBER = 'textWithNumber';
    public static CHECK_ICON_IND = 'checkIconInd';
    public static SWITCH = 'switch';
    public static CHECK_MULTI_ICON_IND = 'checkMultiIconInd';
    public static SIMPLE_TEXT = 'simpleText';
    public static COMMENTS = 'comments';
    public static DNB_VERSION= 'DNB_VERSION'
    public static DATE_TIME_ZONE = "date_time_zome";

    field: string;
    header: string;
    width: string;
    filter: boolean;
    columnType: string;
    filterType: string;
    iconImage: string; //Image icon to display in case colum is an icon
    iconImages: string[];
    buttons: EclButtonTable[];
    optionsDropDown: any[];
    onChangeDropDown: Function = null;
    sort: boolean;
    maxLength: number;
    alignment: string;
    fieldOptions: string;
    pipeName: string;
    pipeFormat: string;
    checked:boolean;
    controlCheckColumn : number;
    showPartOfData: string = '';
    textIconField: string;
    textIconImage: string;
    shouldDisplay: Function = null;
    styles: EclColumnStyles[];
    toolTipDescriptionField: string;
    isOverlayPanel: boolean = false;
    dateRange: string;    
    commentsConfig: EclTableCommentsConfig;
    maxDate: string;

    constructor(
        field: string,
        header: string,
        width: string,
        filter: boolean,
        columnType: string,
        filterType: string = EclColumn.TEXT,
        iconImage: string = 'fa fa-check',
        iconImages: string[] = [],
        buttons: EclButtonTable[] = [],
        optionsDropDown: any[] = [],
        onChangeDropDown = null,
        sort: boolean = false,
        maxLength: number = 0,
	    fieldOptions: string = '',
        alignment: string = 'left',
        pipeName: string = null,
        pipeFormat: string = null,
        checked:boolean = false,
        controlCheckColumn:number = 0,
        showPartOfData: string = '',
        textIconField: string = '',
        textIconImage: string = '',
        shouldDisplay = null,
        styles: EclColumnStyles[] = null,
        toolTipDescriptionField: string = '',
        isOverlayPanel: boolean = false, 
        dateRange?,        
        commentsConfig: EclTableCommentsConfig = null,
        maxDate?,
        ) {

        if (this.columnType == EclColumn.ICON || this.columnType == EclColumn.BUTTONS || this.columnType == EclColumn.DROPDOWN || this.columnType == EclColumn.INPUT) {
            filter = false;
        }

        this.field = field;
        this.header = header;
        this.width = width;
        this.filter = filter;
        this.columnType = columnType;
        this.filterType = filterType;
        this.iconImage = iconImage;
        this.iconImages = iconImages;
        this.buttons = buttons;
        this.optionsDropDown = optionsDropDown;
        this.onChangeDropDown = onChangeDropDown;
        this.sort = sort;
        this.maxLength = maxLength;
        this.alignment = alignment;
        this.fieldOptions = fieldOptions;
        this.pipeName = pipeName;
        this.pipeFormat = pipeFormat;
        this.checked = checked;
        this.controlCheckColumn = controlCheckColumn;
        this.showPartOfData = showPartOfData;
        this.textIconField = textIconField;
        this.textIconImage = textIconImage;
        this.shouldDisplay = shouldDisplay;
        this.styles = styles;
        this.toolTipDescriptionField = toolTipDescriptionField;
        this.isOverlayPanel = isOverlayPanel;
        this.dateRange = dateRange;        
        this.commentsConfig = commentsConfig;
        this.maxDate = maxDate;
      }

}
