import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerEmployeeOrderComponent } from './customer-employee-order.component';

describe('CustomerEmployeeOrderComponent', () => {
  let component: CustomerEmployeeOrderComponent;
  let fixture: ComponentFixture<CustomerEmployeeOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerEmployeeOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerEmployeeOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
