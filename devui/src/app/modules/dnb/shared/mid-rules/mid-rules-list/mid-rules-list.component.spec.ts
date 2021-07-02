import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { DialogModule } from "primeng/primeng";
import { DnbService } from "../../../services/dnb.service";
import { MidRulesListComponent } from "./mid-rules-list.component";

fdescribe("MidRulesListComponent", () => {
  let component: MidRulesListComponent;
  let fixture: ComponentFixture<MidRulesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MidRulesListComponent],
      imports: [DialogModule, HttpClientTestingModule],
      providers: [DnbService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MidRulesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    component.openDialog = true;
    component.ngOnChanges();
    expect(component).toBeTruthy();
  });

  it("should emit selection set", () => {
    const event = spyOn(component.selectionSet, "emit");
    component.dialogSelected({ template: "", reasonCode: "" });
    expect(event).toHaveBeenCalled();
  });

  it("should emit dialog hidden", () => {
    const event = spyOn(component.openDialogChange, "emit");
    component.dialogHidden();
    expect(event).toHaveBeenCalled();
  });
});
