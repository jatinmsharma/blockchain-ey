import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorOrganizationComponent } from './vendor-organization.component';

describe('VendorOrganizationComponent', () => {
  let component: VendorOrganizationComponent;
  let fixture: ComponentFixture<VendorOrganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorOrganizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
