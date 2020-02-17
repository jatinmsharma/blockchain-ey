import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorTableEmployeeComponent } from './vendor-table-employee.component';

describe('VendorTableEmployeeComponent', () => {
  let component: VendorTableEmployeeComponent;
  let fixture: ComponentFixture<VendorTableEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorTableEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorTableEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
