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
  ViewChildren,
  ViewEncapsulation,
} from "@angular/core";
import { fromEvent, Subscription } from "rxjs";
import { filter, take } from "rxjs/operators";
import { StorageService } from "src/app/services/storage.service";
import { behaviors } from "../../models/constants/behaviors.constants";
import {
  defaultEditableMenuPermissions,
  defaultMenuPermissions,
  defaultReadOnlyMenuPermissions,
} from "../../models/constants/rowMenuPermissions.constants";
import { SectionCode } from "../../models/constants/sectioncode.constant";
import { storageCopy } from "../../models/constants/storage.constants";
import { Row, Section } from "../../models/interfaces/uibase";
import { CellEditorComponent } from "../cell-editor/cell-editor.component";

@Component({
  selector: "app-dnb-section",
  templateUrl: "./section.component.html",
  styleUrls: ["./section.component.css"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionComponent implements OnChanges, OnDestroy {
  @ViewChildren(CellEditorComponent) editColumns: QueryList<
    CellEditorComponent
  >;
  @Input() section: Section;
  @Input() isReadOnly: boolean = true;
  @Input() enableEditing: boolean = true;
  @Input() isComparing: boolean = false;
  @Input() undoCopyRowFlag: boolean = false;
  @Input() disabled: boolean = false;

  @Output() sectionChange: EventEmitter<Section> = new EventEmitter();
  @Output() behaviorEvnt: EventEmitter<any> = new EventEmitter();
  menuPermissions = defaultMenuPermissions;

  undoItems: any = {
    undoFlag: false,
    backUpIndexRow: null,
    backUpRow: null,
    undoCopyRow: false,
  };
  contextMenuOpen: boolean = false;
  top: number = 0;
  left: number = 0;
  selectedRowIndex: number = 0;
  selectedColumnIndex: number = 0;
  clickSubscribe: Subscription;
  scrollSubscribe: Subscription;
  contextmenuSubscribe: Subscription;

  constructor(
    private eRef: ElementRef,
    private storageService: StorageService,
    private cd: ChangeDetectorRef
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

  ngOnDestroy() {
    this.contextmenuSubscribe && this.contextmenuSubscribe.unsubscribe();
    this.scrollSubscribe && this.scrollSubscribe.unsubscribe();
    this.clickSubscribe && this.clickSubscribe.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.undoCopyRowFlag) {
      this.undoItems.undoCopyRow = this.undoCopyRowFlag;
    }
  }

  behavior(event): void {
    switch (event.behavior) {
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

  open({ x, y }: MouseEvent, rowIndex: number, columnIndex: number) {
    this.close();
    this.menuPermissions = this.isReadOnly
      ? defaultReadOnlyMenuPermissions
      : defaultEditableMenuPermissions;

    if (
      (this.section.drugVersionCode === SectionCode.DiagnosisCodeOverlaps ||
        this.section.drugVersionCode === SectionCode.DailyMaxUnits) &&
      !this.isReadOnly
    ) {
      this.menuPermissions = {
        ...this.menuPermissions,
        separation: true,
      };
    }

    this.selectedRowIndex = rowIndex;
    this.selectedColumnIndex = columnIndex;
    this.contextMenuOpen = true;
    this.top = y;
    this.left = window.innerWidth - x > 130 ? x : x - 120;

    this.clickSubscribe = fromEvent<MouseEvent>(document, "click")
      .pipe(take(1))
      .subscribe(() => {
        this.close();
        this.cd.detectChanges();
      });
  }

  copyColumn(): void {
    const copyValue = this.section.rows[this.selectedRowIndex].columns[
      this.selectedColumnIndex
    ];
    this.storageService.set(storageCopy.copyColumn, copyValue.value, false);
  }

  pasteColumn(): void {
    const value = this.storageService.get(storageCopy.copyColumn, false);
    if (value) {
      const originalColumn = this.section.rows[this.selectedRowIndex].columns[
        this.selectedColumnIndex
      ];
      this.section.rows[this.selectedRowIndex].columns[
        this.selectedColumnIndex
      ] = {
        ...originalColumn,
        value: value,
        isReadOnly: false,
      };
    }
  }

  close() {
    this.clickSubscribe && this.clickSubscribe.unsubscribe();
    this.contextMenuOpen = false;
  }
}
