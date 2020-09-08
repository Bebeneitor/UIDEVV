import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/api';

@Component({
  selector: 'app-rule-manager',
  templateUrl: './rule-manager.component.html',
  styleUrls: ['./rule-manager.component.css']
})
export class RuleManagerComponent implements OnInit {
  
  title: string = '';

  constructor(private activatedRoute: ActivatedRoute, private router: Router, public dialogService: DialogService) { }

  /**
   * Fires every time the component is rendered, 
   * check the route url for changes, if there is no children component
   * redirects the user to the initiate analysis screen.
   */
  ngOnInit() {
    this.activatedRoute.url.subscribe(url => {
      if (this.activatedRoute.children.length === 0) {
        this.router.navigate(['/industry-updates/rule-process/initiate-analysis']);
      }
      this.title = this.activatedRoute.snapshot.children[0].data.pageTitle;
    });
  }
}
