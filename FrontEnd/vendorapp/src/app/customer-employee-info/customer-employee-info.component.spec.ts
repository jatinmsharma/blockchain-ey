import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerEmployeeInfoComponent } from './customer-employee-info.component';

describe('CustomerEmployeeInfoComponent', () => {
  let component: CustomerEmployeeInfoComponent;
  let fixture: ComponentFixture<CustomerEmployeeInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerEmployeeInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerEmployeeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
