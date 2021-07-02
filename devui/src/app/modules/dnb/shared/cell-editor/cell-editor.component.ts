import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { QuillModules, QuillViewComponent } from "ngx-quill";
import * as Quill from "quill";
import Delta from "quill-delta";
import { merge, Subject, Subscription, timer } from "rxjs";
import { bufferToggle, filter, map, throttle } from "rxjs/operators";
import { ToastMessageService } from "src/app/services/toast-message.service";
import { dnbCodes } from "../../models/constants/actionCodes.constants";
import {
  DnBActions,
  SectionPosition,
} from "../../models/constants/actions.constants";
import { allowedASCII } from "../../models/constants/ascii.constants";
import { arrowNavigation } from "../../models/constants/behaviors.constants";
import {
  Column,
  CommentData,
  SearchData,
} from "../../models/interfaces/uibase";
import { DnbRoleAuthService } from "../../services/dnb-role-auth.service";
import { DnbStoreService } from "../../services/dnb-store.service";
import { DnbUndoRedoService } from "../../services/undo-redo.service";
import { diff_match_patch } from "../../utils/diff_match_patch";
import { cleanData, prepareData } from "../../utils/tools.utils";
declare let $: any;
const HIGH_LIGHT_SEARCH_COLOR = "orange";
const SEARCH_COLOR = "yellow";
const COMPARE_ADDED_COLOR = "blue";
const COMPARE_REMOVED_COLOR = "red";
const COMPARE_NORMAL_COLOR = "black";
const TRANSPARENT_COLOR = "transparent";

const Inline = Quill.import("blots/inline");
class CommentBlot extends Inline {
  static create(value) {
    let node = super.create(true);
    node.setAttribute("attr-id", value);
    return node;
  }

  static formats(node) {
    return node.getAttribute("attr-id") || "";
  }
}
(CommentBlot as any).blotName = "custom-comment";
(CommentBlot as any).tagName = "H6";
(CommentBlot as any).className = "comment";

Quill.register({ "formats/custom-comment": CommentBlot });

