import { Component, Input } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { StorageService } from "src/app/services/storage.service";
import {
  Column,
  GroupedSection,
  GroupRow,
  SearchData,
  Section,
} from "../../models/interfaces/uibase";
import { GroupedSectionComponent } from "./grouped-section.component";
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
  @Input() isLastSectionColumn: string;
  getDifferences() {}
}
@Component({ selector: "app-dnb-row-menu", template: "" })
class RowMenuStubComponent {
  @Input() section: Section | GroupedSection;
  @Input() isGrouped: boolean = false;
  @Input() rowIndex: number = 0;
  @Input() groupIndex: number = 0;
  @Input() visible: boolean = true;
  @Input() undoItems: any = {
    undoFlag: false,
    backUpIndexRow: null,
    backUpIndexGroup: null,
    wasGroupRemoved: false,
    backUpRow: null,
    backUpGroup: null,
  };
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

fdescribe("GroupedSectionComponent", () => {
  let component: GroupedSectionComponent;
  let fixture: ComponentFixture<GroupedSectionComponent>;
  let storageService: StorageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GroupedSectionComponent,
        CellEditorStubComponent,
        RowMenuStubComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedSectionComponent);
    component = fixture.componentInstance;

    component.section = {
      headers: ["header 1", "header 2", "header 3"],
      section: { code: "code", name: "section" },
      drugVersionCode: "id",
      id: "id",
      groups: [
        {
          names: [
            {
              value: "Group1",
              isReadOnly: true,
            },
          ],
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
        },
      ],
    };
    storageService = TestBed.get(StorageService);

    fixture.detectChanges();
  });

  it("should create", () => {
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
    const undoCopyEvent = { behavior: behaviors.undoCopyRow };
    component.behavior(undoCopyEvent);
    expect(event).toHaveBeenCalled();
  });

  it("should emit copy Row Group", () => {
    const event = spyOn(component.behaviorEvnt, "emit");
    const undoCopyEvent = { behavior: behaviors.copyRowGroup };
    component.behavior(undoCopyEvent);
    expect(event).toHaveBeenCalled();
  });

  it("should emit undo copy Group", () => {
    const event = spyOn(component.behaviorEvnt, "emit");
    const undoCopyEvent = { behavior: behaviors.copyGroup };
    component.behavior(undoCopyEvent);
    expect(event).toHaveBeenCalled();
  });

  it("should emit copyGroup", () => {
    const event = spyOn(component.behaviorEvnt, "emit");
    const group: GroupRow = { names: [], rows: [] };
    const groupIndex: number = 0;
    component.copyGroup(group, groupIndex);
    expect(event).toHaveBeenCalled();
  });

  it("should open menu context", () => {
    const mouseEvent = new MouseEvent("click", { clientX: 1, clientY: 1 });
    component.openRowMenu(mouseEvent, 1, 1, 1);
    expect(component.contextMenuOpen).toBe(true);
  });

  it("should copy column", () => {
    const mouseEvent = new MouseEvent("click", { clientX: 1, clientY: 1 });
    component.openRowMenu(mouseEvent, 0, 0, 0);
    const event = { behavior: behaviors.copyColumn };
    component.behavior(event);
    const value = storageService.get(storageCopy.copyColumn, false);
    expect(value).toBe("Row1");
  });

  it("should paste content", () => {
    const mouseEvent = new MouseEvent("click", { clientX: 1, clientY: 1 });
    component.openRowMenu(mouseEvent, 0, 0, 0);
    const copyEvent = { behavior: behaviors.copyColumn };
    component.behavior(copyEvent);
    component.openRowMenu(mouseEvent, 0, 1, 0);
    const pasteEvent = { behavior: behaviors.pasteColumn };
    component.behavior(pasteEvent);
    const newValue =
      component.section.groups[component.selectedGroupIndex].rows[
        component.selectedRowIndex
      ].columns[component.selectedColumnIndex].value;
    expect(newValue).toBe("Row1");
  });
});
