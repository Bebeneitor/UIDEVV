import { Component, Input, OnInit } from '@angular/core';
import { ResearchRequestDto } from 'src/app/shared/models/dto/research-request-dto';

@Component({
  selector: 'rr-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css', '../shared-request-style.css']
})
export class StatusComponent implements OnInit {
  @Input() request: ResearchRequestDto

  dropDownStyles: any = { 'width': '100%', 'max-width': '100%', 'border': '1px solid #31006F' };

  constructor() { }

  ngOnInit() { }



  
}
