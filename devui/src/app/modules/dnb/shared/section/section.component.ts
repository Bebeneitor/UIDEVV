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
import { fromEvent, Subscription } from "rxjs";
import { filter, take } from "rxjs/operators";
import { StorageService } from "src/app/services/storage.service";
import { ToastMessageService } from "src/app/services/toast-message.service";
import { dnbCodes } from "../../models/constants/actionCodes.constants";
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
  defaultEditableMenuPermissions,
  defaultMenuPermissions,
  defaultReadOnlyMenuPermissions,
  menuPermissions,
} from "../../models/constants/rowMenuPermissions.constants";
import { SectionsAutopopulationIndication } from "../../models/constants/sectionAutopopulation.constants";
import { SectionCode } from "../../models/constants/sectioncode.constant";
import {
  storageCopy,
  storageDrug,
} from "../../models/constants/storage.constants";
import {
  Column,
  CommentData,
  FeedBackData,
  Row,
  Section,
} from "../../models/interfaces/uibase";
import { DnbUndoRedoService } from "../../services/undo-redo.service";
import {
  checkCollision,
  cloneSection,
  createNewRow,
  guidGenerator,
} from "../../utils/tools.utils";
import { CellEditorComponent } from "../cell-editor/cell-editor.component";

@Component({
  selector: "app-dnb-section",
  templateUrl: "./section.component.html",
  styleUrls: ["./section.component.css"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionComponent implements OnChanges, OnDestroy {
  @ViewChildren("editableCell")
  editColumns: QueryList<CellEditorComponent>;
  @ViewChild("rowItems",{static: false}) rowItems: ElementRef;
  @Input() section: Section;
  @Input() sectionIndex: number;
  @Input() isApproverReviewing: boolean = false;
  @Input() feedbackComplete: boolean = false;
  @Input() isReadOnly: boolean = true;
  @Input() sectionEnable: boolean = true;
  @Input() isComparing: boolean = false;
  @Input() undoCopyRowFlag: boolean = false;
  @Input() disabled: boolean = false;
  @Input() isRules: boolean = false;
  @Input() focusType: { type: string; isTabAction?: boolean } = null;

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
  menuPermissions: menuPermissions | feedbackPermissions =
    defaultMenuPermissions;
  dnbCodes = dnbCodes;
  undoItems: any = {
    undoFlag: false,
    backUpIndexRow: null,
    backUpRow: null,
    undoCopyRow: false,
    undoMultiSelect: false,
  };
  contextMenuOpen: boolean = false;
  top: number = 0;
  left: number = 0;
  selectedRowIndex: number = 0;
  selectedColumnIndex: number = 0;
  clickSubscribe: Subscription;
  scrollSubscribe: Subscription;
  contextmenuSubscribe: Subscription;
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
  sortReverse: boolean = false;
  selectedFeedbacks: FeedBackData[] = [];
  shouldCheckFeedback: boolean = true;
  typeRemoveMultiple: string = "rows";
  selectedValues: any[] = [];
  selectedBackupValues: any[] = [];
  cancelMultiSelect: boolean = false;
  checkAll: boolean = false;
  addManyRowsDialog: boolean = false;
  addRowCount: number = 1;
  addRowIndex: number = 0;
  spinnerInput: string = null;
  addedRowForMultiDelete: boolean = false;
  currentRange: any = null;
  rowReference: any = null;
  sectionReference: any = null;
  indicationMenu: boolean = false;
  newStart: number = null;
  newEnd: number = null;
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
        this.closeFeedback();
      });

    if (window.location.href.includes("new-drug"))
      this.indicationMenu = !this.indicationMenu;
  }

  ngOnDestroy() {
    this.contextmenuSubscribe && this.contextmenuSubscribe.unsubscribe();
    this.scrollSubscribe && this.scrollSubscribe.unsubscribe();
    this.clickSubscribe && this.clickSubscribe.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.undoCopyRowFlag) {
      this.undoItems.undoCopyRow = this.undoCopyRowFlag;
    }
    if (changes.focusType) {
      this.changeFocus();
    }
    if (changes.isApproverReviewing || changes.feedbackComplete) {
      this.shouldCheckFeedback =
        !this.isApproverReviewing ||
        (this.isApproverReviewing && this.feedbackComplete);
    }
  }

  sortData() {
    this.sortReverse = !this.sortReverse;
    let sort = +this.sortReverse === 0 ? -1 : 1;
    if (this.section.section.code === SectionCode.DiagnosisCodes) {
      this.section.rows.sort((data1, data2) => {
        let result = null;
        if (
          data1["columns"][0].value == null &&
          data2["columns"][0].value != null
        )
          result = -1;
        else if (
          data1["columns"][0].value != null &&
          data2["columns"][0].value == null
        )
          result = 1;
        else if (
          data1["columns"][0].value == null &&
          data2["columns"][0].value == null
        )
          result = 0;
        else if (
          typeof data1["columns"][0].value === "string" &&
          typeof data2["columns"][0].value === "string"
        ) {
          result = data1["columns"][0].value.localeCompare(
            data2["columns"][0].value
          );
        } else
          result =
            data1["columns"][0].value < data2["columns"][0].value
              ? -1
              : data1["columns"][0].value > data2["columns"][0].value
              ? 1
              : 0;
        return sort * result;
      });
    }
  }

  behavior(event): void {
    switch (event.behavior) {
      case behaviors.addManyRows:
        this.addRowCount = 1;
        this.addRowIndex = event.rowIndex;
        this.addManyRowsDialog = true;
        break;
      case behaviors.copyRow:
        this.copyRow(event.row, event.rowIndex);
        break;
      case behaviors.copyColumn:
        this.copyColumn();
        this.behaviorEvnt.emit(event);
        break;
      case behaviors.pasteColumn:
        this.pasteColumn();
        this.behaviorEvnt.emit(event);
        break;
      case behaviors.detailEdit:
        this.behaviorEvnt.emit({
          behavior: behaviors.detailEdit,
          rowIndex: this.selectedRowIndex,
        });
        break;
      case behaviors.removeRow:
        this.removeRow();
        this.closeFeedback();
        this.closeComment();
        this.behaviorEvnt.emit(event);
        break;
      case behaviors.checkFeedback:
        this.showFeedback = true;
        const rowBounds2 = this.rowReference.getBoundingClientRect();
        const tableBounds2 = this.sectionReference.getBoundingClientRect();
        this.selectedFeedbacks = this.currentColumn.feedbackData;
        this.feedbackTop = rowBounds2.y - tableBounds2.y;
        this.feedbackLeft =
          rowBounds2.x < 310 ? -285 + (300 - rowBounds2.x) : -285;
        break;
      case behaviors.removeMultipleRows:
        this.closeFeedback();
        this.closeComment();
        this.removeMultipleRows(event);
        this.behaviorEvnt.emit(event);
        break;
      case behaviors.cancelMultiSelectRows:
        this.closeFeedback();
        this.closeComment();
        this.cancelMultiSelectRows(event);
        break;
      case behaviors.confirmRemoveMultipleRows:
        this.closeFeedback();
        this.closeComment();
        this.confirmRemoveMultipleRows(event);
        this.behaviorEvnt.emit(event);
        break;
      case behaviors.undoRemoveMultiSelect:
        this.closeFeedback();
        this.closeComment();
        this.undoRemoveMultiSelect(event);
        this.behaviorEvnt.emit(event);
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
      case behaviors.indicationRemove:
        this.closeFeedback();
        this.behaviorEvnt.emit(event);
        break;
      case behaviors.indicationAdded:
        this.closeFeedback();
        this.behaviorEvnt.emit(event);
        break;
      default:
        this.behaviorEvnt.emit(event);
        break;
    }
  }

  copyRow(row: Row, rowIndex: number): void {
    this.behaviorEvnt.emit({ behavior: behaviors.copyRow, row, rowIndex });
  }

  updateCompareColumns(): void {
    setTimeout(() => {
      this.editColumns.forEach((column) => {
        column.getContentDifferences();
      });
    });
  }

  open(
    { x, y }: MouseEvent,
    rowIndex: number,
    columnIndex: number,
    column: Column
  ) {
    this.close();
    this.menuPermissions = this.isReadOnly
      ? { ...defaultReadOnlyMenuPermissions }
      : { ...defaultEditableMenuPermissions };

    let hideMenu = false;
    if (this.section.section.code === SectionCode.Rules) {
      if (!this.isReadOnly) {
        this.menuPermissions = {
          ...this.menuPermissions,
          addMidRule: true,
        };
      } else {
        hideMenu = true;
      }
    }

    if (SectionsAutopopulationIndication.indexOf(this.section.id) !== -1) {
      if (column.isReadOnly) {
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
      } else {
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
          pasteColumn: true,
        };
      }
    }
    if (this.isApproverReviewing) {
      hideMenu = true;
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
      if (SectionsAutopopulationIndication.indexOf(this.section.id) !== -1) {
        hideMenu = false;
        this.menuPermissions = checkFeedbackOnlyMenuPermissions;
      }
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
        if (SectionsAutopopulationIndication.indexOf(this.section.id) !== -1) {
          if (column.isReadOnly) {
            this.menuPermissions = {
              ...this.menuPermissions,
              addComment: true,
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
          } else {
            this.menuPermissions = {
              ...this.menuPermissions,
              addComment: true,
              removeRow: false,
              removeGroup: false,
              addRow: false,
              moveDown: false,
              moveUp: false,
              multiSelect: false,
              addManyRows: false,
              copyColumn: true,
              pasteColumn: true,
            };
          }
        } else {
          this.menuPermissions = {
            ...this.menuPermissions,
            addComment: true,
          };
        }

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
    this.permissionMenuGlobalReviewSection();
    this.selectedRowIndex = rowIndex;
    this.selectedColumnIndex = columnIndex;
    this.contextMenuOpen = !hideMenu;
    setTimeout(() => {
      if (this.rowItems && this.contextMenuOpen) {
        let menuHeight = 0;
        menuHeight = this.rowItems.nativeElement.offsetHeight;
        this.top = window.innerHeight - y > menuHeight ? y : y - menuHeight;
        this.left = window.innerWidth - x > 160 ? x : x - 150;
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
    if (this.section.section.code === SectionCode.GeneralInformation) {
      if (column.isReadOnly) {
        this.menuPermissions = {
          ...this.menuPermissions,
          pasteColumn: false,
        };
      }
    }
  }

  permissionMenuGlobalReviewSection() {
    if (
      this.section.section.code === SectionCode.GlobalReviewIndications &&
      !this.indicationMenu
    ) {
      this.menuPermissions = {
        ...this.menuPermissions,
        indicationRemove: { visible: true, label: "Indication Removed" },
        indicationAdded: { visible: true, label: "Indication Added" },
      };
    }
    if (
      this.section.section.code === SectionCode.GlobalReviewCodes &&
      !this.indicationMenu
    ) {
      this.menuPermissions = {
        ...this.menuPermissions,
        indicationRemove: { visible: true, label: "ICD-10 Code Removed" },
        indicationAdded: { visible: true, label: "ICD-10 Code Added" },
      };
    }
  }

  copyColumn(): void {
    const copyValue =
      this.section.rows[this.selectedRowIndex].columns[
        this.selectedColumnIndex
      ];
    this.storageService.set(storageCopy.copyColumn, copyValue.value, false);
  }

  pasteColumn(): void {
    const value = this.storageService.get(storageCopy.copyColumn, false);
    if (value) {
      const originalColumn =
        this.section.rows[this.selectedRowIndex].columns[
          this.selectedColumnIndex
        ];
      if (originalColumn.isReadOnly) {
        return;
      }
      this.section.rows[this.selectedRowIndex].columns[
        this.selectedColumnIndex
      ] = {
        ...originalColumn,
        value: value,
      };
    }
  }

  close(): void {
    this.clickSubscribe && this.clickSubscribe.unsubscribe();
    this.contextMenuOpen = false;
  }

  changeFocus(): void {
    if (this.focusType && this.focusType.type === arrowNavigation.up) {
      const rows = this.section.rows[this.section.rows.length - 1];
      const range = rows.columns[rows.columns.length - 1].value.length;
      rows.columns[rows.columns.length - 1].focus = {
        hasFocus: true,
        range,
        isTabAction: this.focusType.isTabAction,
      };
    }
    if (this.focusType && this.focusType.type === arrowNavigation.down) {
      const newCol = this.section.rows[0].columns[0];
      if (newCol.isReadOnly) {
        this.cellNavigate(
          {
            type: arrowNavigation.right,
            isTabAction: this.focusType.isTabAction,
          },
          0,
          0
        );
      } else {
        this.section.rows[0].columns[0].focus = {
          hasFocus: true,
          isTabAction: this.focusType.isTabAction,
        };
      }
    }
    this.focusType = null;
    this.focusTypeChange.emit(this.focusType);
  }

  cellNavigate(
    { type, isTabAction }: { type: string; isTabAction: boolean },
    colIndex: number,
    rowIndex: number
  ): void {
    switch (type) {
      case arrowNavigation.up: {
        if (rowIndex === 0) {
          this.sectionNavigate.emit({ type: arrowNavigation.up, isTabAction });
        } else {
          const newCol = this.section.rows[rowIndex - 1].columns[colIndex];
          if (newCol.isReadOnly) {
            this.cellNavigate({ type, isTabAction }, colIndex, rowIndex - 1);
          } else {
            const range =
              this.section.rows[rowIndex - 1].columns[colIndex].value.length;
            this.section.rows[rowIndex - 1].columns[colIndex].focus = {
              hasFocus: true,
              range,
            };
          }
        }
        break;
      }
      case arrowNavigation.down: {
        if (rowIndex === this.section.rows.length - 1) {
          this.sectionNavigate.emit({
            type: arrowNavigation.down,
            isTabAction,
          });
        } else {
          const newCol = this.section.rows[rowIndex + 1].columns[colIndex];
          if (newCol.isReadOnly) {
            this.cellNavigate({ type, isTabAction }, colIndex, rowIndex + 1);
          } else {
            this.section.rows[rowIndex + 1].columns[colIndex].focus = {
              hasFocus: true,
            };
          }
        }
        break;
      }
      case arrowNavigation.left: {
        if (colIndex === 0) {
          if (rowIndex === 0) {
            this.sectionNavigate.emit({
              type: arrowNavigation.up,
              isTabAction,
            });
          } else {
            const rows = this.section.rows[rowIndex - 1];
            const newCol = rows.columns[rows.columns.length - 1];
            if (newCol.isReadOnly) {
              this.cellNavigate(
                { type, isTabAction },
                rows.columns.length - 1,
                rowIndex - 1
              );
            } else {
              const range = rows.columns[rows.columns.length - 1].value.length;
              rows.columns[rows.columns.length - 1].focus = {
                hasFocus: true,
                range,
                isTabAction,
              };
            }
          }
        } else {
          const newCol = this.section.rows[rowIndex].columns[colIndex - 1];
          const range =
            this.section.rows[rowIndex].columns[colIndex - 1].value.length;
          if (newCol.isReadOnly) {
            this.cellNavigate({ type, isTabAction }, colIndex - 1, rowIndex);
          } else {
            this.section.rows[rowIndex].columns[colIndex - 1].focus = {
              hasFocus: true,
              range,
              isTabAction,
            };
          }
        }
        break;
      }
      case arrowNavigation.right: {
        if (colIndex === this.section.rows[rowIndex].columns.length - 1) {
          if (rowIndex === this.section.rows.length - 1) {
            this.sectionNavigate.emit({
              type: arrowNavigation.down,
              isTabAction,
            });
          } else {
            const newCol = this.section.rows[rowIndex + 1].columns[0];
            if (newCol.isReadOnly) {
              this.cellNavigate({ type, isTabAction }, 0, rowIndex + 1);
            } else {
              this.section.rows[rowIndex + 1].columns[0].focus = {
                hasFocus: true,
                isTabAction,
              };
            }
          }
        } else {
          const newCol = this.section.rows[rowIndex].columns[colIndex + 1];
          if (newCol.isReadOnly) {
            this.cellNavigate({ type, isTabAction }, colIndex + 1, rowIndex);
          } else {
            this.section.rows[rowIndex].columns[colIndex + 1].focus = {
              hasFocus: true,
              isTabAction,
            };
          }
        }
        break;
      }
    }
  }

  setSelectSectionForPaste(colIndex: number, rowIndex: number): void {
    const data = { colIndex, rowIndex, sectionIndex: this.sectionIndex };
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
          createdById: null,
          createdOn: "",
        };
      }
    }
  }

  feedbackClicked(feedback: FeedBackData, column: Column, rowRef) {
    this.showFeedback = true;
    const rowBounds = rowRef.getBoundingClientRect();
    this.feedbackLeft = rowBounds.x < 310 ? -285 + (300 - rowBounds.x) : -285;
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
      const foundRow = this.section.rows.find(
        (row) => row.code === feedback.sectionRowUuid
      );
      const foundHeaderIndex = this.section.headers.findIndex(
        (header) => header === feedback.uiColumnAttribute
      );
      const column = foundRow.columns[foundHeaderIndex];
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

  removeMultipleRows(event) {
    this.cancelMultiSelect = true;
    this.checkAll = false;
  }

  cancelMultiSelectRows(event) {
    this.cancelMultiSelect = false;
    this.checkAll = false;
    this.selectedValues = [];
  }

  confirmRemoveMultipleRows(event) {
    if (this.selectedValues.length === 0) {
      this.cancelMultiSelect = false;
      return;
    }
    this.addedRowForMultiDelete = false;
    this.createBackUp();
    let feedbacks = this.section.feedbackData;
    this.selectedBackupValues.forEach((selectedToRemove) => {
      selectedToRemove.row.columns.forEach((column: Column) => {
        if (column.feedbackData && column.feedbackData.length > 0) {
          feedbacks = feedbacks.concat(column.feedbackData);
        }
      });
    });
    this.section.feedbackData = feedbacks;
    if (
      this.checkAll ||
      this.selectedValues.length === this.section.rows.length
    ) {
      this.addRow();
      this.addedRowForMultiDelete = true;
    } else {
      this.selectedValues.forEach((item: any) => {
        this.section.rows.forEach((row, index) => {
          if (row.codeUI === item) {
            this.section.rows.splice(index, 1);
          }
        });
      });
    }
    this.checkAll = false;
    this.cancelMultiSelect = false;
    this.selectedValues = [];
    this.undoItems.undoMultiSelect = true;
  }

  addRow(): void {
    const newRow = createNewRow(this.section.rows);
    this.section.rows.push(newRow);
    this.section.rows.splice(0, this.section.rows.length - 1);
  }

  checkAllRows(event) {
    if (event) {
      this.selectedValues = this.section.rows.map((row) => {
        return row.codeUI;
      });
    } else {
      this.selectedValues = [];
    }
  }

  undoRemoveMultiSelect(event) {
    this.selectedBackupValues.forEach((item: any) => {
      this.section.rows.splice(item.index, 0, item.row);
      this.section.feedbackData = this.section.feedbackData.filter(
        (fb) => fb.sectionRowUuid !== item.row.code
      );
    });
    this.selectedBackupValues = [];
    this.undoItems.undoMultiSelect = false;
    if (this.addedRowForMultiDelete) {
      this.section.rows.pop();
    }
  }

  createBackUp() {
    this.selectedBackupValues = [];
    this.selectedValues.forEach((item) => {
      this.section.rows.forEach((row, index) => {
        if (row.codeUI === item) {
          this.selectedBackupValues.push({
            codeUI: row.codeUI,
            index: index,
            row: row,
          });
        }
      });
    });
  }

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
      this.section.rows.splice(
        this.addRowIndex + 1,
        0,
        createNewRow(this.section.rows)
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

    this.addComment(
      this.section.rows[this.selectedRowIndex].code,
      this.section.headers[this.selectedColumnIndex],
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
    rowIndex: number,
    columnIndex: number
  ) {
    return {
      sectionIndex,
      rowIndex,
      columnIndex,
      isGrouped: false,
    };
  }

  removeRow(): void {
    let removedRow: Row;
    let section: Section;
    section = cloneSection(this.section, false) as Section;
    if (section.rows.length === 1) {
      const newRow = createNewRow(section.rows);
      section.rows.splice(this.selectedRowIndex + 1, 0, newRow);
    }
    removedRow = section.rows.splice(this.selectedRowIndex, 1)[0];
    let feedbacks = section.feedbackData;
    removedRow.columns.forEach((column: Column) => {
      if (column.feedbackData && column.feedbackData.length > 0) {
        feedbacks = feedbacks.concat(column.feedbackData);
      }
    });
    section.feedbackData = feedbacks;
    this.undoRedo.doCommand(
      DnBActions.SECTION_CHANGE,
      {
        sectionIndex: this.sectionIndex,
      },
      section,
      null
    );
  }
}
