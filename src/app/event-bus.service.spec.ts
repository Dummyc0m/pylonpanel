/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { EventBusService } from './event-bus.service';

describe('Service: EventBus', () => {
  beforeEach(() => {
    addProviders([EventBusService]);
  });

  it('should ...',
    inject([EventBusService],
      (service: EventBusService) => {
        expect(service).toBeTruthy();
      }));
});
