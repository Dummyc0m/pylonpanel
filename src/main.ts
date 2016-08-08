import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppComponent, environment } from './app/';
import {
  provideRouter
} from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { routes } from './app/routes';
import {UserService} from "./app/user.service";

if (environment.production) {
  enableProdMode();
}

bootstrap(AppComponent, [
  UserService,
  provideRouter(routes), // <-- installs our routes
  { provide: LocationStrategy, useClass: HashLocationStrategy }
]);
