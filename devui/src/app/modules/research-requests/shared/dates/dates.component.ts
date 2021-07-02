import { Component, Input, OnInit } from '@angular/core';
import { ResearchRequestDto } from 'src/app/shared/models/dto/research-request-dto';

@Component({
  selector: 'rr-dates',
  templateUrl: './dates.component.html',
  styleUrls: ['./dates.component.css', '../shared-request-style.css']
})
export class DatesComponent implements OnInit {

  request: ResearchRequestDto;
  @Input() set setRequest(value) {
    this.request = value;
  }
  @Input() readOnly;
  @Input() rrButtonsDisable;

  constructor() { }

  ngOnInit() {
  }

}
