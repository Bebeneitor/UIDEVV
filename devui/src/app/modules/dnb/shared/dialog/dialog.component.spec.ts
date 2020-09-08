import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { DialogModule } from "primeng/components/dialog/dialog";
import { RadioButtonModule } from "primeng/primeng";
import { DialogComponent } from "./dialog.component";

fdescribe("DialogComponent", () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogComponent],
      imports: [DialogModule, FormsModule, RadioButtonModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    component.setUpDialog = {
      header: "",
      container: [],
      buttonCancel: true,
      valueDefault: "",
    };
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should emit should emit openDialog", () => {
    const event = spyOn(component.openDialogChange, "emit");
    component.dialogHidden();
    expect(event).toHaveBeenCalled();
  });

  it("should  emit value selected", () => {
    const event = spyOn(component.selectionSet, "emit");
    component.dialogSelected();
    expect(event).toHaveBeenCalled();
  });
});
