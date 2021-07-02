import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'rr-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css', '../shared-request-style.css']
})

export class SummaryComponent implements OnInit {
  request: any;
  @ViewChild('summaryBox',{static: true}) summary: ElementRef;
  @Input() set setRequest(value) {
    this.request = value;
    if (this.request.projectRequestId) {
      this.editable = 'edit-readonly'
      this.editMode = true;
    } else {
      this.summary.nativeElement.focus();
    }
  }

  editable: string = 'editable';
  editMode: boolean;
  curTextheight: number;

  constructor() { }

  ngOnInit() { }

  changeEditMode(active: string) {
    if (!this.request.projectRequestId) {
      if (active === 'active') {
        this.editable = 'editable';
        this.editMode = false;
      } else {
        this.editable = 'uneditable';
        this.editMode = true;
      }
    }
  }

  autoGrowText(e) {
    e.target.style.height = '0px';
    this.curTextheight = e.target.scrollHeight + 25;
    e.target.style.height = `${this.curTextheight}px`
  }

}
