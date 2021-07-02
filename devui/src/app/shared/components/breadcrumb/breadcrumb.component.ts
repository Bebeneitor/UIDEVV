import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

  items: any[] = [];

  @Input()
  path: string = "";

  constructor() { }

  ngOnInit() {

    if (this.path != null && this.path != undefined && this.path != "") {
      let arr = this.path.split(">");

      for (let i = 0; i < arr.length; i++) {
        this.items.push({
          label: arr[i]
        });
      }
    }
  }

}
