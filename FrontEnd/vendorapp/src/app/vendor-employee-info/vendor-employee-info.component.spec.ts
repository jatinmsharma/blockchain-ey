import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorEmployeeInfoComponent } from './vendor-employee-info.component';

describe('VendorEmployeeInfoComponent', () => {
  let component: VendorEmployeeInfoComponent;
  let fixture: ComponentFixture<VendorEmployeeInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorEmployeeInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorEmployeeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
