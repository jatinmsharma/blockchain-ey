import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BlockchainService } from '../blockchain.service'
import { MatPaginator } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material';
import { FormBuilder, Validators, FormControl, NgSelectOption } from '@angular/forms'

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
  selector: 'app-customer-employee-order',
  templateUrl: './customer-employee-order.component.html',
  styleUrls: ['./customer-employee-order.component.css']
})



export class CustomerEmployeeOrderComponent implements OnInit {
  pp: any;
  id: any;
  name: any;
  unit: any;
  package_list = [];
  sortedlist = [];
  orderId = "";
  vendorName = "";
  employeeName = "";
  shippingAddress = "";
  billingAddress = "";
  gstNo = "";
  poNumber = "";
  poDate = "";
  isDelegatorSelected=false;
  orderDate = "";
  statusComment = "";
  orderStatus = "";
  orderAmount = "";
  orderNumber = "";
  employeeKey = "";
  local:any;
  salesServiceTaxAmountUpdate = "";
  goodsServiceDiscount = "";
  goodsServicesDiscount = "";
  newOwnerPublicKey = "";
  orderStatusPayment = "0";
  displayedColumns: string[] = [
    // 'select', // 'id', 
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

  invoiceData = this.fb.group({
    invoiceNumber: ['', [Validators.required]],
    invoiceDate: ['', Validators.required],
    invoiceAmount: ['1', Validators.required],
    comment: [''],

  });

  statusUpdate = this.fb.group({
    comment: ['', Validators.required]
  })
  dataSource: MatTableDataSource<RawMaterial>;
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  username = ""
  constructor(private data: UserService, private fb: FormBuilder, private httpClient: HttpClient, private blockchainService: BlockchainService, ) {
    this.username = localStorage.getItem('userID');
    this.name = localStorage.getItem('userName');

    this.getOrderDetails()
    console.log("helli");
  }

  getOrderDetails() {
    let that = this;
    this.blockchainService.getEntity('order').subscribe(async val => {
      if (val) {
        var from = 0;
        var to = val['entity'].length;
        var dataAtATime = 2;
        // while (to < val['entity'].length) {
        //   if (val['entity'].length - to > dataAtATime ) {
        //     console.log("A", from,to,val['entity'].length)
        //     from = to;
        //     to = to + dataAtATime;
        //   }
        //   else if (val['entity'].length - to < dataAtATime ) {
        //     console.log("B",from,to, val['entity'].length)
        //     from = to;
        //     to = val['entity'].length
        //   } 
        //   console.log(from, to)

        var ownerIDName = {}
        for (var i = from; i < to; i++) {
          console.log(val['entity'][i]); 

          var waitResponseOH, waitResponseOw, waitResponseCI, waitResponseCE;
          if (val['entity'][i].hasOwnProperty('vendor') && val['entity'][i].hasOwnProperty('customer') && val['entity'][i]['customer']['employeeID'] == localStorage.getItem('userID')) {
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
        // 
      }
    })
    this.local=localStorage;
  }

  async search() {
    {
      this.isDelegatorSelected = false;
      var queryVendor = {
        "userType": 2,
        "vendorName": localStorage.getItem('name'),
        "name": {
          "$regex": "(?i)" + (<HTMLInputElement>document.getElementById("userNameSearch")).value
        }
      }
      var names = [];
      // console.log(queryVendor)
      console.log(queryVendor)
      let that = this;
      var data = await this.blockchainService.getallNamePub(queryVendor)
      console.log(data['docs'])
      // console.log(data)
      // this.autocomplete(document.getElementById("userNameSearch"), data['docs']);

    }
  }
  
  
  async getGSTNumber() {
    let that = this;
    await this.blockchainService.getIDDetails(localStorage.getItem('customerOrgID')).subscribe(val => {
      if (val) {
        console.log(val);
        that.gstNo = (val[localStorage.getItem('customerOrgID')][0]['customer'].GSTNumber)
      }
    })
  }

  getdata(event: any) {
    console.log(event);
    this.getGSTNumber();
    this.pp = event;
    // this.pp=  JSON.stringify(event,null,'\t');
    // console.log(this.pp)
    this.orderNumber = event.orderNumber;
    this.orderId = event.ID;
    this.vendorName = event.vendor.name;
    this.employeeName = event.customer.name;
    this.shippingAddress = event.customer.addressShipping;
    this.billingAddress = event.customer.addressBilling;
    // this.gstNo = "";
    this.poNumber = event.PO_Number;
    this.poDate = event.PO_Date;
    this.orderDate = event.orderDate;
    this.statusComment = event.orderStatus.comment;
    this.orderStatus = event.orderStatus.status;
    this.orderAmount = event.orderAmount;
    if (this.orderStatus == '6') {
      this.orderStatusPayment = event.orderPayment.status.paymentStatus
    }else{
      this.orderStatusPayment="0"
    }

    this.goodsServiceDiscount = event.goodsService[0].discount;
    console.log(event.goodsService[0].discount);
    var x = {}
    for (var i = 0; i < event.goodsService.length; i++) {
      // var tempdata = {};
      x[event.goodsService[0].name] = event.goodsService[0].discount
      // x += tempdata;
      // x.push({ 'name':event.goodsService[0].name, 'discount': event.goodsService[0].discount })
    }
    // x += '}'
    this.goodsServicesDiscount = JSON.stringify(x, undefined, 2);
    console.log(this.goodsServicesDiscount);

    // }
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

  invoiceDataUpload() {
    let that = this;
    console.log(this.invoiceData.value)
    var payload = this.invoiceData.value;
    payload['paymentStatus'] = '1';
    payload['orderNumber'] = this.orderNumber;
    payload['vendor'] = {};
    payload.vendor['employeeName'] = this.name;
    console.log(payload)

    this.blockchainService.orderPayment(payload).subscribe(val => {
      console.log(payload)
      console.log(event)

      if (val) {
        console.log("acceptOrder", val);
        // that.invoiceData['value'={}
      }
    })
  }

  statusUpdateMethod(status: any) {
    let that = this;
    console.log(this.statusUpdate.value)
    var payload = this.statusUpdate.value;
    payload['orderNumber'] = this.orderNumber;
    payload['orderStatus'] = status;
    payload['vendor'] = {}
    payload['vendor']['employeeName'] = this.name

    console.log(payload)
    this.blockchainService.orderStatus(payload).subscribe(val => {
      if (val) {
        console.log("acceptOrder", val);
        console.log("payload data", payload);
        // if (JSON.parse(val['response']['body']).data[0].status == 'COMMITTED') {
        //   that.goodsServicesDiscount = ""
        var ud = that.blockchainService.updateOrders({ 'id': val['userid'] });
        console.log(ud);
        window['ud'] = ud;
        //   window.alert("Order Status Update Successfull  \n OrderID:" + val['userid']);
        // } else {
        //   window.alert("Order Status Updation Failed  \n Status:" + JSON.parse(val['response']['body']).data[0].status + "\n Error Message: " + JSON.parse(val['response']['body']).data[0]['invalid_transactions'][0].message)
        // }
      }
    })
  }

  paymentStatusUpdateMethod(status: any) {
    let that = this;
    console.log(this.statusUpdate.value)
    var payload = this.statusUpdate.value;
    payload['orderNumber'] = this.orderNumber;
    payload['paymentStatus'] = status;

    console.log(payload)

    this.blockchainService.orderPaymentStatus(payload).subscribe(val => {
      if (val) {
        console.log("paymentStatus", val);
      }
    })
  }
  
  ngOnInit() {

  }


}
