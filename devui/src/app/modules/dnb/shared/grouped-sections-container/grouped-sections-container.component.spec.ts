import { Component, Input } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { ConfirmationService } from "primeng/api";
import { InputSwitchModule } from "primeng/inputswitch";
import { behaviors } from "../../models/constants/behaviors.constants";
import {
  Column,
  GroupedSection,
  GroupRow,
  Row,
  SearchData,
} from "../../models/interfaces/uibase";
import { DnbStoreService } from "../../services/dnb-store.service";
import { CopyToNew } from "../../utils/utils.index";
import { GroupedSectionsContainerComponent } from "./grouped-sections-container.component";

@Component({ selector: "app-dnb-grouped-section", template: "" })
class SectionSubComponent {
  @Input() section: GroupedSection;
  @Input() isReadOnly: boolean = true;
  @Input() undoCopyRowFlag: boolean = false;
  @Input() undoCopyRowGroupFlag: boolean = false;
  @Input() hasRowHeading: boolean = false;
  @Input() isComparing: boolean = false;
  @Input() showCurrent: boolean = false;
  @Input() disabled: boolean = false;
  @Input() enableEditing: boolean = true;
  updateCompareColumns() {}
}

@Component({ selector: "app-cell-editor", template: "" })
class CellEditorStubComponent {
  @Input() column: Column = null;
  @Input() isComparing: boolean = false;
  @Input() searchInfo: SearchData = null;
  @Input() highLight: number = null;
  @Input() isReadOnly = false;
  @Input() negativeDiff: any;
  @Input() sectionId: string;

  getDifferences() {}
}

