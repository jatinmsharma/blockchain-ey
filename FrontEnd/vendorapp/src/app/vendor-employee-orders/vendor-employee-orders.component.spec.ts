import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorEmployeeOrdersComponent } from './vendor-employee-orders.component';

describe('VendorEmployeeOrdersComponent', () => {
  let component: VendorEmployeeOrdersComponent;
  let fixture: ComponentFixture<VendorEmployeeOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorEmployeeOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorEmployeeOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
