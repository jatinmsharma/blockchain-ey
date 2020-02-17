import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorTableGoodsComponent } from './vendor-table-goods.component';

describe('VendorTableGoodsComponent', () => {
  let component: VendorTableGoodsComponent;
  let fixture: ComponentFixture<VendorTableGoodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorTableGoodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorTableGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
