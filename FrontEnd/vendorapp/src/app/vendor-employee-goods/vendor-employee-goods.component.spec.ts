import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorEmployeeGoodsComponent } from './vendor-employee-goods.component';

describe('VendorEmployeeGoodsComponent', () => {
  let component: VendorEmployeeGoodsComponent;
  let fixture: ComponentFixture<VendorEmployeeGoodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorEmployeeGoodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorEmployeeGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
