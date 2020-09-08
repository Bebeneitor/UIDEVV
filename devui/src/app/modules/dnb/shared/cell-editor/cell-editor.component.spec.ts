import { SimpleChange } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { QuillModule } from "ngx-quill";
import { MessageService } from "primeng/api";
import { ToastMessageService } from "src/app/services/toast-message.service";
import { CellEditorComponent } from "./cell-editor.component";

fdescribe("CellEditorComponent", () => {
  let component: CellEditorComponent;
  let fixture: ComponentFixture<CellEditorComponent>;
  const column = {
    isReadOnly: false,
    value: "new value",
    compareColumn: {
      isReadOnly: false,
      value: "old value",
    },
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CellEditorComponent],
      imports: [
        QuillModule.forRoot({ modules: { toolbar: false }, placeholder: "" }),
        FormsModule,
      ],
      providers: [MessageService, ToastMessageService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellEditorComponent);
    component = fixture.componentInstance;

    component.column = column;
    component.isComparing = true;
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

  it("should not compare if comparing is off", async () => {
    const changes = {
      column: new SimpleChange(null, column, true),
      isComparing: new SimpleChange(null, false, true),
    };
    component.column = column;
    component.isComparing = false;
    await fixture.whenStable();
    component.ngOnChanges(changes);
    await fixture.whenStable();
    fixture.detectChanges();
    const html = fixture.debugElement.query(By.css(".quill-editor"))
      .nativeElement.innerHTML;
    expect(html).toContain("<p>new value</p>");
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

  it("should set content with removed content", async () => {
    const diff: [number, string][] = [
      [0, "text"],
      [-1, "removed"],
    ];
    const changes = {
      negativeDiff: new SimpleChange(null, diff, true),
    };
    component.negativeDiff = diff;
    fixture.detectChanges();
    await fixture.whenStable();
    component.ngOnChanges(changes);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const html = fixture.debugElement.query(By.css(".quill-editor"))
      .nativeElement.innerHTML;
    expect(html).toContain(
      '<p><span style="color: black;">text</span><s style="color: red;">removed</s></p>'
    );
  });

  it("should set correct search format", async () => {
    const searchInfo = {
      positions: [0, 5],
      length: 3,
    };
    const changes = {
      searchInfo: new SimpleChange(null, searchInfo, true),
      isComparing: new SimpleChange(null, false, true),
      highLight: new SimpleChange(null, null, true),
    };
    component.isComparing = false;
    component.searchInfo = searchInfo;
    component.highLight = null;
    fixture.detectChanges();
    await fixture.whenStable();
    component.ngOnChanges(changes);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const html = fixture.debugElement.query(By.css(".quill-editor"))
      .nativeElement.innerHTML;

    expect(html).toContain(
      '<p><span style="background-color: yellow;">new</span> v<span style="background-color: yellow;">alu</span>e</p>'
    );
  });

  it("should set correct search format and high light", async () => {
    const searchInfo = {
      positions: [0, 5],
      length: 3,
    };
    const changes = {
      searchInfo: new SimpleChange(null, searchInfo, true),
      isComparing: new SimpleChange(null, false, true),
      highLight: new SimpleChange(null, 0, true),
    };
    component.isComparing = false;
    component.searchInfo = searchInfo;
    component.highLight = 0;
    fixture.detectChanges();
    await fixture.whenStable();
    component.ngOnChanges(changes);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const html = fixture.debugElement.query(By.css(".quill-editor"))
      .nativeElement.innerHTML;
    expect(html).toContain(
      '<p><span style="background-color: orange;">new</span> v<span style="background-color: yellow;">alu</span>e</p>'
    );
  });

  it("should set max value", () => {
    const text = "tania soto";
    component.column = {
      isReadOnly: false,
      value: "tania",
      maxLength: 6,
    };
    const fakeEditor = {
      clipboard: {
        addMatcher: (args) => {},
      },
      getSelection: () => {},
      setText: () => {},
    };
    component.editorChanged({ source: "user", text, editor: fakeEditor });
    expect(component.column.value.length).toBe(6);
  });
});
