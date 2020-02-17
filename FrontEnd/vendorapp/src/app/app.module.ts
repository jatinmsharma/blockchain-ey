import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule,routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { HttpClientModule } from '@angular/common/http';
import { VendorTableComponent } from './vendor-table/vendor-table.component';
import { VendorInfoComponent } from './vendor-info/vendor-info.component';
import { VendorTableEmployeeComponent } from './vendor-table-employee/vendor-table-employee.component';
import { VendorTableGoodsComponent } from './vendor-table-goods/vendor-table-goods.component';
import { VendorTableOrdersComponent } from './vendor-table-orders/vendor-table-orders.component';
import { RegistrationComponent } from './registration/registration.component';
import { VendorCustomerComponent } from './vendor-customer/vendor-customer.component';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CustomerInfoComponent } from './customer-info/customer-info.component';
import { CustomerTableComponent } from './customer-table/customer-table.component';
import { CustomerTableEmployeeComponent } from './customer-table-employee/customer-table-employee.component';
import { CustomerTableGoodsComponent } from './customer-table-goods/customer-table-goods.component';
import { CustomerTableOrdersComponent } from './customer-table-orders/customer-table-orders.component';
import { CustomerComponent } from './customer/customer.component';
import { MatTableModule } from '@angular/material'
import { AppMaterialModule } from './app.material.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CustomerVendorComponent } from './customer-vendor/customer-vendor.component';
import { VendorOrganizationComponent } from './vendor-organization/vendor-organization.component';
import { VendorEmployeeComponent } from './vendor-employee/vendor-employee.component';
import { VendorEmployeeGoodsComponent } from './vendor-employee-goods/vendor-employee-goods.component';
import { VendorEmployeeOrdersComponent } from './vendor-employee-orders/vendor-employee-orders.component';
import { CustomerEmployeeComponent } from './customer-employee/customer-employee.component';
import { CustomerEmployeeGoodsComponent } from './customer-employee-goods/customer-employee-goods.component';
import { CustomerEmployeeOrderComponent } from './customer-employee-order/customer-employee-order.component';
import { CustomerEmployeeInfoComponent } from './customer-employee-info/customer-employee-info.component';
import { VendorEmployeeInfoComponent } from './vendor-employee-info/vendor-employee-info.component';
import { HeaderComponent } from './header/header.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatSortModule} from '@angular/material/sort';
@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    CustomerInfoComponent,
    CustomerTableComponent,
    CustomerTableEmployeeComponent,
    CustomerTableGoodsComponent,
    CustomerTableOrdersComponent,
    CustomerComponent,
    CustomerVendorComponent,
    VendorOrganizationComponent,
    VendorEmployeeComponent,
    VendorEmployeeGoodsComponent,
    VendorEmployeeOrdersComponent,
    CustomerEmployeeComponent,
    CustomerEmployeeGoodsComponent,
    CustomerEmployeeOrderComponent,
    CustomerEmployeeInfoComponent,
    VendorEmployeeInfoComponent,
    HeaderComponent,
    //VendorTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatTableModule,
    HttpModule,
    NgbModule,
   ReactiveFormsModule,
  AppMaterialModule,
  MatSortModule
  ],
  providers: [AuthService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