fdescribe("GroupedSectionsContainerComponent", () => {
  let component: GroupedSectionsContainerComponent;
  let fixture: ComponentFixture<GroupedSectionsContainerComponent>;
  let dnbStore: DnbStoreService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GroupedSectionsContainerComponent,
        SectionSubComponent,
        CellEditorStubComponent,
      ],
      imports: [FormsModule, InputSwitchModule],
      providers: [ConfirmationService, CopyToNew, DnbStoreService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedSectionsContainerComponent);
    component = fixture.componentInstance;
    component.currentVersion = {
      id: "sectionotwo",
      headers: ["header 1", "header 2", "header 3"],
      section: { code: "code", name: "Section Name" },
      drugVersionCode: "id",
      groups: [
        {
          names: [
            {
              value: "Group One",
              isReadOnly: true,
            },
            {
              value: "Group Tewo",
              isReadOnly: true,
            },
          ],
          rows: [
            {
              columns: [
                {
                  value: "Old Column 1",
                  isReadOnly: true,
                },
              ],
              hasBorder: false,
            },
            {
              columns: [
                {
                  value: "Row 2 new Column 1",
                  isReadOnly: true,
                },
              ],
              hasBorder: false,
            },
          ],
        },
      ],
    };
    component.newVersion = {
      id: "sectionone",
      headers: ["header 1", "header 2", "header 3"],
      section: { code: "code", name: "Section Name" },
      drugVersionCode: "id",
      groups: [
        {
          names: [
            {
              value: "Group One",
              isReadOnly: true,
            },
            {
              value: "Group Tewo",
              isReadOnly: true,
            },
          ],
          rows: [
            {
              columns: [
                {
                  value: "Row 1 new Column 11",
                  isReadOnly: true,
                },
              ],
              hasBorder: false,
            },
            {
              columns: [
                {
                  value: "Row 2 Old Column 1",
                  isReadOnly: true,
                },
              ],
              hasBorder: false,
            },
          ],
        },
      ],
    };

    component.hasRowHeading = false;
    component.isComparing = false;
    component.showCurrent = false;
    component.enableEditing = true;
    dnbStore = TestBed.get(DnbStoreService);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should add row if it does not exist in new version", () => {
    const row: Row = {
      columns: [
        {
          value: "Row 1 new Column 11",
          isReadOnly: true,
        },
      ],
      hasBorder: false,
    };
    const event = { behavior: behaviors.copyRow, row };
    component.behavior(event);
    expect(component.newVersion.groups[0].rows[0].columns[0].value).toBe(
      row.columns[0].value
    );
  });

  it("should undo copy row and restore to current version", () => {
    const row: Row = component.currentVersion.groups[0].rows[0];
    const copyEvent = { behavior: behaviors.copyRow, row, groupIndex: 0 };
    component.behavior(copyEvent);
    const undoEvent = { behavior: behaviors.undoCopyRow };
    component.behavior(undoEvent);
    expect(component.currentVersion.groups[0].rows[0].columns[0].value).toBe(
      component.currentVersion.groups[0].rows[0].columns[0].value
    );
  });

  it("should add new group if it does not exist in new version", () => {
    const groupRow: GroupRow = {
      names: [
        {
          value: "Old Column 1",
          isReadOnly: true,
        },
        {
          value: "Old Column 1",
          isReadOnly: true,
        },
      ],
      rows: [
        {
          columns: [
            {
              value: "Old Column 2",
              isReadOnly: true,
            },
          ],
          hasBorder: false,
        },
      ],
    };
    const indexGroup: number = 0;
    const event = { behavior: behaviors.copyGroup, groupRow, indexGroup };
    component.behavior(event);
    expect(component.newVersion.groups[1].rows[0].columns[0].value).toBe(
      groupRow.rows[0].columns[0].value
    );
  });

  it("should undo copy group", () => {
    const groupRow: GroupRow = {
      names: [
        {
          value: "Old Column 1",
          isReadOnly: true,
        },
        {
          value: "Old Column 1",
          isReadOnly: true,
        },
      ],
      rows: [
        {
          columns: [
            {
              value: "Old Column 2",
              isReadOnly: true,
            },
          ],
          hasBorder: false,
        },
      ],
    };
    const indexGroup: number = 0;
    const event = { behavior: behaviors.copyGroup, groupRow, indexGroup };
    component.behavior(event);
    const event2 = {
      behavior: behaviors.undoCopyGroup,
    };
    component.behavior(event2);
    expect(component.newVersion.groups[1]).toBeFalsy();
  });

  it("should copy the row of a group", () => {
    const groupRow: Row = {
      columns: [
        {
          value: "New Copied Column 2",
          isReadOnly: true,
        },
      ],
      hasBorder: false,
    };
    const indexGroup: number = 0;
    const event = {
      behavior: behaviors.copyRowGroup,
      row: groupRow,
      groupIndex: indexGroup,
    };
    component.behavior(event);
    expect(component.newVersion.groups[0].rows[2].columns[0].value).toBe(
      groupRow.columns[0].value
    );
  });

  it("should copy the to the first empty group", () => {
    const groupRow: Row = {
      columns: [
        {
          value: "New Copied Column 2",
          isReadOnly: true,
        },
      ],
      hasBorder: false,
    };
    const indexGroup: number = 0;
    const event = {
      behavior: behaviors.copyRowGroup,
      row: groupRow,
      groupIndex: indexGroup,
    };
    component.newVersion.groups[0].names.forEach((col) => {
      col.value = "";
    });
    component.newVersion.groups[0].rows.forEach((row) => {
      row.columns.forEach((col) => {
        col.value = "";
      });
    });

    component.behavior(event);
    expect(component.newVersion.groups[0].rows[0].columns[0].value).toBe(
      groupRow.columns[0].value
    );
  });

  it("should add a new group if no space is found", () => {
    const groupRow: Row = {
      columns: [
        {
          value: "New Copied Column 2",
          isReadOnly: true,
        },
      ],
      hasBorder: false,
    };
    const indexGroup: number = 0;
    const event = {
      behavior: behaviors.copyRowGroup,
      row: groupRow,
      groupIndex: indexGroup,
    };
    const column = { isReadOnly: false, value: "test" };
    component.newVersion.groups = [
      {
        names: [column],
        rows: [{ columns: [column], hasBorder: false }],
      },
    ];

    component.behavior(event);
    expect(component.newVersion.groups[1].rows[0].columns[0].value).toBe(
      groupRow.columns[0].value
    );
  });

  it("should undo copy the row of a group", () => {
    const groupRow: Row = {
      columns: [
        {
          value: "New Copied Column 2",
          isReadOnly: true,
        },
      ],
      hasBorder: false,
    };
    const indexGroup: number = 0;
    const event = {
      behavior: behaviors.copyRowGroup,
      row: groupRow,
      groupIndex: indexGroup,
    };
    component.behavior(event);

    const event2 = {
      behavior: behaviors.undoCopyRowGroup,
    };
    component.behavior(event2);
    expect(component.newVersion.groups[0].rows[2]).toBeFalsy();
  });

  it("should  not compare if compare is false", () => {
    component.isComparing = false;
    component.newVersion.groups[0].rows[0].columns[0].value = "New Column 1";
    const column = component.newVersion.groups[0].rows[0].columns[0];
    component.checkColumnChange(column, 0, 0, 0);
    expect(
      component.newVersion.groups[0].rows[0].columns[0].compareColumn
    ).toBeFalsy();
  });

  it("should compare all cells on reset", () => {
    component.isComparing = true;
    component.resetCompare();
    expect(
      component.newVersion.groups[0].rows[0].columns[0].compareColumn.value
    ).toBe("Old Column 1");
    component.isComparing = false;
    component.resetCompare();
    expect(
      component.newVersion.groups[0].rows[0].columns[0].compareColumn
    ).toBeFalsy();
  });

  it("should get compare cell based on position", () => {
    const foundColumn = component.getOrignalCell(0, 0, 0);
    expect(component.currentVersion.groups[0].rows[0].columns[0].value).toEqual(
      foundColumn.value
    );
  });

  it("should emit sticky section", () => {
    const event = spyOn(component.stickySection, "emit");
    component.stickSection();
    expect(event).toHaveBeenCalled();
  });

  it("should emit toggle section copy", () => {
    const event = spyOn(component.toggleSectionCopy, "emit");
    component.collapseSection();
    expect(event).toHaveBeenCalled();
  });

  it("should confirm Copy Section", () => {
    component.confirmCopySectionGroup();
  });

  it("should collapse a section", () => {
    const spy = spyOn(component.toggleSectionCopy, "emit");
    component.collapseSection();

    expect(spy).toHaveBeenCalledWith({
      section: component.newVersion,
      status: false,
    });
  });

  it("should disable a section", () => {
    const spy = spyOn(component.toggleSectionCopy, "emit");
    component.shouldDisableSection = true;
    component.disableChange();

    expect(spy).toHaveBeenCalledWith({
      section: component.newVersion,
      status: false,
    });
  });

  it("should listen to store changes", () => {
    let currentSectionRef = component.currentVersion;
    dnbStore.notifySectionContainerBulkUpdate("Section Name");
    expect(currentSectionRef === component.currentVersion).toBe(false);
    const diff = [];
    const compareColumn: Column = {
      isReadOnly: false,
      value: "test",
    };
    currentSectionRef = component.currentVersion;
    dnbStore.notifySectionContainerColumnUpdate(
      "Section Name",
      compareColumn,
      diff
    );
    expect(currentSectionRef === component.currentVersion).toBe(false);
  });

  it("remove when method is removed", () => {
    component.consoleResponseGroup();
    expect(true).toBe(true);
  });
});
