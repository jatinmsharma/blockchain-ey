import { TestBed } from '@angular/core/testing';

import { VendorInfoServiceService } from './vendor-info-service.service';

describe('VendorInfoServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VendorInfoServiceService = TestBed.get(VendorInfoServiceService);
    expect(service).toBeTruthy();
  });
});
