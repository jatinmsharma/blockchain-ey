import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTableOrdersComponent } from './customer-table-orders.component';

describe('CustomerTableOrdersComponent', () => {
  let component: CustomerTableOrdersComponent;
  let fixture: ComponentFixture<CustomerTableOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerTableOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerTableOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
