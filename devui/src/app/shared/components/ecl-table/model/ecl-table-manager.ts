import { EclButtonTable } from './ecl-button';
import { EclColumn } from './ecl-column';
import { EclColumnStyles } from './ecl-column-style';
import { EclTableCommentsConfig } from './ecl-comments-config';

export class EclTableColumnManager {

    columns: EclColumn[];

    constructor() {
        this.columns = [];
    }

    getColumns() {
        return this.columns;
    }

    addTextColumn(
        field: string,
        header: string,
        width: string,
        filter: boolean,
        filterType: string = EclColumn.TEXT,
        sort: boolean,
        maxLength: number = 0,
        alignment: string = 'left',
        styles: EclColumnStyles[] = null,
        toolTipDescriptionField?: string) {
        let column = new EclColumn(field, header, width, filter, EclColumn.TEXT, filterType, null, [], null, null, null, sort, maxLength, '', alignment, null, null, false, 0, '', '', '', null, styles,toolTipDescriptionField);
        this.columns.push(column);
    }

    addDropDownColumn(
        field: string,
        header: string,
        width: string,
        filter: boolean,
        filterType: string = EclColumn.TEXT,
        optionsDropDown: any[],
        onChangeDropDown: any,
        sort: boolean,
        fieldOptions: string = ''
    ) {
        let column = new EclColumn(field, header, width, filter, EclColumn.DROPDOWN, filterType, null, [], null, optionsDropDown, onChangeDropDown, sort, 0, fieldOptions);
        this.columns.push(column);
    }

    addInputColumn(
        field: string,
        header: string,
        width: string,
        filter: boolean,
        filterType: string = EclColumn.TEXT,
        sort: boolean
    ) {
        let column = new EclColumn(field, header, width, filter, EclColumn.INPUT, filterType, null, [], null, null, null, sort);
        this.columns.push(column);
    }

    addDateColumn(
        field: string,
        header: string,
        width: string,
        filter: boolean,
        sort: boolean,
        pipeName: string = null,
        pipeFormat: string = null,
        filterType: string = EclColumn.DATE, 
        dateRange?,
        maxDate?) {
            let column = new EclColumn(field, header, width, filter, EclColumn.DATE,filterType, null, null, [], null, null, sort, 0, '','left',pipeName, pipeFormat, false, null, null, null, null, null, null, null, false, dateRange, null, maxDate);
        this.columns.push(column);
    }

    addLinkColumn(
        field: string,
        header: string,
        width: string,
        filter: boolean,
        filterType: string = EclColumn.TEXT,
        sort: boolean,
        alignment: string = 'left'
    ) {
        let column = new EclColumn(field, header, width, filter, EclColumn.LINK, filterType, null, [], null, null, null, sort, 0, '', alignment);
        this.columns.push(column);
    }

    addOverlayPanelColumn(
        field: string,
        header: string,
        width: string,
        filter: boolean,
        filterType: string = EclColumn.TEXT,
        sort: boolean,
        alignment: string = 'left'
    ) {
        let column = new EclColumn(field, header, width, filter, EclColumn.OVERLAY_PANEL, filterType, null, [], null, null, null, sort, 0, '', alignment);
        this.columns.push(column);
    }

    addIconColumn(
        field: string,
        header: string,
        width: string,
        icon: string = null,
        icons: string[] = [],
        visible: Function = null
    ) {
        let column = new EclColumn(field, header, width, false, EclColumn.ICON, null, icon, icons, null);
        if (visible) {
            column.shouldDisplay = visible;
        }
        this.columns.push(column);
    }

    addButtonsColumn(
        field: string,
        header: string,
        width: string,
        buttons: EclButtonTable[]
    ) {
        let column = new EclColumn(field, header, width, false, EclColumn.BUTTONS, null, null, null, buttons);
        this.columns.push(column);
    }

    addCalendarColumn(
        field: string,
        header: string,
        width: string,
        filter: boolean,
        sort: boolean,
        pipeName: string = null,
        pipeFormat: string = null) {
        let column = new EclColumn(field, header, width, filter, EclColumn.CALENDAR, EclColumn.DATE, null, [], null, null, null, sort,0,'', 'left',pipeName, pipeFormat);
        this.columns.push(column);
    }

    addCheckColumn(
        field: string,
        header: string,
        width: string,
        filter: boolean,
        filterType: string = EclColumn.TEXT,
        checked: boolean =false,
        controlCheckColumn:number = 0,
        sort: boolean,
        visible: Function = null
    ) {
        let column = new EclColumn(field, header, width, filter, EclColumn.CHECK, filterType, null, [], null, null, null, sort,0,'','left',null,null, checked,controlCheckColumn);
        if (visible) {            
            column.shouldDisplay = visible;
        }
        this.columns.push(column);
    }

    addCheckIconIndictorColumn(
        field: string,
        header: string,
        width: string,
        filter: boolean,
        filterType: string = EclColumn.TEXT,
        checked: boolean = false,
        controlCheckColumn: number = 0,
        sort: boolean
    ) {
        let column = new EclColumn(field, header, width, filter, EclColumn.CHECK_ICON_IND, filterType, null, [], null, null, null, sort, 0, '', 'center', null, null, checked, controlCheckColumn);
        this.columns.push(column);
    }

