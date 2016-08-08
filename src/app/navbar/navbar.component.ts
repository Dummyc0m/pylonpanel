import {Component, OnInit, Inject} from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES } from "ng-semantic";
import {UserService} from "../user.service";

@Component({
  moduleId: module.id,
  selector: 'navbar',
  directives: [SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES, ROUTER_DIRECTIVES],
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css']
})
export class NavbarComponent implements OnInit {
  leftItems: Array<any>;
  rightItems: Array<any>;

  title = 'Pylon Panel';

  constructor(@Inject(UserService) private userService: UserService) {
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
