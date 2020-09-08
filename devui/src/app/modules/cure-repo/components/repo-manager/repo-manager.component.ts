import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-repo-manager',
  templateUrl: './repo-manager.component.html',
  styleUrls: ['./repo-manager.component.css']
})
export class RepoManagerComponent implements OnInit {
  title: string = '';
  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.activatedRoute.url.subscribe(url => {
      if (this.activatedRoute.children.length === 0) {
        this.router.navigate(['/cure-and-repo/repo/module-consulting']);
      }
      this.title = this.activatedRoute.snapshot.children[0].data.pageTitle;
    });
  }
}
