import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { QuillViewComponent } from "ngx-quill";
import { Quill } from "quill";
import { ToastMessageService } from "src/app/services/toast-message.service";
import { Column, SearchData } from "../../models/interfaces/uibase";
import { DnbStoreService } from "../../services/dnb-store.service";
import { diff_match_patch } from "../../utils/diff_match_patch";
declare let $: any;
const HIGH_LIGHT_SEARCH_COLOR = "orange";
const SEARCH_COLOR = "yellow";
const COMPARE_ADDED_COLOR = "blue";
const COMPARE_REMOVED_COLOR = "red";
const COMPARE_NORMAL_COLOR = "black";
const TRANSPARENT_COLOR = "transparent";

@Component({
  selector: "app-cell-editor",
  templateUrl: "./cell-editor.component.html",
  styleUrls: ["./cell-editor.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellEditorComponent implements OnChanges {
  @ViewChild("editor") editor: QuillViewComponent;
  @Input() column: Column = null;
  @Input() isComparing: boolean = false;
  @Input() searchInfo: SearchData = null;
  @Input() highLight: number = null;
  @Input() isReadOnly = false;
  @Input() negativeDiff: [number, string][];
  @Input() sectionId: string = "";
  @Input() isLastSectionColumn: boolean = false;

  qEditor: Quill;
  selectionIndex: number = null;
  dmp = new diff_match_patch();
  startValue = "";
  lastWordLength: number = 0;
  constructor(
    private toastService: ToastMessageService,
    private dnbStore: DnbStoreService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.column) {
      this.startValue = this.column.value;
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
          } else {
            this.getContentDifferences(null, true);
          }

          if (this.isLastSectionColumn) {
            this.dnbStore.notifySectionContainerBulkUpdate(this.sectionId);
          }
        } else {
          this.qEditor.removeFormat(0, this.qEditor.getLength() - 1);
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
          this.qEditor.setText(this.column.value);
          if (this.searchInfo) {
            this.setSearchFormat(changes.searchInfo.previousValue);
          }
        }
      }
      if (changes.highLight) {
        this.setHighlight(changes.highLight.previousValue);
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
  }

  setNegativeContent() {
    this.qEditor.setContents(this.transformNegativeContent(this.negativeDiff));
  }

  editorChanged({ source, text, editor }): void {
    this.qEditor = editor;

    const validatedText = this.columnValueRegExValidator(text);
    if (validatedText !== text) {
      text = validatedText;
      this.column.value = text;
      this.setEditorContent();
    }
    if (source === "user") {
      if (this.isComparing) {
        const select = this.qEditor.getSelection();
        this.selectionIndex = select ? select.index : null;
      }
      if (
        this.column.maxLength &&
        text.length > this.column.maxLength + 1 &&
        !this.isReadOnly
      ) {
        text = text.slice(0, this.column.maxLength);
        this.column.value = text;
        this.setEditorContent();
        this.toastService.messageWarning(
          "Warning!",
          `Maximum character limit exceeded in text field.`,
          1500,
          true
        );
      } else {
        this.column.value = text;
      }

      if (this.isComparing) {
        this.getContentDifferences();
      }
    }
  }

  selectionChanged({ range }): void {
    if (this.isComparing) {
      this.selectionIndex = range ? range.index : null;
    }
  }

  getContentDifferences(searchInfoPrevValue = null, isBulkUpdate = false) {
    if (!this.isComparing) {
      return;
    }
    setTimeout(() => {
      if (this.column.compareColumn == null) {
        this.column.diff = [[0, this.column.value]];
        this.qEditor.setText(this.column.value);
      } else {
        const diff = this.getComparisonDiffs(
          this.column.compareColumn.value,
          this.column.value
        );
        this.qEditor.setContents(this.transformPositiveContent(diff));
        this.column.compareColumn.diff = diff;

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
      if (this.searchInfo) {
        this.setSearchFormat(searchInfoPrevValue);
      }
    });
  }

  getComparisonDiffs(original: string, newText: string) {
    const diff = this.dmp.diff_main(original, newText);
    this.dmp.diff_cleanupSemantic(diff);
    return diff;
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

  setEditorContent(): void {
    if (this.negativeDiff) {
      this.setNegativeContent();
    } else {
      if (this.isComparing) {
        this.getContentDifferences();
      } else {
        this.qEditor.setText(this.column.value);
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
        this.toastService.messageError(
          this.column.regExTitle || "Error!",
          this.column.regExMessage || "Error",
          1500,
          true
        );
      }
    }
    return newValue;
  }
}
