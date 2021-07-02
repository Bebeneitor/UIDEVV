import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from "@angular/core";
import { fromEvent } from "rxjs";
import { Subscription } from "rxjs/internal/Subscription";
import { filter, take } from "rxjs/operators";
import { StorageService } from "src/app/services/storage.service";
import { ToastMessageService } from "src/app/services/toast-message.service";
import { DnBActions } from "../../models/constants/actions.constants";
import {
  arrowNavigation,
  behaviors,
} from "../../models/constants/behaviors.constants";
import {
  approverRowMenuPermissions,
  feedbackPermissions,
} from "../../models/constants/feedbackMenuPermissions.constats";
import {
  checkFeedbackOnlyMenuPermissions,
  defaulReadOnlyGroupRowMenuPermissions,
  defaultEditableGroupMenuPermissions,
  defaultEditableGroupRowMenuPermissions,
  defaultMenuPermissions,
  defaultReadOnlyGroupMenuPermissions,
  menuPermissions,
} from "../../models/constants/rowMenuPermissions.constants";
import {
  blockGroupedCheckBox,
  SectionCode,
} from "../../models/constants/sectioncode.constant";
import {
  storageCopy,
  storageDrug,
} from "../../models/constants/storage.constants";
import {
  Column,
  CommentData,
  FeedBackData,
  GroupedSection,
  GroupRow,
  Row,
  Section,
} from "../../models/interfaces/uibase";
import { DnbUndoRedoService } from "../../services/undo-redo.service";
import {
  checkCollision,
  cleanData,
  cloneSection,
  compareToOrder,
  createNewRow,
  guidGenerator,
  isValueReadOnly,
  valuesCorresponding,
} from "../../utils/tools.utils";
import { CellEditorComponent } from "../cell-editor/cell-editor.component";

