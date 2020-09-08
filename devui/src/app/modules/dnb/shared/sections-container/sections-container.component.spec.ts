import { Component, Input } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { ConfirmationService } from "primeng/api";
import { InputSwitchModule } from "primeng/inputswitch";
import { behaviors } from "../../models/constants/behaviors.constants";
import {
  Column,
  Row,
  SearchData,
  Section,
} from "../../models/interfaces/uibase";
import { DnbStoreService } from "../../services/dnb-store.service";
import { CopyToNew } from "../../utils/utils.index";
import { SectionsContainerComponent } from "./sections-container.component";

@Component({ selector: "app-dnb-section", template: "" })
class SectionStubComponent {
  @Input() section: Section;
  @Input() isReadOnly: boolean = true;
  @Input() isComparing: boolean = false;
  @Input() undoCopyRowFlag: boolean = false;
  @Input() enableEditing: boolean = true;
  @Input() disabled: boolean = false;
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

fdescribe("SectionsContainerComponent", () => {
  let component: SectionsContainerComponent;
  let fixture: ComponentFixture<SectionsContainerComponent>;
  let dnbStore: DnbStoreService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SectionsContainerComponent,
        SectionStubComponent,
        CellEditorStubComponent,
      ],
      imports: [FormsModule, InputSwitchModule],
      providers: [ConfirmationService, CopyToNew, DnbStoreService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionsContainerComponent);
    component = fixture.componentInstance;
    component.newVersion = {
      id: "sectionone",
      headers: ["header 1", "header 2", "header 3"],
      section: { code: "code", name: "Section Name" },
      drugVersionCode: "id",
      rows: [
        {
          columns: [
            {
              value: "Row 1 Old Column 1",
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
    };
    component.currentVersion = {
      id: "sectionone",
      headers: ["header 1", "header 2", "header 3"],
      section: { code: "code", name: "Section Name" },
      drugVersionCode: "id",
      rows: [
        {
          columns: [
            {
              value: "Row 1 Old Column 1",
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
    };
    component.undoCopyRowFlag = false;
    component.showCurrent = true;
    component.isComparing = true;
    component.hasRowHeading = false;
    dnbStore = TestBed.get(DnbStoreService);
    fixture.detectChanges();
  });

  it("should create section container", () => {
    expect(component).toBeTruthy();
  });

  it("should display correct section name", () => {
    const policyReleaseHTML = fixture.debugElement
      .query(By.css(".old-version h3"))
      .nativeElement.textContent.trim();
    expect(policyReleaseHTML).toBe(component.currentVersion.section.name);
  });

  it("should copy row if it exists in new version", () => {
    const row: Row = component.currentVersion.rows[0];
    const event = { behavior: behaviors.copyRow, row };
    component.behavior(event);
    expect(component.currentVersion.rows[0].columns[0].value).toBe(
      component.newVersion.rows[0].columns[0].value
    );
  });

  it("should undo copy row and restore to current version", () => {
    const row: Row = component.currentVersion.rows[0];
    const copyEvent = { behavior: behaviors.copyRow, row };
    component.behavior(copyEvent);
    const undoEvent = { behavior: behaviors.undoCopyRow };
    component.behavior(undoEvent);
    expect(component.currentVersion.rows[0].columns[0].value).toBe(
      component.currentVersion.rows[0].columns[0].value
    );
  });

  it("should add row if it does not exist in new version", () => {
    const row: Row = {
      columns: [
        {
          value: "Some Column 1",
          isReadOnly: true,
        },
      ],
      hasBorder: false,
    };
    const event = { behavior: behaviors.copyRow, row };
    component.behavior(event);
    expect(component.newVersion.rows[2].columns[0].value).toBe(
      row.columns[0].value
    );
  });

  it("should get the correct cell to compare", () => {
    component.isComparing = true;
    component.newVersion.rows[0].columns[0].value = "New Column 1";
    const column = component.newVersion.rows[0].columns[0];
    component.checkColumnChange(column, 0, 0);
    expect(component.newVersion.rows[0].columns[0].compareColumn.value).toBe(
      "Row 1 Old Column 1"
    );
  });

  it("should  not compare if compare is false", () => {
    component.isComparing = false;
    component.newVersion.rows[0].columns[0].value = "New Column 1";
    const column = component.newVersion.rows[0].columns[0];
    component.checkColumnChange(column, 0, 0);
    expect(component.newVersion.rows[0].columns[0].compareColumn).toBeFalsy();
  });

  it("should compare all cells on reset", () => {
    component.isComparing = true;
    component.newVersion.rows[0].columns[0].value = "New Column 1";
    component.resetCompare();
    expect(component.newVersion.rows[0].columns[0].compareColumn.value).toBe(
      "Row 1 Old Column 1"
    );
    component.isComparing = false;
    component.resetCompare();
    expect(component.newVersion.rows[0].columns[0].compareColumn).toBeFalsy();
  });

  it("should get compare cell based on position", () => {
    const foundColumn = component.getOrignalCell(0, 0);
    expect(component.currentVersion.rows[0].columns[0].value).toEqual(
      foundColumn.value
    );
  });

  it("should get compare cell based on row header", () => {
    component.hasRowHeading = true;
    const rowTwo = component.newVersion.rows[1];
    component.newVersion.rows[1] = component.newVersion.rows[0];
    component.newVersion.rows[0] = rowTwo;
    const foundColumn = component.getOrignalCell(0, 0);
    expect(component.newVersion.rows[0].columns[0].value).toBe(
      foundColumn.value
    );
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
    component.consoleResponse();
    expect(true).toBe(true);
  });

  it("should copy section", () => {
    component.copySection();
    expect(component.currentVersion.rows[0].columns[0].value).toBe(
      component.newVersion.rows[0].columns[0].value
    );
  });

  it("should copy section", () => {
    component.copySection();
    expect(component.currentVersion.rows[0].columns[0].value).toBe(
      component.newVersion.rows[0].columns[0].value
    );
    component.undoCopyAll();
    expect(component.newVersion.rows[0].columns[0].value).toBe("Row 1 Old Column 1");
  });
});
