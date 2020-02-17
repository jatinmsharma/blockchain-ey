import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCustomerComponent } from './vendor-customer.component';

describe('VendorCustomerComponent', () => {
  let component: VendorCustomerComponent;
  let fixture: ComponentFixture<VendorCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
