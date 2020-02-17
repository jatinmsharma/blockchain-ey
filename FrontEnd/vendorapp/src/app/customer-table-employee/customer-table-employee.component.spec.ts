import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTableEmployeeComponent } from './customer-table-employee.component';

describe('CustomerTableEmployeeComponent', () => {
  let component: CustomerTableEmployeeComponent;
  let fixture: ComponentFixture<CustomerTableEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerTableEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerTableEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
