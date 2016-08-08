import { Injectable } from '@angular/core';

@Injectable()
export class UserService {
  sockJs: SockJSClass;

  constructor() {
    this.sockJs = SockJS();
  }

  getCurrentUser(): User {
    return null
  }
}

export class User {

}
