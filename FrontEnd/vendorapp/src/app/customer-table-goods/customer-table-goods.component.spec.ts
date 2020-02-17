import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTableGoodsComponent } from './customer-table-goods.component';

describe('CustomerTableGoodsComponent', () => {
  let component: CustomerTableGoodsComponent;
  let fixture: ComponentFixture<CustomerTableGoodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerTableGoodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerTableGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
