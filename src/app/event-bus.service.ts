import { Injectable } from '@angular/core';
import {EventBus} from "./eventbus";

@Injectable()
export class EventBusService {
  private eventBus: EventBus;

  constructor() {
    // this.eventBus = EventBus()
    // this.eventBus.registerHandler()
  }

}
