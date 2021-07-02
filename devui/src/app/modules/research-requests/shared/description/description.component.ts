import { Component, Input, OnInit } from '@angular/core';
import { ResearchRequestDto } from 'src/app/shared/models/dto/research-request-dto';

@Component({
  selector: 'rr-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css', '../shared-request-style.css']
})
export class DescriptionComponent implements OnInit {
  request: ResearchRequestDto;

  @Input() set setRequest(value) {
    this.request = value;
  }
  @Input() readOnly;

  constructor() { }

  ngOnInit() {
  }

}
