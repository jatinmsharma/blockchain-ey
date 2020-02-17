import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerOrganizationComponent } from './customer-organization.component';

describe('CustomerOrganizationComponent', () => {
  let component: CustomerOrganizationComponent;
  let fixture: ComponentFixture<CustomerOrganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerOrganizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
