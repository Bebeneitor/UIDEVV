import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryStatusCodesComponent } from './library-status-codes.component';

describe('LibraryStatusCodesComponent', () => {
  let component: LibraryStatusCodesComponent;
  let fixture: ComponentFixture<LibraryStatusCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibraryStatusCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryStatusCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
