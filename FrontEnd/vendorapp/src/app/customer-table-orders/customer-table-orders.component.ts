import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BlockchainService } from '../blockchain.service'
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';

export interface RawMaterial {
  ID: String;
  PO_Date: String;
  PO_Number: String;
  orderAmount: String;
  orderDate: String;
  orderHandler: String;
  orderNumber: String;
  owner: String;
  globalStatus: String;
}

@Component({
  selector: 'app-customer-table-orders',
  templateUrl: './customer-table-orders.component.html',
  styleUrls: ['./customer-table-orders.component.css']
})
export class CustomerTableOrdersComponent implements OnInit {
  arr: any;
  id: any;
  name: any;
  unit: any;
  package_list = [];
  sortedlist = [];
  orderId = "";
  orderNumber = "";
  vendorName = "";
  employeeName = "";
  shippingAddress = "";
  billingAddress = "";
  gstNo = "";
  poNumber = "";
  poDate = "";
  orderDate = "";
  statusComment = "";
  orderStatus = "";
  employeeKey = "";
  orderAmount = "";
  newOwnerPublicKey = "";
goodsServicesDiscount = "";

  pp: any;
  orderStatusPayment = "";
  displayedColumns: string[] = [
    // 'id',
    'orderNumber',
    'PO_Date',
    'PO_Number',
    'orderAmount',
    'orderDate',
    'orderHandler',
    'owner',
    'globalStatus',
  ];
  OrderStatus = ["", "Created", "Awarded", "Discarted", "Returned", "Accepted", "Delivered", "Invoice Genrated", "Invoice Paid"]

  dataSource: MatTableDataSource<RawMaterial>;
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort;

  username = ""

  constructor(private data: UserService, private httpClient: HttpClient, private blockchainService: BlockchainService, ) {
    this.username = localStorage.getItem('userID');
    this.getUserDetails()

    console.log("helli");
  }

  getUserDetails() {
    let that = this;
    this.blockchainService.getEntity('order').subscribe(async val => {
      if (val) {
        var from = 0;
        var to = val['entity'].length;
        var dataAtATime = 2;
        // while (to < val['entity'].length) {
        //   if (val['entity'].length - to > dataAtATime ) {
        //     // console.log("1", val['entity'].length)
        //     from = to;
        //     to = to + dataAtATime;
        //   }
        //   else if (val['entity'].length - to < dataAtATime ) {
        //     // console.log("2", val['entity'].length)
        //     from = to;
        //     to = val['entity'].length
        //   }
        //   console.log(from, to)

        var ownerIDName = {}
        for (var i = from; i < to; i++) {

          var waitResponseOH, waitResponseOw, waitResponseCI, waitResponseCE;
          if (val['entity'][i].hasOwnProperty('customer') && val['entity'][i]['customer']['ID'] == localStorage.getItem('userID')) {
            console.log(val['entity'][i]);
            var orderData = val['entity'][i];
            if (ownerIDName.hasOwnProperty(orderData['orderHandler'])) {
              orderData['orderHandler'] = ownerIDName[orderData['orderHandler']];
            } else {
              waitResponseOH = await that.blockchainService.getUserName({ pubKey: orderData['orderHandler'] })
              orderData['orderHandler'] = waitResponseOH['docs'][0].name;
              ownerIDName[orderData['orderHandler']] = waitResponseOH['docs'][0].name;
            }
            if (ownerIDName.hasOwnProperty(orderData['owner'])) {
              orderData['owner'] = ownerIDName[orderData['owner']];
            } else {
              waitResponseOw = await that.blockchainService.getUserName({ pubKey: orderData['owner'] })
              orderData['owner'] = waitResponseOw['docs'][0].name;
              ownerIDName[orderData['owner']] = waitResponseOw['docs'][0].name;
            }
            if (ownerIDName.hasOwnProperty(orderData['customer']['ID'])) {
              orderData['customer']['ID'] = ownerIDName[orderData['customer']['ID']];
            } else {
              waitResponseCI = await that.blockchainService.getUserNameByID({ ID: orderData['customer']['ID'] })
              orderData['customer']['ID'] = waitResponseCI['docs'][0].name;
              ownerIDName[orderData['customer']['ID']] = waitResponseCI['docs'][0].name;
            }

            if (ownerIDName.hasOwnProperty(orderData['customer']['employeeID'])) {
              orderData['customer']['employeeID'] = ownerIDName[orderData['customer']['employeeID']];
            } else {
              waitResponseCE = await that.blockchainService.getUserNameByID({ ID: orderData['customer']['employeeID'] })
              orderData['customer']['employeeID'] = waitResponseCE['docs'][0].name;
              ownerIDName[orderData['customer']['employeeID']] = waitResponseCE['docs'][0].name;
            }
            if (orderData['orderStatus']['employeeID'] !== "") {
              if (ownerIDName.hasOwnProperty(orderData['orderStatus']['employeeID'])) {
                orderData['orderStatus']['employeeID'] = ownerIDName[orderData['orderStatus']['employeeID']];
              } else {
                waitResponseCE = await that.blockchainService.getUserName({ pubKey: orderData['orderStatus']['employeeID'] })
                console.log(orderData['orderStatus']['employeeID'])
                orderData['orderStatus']['employeeID'] = waitResponseCE['docs'][0].name;
                ownerIDName[orderData['orderStatus']['employeeID']] = waitResponseCE['docs'][0].name;
              }
            }
            if (orderData.hasOwnProperty('orderPayment')) {
              orderData['globalStatus'] = this.OrderStatus[parseInt(orderData['orderPayment'].status.paymentStatus) + 6];
            } else {
              orderData['globalStatus'] = this.OrderStatus[parseInt(orderData['orderStatus'].status)];
            }
            that.sortedlist.push(orderData)
            this.dataSource = new MatTableDataSource<RawMaterial>(that.sortedlist);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

          }
        }
        // }

      }
    })
  }

  getdata(event: any) {
    this.pp = event;
    console.log(this.pp);
    this.orderId = event.ID;
    this.orderNumber = event.orderNumber;
    this.vendorName = event.vendor.name;
    this.employeeName = event.customer.name;
    this.shippingAddress = event.customer.addressShipping;
    this.billingAddress = event.customer.addressBilling;
    this.poNumber = event.PO_Number;
    this.poDate = event.PO_Date;
    this.orderDate = event.orderDate;
    this.statusComment = event.orderStatus.comment;
    this.orderStatus = event.orderStatus.status;
    this.orderAmount = event.orderAmount;
    if (this.orderStatus == '6') {
      this.orderStatusPayment = event.orderPayment.status.paymentStatus
    } else {
      this.orderStatusPayment = "0"
    }
  }

  transferOwnerShip(orderNumber=this.orderNumber, newOwnerPublicKey= this.newOwnerPublicKey) {
    let that = this;
    console.log("transferOwnerShip", orderNumber, newOwnerPublicKey);
    var payload = { 
      "orderNumber": orderNumber,
      "newOwnerPublicKey": newOwnerPublicKey
    }
    alert('transfered');
    this.blockchainService.transferOwnership(payload).subscribe(val => {
      if (val) {
        console.log("acceptOrder", val);
        that.goodsServicesDiscount = "" 
      }
    })
  }





  search(){
    console.log('working');
  }




  ngOnInit() {
  }

}
