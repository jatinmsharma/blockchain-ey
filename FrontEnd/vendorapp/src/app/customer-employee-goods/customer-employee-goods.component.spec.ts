import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerEmployeeGoodsComponent } from './customer-employee-goods.component';

describe('CustomerEmployeeGoodsComponent', () => {
  let component: CustomerEmployeeGoodsComponent;
  let fixture: ComponentFixture<CustomerEmployeeGoodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerEmployeeGoodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerEmployeeGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
