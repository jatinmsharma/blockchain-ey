import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorComponent } from './vendor/vendor.component';
import { HomeComponent } from './home/home.component';
import { VendorTableComponent } from './vendor-table/vendor-table.component';
import { VendorInfoComponent } from './vendor-info/vendor-info.component';
import { VendorTableEmployeeComponent } from './vendor-table-employee/vendor-table-employee.component';
import { VendorTableGoodsComponent } from './vendor-table-goods/vendor-table-goods.component';
import { VendorTableOrdersComponent } from './vendor-table-orders/vendor-table-orders.component';
import { RegistrationComponent } from './registration/registration.component';
import { VendorCustomerComponent } from './vendor-customer/vendor-customer.component';
import { CustomerOrganizationComponent } from './customer-organization/customer-organization.component';
import { AuthGuard } from './auth.guard';
import { CustomerTableComponent } from './customer-table/customer-table.component'
import { CustomerTableEmployeeComponent } from './customer-table-employee/customer-table-employee.component';
import { CustomerTableGoodsComponent } from './customer-table-goods/customer-table-goods.component';
import { CustomerTableOrdersComponent } from './customer-table-orders/customer-table-orders.component';
import { CustomerComponent } from './customer/customer.component';
import { CustomerInfoComponent } from './customer-info/customer-info.component';
import { VendorOrganizationComponent } from './vendor-organization/vendor-organization.component';
import { VendorEmployeeComponent } from './vendor-employee/vendor-employee.component';
import { VendorEmployeeGoodsComponent } from './vendor-employee-goods/vendor-employee-goods.component';
import { VendorEmployeeOrdersComponent } from './vendor-employee-orders/vendor-employee-orders.component';
import { CustomerEmployeeComponent } from './customer-employee/customer-employee.component';
import { CustomerEmployeeGoodsComponent } from './customer-employee-goods/customer-employee-goods.component';
import { CustomerEmployeeOrderComponent } from './customer-employee-order/customer-employee-order.component';
import { CustomerEmployeeInfoComponent } from './customer-employee-info/customer-employee-info.component';
import { VendorEmployeeInfoComponent } from './vendor-employee-info/vendor-employee-info.component';
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegistrationComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'vendorEmployee', component: VendorEmployeeComponent, canActivate: [AuthGuard], children:
      [
        {
          path: 'info', component: VendorEmployeeInfoComponent,

        },
        {
          path: 'goods', component: VendorEmployeeGoodsComponent,

        },
        {
          path: 'orders', component: VendorEmployeeOrdersComponent,

        },
      ]


  },
  {
    path: 'customerEmployee', component: CustomerEmployeeComponent, canActivate: [AuthGuard], children:
      [
        {
          path: 'info', component: CustomerEmployeeInfoComponent,

        },
        {
          path: 'goods', component: CustomerEmployeeGoodsComponent,

        },
        {
          path: 'orders', component: CustomerEmployeeOrderComponent,

        },
      ]


  },

  {
    path: 'customer', component: CustomerComponent, canActivate: [AuthGuard], children:
      [
        {
          path: 'table', component: CustomerTableComponent, children:
            [

              {
                path: 'goods', component: CustomerTableGoodsComponent
              },
              {
                path: 'orders', component: CustomerTableOrdersComponent
              }
            ]
        },
        {
          path: 'employee', component: CustomerTableEmployeeComponent
        },
        {
          path: 'info', component: CustomerInfoComponent
        },
        {
          path: 'customer', component: VendorCustomerComponent, children:
            [
              {
                path: 'organization', component: VendorCustomerComponent, children:
                  [
                    {
                      path: 'orglist', component: CustomerOrganizationComponent
                    }
                  ]
              }
            ]
        },
      ]


  },
  {
    path: 'vendor', component: VendorComponent, canActivate: [AuthGuard], children:
      [
        {
          path: 'table', component: VendorTableComponent, children:
            [

              {
                path: 'goods', component: VendorTableGoodsComponent
              },
              {
                path: 'customer', component: VendorCustomerComponent, children:
                  [
                    {
                      path: 'organization', component: VendorOrganizationComponent,

                    },
                  ]
              }

            ]
        },
        {
          path: 'info', component: VendorInfoComponent
        },
        {
          path: 'employee', component: VendorTableEmployeeComponent
        },
        {
          path: 'orders', component: VendorTableOrdersComponent
        }
      ]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { AuthGuard }
export const routingComponents = [HomeComponent, RegistrationComponent, VendorComponent, VendorTableComponent, VendorInfoComponent, VendorTableEmployeeComponent, VendorTableGoodsComponent, VendorTableOrdersComponent, VendorCustomerComponent, CustomerOrganizationComponent, CustomerComponent, VendorOrganizationComponent, VendorEmployeeComponent, VendorEmployeeGoodsComponent]
