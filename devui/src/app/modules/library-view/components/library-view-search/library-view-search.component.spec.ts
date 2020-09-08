import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryViewSearchComponent } from './library-view-search.component';

describe('LibraryViewComponent', () => {
  let component: LibraryViewSearchComponent;
  let fixture: ComponentFixture<LibraryViewSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibraryViewSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryViewSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
