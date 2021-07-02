import { Component, Input, OnInit } from '@angular/core';
import { ResearchRequestDto } from 'src/app/shared/models/dto/research-request-dto';

@Component({
  selector: 'rr-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css', '../shared-request-style.css']
})
export class CommentComponent implements OnInit {

  request: ResearchRequestDto;
  @Input() set setRequest(value) {
    this.request = value;
  }
  @Input() searchDisable;

  constructor() { }

  ngOnInit() {
  }

  removeRedOutline(id: string) {
    let commentBox = document.getElementById(id);
    commentBox.className = 'form-control input-textarea';
  }

}
