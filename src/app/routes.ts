import { RouterConfig } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {LoginComponent} from "./login/login.component";
import {UserComponent} from "./user/user.component";
import {TemplateComponent} from "./template/template.component";
import {NodeComponent} from "./node/node.component";

export const routes: RouterConfig = [
  { path: '', redirectTo: 'login', terminal: true },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'node', component: NodeComponent },
  { path: 'template', component: TemplateComponent },
  { path: 'user', component: UserComponent },
  { path: 'login', component: LoginComponent },
  //{ path: 'login', redirectTo: 'contact' },
];
