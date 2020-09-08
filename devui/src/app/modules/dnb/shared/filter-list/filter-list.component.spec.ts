import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FilterListComponent } from "./filter-list.component";

fdescribe("FilterListComponent", () => {
  let component: FilterListComponent;
  let fixture: ComponentFixture<FilterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should emit filtered letter", () => {
    const event = spyOn(component.filter, "emit");
    component.filterEmit("X");
    expect(event).toHaveBeenCalled();
  });
});
