import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DifMarkupsEditorComponent } from './dif-markups-editor.component';

describe('DifMarkupsEditorComponent', () => {
  let component: DifMarkupsEditorComponent;
  let fixture: ComponentFixture<DifMarkupsEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DifMarkupsEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DifMarkupsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('diff many items', () => {
    let values = createLargeStringToCompare(100, 10, 5);
    component.originalText = values.oldString;
    component.text = values.newString;
    expect(component).toBeTruthy();
  });

  it('diff many more items', () => {
    let values = createLargeStringToCompare(2000, 80, 10);
    component.originalText = values.oldString;
    component.text = values.newString;
    expect(component).toBeTruthy();
  });

  it('diff too many more items', () => {
    let values = createLargeStringToCompare(5000, 300, 80);
    component.originalText = values.oldString;
    component.text = values.newString;
    expect(component).toBeTruthy();
  });


});

function createCode(pref, n): string {
  let s = pref + '000' + n;
  return s.substring(s.length - 5);
}
function createLargeStringToCompare(cnt: number, posMod = 50, block=5) {
  let oldString = [];
  let newString = [];
  for (let i = 0; i < cnt; i++) {
    oldString.push(createCode('A', i));
    newString.push(createCode('A', i));
  }
  newString.splice(posMod, block);
  // add some diff
  for (let i = 0; i < block; i++) {
    newString.push(createCode('Z', i));

  }
  return {oldString: oldString.join(','), newString: newString.join(',')};
}
