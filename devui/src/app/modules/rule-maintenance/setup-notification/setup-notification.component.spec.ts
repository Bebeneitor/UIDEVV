import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupNotificationComponent } from './setup-notification.component';

describe('SetupNotificationComponent', () => {
  let component: SetupNotificationComponent;
  let fixture: ComponentFixture<SetupNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
