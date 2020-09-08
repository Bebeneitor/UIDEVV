import { Component, Input } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { QuillModule } from "ngx-quill";
import { StorageService } from "src/app/services/storage.service";
import { defaultMenuPermissions } from "../../models/constants/rowMenuPermissions.constants";
import {
  Column,
  GroupedSection,
  SearchData,
  Section,
} from "../../models/interfaces/uibase";
import { SectionComponent } from "./section.component";
import { behaviors } from "../../models/constants/behaviors.constants";
import { storageCopy } from "../../models/constants/storage.constants";

@Component({ selector: "app-cell-editor", template: "" })
class CellEditorStubComponent {
  @Input() column: Column = null;
  @Input() isComparing: boolean = false;
  @Input() searchInfo: SearchData = null;
  @Input() highLight: number = null;
  @Input() isReadOnly = false;
  @Input() negativeDiff: any;
  @Input() sectionId: string;
  @Input() isLastSectionColumn: boolean;
  getDifferences() {}
}

@Component({ selector: "app-dnb-row-menu", template: "" })
class RowMenuStubComponent {
  @Input() section: Section | GroupedSection;
  @Input() isGrouped: boolean = false;
  @Input() rowIndex: number = 0;
  @Input() groupIndex: number = 0;
  @Input() visible: boolean = true;
  @Input() undoItems = defaultMenuPermissions;
  @Input() menuPermissions: any = {
    separation: true,
    addRow: true,
    removeRow: true,
    moveUp: true,
    moveDown: true,
    undo: true,
    addDosing: false,
    duplicateDosing: false,
  };
}

fdescribe("SectionComponent", () => {
  let component: SectionComponent;
  let fixture: ComponentFixture<SectionComponent>;
  let storageService: StorageService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SectionComponent,
        CellEditorStubComponent,
        RowMenuStubComponent,
      ],
      imports: [QuillModule, FormsModule],
      providers: [StorageService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionComponent);
    component = fixture.componentInstance;
    component.section = {
      headers: ["header 1", "header 2", "header 3"],
      section: { code: "code", name: "section" },
      drugVersionCode: "id",
      id: "id",
      rows: [
        {
          columns: [
            {
              value: "Row1",
              isReadOnly: true,
            },
          ],
          hasBorder: false,
        },
        {
          columns: [
            {
              value: "Row2",
              isReadOnly: true,
            },
          ],
          hasBorder: false,
        },
      ],
    };
    storageService = TestBed.get(StorageService);
    fixture.detectChanges();
  });

  it("should create section", () => {
    expect(component).toBeTruthy();
  });

  it("should emit copy row", () => {
    const event = spyOn(component.behaviorEvnt, "emit");
    const copyEvent = { behavior: behaviors.copyRow };
    component.behavior(copyEvent);
    expect(event).toHaveBeenCalled();
  });

  it("should emit undo copy row", () => {
    const event = spyOn(component.behaviorEvnt, "emit");
    const copyEvent = { behavior: behaviors.undoCopyRow };
    component.behavior(copyEvent);
    expect(event).toHaveBeenCalled();
  });

  it("should open menu context", () => {
    const mouseEvent = new MouseEvent("click", { clientX: 1, clientY: 1 });
    component.open(mouseEvent, 1, 1);
    expect(component.contextMenuOpen).toBe(true);
  });

  it("should copy column", () => {
    const mouseEvent = new MouseEvent("click", { clientX: 1, clientY: 1 });
    component.open(mouseEvent, 0, 0);
    const event = { behavior: behaviors.copyColumn };
    component.behavior(event);
    const value = storageService.get(storageCopy.copyColumn, false);
    expect(value).toBe("Row1");
  });

  it("should paste content", () => {
    const mouseEvent = new MouseEvent("click", { clientX: 1, clientY: 1 });
    component.open(mouseEvent, 0, 0);
    const copyEvent = { behavior: behaviors.copyColumn };
    component.behavior(copyEvent);
    component.open(mouseEvent, 1, 0);
    const pasteEvent = { behavior: behaviors.pasteColumn };
    component.behavior(pasteEvent);
    const newValue =
      component.section.rows[component.selectedRowIndex].columns[
        component.selectedColumnIndex
      ].value;
    expect(newValue).toBe("Row1");
  });
});
