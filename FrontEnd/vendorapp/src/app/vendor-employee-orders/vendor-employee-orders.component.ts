import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BlockchainService } from '../blockchain.service'
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { FormBuilder, Validators, FormControl, NgSelectOption } from '@angular/forms'
import { SelectionModel } from '@angular/cdk/collections';

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
  selector: 'app-vendor-employee-orders',
  templateUrl: './vendor-employee-orders.component.html',
  styleUrls: ['./vendor-employee-orders.component.css']
})
export class VendorEmployeeOrdersComponent implements OnInit {
  id: any;
  name: any;
  unit: any;
  pp: any;
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
  orderPaymentStatus = null;
  orderAmount = "";
  orderNumber = "";
  local:any;
  isDelegatorSelected: boolean = false;
  salesServiceTaxAmountUpdate = "";
  goodsServiceDiscount: any[] = [];
  goodsServicesDiscount: any;
  newOwnerPublicKey = "";
  productdiscount: any[] = [];
  productname: any[] = [];
  statusComment1 = ""
  salesServiceTaxAmountUpdate1 = "";
  goodsServicesDiscount1: any;
  orderStatusPayment = "";

  // productArray:any[]=[];
  displayedColumns: string[] = [
    'select', // 'id', 
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
  selection = new SelectionModel<RawMaterial>(true, []);
  dataSource: MatTableDataSource<RawMaterial>;
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort;

  username = ""
  globalFlag = false;

  ngOnInit() {

  }
  constructor(private data: UserService, private fb: FormBuilder, private httpClient: HttpClient, private blockchainService: BlockchainService, ) {
    this.username = localStorage.getItem('userID');
    this.name = localStorage.getItem('userName');
    this.dataSource = new MatTableDataSource<RawMaterial>(this.package_list);
    this.getOrderDetails()
    console.log("helli");

  }
  getOrderDetails() { 
    let that = this;
    this.blockchainService.getEntity('order').subscribe(async val => {
      if (val) {
        var from = 0;
        var to = val['entity'].length;
        var ownerIDName = {}
        for (var i = from; i < to; i++) {
          var waitResponseOH, waitResponseOw, waitResponseCI, waitResponseCE;
          if (val['entity'][i].hasOwnProperty('vendor') && val['entity'][i]['vendor']['name'] == localStorage.getItem('vendorName')) {
            console.log(val['entity'][i]);
            var orderData = val['entity'][i];
            if (parseInt(orderData['orderStatus'].status) == 4 || parseInt(orderData['orderStatus'].status) == 1 || parseInt(orderData['orderStatus'].status) == 3) {
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
    console.log(localStorage);
    this.local=localStorage;
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource['data'].length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
    for (var i = 0; i < this.selection.selected.length; i++) {
      if (this.selection.selected[i]['orderStatus'].status === 2) {
        this.globalFlag = true;
      } else {
        this.globalFlag = false;
        break;
      }
    };
  }
  checkboxLabel(row?: RawMaterial): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
  }
  selectionData() {
    console.log(this.selection.selected)
    this.globalFlag = false;

    for (var i = 0; i < this.selection.selected.length; i++) {
      if (this.selection.selected[i]['orderStatus'].status === 2) {
        this.globalFlag = true;
      } else {
        this.globalFlag = false;
        break;
      }
    };
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
      this.autocomplete(document.getElementById("userNameSearch"), data['docs']);

    }
  }

  autocomplete(inp, arr) {
    let that = this;
    console.log("auto", inp, arr)
    window['inp'] = inp;
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
      var a, b, i, val = this.value;
      console.log("value", this.value)
      /*close any already open lists of autocompleted values*/
      closeAllLists(null);
      if (!val) { return false; }
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].name.substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].name.substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i].name + "'>";
          b.innerHTML += "<p id="+arr[i].owner+">"+arr[i].owner+"</p>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function (e) {
            /*insert the value for the autocomplete text field:*/
            inp.value = this.getElementsByTagName("input")[0].value;
            that.newOwnerPublicKey =  this.getElementsByTagName("p")[0].innerHTML
            
            // window['ptag']=this.getElementsByTagName("p")[0]
            /*close the list of autocompleted values,
            (or any other open lists of autocompleted values:*/
            closeAllLists(null);
          });
          a.appendChild(b);
        }
      }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
      let x= (<HTMLDivElement[]><any>document.getElementById(this.id + "autocomplete-list"))[0];
      let y:any;
      if (x)
       x = <HTMLDivElement><unknown>x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
      closeAllLists(e.target);
      that.isDelegatorSelected = true;
      // that.newOwnerPublicKey=ar
    });
  }

  getdata(event: any) {
    this.productname = [];
    this.productdiscount = [];
    console.log("=====")
    console.log(event);
    this.pp = event;
    console.log(this.pp['ID'])
    console.log(event);
    this.orderNumber = event.orderNumber;
    this.orderId = event.ID;
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
    this.goodsServiceDiscount = event.goodsService;
    if (this.orderStatus == '6') {
      this.orderStatusPayment = event.orderPayment.status.paymentStatus
    }else{
      this.orderStatusPayment="0"
    }
    var x = {}
    for (var i = 0; i < event.goodsService.length; i++) {
      this.productname.push(event.goodsService[i].name);
      if (event.goodsService[i].discount) {
        x[event.goodsService[i].name] = event.goodsService[i].discount;
      }
      else {
        x[event.goodsService[i].name] = "0";
      }
    }
    console.log(x);
    console.log(this.productname);
    this.goodsServicesDiscount = x;
    console.log(this.goodsServicesDiscount);
  }

  updateMultipleOrderStatus(action: string) {
    let that = this;
    for (var i = 0; i < this.selection.selected.length; i++) {
      let k: any = this.selection.selected[i].orderAmount;
      let z: any = this.salesServiceTaxAmountUpdate1;
      let t = (k * z) / 100;
      let goodsServiceDiscount2 = {};

      for (var j = 0; j < this.selection.selected[i]['goodsService'].length; j++) {
        goodsServiceDiscount2[this.selection.selected[i]['goodsService'][j].name] = this.goodsServicesDiscount1;
      }

      var status = 4;
      if (action == 'accept') {
        status = 5
      }
      var payload = {
        "orderNumber": this.selection.selected[i].orderNumber,
        "vendor": {
          "employeeName": this.name
        },
        "orderStatus": status,
        "comment": this.statusComment1,
        "salesServiceTaxAmount": t,
        "discount": goodsServiceDiscount2
      }
      console.log(payload)
      this.blockchainService.acceptOrder(payload).subscribe(val => {
        if (val) {
          console.log("acceptOrder", val);
          that.goodsServicesDiscount = ""
        }
      })
    }
  }


  updateOrderStatus(event: any, orderNumber: any, action: string) {
    let that = this;
    console.log("updateOrderStatus", event, orderNumber, action);
    var status = 4;
    if (action == 'accept') {
      status = 5
    }
    // console.log(this.goodsServicesDiscount)
    var payload = {
      "orderNumber": orderNumber,
      "vendor": {
        "employeeName": this.name
      },
      "orderStatus": status,
      "comment": this.statusComment,
      "salesServiceTaxAmount": this.salesServiceTaxAmountUpdate,
      "discount": this.goodsServicesDiscount
    }
    console.log(payload)
    this.blockchainService.acceptOrder(payload).subscribe(val => {
      if (val) {
        console.log("acceptOrder", val);
        that.goodsServicesDiscount = ""
      }
    })
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

  getquantity(event, j) {
    if (parseInt(event.target.value, 10) <= 100 && parseInt(event.target.value, 10) > -1) {
      console.log("hello", j);
      console.log(this.productname);
      console.log(this.goodsServicesDiscount);
      console.log(this.goodsServicesDiscount[j]);
      console.log(event);
      console.log(this.productname[j]);
      this.goodsServicesDiscount[this.productname[j]] = event.target.value;
      console.log(this.goodsServicesDiscount);
    }
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
      if (val) {
        console.log("acceptOrder", val);
        // that.invoiceData['value'={}
      }
    })
  }

}
