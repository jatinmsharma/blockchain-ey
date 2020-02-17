import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorTableOrdersComponent } from './vendor-table-orders.component';

describe('VendorTableOrdersComponent', () => {
  let component: VendorTableOrdersComponent;
  let fixture: ComponentFixture<VendorTableOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorTableOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorTableOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
