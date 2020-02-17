import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BlockchainService } from '../blockchain.service'
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, Validators, FormControl, NgSelectOption, FormArray } from '@angular/forms';
import * as $ from 'jquery';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import 'bootstrap/dist/js/bootstrap.js';
export interface RawMaterial {
  id: String;
  name: String;
  unit: String;
  creator: string;
  vname: string;
}


@Component({
  selector: 'app-customer-employee-goods',
  templateUrl: './customer-employee-goods.component.html',
  styleUrls: ['./customer-employee-goods.component.css']
})
export class CustomerEmployeeGoodsComponent implements OnInit {
  name1: any[] = [];
  rate: any[] = [];
  quantity: any[] = [];
  gstNo: any;
  id: any;
  name: any;
  orgName: any;
  unit: any;
  package_list = [];
  selectedOrder: any[] = [];
  goods: any[] = [];
  log: any;
  role:any;
  uploadFile:any;
  placeable:boolean=false;
  good_total: number = 0;
  bulkFile = '';
  bulkUploadAction=null;
  bulkupload:boolean=false;
  bulkupload1:boolean=false;
  selection = new SelectionModel<RawMaterial>(true, []);
  vname: any;
  @ViewChild('customer') customer: ElementRef
  displayedColumns: string[] = [
    'select',
    // 'id',
    'name',
    // 'unit',
    'creator',
    'vname',
  ];



  dataSource: MatTableDataSource<RawMaterial>;

  @ViewChild(MatPaginator) paginator: MatPaginator

  username = ""
  orderDetails = this.fb.group({
    orderNumber: ['', [Validators.required]],
    customer: this.fb.group({
      addressShipping: ['', Validators.required],
      addressBilling: ['', Validators.required],
      GSTNumber: [this.gstNo],

    }),
    PO_Number: ['', Validators.required],
    PO_Date: ['', Validators.required],
    orderDate: ['', Validators.required],
    orderAmount: [this.good_total],
    comment: ['', Validators.required],
    // goodsServices: this.fb.array([{
    //   name: '',
    //   quantity: '',
    //   rate: ''
    // }]),

  });

  constructor(
    private data: UserService,
    private httpClient: HttpClient,
    private blockchainService: BlockchainService,
    private fb: FormBuilder,
    private modalService: NgbModal

  ) {
    this.username = localStorage.getItem('userID');
    this.name = localStorage.getItem('name');
    this.orgName = localStorage.getItem('customerName');
    this.role = localStorage.getItem('role');
    this.getUserDetails()
  }

  getUserDetails() {
    let that = this;
    this.blockchainService.getEntity('goods').subscribe(val => {
      if (val) {
        console.log(val['entity'][0]);
        for (var i = 0; i < val['entity'].length; i++) {
          // console.log(val['entity'][i]);
          {
            console.log(val['entity'][i]);
            var payload = {
              'id': val['entity'][i]['goods']['ID'],
              'name': val['entity'][i]['goods']['name'],
              'unit': val['entity'][i]['goods']['unit'],
              'creator': val['entity'][i]['vendor']['creator'],
              'vname': val['entity'][i]['vendor']['name'],
            }
            that.package_list.push(payload)
            //that.package_list.push(val['entity'][i]['vendor'].creator)
            //creator to be added
          }
        }
        this.dataSource = new MatTableDataSource<RawMaterial>(that.package_list);
        this.dataSource.paginator = this.paginator;
        const initialSelection = [];
        const allowMultiSelect = true;
        this.selection = new SelectionModel<RawMaterial>(allowMultiSelect, initialSelection);

      }
    })
  }
  place(){
    console.log(this.selection);  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
    console.log(numSelected);
    console.log(this.selection);
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
    console.log(this.dataSource.data.forEach(row => this.selection.select(row)));
    // console.log(this.selection);
  }
  checkboxLabel(row?: RawMaterial): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
 
