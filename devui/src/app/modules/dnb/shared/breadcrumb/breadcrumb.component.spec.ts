import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { BreadcrumbModule } from "primeng/primeng";
import { BreadcrumbComponent } from "./breadcrumb.component";

fdescribe("BreadcrumbComponent", () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BreadcrumbComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BreadcrumbModule,
        RouterTestingModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should validate exists", () => {
    component.items = [
      { label: "tania", urlNavigation: "" },
      { label: "tania2", urlNavigation: "" },
    ];
    expect(component.validateExist("tania2")).toBe(false);
  });

  it("should validate exists", () => {
    component.items = [
      { label: "tania", urlNavigation: "" },
      { label: "tania2", urlNavigation: "" },
    ];
    component.itemClicked({ toElement: { innerText: "tania2" } });
  });
});
