
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BlockchainService } from '../blockchain.service'
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, Validators, FormControl, NgSelectOption } from '@angular/forms';

export interface RawMaterial {
  id: String;
  name: String;
  unit: String;
  creator: string;
  vname: string;
}
@Component({
  selector: 'app-vendor-employee-goods',
  templateUrl: './vendor-employee-goods.component.html',
  styleUrls: ['./vendor-employee-goods.component.css']
})
export class VendorEmployeeGoodsComponent implements OnInit {
  id: any;
  email: any;
  address: any;
  name: any;
  vendorName: any;
  package_list = [];
  role:any;
  uploadFile:any;
  bulkUploadAction=false;
  bulkFile = '';
  bulkupload:boolean=false;
  

  displayedColumns: string[] = [
    // 'id',
    'name',
    // 'unit',
    'creator',
    // 'vname',
  ];

  dataSource: MatTableDataSource<RawMaterial>;
  @ViewChild(MatPaginator) paginator: MatPaginator
  username = ""
  Roles = [
    { role: "Goods", value: 2 },
    { role: "Service", value: 1 }
  ]
  registerGoods = this.fb.group({
    name: ['', Validators.required],
    servicetype: ['1', Validators.required],
    // unit: ['0', Validators.required],
  });



  constructor(private data: UserService,
    private http: HttpClient,
    private httpClient: HttpClient,
    private blockchainService: BlockchainService,
    private fb: FormBuilder) {
    this.username = localStorage.getItem('userID');
    this.name = localStorage.getItem('name');
    this.vendorName = localStorage.getItem('vendorName');

    this.getUserDetails()
  }


  getUserDetails() {
    let that = this;
    console.log(localStorage);
    this.blockchainService.getEntity('goods').subscribe(val => {
      if (val) {
        console.log(val);
        console.log(val['entity'][0]);
        for (var i = 0; i < val['entity'].length; i++) {
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
          }
        }
        this.dataSource = new MatTableDataSource<RawMaterial>(that.package_list);
        this.dataSource.paginator = this.paginator;
      }
    })
    this.blockchainService.getIDDetails(localStorage.getItem('userID')).subscribe(val => {
      if (val) {
        console.log(localStorage);
        console.log(val);
        that.role = (val[this.username][0]['employee'].role)
        console.log(that.role);
      }
    })
  }

  createGoods() {
    let that = this;
    var payload = {};
    payload['goods'] = this.registerGoods.value;
    payload['vendor'] = {}
    payload['vendor']['name'] = this.vendorName
    payload['vendor']['employeeName'] = this.name;
    console.log(payload);

    this.blockchainService.createGoods(payload).subscribe(val => {
      if (val) { 
        console.log(val);
        if (JSON.parse(val['response']['body']).data[0].status == 'COMMITTED') {
          window.alert("Goods/Service Register Successfull \n ID:" + val['userid'])
          var couchpayload = {};
          couchpayload['data'] = {};
          couchpayload['data']['name'] = payload["goods"]["name"];
          couchpayload['data']['serviceType'] = payload["goods"]["servicetype"];
          couchpayload['data']['unit'] = 0;
          couchpayload['data']['vendorName'] = payload["vendor"]["name"];
          couchpayload['data']['employeeName'] = payload["vendor"]["employeeName"];
          couchpayload['id'] = val['userid'];
          console.log(couchpayload)
          that.blockchainService.registerGoodsnServiceDB(couchpayload).subscribe(val => {
            if (val) {
              console.log(val)
            }
          }, (err) => {
            console.log(err)
          })
        } else {
          this.getUserDetails();

          window.alert("Goods Registration Error: \n " + JSON.parse(val['response']['body']).data[0].status)
        }
      }
    })
  }




  bulkRegister() {
    console.log(this.bulkFile);
    let that = this;
    var blockchainPayload = {}
    blockchainPayload['action'] = this.bulkFile;
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