    if(this.selection['selected'].length > 0)
    {
      this.placeable= true;
    }
    else
    {
      this.placeable= false;
    }

  }
  goodsSelect() {
   
    this.gstNo = localStorage.GSTNumber;
    console.log(this.gstNo);
    console.log(this.selection);
    var x = [];
    var data = {}
    data['name'] = this.selection['selected'][0]['name']
    data['quantity'] = this.selection['selected'][0]['unit']
    data['rate'] = 0
    this.vname = this.selection['selected'][0]['vname']
    x.push(data);
    for (var i = 1; i < this.selection['selected'].length; i++) {
      var ddata = {}
      ddata['name'] = this.selection['selected'][i]['name']
      ddata['quantity'] = this.selection['selected'][i]['unit']
      ddata['rate'] = 0
      x.push(ddata);

    }
    this.selectedOrder = x//JSON.stringify(x, null, '\t')
    console.log(this.selectedOrder)

    for (let i = 0; i < this.selectedOrder.length; i++) {
      if (!this.selectedOrder[i].quantity) {
        this.selectedOrder[i].quantity = 1;

      }
      console.log("hello");
      this.goods.push({
        name: this.selectedOrder[i].name,
        quantity: this.selectedOrder[i].quantity,
        rate: this.selectedOrder[i].rate

      });
      this.good_total += (this.selectedOrder[i].quantity * this.selectedOrder[i].rate);
      // }
      // else {
      //   this.goods.push({
      //     name: this.selectedOrder[i].name,
      //     quantity: this.selectedOrder[i].quantity,
      //     rate: this.selectedOrder[i].rate

      //   });
      //   this.good_total += (0 * this.selectedOrder[i].rate);
      // }
    }
    console.log(this.good_total);
    console.log(this.goods);
  }

  get goodsServicesFA(): FormArray {
    return this.orderDetails.get('goodsServices') as FormArray;
  }

  goodsEmpty() {
    this.goods = [];
    this.good_total = 0;
  }

  placeOrder(f) {
    let validGoodsData = []
    for (var i = 0; i < this.goods.length;i++) {
      if (!(this.goods[i].rate == 0) && !(this.goods[i].quantity == 0)) {
        validGoodsData.push(this.goods[i])
      }
    }
    this.log = JSON.stringify(this.goods, null, '\t')
    console.log(this.log);
    console.log(f);
    console.log(this.orderDetails.value);
    var payload = this.orderDetails.value;
    payload['customer']['GSTNumber'] = this.gstNo;
    payload['orderAmount'] = this.good_total;
    payload['goodsService'] = validGoodsData;
    payload['orderStatus'] = 1;
    payload['vendor'] = {}
    payload['vendor']['name'] = this.vname;
    payload['customer']['employeeName'] = this.name;
    this.goods = [];
    this.good_total = 0;
    console.log(payload)
    this.blockchainService.createOrder(payload).subscribe(val => {
      if (val) {
        if (JSON.parse(val['response']['body']).data[0].status == 'COMMITTED') {
          // window.alert("Order Creation Successfull  \n OrderID:" + val['userid']);
          var couchdbPayload = {
            "id": val['userid'],
            "data": payload
          }
          this.blockchainService.registerOrders(couchdbPayload).subscribe((couchData) => {
            console.log(couchData);
          },
            (err) => {
              console.log("Error on Registration in DB: ", err)
            })
          window.alert("Order Creation Successfull  \n OrderID:" + val['userid']);
        } else {
          window.alert("Order Creation Failed \n Status:" + JSON.parse(val['response']['body']).data[0].status + "\n Error Message: " + JSON.parse(val['response']['body']).data[0]['invalid_transactions'][0].message)
        }

      } else {
        console.log("Error")
      }
    },
      err => {
        console.log("Error on Creation :", err);
      });
  }



bulkRegister() {
    console.log(this.bulkFile);
    let that = this;
    var blockchainPayload = {}
    blockchainPayload['action'] = 'createOrder';
    console.log("Action name ",blockchainPayload['action']);
    if (this.uploadFile) {
      console.log("Entering here");
      blockchainPayload['file'] = this.uploadFile;
      console.log("Now here",this.uploadFile);
      this.blockchainService.bulkUpload(blockchainPayload).subscribe((val) => {
        if (val) {
          console.log(val)
          var allResponseData = {}
          allResponseData['COMMITTED'] = [];
          allResponseData['INVALID'] = [];
          var Registered = {};
          Registered['newEmployee'] = []
          Registered['AlreadyOnNetwork'] = []
          val['response'].forEach(async element => {
            console.log(element)
            if (element['response'].status == 'COMMITTED') {
              var couchpayload = {};
              couchpayload['data'] = {};
              couchpayload['data'] = element['request'];
              couchpayload['id'] = element['response']['UserID'];
              couchpayload['data']['userType'] = 4;
              couchpayload['data']['publicKey'] = element['request']['publicKey'];
              couchpayload['data']['owner'] = element['request']['publicKey'];
              delete couchpayload['data']['employeeAddress']
              console.log(couchpayload)
              allResponseData['COMMITTED'].push({
                data: element['request'],
                UserID: element['response']['UserID']
              })
              await that.blockchainService.registerEmployeeDB(couchpayload).subscribe(val => {
                if (val['ok']) {
                  console.log(val)
                  Registered['newEmployee'].push(val)
                  // this.userid = val['userid']
                  // this.Auth.setuserid(this.userid);
                }
              }, (err) => {
                // console.log(err)
                Registered['AlreadyOnNetwork'].push(couchpayload['id'])
              })
            }
            else {
              allResponseData['INVALID'].push({
                data: element['request'],
                UserID: element['response']['invalid_transactions']
              })
            }
          })

          console.log(allResponseData)
          console.log(Registered)

        }
      },
        (err) => {
          console.log(err.message)
        })

    }
  }








  getname(event, j) {
    console.log(event)
    this.goods[j].name = event.target.value;
    console.log(this.goods);
  }

  getquantity(event, j) {
    // if (parseInt(event.target.value, 10) <= this.selectedOrder[j].quantity && parseInt(event.target.value, 10) > -1) {
    console.log("hello");
    console.log(event)
    this.good_total = this.good_total - (this.goods[j].rate * this.goods[j].quantity);
    this.goods[j].quantity = event.target.value;
    this.good_total = this.good_total + (this.goods[j].rate * this.goods[j].quantity);
    console.log(this.goods);
    // }
    // else {
    //   console.log("bye");
    //   window.alert("quantity sholud be less than" + this.goods[j].quantity + "and grater than 0");
    // }
  }

  getrate(event, j) {
    if (parseInt(event.target.value, 10) >= 0) {
      console.log(event)
      this.good_total = this.good_total - (this.goods[j].rate * this.goods[j].quantity);
      this.goods[j].rate = event.target.value;
      this.good_total = this.good_total + (this.goods[j].rate * this.goods[j].quantity);
      console.log(this.goods);
    }
    else {
      window.alert("rate should be greater than zero");
    }
  }

  updateFileData(files: FileList) {
    let that = this;
    console.log(files);

    if (files && files.length > 0) {
      let file: File = files.item(0);
      this.uploadFile = file;
      this.bulkUploadAction=true;
      console.log(file.name);
      console.log(file.size);
      console.log(file.type);
      // if (file.type == "text/csv") {
      //   let reader: FileReader = new FileReader();
      //   reader.readAsText(file);
      //   reader.onload = (e) => {
      //     let csv: string = reader.result as string;
      //     console.log(csv);
      //   }
      // }
    }

  }


  ngOnInit() {
  }

}