@Component({
  selector: "app-cell-editor",
  templateUrl: "./cell-editor.component.html",
  styleUrls: ["./cell-editor.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellEditorComponent implements OnChanges, OnInit, OnDestroy {
  @ViewChild("editor", { static: true }) editor: QuillViewComponent;
  @Input() column: Column = null;
  @Input() sectionPosition: SectionPosition = null;
  @Input() isComparing: boolean = false;
  @Input() searchInfo: SearchData = null;
  @Input() comments: CommentData[] = null;
  @Input() highLight: number = null;
  @Input() focus: {
    hasFocus: boolean;
    range?: number;
    isTabAction?: boolean;
  } = null;
  @Input() isReadOnly = false;
  @Input() compareSide = false;
  @Input() negativeDiff: [number, string][];
  @Input() sectionId: string = "";
  @Input() isLastSectionColumn: boolean = false;
  @Input() showAllChanges: boolean = false;
  @Output() cellNavigate = new EventEmitter<{
    type: string;
    isTabAction?: boolean;
  }>();
  @Output() focusChange = new EventEmitter<{
    hasFocus: boolean;
    range?: number;
    isTabAction?: boolean;
  }>();
  @Output() range = new EventEmitter<{
    range: number;
    length: boolean;
  }>();
  @Output() commentsChange = new EventEmitter<CommentData[]>();

  qEditor: Quill;
  selectionIndex: number = null;
  dmp = new diff_match_patch();
  startValue = "";
  lastWordLength: number = 0;
  placeholder: string = "";
  quillConfig: QuillModules = {
    toolbar: false,
    clipboard: {
      matchers: [
        [Node.TEXT_NODE, (node, delta) => this.fixCopy(node, delta)],
        ["IMG", (node, delta) => new Delta().insert("")],
        ["VIDEO", (node, delta) => new Delta().insert("")],
      ],
    },
    history: {
      delay: 0,
      maxStack: 0,
      userOnly: false,
    },
    keyboard: {
      bindings: {
        shiftTab: {
          key: 9,
          shiftKey: true,
          handler: () => {
            this.cellNavigate.emit({
              type: arrowNavigation.left,
              isTabAction: true,
            });
            return false;
          },
        },
        tab: {
          key: 9,
          handler: () => {
            this.cellNavigate.emit({
              type: arrowNavigation.right,
              isTabAction: true,
            });
            return false;
          },
        },
        arrowDown: {
          key: 40,
          altKey: true,
          shortKey: true,
          handler: () => {
            this.cellNavigate.emit({
              type: arrowNavigation.down,
            });
            return true;
          },
        },
        arrowUp: {
          key: 38,
          altKey: true,
          shortKey: true,
          handler: () => {
            this.cellNavigate.emit({
              type: arrowNavigation.up,
            });
            return true;
          },
        },
        arrowLeft: {
          key: 37,
          altKey: true,
          shortKey: true,
          handler: () => {
            this.cellNavigate.emit({
              type: arrowNavigation.left,
            });
            return true;
          },
        },
        arrowRight: {
          key: 39,
          altKey: true,
          shortKey: true,
          handler: () => {
            this.cellNavigate.emit({
              type: arrowNavigation.right,
            });
            return true;
          },
        },
      },
    },
  };
  commentsBackup: CommentData[] = [];
  innerCommentchange = false;
  validDailyMax: boolean = false;
  oldDiff: [number, string][] = [];
  ignoreAllValue: boolean = false;
  prevFocus: number = null;
  valueObs: Subject<string> = new Subject<string>();
  cancelObs: Subject<string> = new Subject<string>();
  changesSubs: Subscription;
  oldVal: string = "";
  cancelLast: boolean = false;
  isLastPaste: boolean = false;
  constructor(
    private toastService: ToastMessageService,
    private dnbStore: DnbStoreService,
    private roleAuthService: DnbRoleAuthService,
    private undoRedo: DnbUndoRedoService
  ) {}

  keydown = (event) => {
    if (event.key === "z" && event.ctrlKey && !this.isReadOnly) {
      this.cancelObs.next(this.column.value);
      this.cancelLast = true;
      event.stopPropagation();
      event.preventDefault();
      this.undoRedo.undo();
    }
  };

  ngOnInit() {
    if (!this.isReadOnly) {
      const timerInterval = () => timer(3000);
      const event$ = this.valueObs.asObservable();
      const throttleObs = event$
        .pipe(bufferToggle(event$.pipe(throttle(timerInterval)), timerInterval))
        .pipe(
          filter(() => {
            if (this.cancelLast) {
              return false;
            } else {
              return true;
            }
          })
        );

      const inmediateObs = this.cancelObs.asObservable().pipe(
        filter((val) => {
          const different = this.oldVal.trim() !== cleanData(val).trim();
          if (different) {
            this.cancelLast = false;
          }
          return different;
        }),
        map((item) => [item])
      );

      this.changesSubs = merge(throttleObs, inmediateObs).subscribe(
        (values: string[]) => {
          const val = values.pop();
          const {
            sectionIndex,
            rowIndex,
            columnIndex,
            groupIndex,
            isGrouped,
            isSectionCodes,
            isDrugName,
            isName,
          } = this.sectionPosition;
          if (isDrugName) {
            this.undoRedo.doCommand(
              DnBActions.DRUG_NAME,
              {
                isDrugName,
                oldVal: this.oldVal,
                val: val,
              },
              val,
              this.oldVal
            );
          } else if (isSectionCodes) {
            this.undoRedo.doCommand(
              DnBActions.SECTION_HEADER_CODES_DATA,
              {
                sectionIndex,
                isSectionCodes,
                oldVal: this.oldVal,
                val: val,
              },
              val,
              this.oldVal
            );
          } else {
            this.undoRedo.doCommand(
              isGrouped
                ? DnBActions.GROUPED_COLUMN_CHANGE
                : DnBActions.COLUMN_CHANGE,
              {
                sectionIndex,
                groupIndex,
                rowIndex,
                columnIndex,
                oldVal: this.oldVal,
                val: val,
                isName,
              },
              val,
              this.oldVal
            );
          }
          this.oldVal = val;
        }
      );
    }
  }

  ngOnDestroy() {
    if (this.changesSubs !== undefined) {
      this.changesSubs && this.changesSubs.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.column) {
      this.startValue = this.column.value
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      this.placeholder = this.column.placeholder ? this.column.placeholder : "";
      this.commentsBackup = this.column.comments || [];
    }
    if (this.qEditor) {
      if (changes.column) {
        this.setEditorContent();
      }
      if (changes.isComparing) {
        if (this.isComparing) {
          if (this.negativeDiff) {
            this.setNegativeContent();
            if (this.searchInfo) {
              this.setSearchFormat(null);
            }
          } else if (this.compareSide) {
            this.getContentDifferences(null, true);
            if (this.isLastSectionColumn) {
              this.dnbStore.notifySectionContainerBulkUpdate(this.sectionId);
            }
          }
        } else {
          this.qEditor.removeFormat(0, this.qEditor.getLength() - 1);
          if (this.showAllChanges) {
            this.setContent();
          }
          if (this.comments) {
            this.setCommentsData();
          }
          this.setCurrentSearchData();
        }
      }
      if (changes.negativeDiff) {
        this.setNegativeContent();
      }
      if (changes.searchInfo) {
        if (this.negativeDiff) {
          this.setNegativeContent();
          this.setSearchFormat(changes.searchInfo.previousValue);
        } else if (this.isComparing) {
          this.getContentDifferences(changes.searchInfo.previousValue);
        } else {
          this.setContent();
          if (this.comments) {
            this.setCommentsData();
          }
          if (this.searchInfo) {
            this.setSearchFormat(changes.searchInfo.previousValue);
          }
        }
      }
      if (changes.highLight && this.searchInfo) {
        this.setHighlight(changes.highLight.previousValue);
      }
      if (changes.focus) {
        this.setFocus();
      }
      if (changes.comments) {
        if (this.isComparing) {
          this.getContentDifferences();
        } else {
          this.setContent();
        }
        this.comments.forEach((comment) => {
          const found = this.commentsBackup.find(
            (backup) => backup.elementId === comment.elementId
          );
          if (found === undefined) {
            this.commentsBackup.push(comment);
          }
        });
        if (this.comments) {
          this.setCommentsData();
        }
      }
    }
  }

  scrollIfOutsideofView(): void {
    const element = this.editor.editorElem;
    const yOffset = 130;
    const offset = element.getBoundingClientRect().top - $(window).scrollTop();

    if (offset > window.innerHeight || offset < 0) {
      const y =
        element.getBoundingClientRect().top + window.pageYOffset - yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }

  editorStarted(instance: Quill): void {
    this.qEditor = instance;
    this.setEditorContent();
    this.setCurrentSearchData();
    if (this.comments) {
      this.setCommentsData();
    }
    this.placeholder = this.column.placeholder ? this.column.placeholder : "";
    this.qEditor.root.addEventListener("blur", () => {
      this.cancelObs.next(this.column.value);
      this.cancelLast = true;
    });
  }

  setNegativeContent() {
    this.qEditor.setContents(this.transformNegativeContent(this.negativeDiff));
  }

  editorChanged({ source, text, editor, content, delta }): void {
    this.qEditor = editor;
    if (this.ignoreAllValue && source !== "user") {
      const positiveChange = this.transformPositiveContent(this.oldDiff);
      text = positiveChange.reduce((acc, item) => acc + item.insert, "");
    }

    if (this.isComparing && this.showAllChanges) {
      if (source === "user") {
        content.ops.forEach((element, i) => {
          const past = content.ops[i - 1];
          if (past !== undefined) {
            if (
              past.attributes &&
              past.attributes.color &&
              past.attributes.color === "red" &&
              element.insert.trim() === ""
            ) {
              element.attributes = { color: "red", strike:true };
            }
          }
        });
        let acum = 0;
        let newText = content.ops.reduce((acc, item) => {
          let insertedInDelete = "";
          let deltaAcum = 0;
          if (
            item.attributes &&
            item.attributes.color &&
            item.attributes.color === "red"
          ) {
            let min,
              max = 0;
            min = acum;
            max = min + item.insert.length;
            delta.ops.forEach((item) => {
              if (item.retain !== undefined) {
                deltaAcum += item.retain;
              }
              if (item.insert !== undefined) {
                if (
                  item.attributes &&
                  item.attributes.color &&
                  item.attributes.color === "red" &&
                  deltaAcum > min &&
                  deltaAcum < max
                ) {
                  insertedInDelete = item.insert;
                  editor.setSelection(max);
                }
                deltaAcum += item.retain;
              }
            });
            acum += item.insert.length;
            return (acc += insertedInDelete);
          } else if (
            item.attributes &&
            item.attributes.color &&
            item.attributes.color === "blue"
          ) {
            acum += item.insert.length;
            return (acc += item.insert);
          } else {
            acum += item.insert.length;
            return (acc += item.insert);
          }
        }, "");
        text = newText;
      }
    }
    const validatedText = this.columnValueRegExValidator(text);
    if (validatedText !== text) {
      text = validatedText;
      this.column.value = text;
      this.setEditorContent(source);
    }
    text = this.validateMaxLength(text, source);
    if (source === "user") {
      if (!this.isReadOnly) {
        if (this.isLastPaste) {
          this.cancelObs.next(this.column.value);
          this.cancelLast = true;
          this.isLastPaste = false;
        } else {
          this.valueObs.next(text);
          this.cancelLast = false;
        }
      }
      if (this.commentsBackup && content.ops) {
        this.checkCommentsUpdate(content);
      }
      const select = this.qEditor.getSelection();
      this.selectionIndex = select ? select.index : null;
      if (this.isComparing) {
        this.getContentDifferences(null, false, "silent");
      }
    } else {
      this.oldVal = this.column.value;
      this.isLastPaste = false;
    }
  }

  selectionChanged({ range }): void {
    this.range.emit(range);
    this.selectionIndex = range ? range.index : null;
  }

  setContent(source = ""): void {
    if (this.column.compareColumn == null) {
      this.column.diff = [[0, this.column.value]];
      this.qEditor.setText(this.column.value, source);
    } else if (this.showAllChanges) {
      const diff = this.getComparisonDiffs(
        prepareData(this.column.compareColumn.value),
        this.column.value
      );
      this.qEditor.setContents(this.transformPositiveContent(diff), source);
    } else {
      this.qEditor.setText(this.column.value, source);
    }
  }

  getContentDifferences(
    searchInfoPrevValue = null,
    isBulkUpdate = false,
    source = ""
  ) {
    if (!this.isComparing) {
      return;
    }
    this.ignoreAllValue = false;
    setTimeout(() => {
      if (this.column.compareColumn == null) {
        this.column.diff = [[0, this.column.value]];
        this.qEditor.setText(this.column.value, source);
      } else {
        let diff;
        if (this.showAllChanges) {
          diff = this.getComparisonDiffs(
            prepareData(this.column.compareColumn.value),
            this.column.value
          );
          this.oldDiff = diff;
          this.ignoreAllValue = true;
          this.qEditor.setContents(this.transformAllContent(diff), source);
        } else {
          diff = this.getCharacterDiff(
            this.column.compareColumn.value,
            this.column.value
          );
          this.qEditor.setContents(this.transformPositiveContent(diff), source);
          this.column.compareColumn.diff = diff;
        }

        if (!isBulkUpdate) {
          this.dnbStore.notifySectionContainerColumnUpdate(
            this.sectionId,
            this.column.compareColumn,
            diff
          );
        }
      }
      if (this.selectionIndex !== null) {
        this.qEditor.setSelection(this.selectionIndex);
      }
      if (this.comments) {
        this.setCommentsData();
      }
      if (this.searchInfo) {
        this.setSearchFormat(searchInfoPrevValue);
      }
    });
  }

  getCharacterDiff(original: string, newText: string) {
    const diff = this.dmp.diff_main(original, newText);
    this.dmp.diff_cleanupSemantic(diff);
    return diff;
  }

  getComparisonDiffs(original: string, newText: string) {
    const a = this.dmp.diff_linesToWords_(original, newText);
    const lineText1 = a.chars1;
    const lineText2 = a.chars2;
    const lineArray = a.lineArray;
    const diff = this.dmp.diff_main(lineText1, lineText2, false);
    this.dmp.diff_charsToLines_(diff, lineArray);
    this.dmp.diff_cleanupSemantic(a);
    return diff;
  }

  transformAllContent(diff) {
    return diff.map((item) => {
      if (item[0] === -1) {
        return {
          insert: item[1],
          attributes: { color: COMPARE_REMOVED_COLOR, strike: true },
        };
      }
      if (item[0] === 0) {
        return {
          insert: item[1],
          color: COMPARE_NORMAL_COLOR,
        };
      }
      if (item[0] === 1) {
        return {
          insert: item[1],
          attributes: { color: COMPARE_ADDED_COLOR, underline: true },
        };
      }
    });
  }

  transformPositiveContent(diff) {
    return diff
      .filter((item) => item[0] > -1)
      .map((item) => {
        return item[0] > 0
          ? {
              insert: item[1],
              attributes: { color: COMPARE_ADDED_COLOR, underline: true },
            }
          : {
              insert: item[1],
              attributes: {
                color: COMPARE_NORMAL_COLOR,
              },
            };
      });
  }

  transformNegativeContent(diff) {
    return diff
      .filter((item) => item[0] < 1)
      .map((item) => {
        return item[0] < 0
          ? {
              insert: item[1],
              attributes: { color: COMPARE_REMOVED_COLOR, strike: true },
            }
          : {
              insert: item[1],
              attributes: {
                color: COMPARE_NORMAL_COLOR,
              },
            };
      });
  }

  setEditorContent(source = ""): void {
    if (this.negativeDiff !== null && this.negativeDiff !== undefined) {
      this.setNegativeContent();
    } else {
      if (this.isComparing) {
        this.getContentDifferences();
      } else {
        this.setContent(source);
      }
    }
  }

  setSearchFormat(oldData: any): void {
    if (oldData) {
      oldData.positions.forEach((position) => {
        this.qEditor.formatText(position, oldData.length, {
          "background-color": TRANSPARENT_COLOR,
        });
      });
    }
    this.setCurrentSearchData();
  }

  setCurrentSearchData(): void {
    if (this.searchInfo) {
      this.lastWordLength = this.searchInfo.length;
      this.searchInfo.positions.forEach((position) => {
        this.qEditor.formatText(position, this.searchInfo.length, {
          "background-color": SEARCH_COLOR,
        });
      });
      this.setCurrentHighlight();
    }
  }

  setCommentsData(): void {
    this.comments.forEach(({ beginIndex, endIndex, elementId }) => {
      const length = endIndex - beginIndex;
      this.qEditor.formatText(
        { index: beginIndex, length },
        "custom-comment",
        elementId
      );
    });
  }

  setHighlight(oldPosition: any): void {
    const positionExists = oldPosition !== null && oldPosition !== undefined;
    const existsInSearchInfo = this.searchInfo
      ? this.searchInfo.positions.indexOf(oldPosition) > -1
      : false;
    if (positionExists) {
      const color = existsInSearchInfo ? SEARCH_COLOR : TRANSPARENT_COLOR;
      this.qEditor.formatText(oldPosition, this.lastWordLength, {
        "background-color": color,
      });
    }
    this.setCurrentHighlight();
  }

  setCurrentHighlight() {
    const position = this.highLight;
    const positionExists = position !== null && position !== undefined;
    if (positionExists) {
      this.qEditor.formatText(position, this.searchInfo.length, {
        "background-color": HIGH_LIGHT_SEARCH_COLOR,
      });
      this.scrollIfOutsideofView();
    }
  }

  columnValueRegExValidator(text: string): string {
    let newValue = text;
    if (this.column.regExValidator) {
      const regEx = new RegExp(this.column.regExValidator, "gi");
      if (regEx && regEx.test(text)) {
        newValue = text.replace(regEx, "");
        if (this.validDailyMax) return newValue;
        this.toastService.messageError(
          this.column.regExTitle || "Error!",
          this.column.regExMessage || "Error",
          6000,
          true
        );
        if (this.column.regExTitle.includes("Daily Maximum Units"))
          this.validDailyMax = true;
      }
    }
    return newValue;
  }

  validateMaxLength(text: string, source): string {
    if (this.isReadOnly) {
      return;
    }
    let exceeds = false;
    let newText = "";
    let exceedsItems = false;
    if (this.column.maxLength && this.column.isArrayValue) {
      if (text.includes(",")) {
        let textArray = text.split(",");
        if (textArray.length > this.column.maxArrayItems) {
          exceedsItems = true;
          textArray = textArray.slice(0, this.column.maxArrayItems);
          newText = textArray.join(",");
        }

        let oneExceeds = false;
        textArray = textArray.map((item) => {
          if (item.length > this.column.maxLength) {
            oneExceeds = true;
            return item.slice(0, this.column.maxLength);
          }
          return item;
        });
        if (oneExceeds) {
          exceeds = true;
          newText = textArray.join(",");
        }
      } else if (text.length > this.column.maxLength + 1) {
        exceeds = true;
        newText = text.slice(0, this.column.maxLength);
      }
    }
    if (
      this.column.maxLength &&
      !this.column.isArrayValue &&
      text.length > this.column.maxLength + 1
    ) {
      exceeds = true;
      newText = text.slice(0, this.column.maxLength);
    }

    if (exceedsItems) {
      text = newText;
      this.column.value = text;
      this.setEditorContent(source);
      this.toastService.messageError(
        "Maximum of codes allowed reached",
        `Only ${this.column.maxArrayItems} codes can be added.`,
        6000,
        true
      );
    }

    if (exceeds) {
      text = newText;
      this.column.value = text;
      this.setEditorContent(source);
      this.toastService.messageWarning(
        "Warning!",
        `Maximum character limit exceeded in text field.`,
        6000,
        true
      );
    } else {
      this.column.value = text;
    }
    return text;
  }

  setFocus(): void {
    if (this.focus && this.focus.hasFocus && this.qEditor) {
      if (this.focus.isTabAction) {
        this.qEditor.setSelection(0, this.column.value.length);
      } else {
        if (this.focus.range && this.column.value.trim() !== "") {
          this.qEditor.setSelection(this.focus.range);
        } else {
          this.qEditor.setSelection(0);
        }
      }
    }
    this.focus = null;
    this.focusChange.emit(this.focus);
  }

  keyup(event): void {
    const t = document.getSelection();
    const node = t.anchorNode;
    const select = this.qEditor.getSelection();
    const focus = select ? select.index : null;
    switch (event.key) {
      case "ArrowUp": {
        const text = node.textContent.slice(0, t.focusOffset).trim();
        if (
          (text === "" && node.nodeType === 3) ||
          this.column.value.trim() === ""
        ) {
          this.cellNavigate.emit({
            type: arrowNavigation.up,
          });
        }
        break;
      }
      case "ArrowDown": {
        const text = node.textContent
          .slice(t.focusOffset, node.textContent.length - 1)
          .trim();
        if (
          (text === "" && !node.parentNode.nextSibling) ||
          this.column.value.trim() === ""
        ) {
          this.cellNavigate.emit({
            type: arrowNavigation.down,
          });
        }
        break;
      }
      case "ArrowLeft": {
        if (
          this.column.value.trim() === "" ||
          (focus === this.prevFocus && this.selectionIndex === 0)
        ) {
          this.cellNavigate.emit({
            type: arrowNavigation.left,
          });
        }
        break;
      }
      case "ArrowRight": {
        const parentSibling = node.parentNode.nextSibling
          ? (node.parentNode.nextSibling as any).className !== "ql-clipboard"
          : false;
        if (
          this.column.value.trim() === "" ||
          (focus === this.prevFocus && !parentSibling && !node.nextSibling)
        ) {
          this.cellNavigate.emit({
            type: arrowNavigation.right,
          });
        }
        break;
      }
    }
    this.prevFocus = focus;
  }

  fixCopy(node, delta) {
    const chars = allowedASCII.reduce((acc, item) => acc + item, "");
    const searchstring = `[^${chars}]`;
    let value = node.data.replace(new RegExp(searchstring, "g"), "");
    let newDelta = new Delta().insert(value);
    if (!this.roleAuthService.isAuthorized(dnbCodes.EDIT_DRDS)) {
      newDelta = new Delta().insert("");
    }
    this.isLastPaste = true;
    return newDelta.compose(
      new Delta().retain(newDelta.length(), {
        color: false,
        background: false,
        bold: false,
        strike: false,
        underline: false,
      })
    );
  }

  checkCommentsUpdate(content) {
    const comments = this.commentsBackup.filter((item) => {
      let found = false;
      let acc = 0;
      for (let i = 0; i < content.ops.length; i++) {
        const opt = content.ops[i];
        if (
          opt.attributes !== undefined &&
          opt.attributes["custom-comment"] == item.elementId
        ) {
          found = true;
          item.beginIndex = acc;
          item.endIndex = acc + opt.insert.length;
          break;
        }
        acc += opt.insert.length;
      }
      return found;
    });
    const current = this.comments
      ? this.comments.reduce((acc, item) => (acc += item.elementId), "")
      : "";
    const newComments = comments
      ? comments.reduce((acc, item) => (acc += item.elementId), "")
      : "";
    if (current !== newComments) {
      this.innerCommentchange = true;
      this.commentsChange.emit(comments);
    }
  }
}
