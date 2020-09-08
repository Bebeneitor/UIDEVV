import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionalReferencesComponent } from './provisional-references.component';
import { ConfirmDialogModule, ConfirmationService, MessageService } from 'primeng/primeng';


describe('ProvisionalReferencesComponent', () => {
  let component: ProvisionalReferencesComponent;
  let fixture: ComponentFixture<ProvisionalReferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvisionalReferencesComponent ],
      imports: [ConfirmDialogModule,],
      providers: [MessageService, ConfirmationService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvisionalReferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
