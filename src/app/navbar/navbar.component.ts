import { Component, OnInit } from '@angular/core';
import { SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES } from "ng-semantic";

@Component({
  moduleId: module.id,
  selector: 'navbar',
  directives: [SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES],
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css']
})
export class NavbarComponent implements OnInit {
  leftItems: Array<any>;
  rightItems: Array<any>;

  title = 'Pylon Panel';

  constructor() {
    this.leftItems = [{
      "title": "Home",
      "icon": "home"
    }, {
        "title": "About Us",
        "icon": "user"
      }, {
        "title": "Contact",
        "icon": "user"
      }];
    
    this.rightItems = [{
        "title": "Settings",
        "icon": "settings"
      }];
  }

  ngOnInit() {
  }
}
