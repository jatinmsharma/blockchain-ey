import { TestBed } from '@angular/core/testing';

import { CustomerInfoServiceService } from './customer-info-service.service';

describe('CustomerInfoServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomerInfoServiceService = TestBed.get(CustomerInfoServiceService);
    expect(service).toBeTruthy();
  });
});
