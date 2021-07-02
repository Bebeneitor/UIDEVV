import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { DialogModule } from "primeng/components/dialog/dialog";
import { RadioButtonModule } from "primeng/primeng";
import { ChooseOptionDialogComponent } from "./choose-option-dialog.component";

fdescribe("DialogComponent", () => {
  let component: ChooseOptionDialogComponent;
  let fixture: ComponentFixture<ChooseOptionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChooseOptionDialogComponent],
      imports: [DialogModule, FormsModule, RadioButtonModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseOptionDialogComponent);
    component = fixture.componentInstance;
    component.setUpDialog = {
      header: "",
      container: [],
      buttonCancel: true,
      valueButton: "",
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
