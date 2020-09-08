import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { SectionNavigationComponent } from "./section-navigation.component";

fdescribe("SectionNavigationComponent", () => {
  let component: SectionNavigationComponent;
  let fixture: ComponentFixture<SectionNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SectionNavigationComponent],
    })
      .overrideTemplate(
        SectionNavigationComponent,
        `
      <div class="sections-navigation">
        <ul>
          <li *ngFor="let section of navigationItems">
            <button (click)="scrollTo(section.id)">{{ section.name }}</button>
          </li>
        </ul>
      </div>
      <div *ngFor="let section of navigationItems">
      <div [id]="section.id">{{ section.name }}</div>
      </div>
    `
      )
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionNavigationComponent);
    component = fixture.componentInstance;
    component.navigationItems = [
      {
        name: "section",
        id: "section",
      },
    ];
    fixture.detectChanges();
  });

  it("should create navigation", () => {
    expect(component).toBeTruthy();
  });

  it("should display correct navigation item", () => {
    const sectionItemName = fixture.debugElement
      .query(By.css("ul li button"))
      .nativeElement.textContent.trim();
    expect(sectionItemName).toBe(component.navigationItems[0].name);
  });

  it("should scroll to a section", () => {
    const spy = spyOn(window, "scrollTo");
    component.scrollTo(component.navigationItems[0].id);
    expect(spy).toHaveBeenCalled();
  });

  it("should toggle navigation", () => {
    component.toggleNavigation();
    expect(component.isNavigationOpen).toBe(true);
  });
});
