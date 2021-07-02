import { SimpleChange } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";
import {
  OktaAuthModule,
  OktaAuthService,
  OKTA_CONFIG,
} from "@okta/okta-angular";
import { QuillModule } from "ngx-quill";
import { MessageService } from "primeng/api";
import { StorageService } from "src/app/services/storage.service";
import { ToastMessageService } from "src/app/services/toast-message.service";
import { storageGeneral } from "../../models/constants/storage.constants";
import { Column, CommentData } from "../../models/interfaces/uibase";
import { DnbRoleAuthService } from "../../services/dnb-role-auth.service";
import { DnbUndoRedoService } from "../../services/undo-redo.service";
import { CellEditorComponent } from "./cell-editor.component";

fdescribe("CellEditorComponent", () => {
  let component: CellEditorComponent;
  let fixture: ComponentFixture<CellEditorComponent>;
  let storage: StorageService;
  let undo: DnbUndoRedoService;

  const column: Column = {
    isReadOnly: false,
    value: "new value",
    compareColumn: {
      isReadOnly: false,
      value: "old value",
      feedbackData: [],
      feedbackLeft: 0,
    },
    feedbackData: [],
    feedbackLeft: 0,
  };

  const oktaConfig = {
    issuer: "https://not-real.okta.com",
    clientId: "fake-client-id",
    redirectUri: "http://localhost:4200",
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CellEditorComponent],
      imports: [
        QuillModule.forRoot({ modules: { toolbar: false }, placeholder: "" }),
        FormsModule,
        OktaAuthModule,
        RouterTestingModule,
      ],
      providers: [
        MessageService,
        ToastMessageService,
        DnbRoleAuthService,
        DnbUndoRedoService,
        OktaAuthService,
        { provide: OKTA_CONFIG, useValue: oktaConfig },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    const dnbPermissions = {
      userId: 1,
      authorities: [
        "ROLE_DNBADMIN",
        "ROLE_CPEA",
        "ROLE_CVPE",
        "ROLE_EBR",
        "ROLE_DNBA",
        "ROLE_DNBE",
        "ROLE_PO",
        "ROLE_CVPA",
        "ROLE_MD",
        "ROLE_TA",
        "ROLE_CVPAP",
        "ROLE_OTH",
        "ROLE_BSC",
        "ROLE_EA",
        "ROLE_CCA",
        "ROLE_CVPU",
        "DNB_READ_MIDRULE_TEMPLATE",
        "DNB_REASSIGN_APPROVER",
        "DNB_EDIT_MIDRULE_TEMPLATE",
        "DNB_READ_DRDS",
        "DNB_EDIT_DRDS",
        "DNB_REVIEW_APPROVE_DRD",
        "DNB_LIST_DRUGS",
        "DNB_DOWNLOAD_DRAFT_DRD",
        "DNB_REASSIGN_EDITOR",
        "DNB_DOWNLOAD_APPROVED_DRD",
      ],
      actions: [
        "DNB_READ_MIDRULE_TEMPLATE",
        "DNB_REASSIGN_APPROVER",
        "DNB_EDIT_MIDRULE_TEMPLATE",
        "DNB_READ_DRDS",
        "DNB_EDIT_DRDS",
        "DNB_REVIEW_APPROVE_DRD",
        "DNB_LIST_DRUGS",
        "DNB_DOWNLOAD_DRAFT_DRD",
        "DNB_REASSIGN_EDITOR",
        "DNB_DOWNLOAD_APPROVED_DRD",
      ],
    };

    storage = TestBed.get(StorageService);
    undo = TestBed.get(DnbUndoRedoService);
    const section = {
      feedbackData: [],
      feedbackLeft: 0,
      headers: [],
      headersUIWidth: [],
      section: { code: "code", name: "section" },
      drugVersionCode: "id",
      id: "id",
      rows: [
        {
          columns: [
            {
              value: "Row1",
              isReadOnly: false,
              feedbackData: [],
              feedbackLeft: 0,
              comments: [],
            },
          ],
          hasBorder: false,
          code: "1",
        },
      ],
    };
    undo.sections = [
      {
        new: section,
        current: section,
        id: "",
        grouped: false,
        hasRowHeading: false,
      },
    ];
    storage.set(storageGeneral.dnbPermissions, dnbPermissions, true);
    storage.set("userSession", { userId: 1 }, true);
    fixture = TestBed.createComponent(CellEditorComponent);
    component = fixture.componentInstance;
    component.sectionPosition = {
      sectionIndex: 0,
      isGrouped: false,
      isDrugName: false,
      isSectionCodes: false,
      isName: false,
      groupIndex: 0,
      rowIndex: 0,
      columnIndex: 0,
      oldVal: "",
    };
    component.column = column;
    component.isComparing = true;
    component.focus = {
      isTabAction: true,
      hasFocus: true,
    };
    component.qEditor = {
      setSelection: (item, item2 = 0) => {},
      setContents: (item, b) => {},
      formatText: (a, b, c) => {},
      getSelection: () => {
        return { index: 0, length: 0 };
      },
    };
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should compare if comparing is on", async () => {
    const changes = {
      column: new SimpleChange(null, column, true),
      isComparing: new SimpleChange(null, true, true),
    };
    component.column = column;
    component.isComparing = true;
    component.comments = null;
    await fixture.whenStable();
    component.ngOnChanges(changes);
    await fixture.whenStable();
    fixture.detectChanges();
    const html = fixture.debugElement.query(By.css(".quill-editor"))
      .nativeElement.innerHTML;
    expect(html).toContain(
      '<p><u style="color: blue;">new</u><span style="color: black;"> value</span></p>'
    );
  });

  it("should compare rules if comparing is on", async () => {
    const changes = {
      column: new SimpleChange(null, column, true),
      showAllChanges: new SimpleChange(null, true, false),
      isComparing: new SimpleChange(null, true, true),
    };
    component.column = column;
    component.isComparing = true;
    component.showAllChanges = true;
    component.comments = null;
    await fixture.whenStable();
    component.ngOnChanges(changes);
    await fixture.whenStable();
    fixture.detectChanges();
    const html = fixture.debugElement.query(By.css(".quill-editor"))
      .nativeElement.innerHTML;
    expect(html).toContain(
      '<p><s style="color: red;">old </s><u style="color: blue;">new </u>value</p>'
    );
  });

  it("should transform the data", () => {
    const diff = [
      [-1, "removed"],
      [0, "stays"],
      [1, "new text"],
    ];
    const transformed = component.transformPositiveContent(diff);
    expect(transformed.length).toBe(2);
  });

  it("should set max value", () => {
    const text = "tania soto";
    component.column = {
      isReadOnly: false,
      value: "tania",
      maxLength: 6,
      feedbackData: [],
      feedbackLeft: 0,
    };
    const fakeEditor = {
      clipboard: {
        addMatcher: (args) => {},
      },
      getSelection: () => {},
      setText: () => {},
      root: {
        addEventListener: () => {},
      },
    };
    component.editorChanged({
      source: "user",
      text,
      editor: fakeEditor,
      content: { ops: {} },
      delta: { ops: {} },
    });
    expect(component.column.value.length).toBe(6);
  });

  it("should set max value on array types", () => {
    const text = "tania, tania";
    component.column = {
      isReadOnly: false,
      value: "tania",
      isArrayValue: true,
      maxLength: 3,
      feedbackData: [],
      feedbackLeft: 0,
    };
    const fakeEditor = {
      clipboard: {
        addMatcher: (args) => {},
      },
      getSelection: () => {},
      setText: () => {},
      root: {
        addEventListener: () => {},
      },
    };
    component.editorChanged({
      source: "user",
      text,
      editor: fakeEditor,
      content: { ops: {} },
      delta: { ops: {} },
    });
    expect(component.column.value.length).toBe(7);
  });

  it("should prevent to add more items than max items array", () => {
    const text = "tania, tania, tania";
    component.column = {
      isReadOnly: false,
      value: "tania",
      isArrayValue: true,
      maxLength: 3,
      maxArrayItems: 2,
      feedbackData: [],
      feedbackLeft: 0,
    };
    const fakeEditor = {
      clipboard: {
        addMatcher: (args) => {},
      },
      getSelection: () => {},
      setText: () => {},
      root: {
        addEventListener: () => {},
      },
    };
    component.editorChanged({
      source: "user",
      text,
      editor: fakeEditor,
      content: { ops: {} },
      delta: { ops: {} },
    });
    expect(component.column.value.length).toBe(7);
  });

  it("should emit if up key is pressed", () => {
    const mockDocument = {
      anchorNode: {
        textContent: "",
        nodeType: 3,
      },
      focusOffset: 0,
    };
    spyOn(document, "getSelection").and.returnValue(mockDocument);
    const spy = spyOn(component.cellNavigate, "emit");
    component.keyup({ key: "ArrowUp" });
    expect(spy).toHaveBeenCalled();
  });

  it("should emit if down key is pressed", () => {
    const mockDocument = {
      anchorNode: {
        textContent: "",
        nodeType: 3,
        parentNode: {
          nextSibling: undefined,
        },
      },
      focusOffset: 0,
    };
    spyOn(document, "getSelection").and.returnValue(mockDocument);
    const spy = spyOn(component.cellNavigate, "emit");
    component.keyup({ key: "ArrowDown" });
    expect(spy).toHaveBeenCalled();
  });

  it("should emit if left key is pressed", () => {
    const mockDocument = {
      anchorNode: {
        textContent: "",
      },
      focusOffset: 0,
    };
    component.selectionIndex = 0;
    spyOn(document, "getSelection").and.returnValue(mockDocument);
    component.column.value = "";
    const spy = spyOn(component.cellNavigate, "emit");
    component.keyup({ key: "ArrowLeft" });
    expect(spy).toHaveBeenCalled();
  });

  it("should emit if right key is pressed", () => {
    const mockDocument = {
      anchorNode: {
        textContent: "",
        parentNode: {
          nextSibling: undefined,
        },
      },
      focusOffset: 0,
    };
    spyOn(document, "getSelection").and.returnValue(mockDocument);
    component.column.value = "";
    const spy = spyOn(component.cellNavigate, "emit");
    component.keyup({ key: "ArrowRight" });
    expect(spy).toHaveBeenCalled();
  });

  it("should set focus", () => {
    component.setFocus();
    expect(component.focus).toBe(null);
  });

  it("should change selection", () => {
    component.selectionChanged({
      range: { index: 1 },
    });
    expect(component.selectionIndex).toBe(1);
  });

  it("should set negative content", () => {
    const spy = spyOn(component.qEditor, "setContents");
    const diff: [number, string][] = [
      [0, "text"],
      [-1, "removed"],
    ];
    component.negativeDiff = diff;
    fixture.detectChanges();
    component.setNegativeContent();
    expect(spy).toHaveBeenCalledWith([
      { insert: "text", attributes: { color: "black" } },
      { insert: "removed", attributes: { color: "red", strike: true } },
    ]);
  });

  it("should set correct comments format", async () => {
    const columnData: Column = {
      isReadOnly: false,
      value: "new value",
      feedbackData: [],
      feedbackLeft: 0,
    };
    const comments: CommentData[] = [
      {
        beginIndex: 0,
        endIndex: 2,
        sectionRowUuid: "test",
        uiSectionCode: "",
        comment: "",
        uiColumnAttribute: "Item",
        elementId: "1",
      },
    ];
    const changes = {
      comments: new SimpleChange(null, comments, true),
    };
    component.comments = comments;
    component.column = columnData;
    component.isComparing = false;
    fixture.detectChanges();
    await fixture.whenStable();
    component.ngOnChanges(changes);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const html = fixture.debugElement.query(By.css(".quill-editor"))
      .nativeElement.innerHTML;
    expect(html).toContain(
      '<p><h6 class="comment" attr-id="1">ne</h6>w value</p>'
    );
  });

  it("should filter comments and emit", () => {
    const spy = spyOn(component.commentsChange, "emit");
    const comments: CommentData[] = [
      {
        beginIndex: 0,
        endIndex: 3,
        sectionRowUuid: "test",
        uiSectionCode: "",
        comment: "",
        uiColumnAttribute: "Item",
        elementId: "1",
      },
    ];
    component.commentsBackup = comments;
    component.comments = comments;
    const content = {
      ops: [
        {
          attributes: {
            "custom-content": "2",
          },
          insert: "new",
        },
      ],
    };
    component.checkCommentsUpdate(content);
    expect(spy).toHaveBeenCalled();
  });

  it("should emit cell navigate", () => {
    const spy = spyOn(component.cellNavigate, "emit");
    (component.quillConfig.keyboard as any).bindings.shiftTab.handler();
    (component.quillConfig.keyboard as any).bindings.tab.handler();
    (component.quillConfig.keyboard as any).bindings.arrowUp.handler();
    (component.quillConfig.keyboard as any).bindings.arrowDown.handler();
    (component.quillConfig.keyboard as any).bindings.arrowRight.handler();
    (component.quillConfig.keyboard as any).bindings.arrowLeft.handler();
    expect(spy).toHaveBeenCalledTimes(6);
  });

  it("should emit on control z", () => {
    const spy = spyOn(undo, "undo");
    component.keydown({
      key: "z",
      ctrlKey: true,
      stopPropagation: () => {},
      preventDefault: () => {},
    });
    expect(spy).toHaveBeenCalled();
  });

  it("should track changes", () => {
    const text = "tania, tania";
    component.column = {
      isReadOnly: false,
      value: "tania",
      isArrayValue: true,
      maxLength: 100,
      feedbackData: [],
      feedbackLeft: 0,
      compareColumn: {
        isReadOnly: true,
        value: "tania",
        feedbackData: [],
        feedbackLeft: 0,
      },
    };
    component.isComparing = true;
    component.showAllChanges = true;
    const fakeEditor = {
      clipboard: {
        addMatcher: (args) => {},
      },
      getSelection: () => {},
      setText: () => {},
      root: {
        addEventListener: () => {},
      },
    };
    component.editorChanged({
      source: "user",
      text,
      editor: fakeEditor,
      content: {
        ops: [
          { insert: "tana", attributes: { color: "red" } },
          { insert: "tani", attributes: { color: "blue" } },
          { insert: "a" },
        ],
      },
      delta: { ops: [] },
    });
    expect(component.column.value).toBe("tania");
  });

  xit("should show search info", async () => {
    component.column = {
      isReadOnly: false,
      value: "tania",
      isArrayValue: true,
      maxLength: 100,
      feedbackData: [],
      feedbackLeft: 0,
    };
    component.searchInfo = {
      positions: [0, 5],
      length: 1,
    }
    await fixture.whenStable();
    fixture.detectChanges();
    component.setSearchFormat({ positions: [0, 5], length: 1 });
    component.setHighlight(0);
    expect(component.column.value).toContain("tania");
  });

  it("should validate data", () => {
    const value = "tania@@@@";
    component.column = {
      value,
      feedbackData: [],
      feedbackLeft: 0,
      isReadOnly: false,
      placeholder: "New Drug Name",
      maxLength: 100,
      regExValidator: /[^-A-Z,()_\d\s]/,
      regExTitle: "New Drug Name",
      regExMessage:
        "Just numbers, letters, parentheses, commas, underscore and dash are allowed",
    };
    expect(component.columnValueRegExValidator(value)).toBe("tania");
  });
});
