import { SimpleChange } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import {
  GroupedSection,
  GroupRow,
  Row,
  Section,
} from "../../../models/interfaces/uibase";
import { RowMenuComponent } from "./row-menu.component";

fdescribe("RowMenuComponent", () => {
  let component: RowMenuComponent;
  let fixture: ComponentFixture<RowMenuComponent>;

  let groupedSection: GroupedSection;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RowMenuComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RowMenuComponent);
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
    groupedSection = {
      id: "sectionotwo",
      headers: ["header 1", "header 2"],
      section: { code: "code", name: "Section Name" },
      drugVersionCode: "id",
      groups: [
        {
          names: [
            {
              value: "Group One",
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
          ],
        },
        {
          names: [
            {
              value: "Group Two",
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
          ],
        },
      ],
    };
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should remove a row", () => {
    component.removeRow();
    expect((component.section as Section).rows.length).toBe(1);
    component.removeRow();
    expect((component.section as Section).rows.length).toBe(1);
  });

  it("should undo removed row", () => {
    component.removeRow();
    expect((component.section as Section).rows.length).toBe(1);
    component.undoRemoveRow();
    expect((component.section as Section).rows.length).toBe(2);
  });

  it("should add a row", () => {
    component.addRow();
    expect((component.section as Section).rows.length).toBe(3);
  });

  it("should move item Up", () => {
    component.moveItem(1);
    expect((component.section as Section).rows[1].columns[0].value).toBe(
      "Row1"
    );
  });

  it("should move item Down", () => {
    component.rowIndex = 1;
    component.moveItem(-1);
    expect((component.section as Section).rows[0].columns[0].value).toBe(
      "Row2"
    );
  });

  it("should move group Up", () => {
    component.section = groupedSection;
    component.moveGroup(1);
    expect((component.section as GroupedSection).groups[1].names[0].value).toBe(
      "Group One"
    );
  });

  it("should move group Down", () => {
    component.section = groupedSection;
    component.groupIndex = 1;
    component.moveGroup(-1);
    expect((component.section as GroupedSection).groups[0].names[0].value).toBe(
      "Group Two"
    );
  });

  it("should remove a row for grouped section", async () => {
    component.section = {
      headers: ["header 1", "header 2"],
      section: { code: "code", name: "section" },
      drugVersionCode: "id",
      id: "id",
      groups: [
        {
          names: [
            {
              value: "Group Name 1",
              isReadOnly: true,
            },
          ],
          rows: [
            {
              columns: [
                {
                  value: "Group Row1",
                  isReadOnly: true,
                },
              ],
              hasBorder: false,
            },
            {
              columns: [
                {
                  value: "Group Row2",
                  isReadOnly: true,
                },
              ],
              hasBorder: false,
            },
          ],
        },
      ],
    };
    component.isGrouped = true;
    fixture.detectChanges();
    const change = {
      undoFlag: true,
      backUpIndexRow: component.rowIndex,
      backUpIndexGroup: component.groupIndex,
      wasGroupRemoved: false,
      backUpGroup: (component.section as GroupedSection).groups[
        component.groupIndex
      ],
      backUpRow: (component.section as GroupedSection).groups[
        component.groupIndex
      ].rows[component.rowIndex],
    };
    component.removeRow();
    component.undoItems = change;
    component.ngOnChanges({ undoItems: new SimpleChange(null, change, true) });
    fixture.detectChanges();
    await fixture.whenStable();
    component.ngOnChanges({ undoItems: new SimpleChange(null, change, true) });
    expect((component.section as GroupedSection).groups[0].rows.length).toBe(1);
  });

  it("should undo removed row for grouped section", async () => {
    component.section = {
      headers: ["header 1", "header 2"],
      section: { code: "code", name: "section" },
      drugVersionCode: "id",
      id: "id",
      groups: [
        {
          names: [
            {
              value: "Group Name 1",
              isReadOnly: true,
            },
          ],
          rows: [
            {
              columns: [
                {
                  value: "Group Row1",
                  isReadOnly: true,
                },
              ],
              hasBorder: false,
            },
            {
              columns: [
                {
                  value: "Group Row2",
                  isReadOnly: true,
                },
              ],
              hasBorder: false,
            },
          ],
        },
      ],
    };
    component.isGrouped = true;
    fixture.detectChanges();
    const change = {
      undoFlag: true,
      backUpIndexRow: component.rowIndex,
      backUpIndexGroup: component.groupIndex,
      wasGroupRemoved: false,
      backUpGroup: (component.section as GroupedSection).groups[
        component.groupIndex
      ],
      backUpRow: (component.section as GroupedSection).groups[
        component.groupIndex
      ].rows[component.rowIndex],
    };
    component.removeRow();
    expect((component.section as GroupedSection).groups[0].rows.length).toBe(1);

    component.undoItems = change;
    component.ngOnChanges({ undoItems: new SimpleChange(null, change, true) });
    fixture.detectChanges();
    await fixture.whenStable();
    component.ngOnChanges({ undoItems: new SimpleChange(null, change, true) });
    component.undoRemoveRow();
    expect((component.section as GroupedSection).groups[0].rows.length).toBe(2);
  });

  it("should add a group for grouped section", () => {
    component.section = {
      headers: ["header 1", "header 2"],
      section: { code: "code", name: "section" },
      drugVersionCode: "id",
      id: "id",
      groups: [
        {
          names: [
            {
              value: "Group Name 1",
              isReadOnly: true,
            },
          ],
          rows: [
            {
              columns: [
                {
                  value: "Group Row1",
                  isReadOnly: true,
                },
              ],
              hasBorder: false,
            },
            {
              columns: [
                {
                  value: "Group Row2",
                  isReadOnly: true,
                },
              ],
              hasBorder: false,
            },
          ],
        },
      ],
    };
    component.isGrouped = true;
    fixture.detectChanges();
    component.addGroup();
    expect((component.section as GroupedSection).groups.length).toBe(2);
  });

  it("should add a dosing for selected group", () => {
    component.section = {
      headers: ["header 1", "header 2"],
      section: { code: "code", name: "section" },
      drugVersionCode: "id",
      id: "id",
      groups: [
        {
          names: [
            {
              value: "Group Name 1",
              isReadOnly: true,
            },
          ],
          rows: [
            {
              columns: [
                {
                  value: "Group Row1",
                  isReadOnly: true,
                },
              ],
              hasBorder: false,
            },
            {
              columns: [
                {
                  value: "Group Row2",
                  isReadOnly: true,
                },
              ],
              hasBorder: false,
            },
          ],
        },
      ],
    };
    component.isGrouped = true;
    fixture.detectChanges();
    component.addGroupRow();
    expect((component.section as GroupedSection).groups[0].rows.length).toBe(3);
  });

  it("should duplicate a dosing for selected group", () => {
    component.section = {
      headers: ["header 1", "header 2"],
      section: { code: "code", name: "section" },
      drugVersionCode: "id",
      id: "id",
      groups: [
        {
          names: [
            {
              value: "Group Name 1",
              isReadOnly: true,
            },
          ],
          rows: [
            {
              columns: [
                {
                  value: "Group Row1",
                  isReadOnly: true,
                },
              ],
              hasBorder: false,
            },
            {
              columns: [
                {
                  value: "Group Row2",
                  isReadOnly: true,
                },
              ],
              hasBorder: false,
            },
          ],
        },
      ],
    };
    component.isGrouped = true;
    fixture.detectChanges();
    component.duplicateDosing();
    expect((component.section as GroupedSection).groups[0].rows.length).toBe(3);
    expect(
      (component.section as GroupedSection).groups[0].rows[0].columns[0].value
    ).toEqual(
      (component.section as GroupedSection).groups[0].rows[1].columns[0].value
    );
  });

  it("should remove a group", () => {
    component.section = {
      headers: ["header 1", "header 2"],
      section: { code: "code", name: "section" },
      drugVersionCode: "id",
      id: "id",
      groups: [
        {
          names: [
            {
              value: "Group Name 1",
              isReadOnly: true,
            },
          ],
          rows: [
            {
              columns: [
                {
                  value: "Group Row1",
                  isReadOnly: true,
                },
              ],
              hasBorder: false,
            },
            {
              columns: [
                {
                  value: "Group Row2",
                  isReadOnly: true,
                },
              ],
              hasBorder: false,
            },
          ],
        },
      ],
    };
    component.isGrouped = true;
    fixture.detectChanges();
    component.removeGroup();
    expect((component.section as GroupedSection).groups.length).toBe(1);
  });

  it("should remove a group", async () => {
    component.section = {
      headers: ["header 1", "header 2"],
      section: { code: "code", name: "section" },
      drugVersionCode: "id",
      id: "id",
      groups: [
        {
          names: [
            {
              value: "Group Name 1",
              isReadOnly: true,
            },
          ],
          rows: [
            {
              columns: [
                {
                  value: "Group Row1",
                  isReadOnly: true,
                },
              ],
              hasBorder: false,
            },
            {
              columns: [
                {
                  value: "Group Row2",
                  isReadOnly: true,
                },
              ],
              hasBorder: false,
            },
          ],
        },
        {
          names: [
            {
              value: "Group Name 1",
              isReadOnly: true,
            },
          ],
          rows: [
            {
              columns: [
                {
                  value: "Group Row1",
                  isReadOnly: true,
                },
              ],
              hasBorder: false,
            },
            {
              columns: [
                {
                  value: "Group Row2",
                  isReadOnly: true,
                },
              ],
              hasBorder: false,
            },
          ],
        },
      ],
    };
    component.isGrouped = true;
    fixture.detectChanges();
    const change = {
      undoFlag: true,
      backUpIndexRow: component.rowIndex,
      backUpIndexGroup: component.groupIndex,
      wasGroupRemoved: false,
      backUpGroup: (component.section as GroupedSection).groups[
        component.groupIndex
      ],
      backUpRow: (component.section as GroupedSection).groups[
        component.groupIndex
      ].rows[component.rowIndex],
    };
    component.removeGroup();
    expect((component.section as GroupedSection).groups.length).toBe(1);

    component.undoItems = change;
    component.ngOnChanges({ undoItems: new SimpleChange(null, change, true) });
    fixture.detectChanges();
    await fixture.whenStable();
    component.ngOnChanges({ undoItems: new SimpleChange(null, change, true) });
    component.undoRemoveGroup();
    expect((component.section as GroupedSection).groups.length).toBe(2);
  });

  it("should toggle the border of the row", () => {
    const row: Row = {
      columns: [],
      hasBorder: false,
    };
    component.toggleSeparation(row);
    expect(row.hasBorder).toBe(true);
  });

  it("should toggle the border of the group row", () => {
    const row: Row = {
      columns: [],
      hasBorder: false,
    };
    const row2: Row = {
      columns: [],
      hasBorder: false,
    };

    let group: GroupRow = {
      names: [],
      rows: [row],
    };
    component.toggleSeparationGroup(group, row, 0);
    expect(row.hasBorder).toBe(true);
    expect(group.hasBorder).toBe(true);
    group.hasBorder = false;
    group.rows = [row, row2];
    component.toggleSeparationGroup(group, row2, 0);
    expect(row2.hasBorder).toBe(true);
    expect(group.hasBorder).toBe(false);
  });

  it("should emit copy", () => {
    const event = spyOn(component.behaviorEvent, "emit");
    component.copyColumn();
    expect(event).toHaveBeenCalled();
  });

  it("should emit paste", () => {
    const event = spyOn(component.behaviorEvent, "emit");
    component.pasteColumn();
    expect(event).toHaveBeenCalled();
  });

  it("should emit copy group", () => {
    const row: Row = {
      columns: [],
      hasBorder: false,
    };

    let group: GroupRow = {
      names: [],
      rows: [row],
    };
    (component.section as GroupedSection).groups = [group];
    const event = spyOn(component.behaviorEvent, "emit");
    component.copyGroup();
    expect(event).toHaveBeenCalled();
  });

  it("should emit undo copy group", () => {
    const event = spyOn(component.behaviorEvent, "emit");
    component.undoCopyGroup();
    expect(event).toHaveBeenCalled();
  });

  it("should emit undo copy group row", () => {
    const row: Row = {
      columns: [],
      hasBorder: false,
    };

    let group: GroupRow = {
      names: [],
      rows: [row],
    };
    (component.section as GroupedSection).groups = [group];
    const event = spyOn(component.behaviorEvent, "emit");
    component.copyGroupRow();
    expect(event).toHaveBeenCalled();
  });

  it("should emit undo copy group row", () => {
    const event = spyOn(component.behaviorEvent, "emit");
    component.undoCopyGroupRow();
    expect(event).toHaveBeenCalled();
  });

  it("it should undo copy row", () => {
    const event = spyOn(component.behaviorEvent, "emit");
    component.undoCopyRow();
    expect(event).toHaveBeenCalled();
  });

  it("it should  emit copy row", () => {
    const event = spyOn(component.behaviorEvent, "emit");
    component.copyRow();
    expect(event).toHaveBeenCalled();
  });
});
