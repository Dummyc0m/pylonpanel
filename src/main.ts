import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppComponent, environment } from './app/';
import { provide } from '@angular/core';
import {
  provideRouter
} from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { routes } from './app/routes';

if (environment.production) {
  enableProdMode();
}

bootstrap(AppComponent, [
  provideRouter(routes), // <-- installs our routes
  provide(LocationStrategy, { useClass: HashLocationStrategy })
]);
