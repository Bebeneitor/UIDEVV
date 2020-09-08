import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
} from "@angular/core";
import { fromEvent } from "rxjs";
import { Subscription } from "rxjs/internal/Subscription";
import { filter, take } from "rxjs/operators";
import { StorageService } from "src/app/services/storage.service";
import { behaviors } from "../../models/constants/behaviors.constants";
import {
  defaulReadOnlyGroupRowMenuPermissions,
  defaultEditableGroupMenuPermissions,
  defaultEditableGroupRowMenuPermissions,
  defaultMenuPermissions,
  defaultReadOnlyGroupMenuPermissions,
  menuPermissions,
} from "../../models/constants/rowMenuPermissions.constants";
import { SectionCode } from "../../models/constants/sectioncode.constant";
import { storageCopy } from "../../models/constants/storage.constants";
import {
  GroupedSection,
  GroupRow,
  Row,
  Section,
} from "../../models/interfaces/uibase";
import { CellEditorComponent } from "../cell-editor/cell-editor.component";

@Component({
  selector: "app-dnb-grouped-section",
  templateUrl: "./grouped-section.component.html",
  styleUrls: ["./grouped-section.component.css"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupedSectionComponent implements OnDestroy {
  @ViewChildren(CellEditorComponent) editColumns: QueryList<
    CellEditorComponent
  >;
  @Input() section: GroupedSection;
  @Input() isReadOnly: boolean = true;
  @Input() enableEditing: boolean = true;
  @Input() isComparing: boolean = false;
  @Input() disabled: boolean = false;

  @Output() sectionChange: EventEmitter<Section> = new EventEmitter();
  @Output() behaviorEvnt: EventEmitter<any> = new EventEmitter();

  undoItems: any = {
    undoFlag: false,
    backUpIndexRow: null,
    backUpIndexGroup: null,
    backUpRow: null,
  };

  menuPermissions: menuPermissions = defaultMenuPermissions;
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

  behavior(event): void {
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
      default:
        this.behaviorEvnt.emit(event);
        break;
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
    isGrouped: boolean = false
  ) {
    this.close();
    this.contextMenuOpen = true;
    this.selectedRowIndex = rowIndex;
    this.selectedGroupIndex = groupIndex;
    this.selectedColumnIndex = columnIndex;
    this.groupContextMenuOpened = isGrouped;
    this.top = y;
    this.left = window.innerWidth - x > 130 ? x : x - 120;
    if (isGrouped) {
      this.menuPermissions = this.isReadOnly
        ? defaultReadOnlyGroupMenuPermissions
        : defaultEditableGroupMenuPermissions;
    } else {
      this.menuPermissions = this.isReadOnly
        ? defaulReadOnlyGroupRowMenuPermissions
        : defaultEditableGroupRowMenuPermissions;
    }

    if (
      this.section.drugVersionCode === SectionCode.DosingPatterns &&
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
      this.section.drugVersionCode === SectionCode.SecondaryMalignancy &&
      !this.isReadOnly
    ) {
      this.menuPermissions = {
        ...this.menuPermissions,
        addGroupRow: { visible: true, label: "Add Primary Malignancy" },
        separation: true,
      };
    }
    this.clickSubscribe = fromEvent<MouseEvent>(document, "click")
      .pipe(take(1))
      .subscribe(() => {
        this.close();
        this.cd.detectChanges();
      });
  }

  close() {
    this.clickSubscribe && this.clickSubscribe.unsubscribe();
    this.contextMenuOpen = false;
  }

  copyColumn(): void {
    let columnValue;
    if (this.groupContextMenuOpened) {
      columnValue = this.section.groups[this.selectedGroupIndex].names[
        this.selectedColumnIndex
      ].value;
    } else {
      columnValue = this.section.groups[this.selectedGroupIndex].rows[
        this.selectedRowIndex
      ].columns[this.selectedColumnIndex].value;
    }
    this.storageService.set(storageCopy.copyColumn, columnValue, false);
  }

  pasteColumn(): void {
    const value = this.storageService.get(storageCopy.copyColumn, false);
    if (value) {
      if (this.groupContextMenuOpened) {
        const oldColumn = this.section.groups[this.selectedGroupIndex].names[
          this.selectedColumnIndex
        ];
        this.section.groups[this.selectedGroupIndex].names[
          this.selectedColumnIndex
        ] = {
          ...oldColumn,
          value: value,
          isReadOnly: false,
        };
      } else {
        const oldColumn = this.section.groups[this.selectedGroupIndex].rows[
          this.selectedRowIndex
        ].columns[this.selectedColumnIndex];
        this.section.groups[this.selectedGroupIndex].rows[
          this.selectedRowIndex
        ].columns[this.selectedColumnIndex] = {
          ...oldColumn,
          value: value,
          isReadOnly: false,
        };
      }
    }
  }
}