    addMultiCheckIconIndictorColumn(
        field: string,
        header: string,
        width: string,
        filter: boolean,
        filterType: string = EclColumn.TEXT,
        checked: boolean = false,
        controlCheckColumn: number = 0,
        sort: boolean
    ) {
        let column = new EclColumn(field, header, width, filter, EclColumn.CHECK_MULTI_ICON_IND, filterType, null, [], null, null, null, sort, 0, '', 'center', null, null, checked, controlCheckColumn);
        this.columns.push(column);
    }

    addMultiLineLinkColumn(
        field: string,
        header: string,
        width: string,
        filter: boolean,
        filterType: string = EclColumn.TEXT,
        sort: boolean,
        alignment: string = 'left'
    ) {
        let column = new EclColumn(field, header, width, filter, EclColumn.MULTI_LINE_LINK, filterType, null, [], null, null, null, sort, 0, '', alignment);
        this.columns.push(column);
    }


    addMultiLineTextColumn(
        field: string,
        header: string,
        width: string,
        filter: boolean,
        filterType: string = EclColumn.TEXT,
        sort: boolean,
        maxLength: number = 0,
        alignment: string = 'left',
        showPartOfData: string = '') {
        let column = new EclColumn(field, header, width, filter, EclColumn.MULTI_LINE_TEXT, filterType, null, [], null, null, null, sort, maxLength, '', alignment,'', '', false, 0, showPartOfData);
        this.columns.push(column);
    }


    addDnbVersionLinkColumn(
        field: string,
        header: string,
        width: string,
        filter: boolean,
        filterType: string = EclColumn.TEXT,
        sort: boolean,
        alignment: string = 'left'
    ) {
        let column = new EclColumn(field, header, width, filter, EclColumn.DNB_LINK, filterType, null, [], null, null, null, sort, 0, '', alignment);
        this.columns.push(column);
    }

    addDnbVersionColumn(
        field: string,
        header: string,
        width: string,
        filter: boolean,
        filterType: string = EclColumn.TEXT,
        sort: boolean,
        maxLength: number = 0,
        alignment: string = 'left',
        styles: EclColumnStyles[] = null,
        toolTipDescriptionField?: string) {
        let column = new EclColumn(field, header, width, filter, EclColumn.DNB_VERSION, filterType, null, [], null, null, null, sort, maxLength, '', alignment, null, null, false, 0, '', '', '', null, styles,toolTipDescriptionField);
        this.columns.push(column);
    }
    
    addLinkColumnWithIcon(
      field: string,
      header: string,
      width: string,
      filter: boolean,
      filterType: string = EclColumn.TEXT,
      sort: boolean,
      alignment: string = 'left',
      textIconField: string,
      textIconImage: string
    ) {
      let column = new EclColumn(field, header, width, filter, EclColumn.LINK_WITH_ICON, filterType, null, [],null, null, null, sort, 0, '', alignment, null, null, false, 0,'', textIconField, textIconImage);
      this.columns.push(column);
    }

  addTextColumnWithIcon(
    field: string,
    header: string,
    width: string,
    filter: boolean,
    filterType: string = EclColumn.TEXT,
    sort: boolean,
    maxLength: number = 0,
    alignment: string = 'left',
    textIconField: string,
    textIconImage: string    ) {
    let column = new EclColumn(field, header, width, filter, EclColumn.TEXT_WITH_ICON, filterType, null, [], null, null, null, sort, maxLength, '', alignment, null, null, false, 0, '', textIconField, textIconImage);
    this.columns.push(column);
  }

  addTextWithCounter(
    field: string,
    header: string,
    width: string,
    filter: boolean,
    filterType: string = EclColumn.TEXT,
    sort: boolean,
    maxLength: number = 0,
    alignment: string = 'left') {
    let column = new EclColumn(field, header, width, filter, EclColumn.TEXT_WITH_NUMBER, filterType, null, [], null, null, null, sort, maxLength, '', alignment, null, null, false, 0);
    this.columns.push(column);
  }

  addOverlayPanelTextColumn(
    field: string,
    header: string,
    width: string,
    filter: boolean,
    filterType: string = EclColumn.TEXT,
    sort: boolean,
    maxLength: number = 0,
    alignment: string = 'left',
    styles: EclColumnStyles[] = null,
    overlayDescriptionField: boolean) {
    let column = new EclColumn(field, header, width, filter, EclColumn.TEXT, filterType, null, [], null, null, null, sort, maxLength, '', alignment, null, null, false, 0, '', '', '', null, styles, '', overlayDescriptionField);
    this.columns.push(column);
}

  addSwitch(
    field: string,
    header: string,
    width: string) {
    let column = new EclColumn(field, header, width, false, EclColumn.SWITCH);
    this.columns.push(column);
  }

  addSimpleTextColumn(
    field: string,
    header: string,
    width: string,
    filter: boolean,
    filterType: string = EclColumn.TEXT,
    sort: boolean,
    maxLength: number = 0,
    alignment: string = 'left',
    styles: EclColumnStyles[] = null,
    toolTipDescriptionField?: string) {
        let column = new EclColumn(field, header, width, filter, EclColumn.SIMPLE_TEXT, filterType, null, [], null, null, null, sort, maxLength, '', alignment, null, null, false, 0, '', '', '', null, styles,toolTipDescriptionField);
        this.columns.push(column);
    }

    addCommentsColumn(
    field: string,
    header: string,
    width: string,
    commentsObject: EclTableCommentsConfig) {
        let column = new EclColumn(field, header, width, false, EclColumn.COMMENTS, null, null, [], null, null, null, false, 0, '', 'center', null, null, false, 0, '', '', '', null, null, null, false, null, commentsObject);
        this.columns.push(column);
    }
}