@Component({
  selector: "app-dnb-grouped-section",
  templateUrl: "./grouped-section.component.html",
  styleUrls: ["./grouped-section.component.css"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupedSectionComponent implements OnChanges, OnDestroy {
  @ViewChildren("editableCell")
  editColumns: QueryList<CellEditorComponent>;
  @ViewChild("rowItems",{static: false}) rowItems: ElementRef;
  @Input() section: GroupedSection;
  @Input() isApproverReviewing: boolean = false;
  @Input() feedbackComplete: boolean = false;
  @Input() isReadOnly: boolean = true;
  @Input() sectionEnable: boolean = true;
  @Input() isComparing: boolean = false;
  @Input() disabled: boolean = false;
  @Input() focusType: { type: string; isTabAction?: boolean } = null;
  @Input() sectionIndex: number;

  @Output() sectionChange: EventEmitter<Section> = new EventEmitter();
  @Output() behaviorEvnt: EventEmitter<any> = new EventEmitter();
  @Output() sectionNavigate: EventEmitter<{
    type: string;
    isTabAction?: boolean;
  }> = new EventEmitter();
  @Output() focusTypeChange = new EventEmitter<{
    type: string;
    isTabAction?: boolean;
  }>();

  @Output() feedbackUpdate = new EventEmitter<number>();
  undoItems: any = {
    undoFlag: false,
    backUpIndexRow: null,
    backUpIndexGroup: null,
    backUpRow: null,
    undoMultiSelect: false,
  };

  menuPermissions: menuPermissions | feedbackPermissions =
    defaultMenuPermissions;
  contextMenuOpen: boolean = false;
  top: number = 0;
  left: number = 0;
  selectedRowIndex: number = 0;
  selectedGroupIndex: number = 0;
  selectedColumnIndex: number = 0;
  clickSubscribe: Subscription;
  scrollSubscribe: Subscription;
  contextmenuSubscribe: Subscription;
  groupContextMenuOpened: boolean = false;
  selectedFeedback: string;
  currentColumn: Column;
  currentFeedback: FeedBackData = null;
  currentComment: CommentData = {
    beginIndex: null,
    endIndex: null,
    comment: "",
    sectionRowUuid: null,
    uiColumnAttribute: null,
    uiSectionCode: null,
  };
  commentBackup = this.currentComment;
  showFeedback: boolean = false;
  showComment: boolean = false;
  hasCurrentFeedback: boolean = false;
  feedbackTop: number = 0;
  feedbackLeft: number = 0;
  selectedFeedbacks: FeedBackData[] = [];
  shouldCheckFeedback: boolean = true;
  multiSelect: boolean = false;
  checkAllGroupHeader: boolean = false;
  checkAllRowHeader: boolean = false;
  typeRemoveMultiple: string = "groups";
  selectedGroups: string[] = [];
  selectedRows: string[] = [];
  codesSection: SectionCode;
  selectedBackUpGroups: any[] = [];
  selectedBackUpRows: any = [];
  addedGroupForMultiDelete: boolean = false;
  addManyRowsDialog: boolean = false;
  addRowCount: number = 1;
  addRowIndex: number = 0;
  addGroupIndex: number = 0;
  spinnerInput: string = null;
  currentRange: any = null;
  rowReference: any = null;
  sectionReference: any = null;
  newStart: number = null;
  newEnd: number = null;
  blockGroupedCheckBox = blockGroupedCheckBox;
  constructor(
    private eRef: ElementRef,
    private storageService: StorageService,
    private cd: ChangeDetectorRef,
    private toastService: ToastMessageService,
    private undoRedo: DnbUndoRedoService
  ) {
    this.scrollSubscribe = fromEvent<MouseEvent>(document, "scroll").subscribe(
      () => {
        this.close();
        this.cd.detectChanges();
      }
    );

    this.contextmenuSubscribe = fromEvent<MouseEvent>(document, "contextmenu")
      .pipe(
        filter((event) => {
          const clickTarget = event.target as HTMLElement;
          return !this.eRef.nativeElement.contains(clickTarget);
        })
      )
      .subscribe(() => {
        this.close();
      });
  }

  behavior(event): void {
    let feedbacks;
    switch (event.behavior) {
      case behaviors.copyColumn:
        this.copyColumn();
        this.behaviorEvnt.emit(event);
        break;
      case behaviors.pasteColumn:
        this.pasteColumn();
        this.behaviorEvnt.emit(event);
        break;
      case behaviors.copyRowGroup:
        this.copyRowGroup(event.row, event.groupIndex);
        break;
      case behaviors.copyGroup:
        this.copyGroup(event.groupRow, event.groupIndex);
        break;
      case behaviors.removeGroup:
        this.removeGroup();
        this.closeFeedback();
        this.closeComment();
        this.behaviorEvnt.emit(event);
        break;
      case behaviors.removeRow:
        this.removeRow();
        this.closeFeedback();
        this.closeComment();
        this.behaviorEvnt.emit(event);
        break;
      case behaviors.checkFeedback:
        const rBounds = this.rowReference.getBoundingClientRect();
        const tBounds = this.sectionReference.getBoundingClientRect();
        this.feedbackTop = rBounds.y - tBounds.y;
        this.feedbackLeft = rBounds.x < 310 ? -285 + (300 - rBounds.x) : -285;
        this.showFeedback = true;
        this.selectedFeedbacks = this.currentColumn.feedbackData;
        break;
      case behaviors.removeMultipleGroups:
        this.removeMultipleRows(event);
        this.closeFeedback();
        this.closeComment();
        break;
      case behaviors.cancelMultiSelectGroupsM:
        this.cancelMultiSelectRows(event);
        this.closeFeedback();
        this.closeComment();
        break;

      case behaviors.confirmRemoveMultipleGruped:
        this.confirmRemoveMultipleRows(event);
        this.closeFeedback();
        this.closeComment();
        break;
      case behaviors.undoRemoveMultiSelect:
        this.undoRemoveMultiSelect();
        this.closeFeedback();
        this.closeComment();
        this.behaviorEvnt.emit(event);
        break;
      case behaviors.addManyRows:
        this.addRowCount = 1;
        this.addManyRowsDialog = true;
        break;
      case behaviors.editComment:
        this.checkComment();
        this.closeFeedback();
        break;
      case behaviors.addComment:
        if (this.currentRange === null) {
          return;
        }
        this.newStart = this.currentRange.index;
        this.newEnd = this.currentRange.index + this.currentRange.length;
        if (this.currentColumn.comments) {
          const collisionDetected = this.currentColumn.comments.some(
            (item) =>
              (this.newStart === item.beginIndex &&
                this.newEnd === item.endIndex) ||
              checkCollision(
                { start: this.newStart, end: this.newEnd },
                { start: item.beginIndex, end: item.endIndex }
              )
          );

          if (collisionDetected) {
            this.toastService.messageError(
              "Collision Detected!",
              "Selected text can not be from an already selected query.",
              6000,
              true
            );
            return;
          }
        }
        this.currentComment = {
          beginIndex: this.newStart,
          endIndex: this.newEnd,
          comment: "",
          sectionRowUuid: "",
          uiColumnAttribute: "",
          uiSectionCode: this.section.section.code,
          elementId: null,
        };
        const rowBounds = this.rowReference.getBoundingClientRect();
        const tableBounds = this.sectionReference.getBoundingClientRect();
        this.feedbackTop = rowBounds.y - tableBounds.y;
        this.feedbackLeft =
          rowBounds.x < 310 ? -285 + (300 - rowBounds.x) : -285;
        this.showComment = true;
        break;
      default:
        this.behaviorEvnt.emit(event);
        break;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.focusType) {
      this.changeFocus();
    }
    if (changes.isApproverReviewing || changes.feedbackComplete) {
      this.shouldCheckFeedback =
        !this.isApproverReviewing ||
        (this.isApproverReviewing && this.feedbackComplete);
    }
  }

  ngOnDestroy() {
    this.contextmenuSubscribe && this.contextmenuSubscribe.unsubscribe();
    this.scrollSubscribe && this.scrollSubscribe.unsubscribe();
    this.clickSubscribe && this.clickSubscribe.unsubscribe();
  }

  copyRowGroup(row: Row, groupIndex: number): void {
    this.behaviorEvnt.emit({
      behavior: behaviors.copyRowGroup,
      row,
      groupIndex,
    });
  }

  copyGroup(groupRow: GroupRow, groupIndex: number) {
    this.behaviorEvnt.emit({
      behavior: behaviors.copyGroup,
      groupRow,
      groupIndex,
    });
  }

  updateCompareColumns(): void {
    setTimeout(() => {
      this.editColumns.forEach((column) => {
        column.getContentDifferences();
      });
    });
  }

  openRowMenu(
    { x, y }: MouseEvent,
    groupIndex: number,
    rowIndex: number,
    columnIndex: number,
    column: Column,
    isGrouped: boolean = false,
    isGroupedCol: boolean = false
  ) {
    this.close();
    this.selectedRowIndex = rowIndex;
    this.selectedGroupIndex = groupIndex;
    this.selectedColumnIndex = columnIndex;
    this.groupContextMenuOpened = isGrouped;
    if (isGrouped) {
      this.menuPermissions = this.isReadOnly
        ? { ...defaultReadOnlyGroupMenuPermissions }
        : { ...defaultEditableGroupMenuPermissions };
    } else {
      this.menuPermissions = this.isReadOnly
        ? { ...defaulReadOnlyGroupRowMenuPermissions }
        : { ...defaultEditableGroupRowMenuPermissions };
    }

    if (
      this.section.section.code === SectionCode.DosingPatterns &&
      !isGrouped &&
      !this.isReadOnly
    ) {
      this.menuPermissions = {
        ...this.menuPermissions,
        addGroupRow: { visible: true, label: "Add Dosing" },
        duplicateDosing: true,
      };
    }
    if (
      this.section.section.code === SectionCode.DiagnosisCodeOverlaps &&
      !this.isReadOnly
    ) {
      this.menuPermissions = {
        ...this.menuPermissions,
        separation: !isGroupedCol ? true : false,
        completeSeparatiion: isGroupedCol ? true : false,
      };
    }

    if (this.section.section.code === SectionCode.DiagnosisCodeOverlaps) {
      this.menuPermissions = {
        ...this.menuPermissions,
        addRow: false,
        addManyRows: false,
        removeRow: false,
        addGroupRow: { visible: false, label: "" },
        moveDown: false,
        moveUp: false,
        addGroup: false,
        removeGroup: false,
        multiSelect: false,
      };
    }

    if (
      this.section.section.code === SectionCode.SecondaryMalignancy &&
      !this.isReadOnly
    ) {
      this.menuPermissions = {
        ...this.menuPermissions,
        addGroupRow: { visible: true, label: "Add Primary Malignancy" },
        separation: !isGroupedCol ? true : false,
        completeSeparatiion: isGroupedCol ? true : false,
      };
    }
    if (
      this.section.section.code === SectionCode.DailyMaxUnits &&
      !this.isReadOnly
    ) {
      this.menuPermissions = {
        ...this.menuPermissions,
        separation: !isGroupedCol ? true : false,
        completeSeparatiion: isGroupedCol ? true : false,
      };
    }
    let hideMenu = false;
    if (this.isApproverReviewing) {
      hideMenu = true;
    }
    if (
      !this.isApproverReviewing &&
      ((this.section.section.code === SectionCode.DosingPatterns &&
        column.isReadOnly) ||
        this.isReadOnly)
    ) {
      this.menuPermissions = {
        ...this.menuPermissions,
        addComment: false,
        removeRow: false,
        removeGroup: false,
        addRow: false,
        moveDown: false,
        moveUp: false,
        multiSelect: false,
        addManyRows: false,
        copyColumn: true,
        pasteColumn: false,
      };
      hideMenu = false;
    }

    if (
      !(
        isGrouped &&
        (this.section.section.code === SectionCode.References ||
          this.section.section.code === SectionCode.DailyMaxUnits ||
          this.section.section.code === SectionCode.GeneralInformation)
      )
    ) {
      this.permissionMenuReadOnly(column);
    }

    if (
      !this.isReadOnly &&
      column.feedbackData &&
      column.feedbackData.length > 0
    ) {
      hideMenu = false;
      this.menuPermissions = {
        ...this.menuPermissions,
        checkFeedback: true,
      };
      this.currentColumn = column;
    }
    if (this.isApproverReviewing && this.shouldCheckFeedback) {
      if (column.feedbackData && column.feedbackData.length > 0) {
        this.menuPermissions = checkFeedbackOnlyMenuPermissions;
        this.currentColumn = column;
      } else {
        hideMenu = true;
      }
    }
    if (this.currentRange === null) {
      window.getSelection().empty();
    }
    if (!this.isReadOnly && this.currentRange && !this.isApproverReviewing) {
      if (this.currentRange.length > 0) {
        this.menuPermissions = {
          ...this.menuPermissions,
          addComment: true,
        };
        hideMenu = false;
      } else if (column.comments) {
        const index = this.currentRange.index;
        const comment = column.comments.find(
          (comment) => index >= comment.beginIndex && index <= comment.endIndex
        );
        if (comment) {
          this.commentBackup = comment;
          this.menuPermissions = {
            ...this.menuPermissions,
            editComment: true,
          };
          hideMenu = false;
        }
      }
      this.currentColumn = column;
    }

    if (
      this.isApproverReviewing &&
      !this.shouldCheckFeedback &&
      this.currentFeedback
    ) {
      hideMenu = true;
      if (!this.showFeedback) {
        hideMenu = false;
        this.menuPermissions = approverRowMenuPermissions;
        if (!this.currentColumn.value.includes(this.selectedFeedback)) {
          this.toastService.messageError(
            "Error!",
            "The selected text does not belong in the column's data",
            6000,
            true
          );
        }
        this.hasCurrentFeedback =
          this.selectedFeedback.length > 0 &&
          this.currentColumn.value.includes(this.selectedFeedback);
      }
    }
    this.permissionMenuCheckCopyStorage();
    this.permissionMenuTemplateSections(column);
    this.contextMenuOpen = !hideMenu;
    setTimeout(() => {
      if (this.rowItems && this.contextMenuOpen) {
        let menuHeight = 0;
        menuHeight = this.rowItems.nativeElement.offsetHeight;
        menuHeight = menuHeight === 0 ? 180 : menuHeight;
        this.top = window.innerHeight - y > menuHeight ? y : y - menuHeight;
        this.left = window.innerWidth - x > 130 ? x : x - 120;
        this.cd.detectChanges();
      }
    });
    this.clickSubscribe = fromEvent<MouseEvent>(document, "click")
      .pipe(take(1))
      .subscribe(() => {
        this.close();
        this.cd.detectChanges();
      });
  }

  permissionMenuCheckCopyStorage() {
    (this.menuPermissions as menuPermissions).pasteColumn =
      this.storageService.get(storageCopy.copyColumn, false) !== null &&
      (this.menuPermissions as menuPermissions).pasteColumn
        ? true
        : false;
  }

  permissionMenuTemplateSections(column: Column) {
    if (
      this.section.section.code === SectionCode.GeneralInformation ||
      this.section.section.code === SectionCode.References ||
      this.section.section.code === SectionCode.DailyMaxUnits
    ) {
      if (column.isReadOnly) {
        this.menuPermissions = {
          ...this.menuPermissions,
          pasteColumn: false,
        };
      }
    }
  }

  permissionMenuReadOnly(column: Column) {
    if (column.isReadOnly) {
      this.menuPermissions = defaulReadOnlyGroupRowMenuPermissions;
      this.menuPermissions = {
        ...this.menuPermissions,
        copyRowGroup: false,
        undoCopyRowGroup: false,
        copyColumn: true,
      };
    }
  }

  close() {
    this.clickSubscribe && this.clickSubscribe.unsubscribe();
    this.contextMenuOpen = false;
  }

  copyColumn(): void {
    let columnValue;
    if (this.groupContextMenuOpened) {
      columnValue =
        this.section.groups[this.selectedGroupIndex].names[
          this.selectedColumnIndex
        ].value;
    } else {
      columnValue =
        this.section.groups[this.selectedGroupIndex].rows[this.selectedRowIndex]
          .columns[this.selectedColumnIndex].value;
    }
    this.storageService.set(storageCopy.copyColumn, columnValue, false);
  }

  pasteColumn(): void {
    const value = this.storageService.get(storageCopy.copyColumn, false);
    if (value) {
      if (this.groupContextMenuOpened) {
        const oldColumn =
          this.section.groups[this.selectedGroupIndex].names[
            this.selectedColumnIndex
          ];
        if (oldColumn.isReadOnly) {
          return;
        }
        this.section.groups[this.selectedGroupIndex].names[
          this.selectedColumnIndex
        ] = {
          ...oldColumn,
          value: value,
        };
      } else {
        const oldColumn =
          this.section.groups[this.selectedGroupIndex].rows[
            this.selectedRowIndex
          ].columns[this.selectedColumnIndex];
        if (oldColumn.isReadOnly) {
          return;
        }
        this.section.groups[this.selectedGroupIndex].rows[
          this.selectedRowIndex
        ].columns[this.selectedColumnIndex] = {
          ...oldColumn,
          value: value,
        };
      }
    }
  }

  groupHasBorder(group: GroupRow): boolean {
    const lastIndex = group.rows.length - 1;
    return group.rows[lastIndex].hasBorder;
  }

  changeFocus(): void {
    if (this.focusType && this.focusType.type === arrowNavigation.up) {
      const lastGroup = this.section.groups[this.section.groups.length - 1];
      const rows = lastGroup.rows[lastGroup.rows.length - 1];
      const range = rows.columns[rows.columns.length - 1].value.length;
      rows.columns[rows.columns.length - 1].focus = {
        hasFocus: true,
        range,
        isTabAction: this.focusType.isTabAction,
      };
    }
    if (this.focusType && this.focusType.type === arrowNavigation.down) {
      const newCol = this.section.groups[0].names[0];
      if (newCol.isReadOnly) {
        this.cellHeaderNavigate(
          {
            type: arrowNavigation.right,
            isTabAction: this.focusType.isTabAction,
          },
          0,
          0
        );
      } else {
        this.section.groups[0].names[0].focus = {
          hasFocus: true,
          isTabAction: this.focusType.isTabAction,
        };
      }
    }
    this.focusType = null;
    this.focusTypeChange.emit(this.focusType);
  }

  groupsNavigate(
    { type, isTabAction }: { type: string; isTabAction: boolean },
    groupIndex: number,
    colIndex?: number
  ): void {
    if (type === arrowNavigation.up) {
      if (groupIndex === 0) {
        this.sectionNavigate.emit({ type, isTabAction });
      } else {
        const newGroup = this.section.groups[groupIndex - 1];
        const rows = newGroup.rows[newGroup.rows.length - 1];
        if (colIndex !== undefined) {
          const range = rows.columns[colIndex].value.length;
          rows.columns[colIndex].focus = {
            hasFocus: true,
            range,
            isTabAction,
          };
        } else {
          const range = rows.columns[rows.columns.length - 1].value.length;
          rows.columns[rows.columns.length - 1].focus = {
            hasFocus: true,
            range,
            isTabAction,
          };
        }
      }
    }
    if (type === arrowNavigation.down) {
      if (groupIndex === this.section.groups.length - 1) {
        this.sectionNavigate.emit({ type, isTabAction });
      } else {
        const newGroup = this.section.groups[groupIndex + 1];
        if (colIndex !== undefined) {
          newGroup.rows[0].columns[colIndex].focus = {
            hasFocus: true,
            isTabAction,
          };
        } else {
          const newCol = newGroup.names[0];
          if (newCol.isReadOnly) {
            this.cellHeaderNavigate(
              { type: arrowNavigation.right, isTabAction },
              0,
              groupIndex + 1
            );
          } else {
            newGroup.names[0].focus = {
              hasFocus: true,
              isTabAction,
            };
          }
        }
      }
    }
  }

  cellHeaderNavigate(
    { type, isTabAction }: { type: string; isTabAction: boolean },
    index: number,
    groupIndex: number
  ) {
    const groupHeaders = this.section.groups[groupIndex].names;
    switch (type) {
      case arrowNavigation.up: {
        if (groupIndex === 0) {
          this.groupsNavigate({ type, isTabAction }, groupIndex);
        } else {
          const range =
            this.section.groups[groupIndex - 1].names[index].value.length;
          this.section.groups[groupIndex - 1].names[index].focus = {
            hasFocus: true,
            range,
            isTabAction,
          };
        }
        break;
      }
      case arrowNavigation.down: {
        if (groupIndex === this.section.groups.length - 1) {
          this.groupsNavigate({ type, isTabAction }, groupIndex);
        } else {
          this.section.groups[groupIndex + 1].names[index].focus = {
            hasFocus: true,
            isTabAction,
          };
        }
        break;
      }
      case arrowNavigation.left: {
        if (index === 0) {
          if (groupIndex === 0) {
            this.sectionNavigate.emit({
              type: arrowNavigation.up,
              isTabAction,
            });
          } else {
            const group = this.section.groups[groupIndex - 1];
            const lastRow = group.rows[group.rows.length - 1];
            const range =
              lastRow.columns[lastRow.columns.length - 1].value.length;
            lastRow.columns[lastRow.columns.length - 1].focus = {
              hasFocus: true,
              range,
              isTabAction,
            };
          }
        } else {
          const range = groupHeaders[index - 1].value.length;
          groupHeaders[index - 1].focus = {
            hasFocus: true,
            range,
            isTabAction,
          };
        }
        break;
      }
      case arrowNavigation.right: {
        if (index === groupHeaders.length - 1) {
          this.section.groups[groupIndex].rows[0].columns[0].focus = {
            hasFocus: true,
            isTabAction,
          };
        } else {
          groupHeaders[index + 1].focus = {
            hasFocus: true,
            isTabAction,
          };
        }
        break;
      }
    }
  }

  cellGroupNavigate(
    { type, isTabAction }: { type: string; isTabAction: boolean },
    colIndex: number,
    rowIndex: number,
    groupIndex: number
  ): void {
    const groupRows = this.section.groups[groupIndex].rows;
    switch (type) {
      case arrowNavigation.up: {
        if (rowIndex === 0) {
          this.groupsNavigate({ type, isTabAction }, groupIndex, colIndex);
        } else {
          const range = groupRows[rowIndex - 1].columns[colIndex].value.length;
          groupRows[rowIndex - 1].columns[colIndex].focus = {
            hasFocus: true,
            range,
            isTabAction,
          };
        }
        break;
      }
      case arrowNavigation.down: {
        if (rowIndex === groupRows.length - 1) {
          this.groupsNavigate({ type, isTabAction }, groupIndex, colIndex);
        } else {
          groupRows[rowIndex + 1].columns[colIndex].focus = {
            hasFocus: true,
            isTabAction,
          };
        }
        break;
      }
      case arrowNavigation.left: {
        if (colIndex === 0) {
          if (rowIndex === 0) {
            const headers = this.section.groups[groupIndex];
            const lastHeader = headers.names[headers.names.length - 1];
            if (lastHeader.isReadOnly) {
              this.cellHeaderNavigate(
                { type, isTabAction },
                headers.names.length - 1,
                groupIndex
              );
            } else {
              const range = lastHeader.value.length;
              lastHeader.focus = {
                hasFocus: true,
                range,
                isTabAction,
              };
            }
          } else {
            const rows = groupRows[rowIndex - 1];
            const range = rows.columns[rows.columns.length - 1].value.length;
            rows.columns[rows.columns.length - 1].focus = {
              hasFocus: true,
              range,
              isTabAction,
            };
          }
        } else {
          const range = groupRows[rowIndex].columns[colIndex - 1].value.length;
          groupRows[rowIndex].columns[colIndex - 1].focus = {
            hasFocus: true,
            range,
            isTabAction,
          };
        }
        break;
      }
      case arrowNavigation.right: {
        if (colIndex === groupRows[rowIndex].columns.length - 1) {
          if (rowIndex === groupRows.length - 1) {
            this.groupsNavigate(
              { type: arrowNavigation.down, isTabAction },
              groupIndex
            );
          } else {
            groupRows[rowIndex + 1].columns[0].focus = {
              hasFocus: true,
              isTabAction,
            };
          }
        } else {
          groupRows[rowIndex].columns[colIndex + 1].focus = {
            hasFocus: true,
            isTabAction,
          };
        }
        break;
      }
    }
  }

  setSelectSectionForPaste(
    colIndex: number,
    rowIndex: number,
    groupIndex: number,
    isGroupHeader: boolean = false
  ): void {
    const data = {
      colIndex,
      rowIndex,
      groupIndex,
      isGroupHeader,
      sectionIndex: this.sectionIndex,
    };
    this.storageService.set(storageDrug.copySectionSource, data, true);
  }

  openFeedback(): void {
    this.showFeedback = true;
  }

  closeFeedback() {
    this.showFeedback = false;
    this.currentFeedback = null;
    this.selectedFeedbacks = [];
  }

  savedFeedback(feedback: FeedBackData) {
    (this.currentColumn.feedbackData =
      this.currentColumn.feedbackData || []).push({
      ...feedback,
    });
    this.currentColumn.feedbackData = [...this.currentColumn.feedbackData];
    this.closeFeedback();
  }

  removedFeedback(feedback: FeedBackData) {
    this.currentColumn.feedbackData = this.currentColumn.feedbackData.filter(
      (item) => item.itemId !== feedback.itemId
    );
    this.closeFeedback();
  }

  selectionSet(
    selection,
    column: Column,
    columnIndex: number,
    rowRef,
    row: Row,
    sectionRef
  ) {
    if (selection.type === 3) {
      this.currentColumn = column;
    } else {
      const rowBounds = rowRef.getBoundingClientRect();
      const tableBounds = sectionRef.getBoundingClientRect();
      const newStart = selection.beginIndex;
      const newEnd = selection.endIndex;
      if (column.feedbackData && newStart !== newEnd) {
        const collisionDetected = column.feedbackData.some(
          (item) =>
            (newStart === item.beginIndex && newEnd === item.endIndex) ||
            checkCollision(
              { start: newStart, end: newEnd },
              { start: item.beginIndex, end: item.endIndex }
            )
        );

        if (collisionDetected) {
          this.toastService.messageError(
            "Collision Detected!",
            "Selected text can not be from an already selected feedback.",
            6000,
            true
          );
          return;
        }
      }

      if (!this.showFeedback) {
        this.feedbackTop = rowBounds.y - tableBounds.y;
        this.feedbackLeft =
          rowBounds.x < 310 ? -285 + (300 - rowBounds.x) : -285;
        this.currentComment = this.commentBackup;
        this.selectedFeedback = selection.text;
        this.currentColumn = column;
        this.currentFeedback = {
          itemId: null,
          instanceId: null,
          beginIndex: selection.beginIndex,
          endIndex: selection.endIndex,
          feedback: "",
          sectionRowUuid: row.code,
          sourceText: column.value,
          uiSectionCode: this.section.section.code,
          uiColumnAttribute: this.section.headers[columnIndex],
          createdBy: "",
          createdOn: "",
          createdById: null,
        };
      }
    }
  }

  feedbackClicked(feedback, column, rowRef) {
    const rowBounds = rowRef.getBoundingClientRect();
    this.feedbackLeft = rowBounds.x < 310 ? -285 + (300 - rowBounds.x) : -285;
    this.showFeedback = true;
    this.currentColumn = column;
    this.currentFeedback = {
      ...feedback,
    };
    this.selectedFeedback = feedback.sourceText.substring(
      feedback.beginIndex,
      feedback.endIndex
    );
  }

  resolved(feedback: FeedBackData) {
    if (feedback.isSectionFeedback) {
      this.section.feedbackData = this.section.feedbackData.map((item) => {
        return {
          ...item,
          resolved:
            item.itemId === feedback.itemId ? feedback.resolved : item.resolved,
        };
      });
    } else {
      let foundGroup = this.section.groups[this.selectedGroupIndex];
      let foundRow = foundGroup.rows[this.selectedRowIndex];

      const foundHeaderIndex = this.section.headers.findIndex(
        (header) => header === feedback.uiColumnAttribute
      );
      const headerCount = this.section.groups[0].names.length;
      let column;
      if (foundHeaderIndex < headerCount) {
        column = foundGroup.names[foundHeaderIndex];
      } else {
        column = foundRow.columns[foundHeaderIndex - headerCount];
      }
      column.feedbackData = column.feedbackData.map((item) => {
        return {
          ...item,
          resolved:
            item.itemId === feedback.itemId ? feedback.resolved : item.resolved,
        };
      });
      column.feedbackLeft += feedback.resolved ? -1 : 1;
      this.selectedFeedbacks = column.feedbackData;
    }
    this.feedbackUpdate.emit(feedback.resolved ? -1 : 1);
  }

  openSectionFeedbacks() {
    this.showFeedback = true;
    this.section.feedbackData = this.section.feedbackData.map((item) => {
      return {
        ...item,
        isSectionFeedback: true,
      };
    });
    this.selectedFeedbacks = this.section.feedbackData;
    this.cd.detectChanges();
  }

  //#region Multiselect
  removeMultipleRows(event) {
    this.multiSelect = true;
  }

  checkAllGroupM(event) {
    if (event) {
      this.selectedGroups = this.section.groups.map((group) => {
        return group.codeGroupUI;
      });
      this.selectedRows = [];
      this.checkAllRowHeader = false;
    } else {
      this.selectedGroups = [];
    }
  }

  checkAllRowM(event) {
    if (event) {
      this.section.groups.forEach((group) => {
        group.rows.forEach((row) => {
          this.selectedRows.push(row.codeUI);
        });
      });

      this.selectedRows = [...this.selectedRows];
      this.selectedGroups = [];
      this.checkAllGroupHeader = false;
    } else {
      this.selectedRows = [];
    }
  }

  cancelMultiSelectRows(event) {
    this.multiSelect = false;
    this.selectedGroups = [];
    this.selectedRows = [];
    this.checkAllGroupHeader = false;
    this.checkAllRowHeader = false;
  }

  confirmRemoveMultipleRows(event) {
    this.createBackUp();
    this.backUpFeedback();
    this.addedGroupForMultiDelete = false;
    if (this.selectedGroups.length === 0 && this.selectedRows.length === 0) {
      this.multiSelect = false;
      return;
    }

    if (
      (this.checkAllGroupHeader || this.checkAllRowHeader) &&
      blockGroupedCheckBox.indexOf(this.section.section.code as SectionCode) ===
        -1
    ) {
      this.addGroup();
      this.addedGroupForMultiDelete = true;
    } else {
      if (this.selectedGroups.length === this.section.groups.length) {
        this.addGroup();
        this.addedGroupForMultiDelete = true;
      } else {
        this.selectedGroups.forEach((group) => {
          this.section.groups.forEach((groupCurrent, index) => {
            if (group === groupCurrent.codeGroupUI) {
              if (this.section.groups.length === 1) {
                this.addGroup();
                this.addedGroupForMultiDelete = true;
              }
              this.section.groups.splice(index, 1);
            }
          });
        });

        if (
          blockGroupedCheckBox.indexOf(
            this.section.section.code as SectionCode
          ) === -1
        ) {
          this.selectedRows.forEach((rowSelected) => {
            this.section.groups.forEach((group, indexG) => {
              group.rows.forEach((row, indexR) => {
                if (row.codeUI === rowSelected) {
                  if (
                    group.rows.length === 1 &&
                    this.section.groups.length === 1
                  ) {
                    this.addGroup();
                    this.addedGroupForMultiDelete = true;
                  } else {
                    if (group.rows.length === 1) {
                      this.section.groups.splice(indexG, 1);
                    } else {
                      this.section.groups[indexG].rows.splice(indexR, 1);
                    }
                  }
                }
              });
            });
          });
        } else {
          this.selectedRows.forEach((rowSelected) => {
            this.section.groups.forEach((group, indexG) => {
              group.rows.forEach((row, indexR) => {
                if (row.codeUI === rowSelected) {
                  if (group.rows.length === 1) {
                    const newRow = createNewRow(
                      this.section.groups[indexG].rows
                    );
                    newRow.codeUI =
                      this.section.groups[indexG].rows[indexR].codeUI;
                    this.section.groups[indexG].rows.splice(indexR, 1);
                    this.section.groups[indexG].rows.splice(
                      this.selectedRowIndex + 1,
                      0,
                      newRow
                    );
                  } else {
                    this.section.groups[indexG].rows.splice(indexR, 1);
                  }
                }
              });
            });
          });
        }
      }
    }
    this.multiSelect = false;
    this.selectedGroups = [];
    this.selectedRows = [];
    this.checkAllGroupHeader = false;
    this.checkAllRowHeader = false;
    this.undoItems.undoMultiSelect = true;
  }

  addGroup() {
    const groupedSection = (this.section as GroupedSection).groups;
    var newGroup: GroupRow = {
      rows: [],
      names: [],
      codeGroupUI: "",
    };

    newGroup = this.createNewGroup(groupedSection);
    (this.section as GroupedSection).groups = [...[newGroup]];
  }

  undoRemoveMultiSelect() {
    //Undo groups
    this.selectedBackUpGroups.forEach((group) => {
      this.section.groups.splice(group.index, 0, group.group);

      group.group.names.forEach((name) => {
        name.feedbackData.forEach((fbd) => {
          this.section.feedbackData = this.section.feedbackData.filter(
            (fb) => fb.sectionRowUuid !== fbd.sectionRowUuid
          );
        });
      });

      group.group.rows.forEach((row) => {
        row.columns.forEach((column) => {
          column.feedbackData.forEach((fbd) => {
            this.section.feedbackData = this.section.feedbackData.filter(
              (fb) => fb.sectionRowUuid !== fbd.sectionRowUuid
            );
          });
        });
      });
    });

    //Undo rows
    this.selectedBackUpRows.forEach((item) => {
      this.section.groups.forEach((group) => {
        if (
          group.codeGroupUI === item.codeGroupUI &&
          blockGroupedCheckBox.indexOf(
            this.section.section.code as SectionCode
          ) === -1
        ) {
          group.rows.splice(item.index, 0, item.row);
          item.row.columns.forEach((column) => {
            column.feedbackData.forEach((fbd) => {
              this.section.feedbackData = this.section.feedbackData.filter(
                (fb) => fb.sectionRowUuid !== fbd.sectionRowUuid
              );
            });
          });
        } else if (group.codeGroupUI === item.codeGroupUI) {
          let found = false;
          group.rows.forEach((row, index) => {
            if (row.codeUI === item.row.codeUI) {
              group.rows[index] = { ...item.row };
              found = true;
            }
          });
          if (!found) {
            group.rows.splice(item.index, 0, item.row);
          }
          item.row.columns.forEach((column) => {
            column.feedbackData.forEach((fbd) => {
              this.section.feedbackData = this.section.feedbackData.filter(
                (fb) => fb.sectionRowUuid !== fbd.sectionRowUuid
              );
            });
          });
        }
      });
    });

    this.selectedBackUpGroups = [];
    this.selectedBackUpRows = [];
    this.undoItems.undoMultiSelect = false;

    if (this.addedGroupForMultiDelete) {
      this.section.groups.pop();
    }
  }

  backUpFeedback() {
    let feedbacks: any[] = [];

    this.selectedBackUpGroups.forEach((group) => {
      group.group.names.forEach((name) => {
        if (name.feedbackData && name.feedbackData.length > 0) {
          feedbacks = feedbacks.concat(name.feedbackData);
        }
      });

      group.group.rows.forEach((row) => {
        row.columns.forEach((column) => {
          if (column.feedbackData && column.feedbackData.length > 0) {
            feedbacks = feedbacks.concat(column.feedbackData);
          }
        });
      });
    });

    this.selectedBackUpRows.forEach((rows) => {
      rows.row.columns.forEach((column) => {
        if (column.feedbackData && column.feedbackData.length > 0) {
          feedbacks = feedbacks.concat(column.feedbackData);
        }
      });
    });

    this.section.feedbackData = this.section.feedbackData.concat(feedbacks);
  }

  createBackUp() {
    this.selectedBackUpGroups = [];
    this.selectedBackUpRows = [];

    //Backup All
    if (
      (this.checkAllGroupHeader || this.checkAllRowHeader) &&
      blockGroupedCheckBox.indexOf(this.section.section.code as SectionCode) ===
        -1
    ) {
      this.section.groups.forEach((group, index) => {
        this.selectedBackUpGroups.push({
          codeGroupUI: group.codeGroupUI,
          index: index,
          group: group,
        });
      });

      return;
    }

    let findGroup: any;

    //Backup groups
    this.selectedGroups.forEach((itemGroup) => {
      this.section.groups.forEach((group, index) => {
        if (group.codeGroupUI === itemGroup) {
          this.selectedBackUpGroups.push({
            codeGroupUI: group.codeGroupUI,
            index: index,
            group: group,
          });
        }
      });
    });

    //Backup rows
    this.selectedRows.forEach((rowSelected) => {
      this.section.groups.forEach((group: GroupRow, indexGroup) => {
        group.rows.forEach((row: Row, indexRow) => {
          findGroup = this.selectedBackUpGroups.find(
            (element) => element.codeGroupUI === group.codeGroupUI
          );
          //If the group its already removed, dont add the row to the backup
          if (!findGroup) {
            if (row.codeUI === rowSelected) {
              let rowsBack;
              rowsBack = this.selectedBackUpRows.filter(
                (e) => e.codeGroupUI === group.codeGroupUI
              ).length;
              if (
                (rowsBack || group.rows.length === 1) &&
                blockGroupedCheckBox.indexOf(
                  this.section.section.code as SectionCode
                ) === -1
              ) {
                // if select all the rows of the group best remove all group
                if (group.rows.length === rowsBack + 1) {
                  // Add all the group to backup
                  this.selectedBackUpGroups.push({
                    codeGroupUI: group.codeGroupUI,
                    index: indexGroup,
                    group: {
                      codeGroupUI: group.codeGroupUI,
                      names: [...group.names],
                      rows: [...group.rows],
                    },
                  });
                  //Delete all saved rows in backup
                  this.selectedBackUpRows = this.selectedBackUpRows.filter(
                    (e) => e.codeGroupUI !== group.codeGroupUI
                  );
                } else {
                  this.selectedBackUpRows.push({
                    codeGroupUI: group.codeGroupUI,
                    codeUI: row.codeUI,
                    index: indexRow,
                    row: { ...row },
                  });
                }
              } else {
                this.selectedBackUpRows.push({
                  codeGroupUI: group.codeGroupUI,
                  codeUI: row.codeUI,
                  index: indexRow,
                  row: row,
                });
              }
            }
          }
        });
      });
    });

    this.selectedBackUpRows.sort(compareToOrder);
    this.selectedBackUpGroups.sort(compareToOrder);
  }

  createNewGroup(groups: GroupRow[]): GroupRow {
    const newGroupHeaders = groups[0].names.map((col) => {
      const diff: [number, string][] = [[0, ""]];
      return {
        maxLength: col.maxLength,
        isReadOnly: false,
        feedbackData: [],
        feedbackLeft: 0,
        value: "",
        diff,
      };
    });
    const newRow = createNewRow(
      (this.section as GroupedSection).groups[0].rows
    );

    return {
      rows: [newRow],
      names: newGroupHeaders,
      codeGroupUI: guidGenerator(),
    };
  }
  //#endregion

  addManyRows() {
    if (this.addRowCount <= 0 || this.addRowCount >= 16) {
      this.toastService.messageError(
        "Error!",
        "You can add 1 to 15 rows at a time.",
        6000,
        true
      );

      if (this.addRowCount <= 0) {
        this.addRowCount = 1;
      }

      if (this.addRowCount >= 16) {
        this.addRowCount = 15;
      }
      return;
    }
    this.addManyRowsDialog = false;
    for (let i = 0; i < this.addRowCount; i++) {
      const newRow = createNewRow(
        this.section.groups[this.selectedGroupIndex].rows
      );
      if (this.section.section.code === SectionCode.DailyMaxUnits) {
        newRow.columns[1].isReadOnly = isValueReadOnly(
          cleanData(
            this.section.groups[this.selectedGroupIndex].names[0].value
          ),
          valuesCorresponding
        );
      }
      this.section.groups[this.selectedGroupIndex].rows.splice(
        this.selectedRowIndex + 1,
        0,
        newRow
      );
    }
  }

  isNumberKey(evt) {
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;

    return true;
  }

  onPaste(e: ClipboardEvent) {
    let clipboardData, pastedData;

    e.stopPropagation();
    e.preventDefault();

    clipboardData = e.clipboardData;
    pastedData = clipboardData.getData("Text");

    pastedData = pastedData.replace(/[^0-9]+/g, "");

    if (pastedData > 15) {
      pastedData = 15;
    }

    this.addRowCount = pastedData;
  }

  closeComment() {
    this.showComment = false;
    this.currentComment = null;
  }

  removedComment(comment: CommentData) {
    this.currentColumn.comments = this.currentColumn.comments.filter(
      (item) => item.elementId !== comment.elementId
    );
    this.closeComment();
    this.currentColumn.comments = [...this.currentColumn.comments];
  }

  addComment(rowId: string, columnId: string, comment) {
    const elementId = guidGenerator();
    const code = rowId === "" || rowId === undefined ? guidGenerator() : rowId;
    const newComment: CommentData = {
      ...comment,
      sectionRowUuid: code,
      uiColumnAttribute: columnId,
      elementId: elementId + "",
    };
    (this.currentColumn.comments = this.currentColumn.comments || []).push({
      ...newComment,
    });
    this.currentComment =
      this.currentColumn.comments[this.currentColumn.comments.length - 1];
    this.currentColumn.comments = [...this.currentColumn.comments];
  }

  checkComment() {
    if (this.commentBackup !== null) {
      const rowBounds = this.rowReference.getBoundingClientRect();
      const tableBounds = this.sectionReference.getBoundingClientRect();
      this.feedbackTop = rowBounds.y - tableBounds.y;
      this.feedbackLeft = rowBounds.x < 310 ? -285 + (300 - rowBounds.x) : -285;
      this.currentComment = this.commentBackup;
      this.showComment = true;
    }
  }

  commentChange(comment: CommentData) {
    this.currentComment.comment = comment.comment;
  }

  commentsChange(comments: CommentData[], column: Column) {
    this.currentColumn = column;
    this.currentColumn.comments = comments;
    this.closeComment();
  }

  saveComment(comment: CommentData) {
    if (comment.comment === "") {
      this.toastService.messageError(
        "Empty Query",
        `A Query on ${this.section.section.name} does not have text and no Query can be added.`,
        6000,
        true
      );
      return;
    }
    const columnIndex = this.groupContextMenuOpened
      ? this.selectedColumnIndex
      : this.section.groups[this.selectedGroupIndex].names.length +
        this.selectedColumnIndex;
    this.addComment(
      this.section.groups[this.selectedGroupIndex].rows[this.selectedRowIndex]
        .code,
      this.section.headers[columnIndex],
      comment
    );
    this.closeFeedback();
    this.closeComment();
  }

  columnsChange(newColumnWidth: number, headerIndex: number) {
    const oldColWidth = +this.section.headersUIWidth[headerIndex];
    const diff = oldColWidth - +newColumnWidth;
    const nextColumnWidth = +this.section.headersUIWidth[headerIndex + 1];
    this.section.headersUIWidth[headerIndex] = newColumnWidth;
    this.section.headersUIWidth[headerIndex + 1] = nextColumnWidth + diff;
  }

  createSectionPosition(
    sectionIndex: number,
    groupIndex: number,
    rowIndex: number,
    columnIndex: number,
    isName: boolean
  ) {
    return {
      sectionIndex,
      groupIndex,
      rowIndex,
      columnIndex,
      isName,
      isGrouped: true,
    };
  }

  removeRow(): void {
    let wasGroupRemoved: boolean = false;
    let removedRow: Row;
    let groupedSection: GroupedSection;
    groupedSection = cloneSection(this.section, true) as GroupedSection;
    const groups = groupedSection.groups;
    if (
      blockGroupedCheckBox.indexOf(this.section.section.code as SectionCode) ===
      -1
    ) {
      if (groups.length === 1 && groups[0].rows.length === 1) {
        const newRow = createNewRow(groups[0].rows);
        groups[0].rows.splice(this.selectedRowIndex + 1, 0, newRow);
      }
      wasGroupRemoved = groups[this.selectedGroupIndex].rows.length === 1;
      removedRow = {
        ...groups[this.selectedGroupIndex].rows[this.selectedRowIndex],
      };

      if (!wasGroupRemoved) {
        groups[this.selectedGroupIndex].rows.splice(
          this.selectedRowIndex,
          1
        )[0];
      } else {
        groups.splice(this.selectedGroupIndex, 1)[0];
      }
    } else {
      if (groups[this.selectedGroupIndex].rows.length === 1) {
        removedRow = { ...groups[this.selectedRowIndex].rows[0] };
        groups[this.selectedGroupIndex].rows[this.selectedRowIndex].columns =
          groups[this.selectedGroupIndex].rows[
            this.selectedRowIndex
          ].columns.map((col) => {
            return {
              ...col,
              value: "",
            };
          });
      } else {
        removedRow = groups[this.selectedGroupIndex].rows.splice(
          this.selectedRowIndex,
          1
        )[0];
      }
    }

    let feedbacks = groupedSection.feedbackData;
    removedRow.columns.forEach((column: Column) => {
      if (column.feedbackData && column.feedbackData.length > 0) {
        feedbacks = feedbacks.concat(column.feedbackData);
      }
    });
    groupedSection.feedbackData = feedbacks;
    this.undoRedo.doCommand(
      DnBActions.GROUPED_SECTION_CHANGE,
      {
        sectionIndex: this.sectionIndex,
      },
      groupedSection,
      null
    );
  }

  removeGroup(): void {
    let removedGroup: GroupRow;
    let groupedSection: GroupedSection;
    groupedSection = cloneSection(this.section, true) as GroupedSection;
    if (groupedSection.groups.length === 1) {
      const groups = groupedSection.groups;
      const newGroup = this.createNewGroup(groups);
      groups.splice(this.selectedGroupIndex + 1, 0, newGroup);
    }
    removedGroup = groupedSection.groups.splice(this.selectedGroupIndex, 1)[0];
    let feedbacks = groupedSection.feedbackData;
    removedGroup.names.forEach((column: Column) => {
      if (column.feedbackData && column.feedbackData.length > 0) {
        feedbacks = feedbacks.concat(column.feedbackData);
      }
    });
    removedGroup.rows.forEach((row: Row) => {
      row.columns.forEach((column: Column) => {
        if (column.feedbackData && column.feedbackData.length > 0) {
          feedbacks = feedbacks.concat(column.feedbackData);
        }
      });
    });
    groupedSection.feedbackData = feedbacks;
    this.undoRedo.doCommand(
      DnBActions.GROUPED_SECTION_CHANGE,
      {
        sectionIndex: this.sectionIndex,
      },
      groupedSection,
      null
    );
  }
}
