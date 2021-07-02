import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ResizableColComponent } from "./resizable-col.component";
import { DnBDirectivesModule } from "../../utils/directives/dnb-directives.module";

fdescribe("ResizableColComponent", () => {
  let component: ResizableColComponent;
  let fixture: ComponentFixture<ResizableColComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResizableColComponent],
      imports:[DnBDirectivesModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResizableColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
