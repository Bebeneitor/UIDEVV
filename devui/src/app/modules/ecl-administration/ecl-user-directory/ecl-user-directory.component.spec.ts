import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EclUserDirectoryComponent } from './ecl-user-directory.component';


describe('EclUserDirectoryComponent', () => {
  let component: EclUserDirectoryComponent;
  let fixture: ComponentFixture<EclUserDirectoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EclUserDirectoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EclUserDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
