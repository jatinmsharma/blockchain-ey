import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BlockchainService } from '../blockchain.service'
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';

declare var $: any

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
  selector: 'app-vendor-table-orders',
  templateUrl: './vendor-table-orders.component.html',
  styleUrls: ['./vendor-table-orders.component.css']
})
export class VendorTableOrdersComponent implements OnInit {
  id: any;
  name: any;
  unit: any;
  holddata: any;
  rawdata: any;
  demo = [];
  package_list = [];
  orderId = "";
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
  orderAmount = "";
  orderNumber = "";
  salesServiceTaxAmountUpdate = "";
  goodsServiceDiscount = "";
  goodsServicesDiscount = "";
  newOwnerPublicKey = "";
  pp: any;
  orderStatusPayment = "";

  // isDelegatorSelected: boolean = false;
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
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  username = ""

  constructor(private data: UserService, private httpClient: HttpClient, private blockchainService: BlockchainService, ) {
    this.username = localStorage.getItem('userID');
    this.getOrderDetails()
  }

  ngOnInit() {
  }
  getOrderDetails() {
    let that = this;
    this.blockchainService.getEntity('order').subscribe(async val => {
      if (val) {
        var from = 0;
        var to = val['entity'].length;
        var dataAtATime = 2;
        var ownerIDName = {}
        for (var i = from; i < to; i++) {
          var waitResponseOH, waitResponseOw, waitResponseCI, waitResponseCE;
          if (val['entity'][i].hasOwnProperty('vendor') && val['entity'][i]['vendor']['name'] == localStorage.getItem('name')) {
            console.log(val['entity'][i]);
            var orderData = val['entity'][i];
            if (parseInt(orderData['orderStatus'].status) < 4) {
              continue;
            }
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
            that.package_list.push(orderData)
            this.dataSource = new MatTableDataSource<RawMaterial>(that.package_list);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

          }
        }
      }
    })
  }

  getdata(event: any) {
    this.pp = event;
    this.orderStatus = event.orderStatus.status;
    this.orderNumber = event['orderNumber'];
    if (this.orderStatus == '6') {
      this.orderStatusPayment = event.orderPayment.status.paymentStatus
    } else {
      this.orderStatusPayment = "0"
    }
    console.log(this.pp['ID'])
  }

  updateOrderStatus(event: any, orderNumber: any, action: string) {
    let that = this;
    console.log("updateOrderStatus", event, orderNumber, action);
    var status = 4;
    if (action == 'accept') {
      status = 5
    }
    var payload = {
      "orderNumber": orderNumber,
      "vendor": {
        "employeeName": this.employeeName
      },
      "orderStatus": status,
      "comment": this.statusComment,
      "salesServiceTaxAmount": this.salesServiceTaxAmountUpdate,
      "discount": this.goodsServicesDiscount
    }
    this.blockchainService.acceptOrder(payload).subscribe(val => {
      if (val) {
        console.log("acceptOrder", val);
        that.goodsServicesDiscount = ""
      }
    })
  }
}
